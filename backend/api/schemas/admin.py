"""Admin schemas."""
from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_users: int
    active_users: int
    total_predictions: int
    predictions_today: int
    top_diseases: list[dict]     # [{ "disease": str, "count": int }]
    recent_users: list[dict]     # [{ "id", "email", "full_name", "role", "created_at" }]


class ActivityPoint(BaseModel):
    date: str
    predictions: int