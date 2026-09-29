"""Health check route."""
from __future__ import annotations

from fastapi import APIRouter, Depends

from dependencies import get_predictor
from schemas.prediction import HealthResponse
from services.predictor import DiseasePredictor


router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health(predictor: DiseasePredictor = Depends(get_predictor)) -> HealthResponse:
    """Report service and model status."""
    return HealthResponse(
        status="ok",
        model_loaded=True,
        model_name=predictor.model_name,
        known_symptoms=len(predictor.known_symptoms),
        known_diseases=len(predictor.known_diseases),
    )