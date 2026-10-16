"""Schemas for disease information and hospital locations."""
from __future__ import annotations

from pydantic import BaseModel


class BilingualText(BaseModel):
    en: str
    ny: str


class BilingualList(BaseModel):
    en: list[str]
    ny: list[str]


class DiseaseInfo(BaseModel):
    key: str
    name: BilingualText
    description: BilingualText
    transmission: BilingualText
    typical_symptoms: BilingualList
    when_to_seek_care: BilingualText
    complications: BilingualText


class Hospital(BaseModel):
    id: str
    name: str
    type: str          # "Central", "District", "Health Centre", "Mission", "Private"
    district: str
    region: str        # "Northern", "Central", "Southern"
    phone: str | None = None
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    services: list[str] = []

class Hospital(BaseModel):
    id: str
    name: str
    type: str
    district: str
    region: str
    phone: str | None = None
    address: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    services: list[str] = []
    distance_km: float | None = None    # ← ADD THIS