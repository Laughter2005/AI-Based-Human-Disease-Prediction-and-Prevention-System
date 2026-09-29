"""Disease prediction route."""
from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException

from dependencies import get_predictor
from schemas.prediction import (
    DiseasePrediction,
    PredictionRequest,
    PredictionResponse,
)
from services.predictor import DiseasePredictor


router = APIRouter(prefix="/predictions", tags=["predictions"])


@router.post("", response_model=PredictionResponse)
def predict(
    payload: PredictionRequest,
    predictor: DiseasePredictor = Depends(get_predictor),
) -> PredictionResponse:
    """
    Predict the top-k diseases for a given set of symptoms.
    """
    # Normalize input
    symptoms = [s.strip().lower() for s in payload.symptoms if s.strip()]
    if not symptoms:
        raise HTTPException(status_code=422, detail="No valid symptoms provided.")

    # Identify unknown symptoms
    known = set(predictor.known_symptoms)
    unknown = [s for s in symptoms if s not in known]

    # If every symptom is unknown, we can't predict
    if len(unknown) == len(symptoms):
        raise HTTPException(
            status_code=422,
            detail={
                "message": "None of the provided symptoms are recognized.",
                "unknown_symptoms": unknown,
                "hint": "Call GET /api/symptoms for the list of valid symptom names.",
            },
        )

    # Run inference
    raw_predictions = predictor.predict(symptoms, top_k=payload.top_k)
    predictions = [DiseasePrediction(**p) for p in raw_predictions]

    return PredictionResponse(
        model=predictor.model_name,
        input_symptoms=symptoms,
        unknown_symptoms=unknown,
        top_predictions=predictions,
        language=payload.language,
    )


@router.get("/symptoms", tags=["metadata"])
def list_symptoms(predictor: DiseasePredictor = Depends(get_predictor)) -> dict:
    """Return all symptom names the model recognizes."""
    return {
        "count": len(predictor.known_symptoms),
        "symptoms": predictor.known_symptoms,
    }


@router.get("/diseases", tags=["metadata"])
def list_diseases(predictor: DiseasePredictor = Depends(get_predictor)) -> dict:
    """Return all diseases the model can predict."""
    return {
        "count": len(predictor.known_diseases),
        "diseases": predictor.known_diseases,
    }