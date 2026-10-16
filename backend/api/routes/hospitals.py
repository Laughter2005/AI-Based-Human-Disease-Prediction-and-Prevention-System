"""Hospital locations routes."""
from __future__ import annotations

import json
import math
from functools import lru_cache
from pathlib import Path

from fastapi import APIRouter, Query

from schemas.disease_info import Hospital


router = APIRouter(prefix="/hospitals", tags=["hospitals"])

DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "malawi_hospitals.json"


@lru_cache
def _load_hospitals() -> list[dict]:
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def _haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Distance between two coordinates in kilometres."""
    R = 6371.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


@router.get("", response_model=list[Hospital])
def list_hospitals(
    lat: float | None = Query(None, ge=-90, le=90, description="User latitude"),
    lng: float | None = Query(None, ge=-180, le=180, description="User longitude"),
    district: str | None = Query(None, description="Filter by district name"),
    region: str | None = Query(None, description="Filter by region: Northern, Central, Southern"),
    type: str | None = Query(None, description="Filter by facility type"),
    limit: int = Query(10, ge=1, le=50),
) -> list[Hospital]:
    """
    List hospitals, optionally sorted by distance from the user.
    When `lat` and `lng` are provided, the closest `limit` hospitals are returned.
    """
    rows = _load_hospitals()

    # Filter by district / region / type
    if district:
        d = district.strip().lower()
        rows = [r for r in rows if r.get("district", "").lower() == d]
    if region:
        r_ = region.strip().lower()
        rows = [r for r in rows if r.get("region", "").lower() == r_]
    if type:
        t = type.strip().lower()
        rows = [r for r in rows if r.get("type", "").lower() == t]

    # Sort by distance if coordinates provided
    if lat is not None and lng is not None:
        for r in rows:
            rlat = r.get("latitude")
            rlng = r.get("longitude")
            if rlat is not None and rlng is not None:
                r["_distance_km"] = round(_haversine_km(lat, lng, rlat, rlng), 1)
            else:
                r["_distance_km"] = None
        rows.sort(key=lambda r: (r["_distance_km"] is None, r["_distance_km"] or 1e9))

    # Limit
    rows = rows[:limit]

    return [Hospital(**r) for r in rows]