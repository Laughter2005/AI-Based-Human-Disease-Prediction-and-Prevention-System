"""Disease information routes."""
from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from fastapi import APIRouter, HTTPException

from schemas.disease_info import DiseaseInfo


router = APIRouter(prefix="/diseases", tags=["diseases"])

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "disease_descriptions.json"


@lru_cache
def _load_descriptions() -> dict:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@router.get("/{disease_key}", response_model=DiseaseInfo)
def get_disease(disease_key: str) -> DiseaseInfo:
    """
    Return full clinical information for a disease.
    Disease key should be lowercase with spaces (e.g. 'hepatitis a').
    """
    data = _load_descriptions()
    key = disease_key.lower().strip()
    if key not in data:
        raise HTTPException(
            status_code=404,
            detail=f"Disease '{disease_key}' not found. Available: {list(data.keys())}",
        )
    return DiseaseInfo(key=key, **data[key])


@router.get("")
def list_diseases() -> dict:
    """List all available disease keys."""
    return {"count": len(_load_descriptions()), "keys": list(_load_descriptions().keys())}