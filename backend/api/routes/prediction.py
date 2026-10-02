"""Disease prediction and history routes."""
from __future__ import annotations

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from core.deps import get_current_user, get_current_user_optional
from db.session import get_db
from dependencies import get_predictor
from models.prediction import Prediction
from models.user import User
from schemas.prediction import (
    DiseasePrediction,
    PredictionHistoryItem,
    PredictionRequest,
    PredictionResponse,
)
from services.predictor import DiseasePredictor


router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.post("", response_model=PredictionResponse)
def predict(
    payload: PredictionRequest,
    predictor: DiseasePredictor = Depends(get_predictor),
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional),
) -> PredictionResponse:
    """
    Predict the top-k diseases for a given set of symptoms.
    If the caller is authenticated, the prediction is saved to history.
    """
    symptoms = [s.strip().lower() for s in payload.symptoms if s.strip()]
    if not symptoms:
        raise HTTPException(status_code=422, detail="No valid symptoms provided.")

    known = set(predictor.known_symptoms)
    unknown = [s for s in symptoms if s not in known]

    if len(unknown) == len(symptoms):
        raise HTTPException(
            status_code=422,
            detail={
                "message": "None of the provided symptoms are recognized.",
                "unknown_symptoms": unknown,
                "hint": "Call GET /api/predictions/symptoms for valid symptom names.",
            },
        )

    raw_predictions = predictor.predict(symptoms, top_k=payload.top_k)
    predictions = [DiseasePrediction(**p) for p in raw_predictions]

    # Save to history if authenticated
    if current_user and predictions:
        top = predictions[0]
        record = Prediction(
            user_id=current_user.id,
            symptoms=json.dumps(symptoms),
            unknown_symptoms=json.dumps(unknown),
            top_disease=top.disease,
            top_confidence=top.confidence,
            model_name=predictor.model_name,
            language=payload.language,
        )
        db.add(record)
        db.commit()

    return PredictionResponse(
        model=predictor.model_name,
        input_symptoms=symptoms,
        unknown_symptoms=unknown,
        top_predictions=predictions,
        language=payload.language,
    )


@router.get("/history", response_model=list[PredictionHistoryItem])
def history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
    limit: int = 50,
) -> list[PredictionHistoryItem]:
    """Return the authenticated user's prediction history, newest first."""
    rows = db.scalars(
        select(Prediction)
        .where(Prediction.user_id == current_user.id)
        .order_by(Prediction.created_at.desc())
        .limit(limit)
    ).all()

    return [
        PredictionHistoryItem(
            id=r.id,
            top_disease=r.top_disease,
            top_confidence=r.top_confidence,
            model_name=r.model_name,
            language=r.language,
            symptoms=json.loads(r.symptoms or "[]"),
            unknown_symptoms=json.loads(r.unknown_symptoms or "[]"),
            created_at=r.created_at,
        )
        for r in rows
    ]


@router.get("/symptoms", tags=["metadata"])
def list_symptoms(predictor: DiseasePredictor = Depends(get_predictor)) -> dict:
    return {
        "count": len(predictor.known_symptoms),
        "symptoms": predictor.known_symptoms,
    }


@router.get("/diseases", tags=["metadata"])
def list_diseases(predictor: DiseasePredictor = Depends(get_predictor)) -> dict:
    return {
        "count": len(predictor.known_diseases),
        "diseases": predictor.known_diseases,
    }