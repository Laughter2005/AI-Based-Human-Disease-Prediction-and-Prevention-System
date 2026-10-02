"""Statistics and reporting schemas."""
from __future__ import annotations

from datetime import datetime
from pydantic import BaseModel


# ---------- User stats ----------
class DiseaseCount(BaseModel):
    disease: str
    count: int


class MonthlyPoint(BaseModel):
    month: str  # "2025-10"
    predictions: int


class UserStats(BaseModel):
    total_predictions: int
    predictions_this_month: int
    predictions_last_30_days: int
    top_diseases: list[DiseaseCount]         # user's top 5
    monthly_trend: list[MonthlyPoint]        # last 6 months
    last_prediction_at: datetime | None
    first_prediction_at: datetime | None


# ---------- Admin reports ----------
class DateRangeReport(BaseModel):
    start_date: str
    end_date: str
    total_predictions: int
    unique_users: int
    top_diseases: list[DiseaseCount]
    daily_breakdown: list[dict]              # [{date, count}]
    language_split: dict                     # {"en": n, "ny": n}


class ReportQuery(BaseModel):
    start_date: str
    end_date: str