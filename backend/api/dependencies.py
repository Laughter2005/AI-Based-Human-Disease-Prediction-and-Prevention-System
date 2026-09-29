"""Shared FastAPI dependencies."""
from __future__ import annotations

from functools import lru_cache

from services.predictor import DiseasePredictor


@lru_cache
def get_predictor() -> DiseasePredictor:
    """Load the ML predictor once and cache it."""
    return DiseasePredictor()