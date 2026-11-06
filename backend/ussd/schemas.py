"""Schemas for USSD requests and session state."""
from __future__ import annotations

from datetime import datetime, timezone
from pydantic import BaseModel, Field


# --- Incoming USSD callback (from Africa's Talking) ---
class USSDRequest(BaseModel):
    sessionId: str
    phoneNumber: str
    text: str = ""           # "1*2*3" for multi-step; "" for first request
    serviceCode: str = ""


# --- Outgoing USSD response ---
class USSDResponse(BaseModel):
    text: str
    end: bool = False        # True to close the session


# --- Internal session state ---
class SessionState(BaseModel):
    phone: str
    language: str = "en"     # "en" or "ny"
    step: str = "language"   # current menu step
    symptoms: list[str] = []
    age: str = ""
    gender: str = ""
    duration: str = ""
    last_activity: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# --- Prediction API response (from main API) ---
class DiseasePrediction(BaseModel):
    disease: str
    confidence: float


class PredictionAPIResponse(BaseModel):
    model: str
    input_symptoms: list[str]
    unknown_symptoms: list[str] = []
    top_predictions: list[DiseasePrediction]
    language: str

class SessionState(BaseModel):
    phone: str
    language: str = "en"
    step: str = "language"
    symptoms: list[str] = []
    age: str = ""
    gender: str = ""
    duration: str = ""
    wants_sms: bool = False   # <-- NEW
    last_disease: str = ""       # <-- NEW
    last_confidence: float = 0.0 # <-- NEW
    last_activity: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))