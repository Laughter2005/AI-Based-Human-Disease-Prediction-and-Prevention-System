"""Pydantic schemas for prediction endpoints."""
from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    symptoms: list[str] = Field(..., min_length=1, max_length=30)
    top_k: int = Field(default=3, ge=1, le=10)
    language: str = Field(default="en", pattern="^(en|ny)$")


class DiseasePrediction(BaseModel):
    disease: str
    confidence: float = Field(..., ge=0.0, le=1.0)


class PredictionResponse(BaseModel):
    model: str
    input_symptoms: list[str]
    unknown_symptoms: list[str] = []
    top_predictions: list[DiseasePrediction]
    language: str


class PredictionHistoryItem(BaseModel):
    id: int
    top_disease: str
    top_confidence: float
    model_name: str
    language: str
    symptoms: list[str]
    unknown_symptoms: list[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    model_name: str
    known_symptoms: int
    known_diseases: int