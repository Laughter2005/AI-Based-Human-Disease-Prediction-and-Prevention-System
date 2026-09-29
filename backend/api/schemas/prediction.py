"""Pydantic schemas for prediction endpoints."""
from __future__ import annotations

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """Incoming prediction request."""

    symptoms: list[str] = Field(
        ...,
        min_length=1,
        max_length=30,
        description="List of symptom IDs (lowercase, e.g. 'fever', 'headache')",
        examples=[["fever", "headache", "vomiting", "chills"]],
    )
    top_k: int = Field(
        default=3,
        ge=1,
        le=10,
        description="Number of top diseases to return",
    )
    language: str = Field(
        default="en",
        pattern="^(en|ny)$",
        description="Response language: 'en' (English) or 'ny' (Chichewa)",
    )


class DiseasePrediction(BaseModel):
    """A single disease prediction."""

    disease: str
    confidence: float = Field(..., ge=0.0, le=1.0)


class PredictionResponse(BaseModel):
    """Prediction response payload."""

    model: str
    input_symptoms: list[str]
    unknown_symptoms: list[str] = []
    top_predictions: list[DiseasePrediction]
    language: str


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    model_loaded: bool
    model_name: str
    known_symptoms: int
    known_diseases: int