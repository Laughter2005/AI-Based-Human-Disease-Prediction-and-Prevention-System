"""User statistics and admin reports routes."""
from __future__ import annotations

import csv
import io
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from core.deps import get_current_admin, get_current_user
from db.session import get_db
from models.prediction import Prediction
from models.user import User
from schemas.stats import DateRangeReport, DiseaseCount, MonthlyPoint, UserStats


router = APIRouter(prefix="/stats", tags=["stats"])


# ---------- User statistics ----------
@router.get("/me", response_model=UserStats)
def my_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserStats:
    """Personal statistics for the authenticated user."""
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    thirty_days_ago = now - timedelta(days=30)
    six_months_ago = now - timedelta(days=180)

    base = select(Prediction).where(Prediction.user_id == current_user.id)

    total = db.scalar(
        select(func.count()).select_from(base.subquery())
    ) or 0

    this_month = db.scalar(
        select(func.count()).select_from(
            base.where(Prediction.created_at >= month_start).subquery()
        )
    ) or 0

    last_30 = db.scalar(
        select(func.count()).select_from(
            base.where(Prediction.created_at >= thirty_days_ago).subquery()
        )
    ) or 0

    # Top 5 diseases
    top_rows = db.execute(
        select(Prediction.top_disease, func.count().label("cnt"))
        .where(Prediction.user_id == current_user.id)
        .group_by(Prediction.top_disease)
        .order_by(func.count().desc())
        .limit(5)
    ).all()
    top_diseases = [DiseaseCount(disease=d, count=c) for d, c in top_rows]

    # Monthly trend (last 6 months)
    # Bind the expression once, then reuse in select/group_by/order_by
    month_expr = func.to_char(Prediction.created_at, "YYYY-MM")

    month_rows = db.execute(
        select(
            month_expr.label("m"),
            func.count().label("cnt"),
        )
        .where(
            Prediction.user_id == current_user.id,
            Prediction.created_at >= six_months_ago,
        )
        .group_by(month_expr)
        .order_by(month_expr)
    ).all()
    monthly_trend = [MonthlyPoint(month=m, predictions=c) for m, c in month_rows]

    # First and last prediction timestamps
    last_at = db.scalar(
        select(func.max(Prediction.created_at)).where(Prediction.user_id == current_user.id)
    )
    first_at = db.scalar(
        select(func.min(Prediction.created_at)).where(Prediction.user_id == current_user.id)
    )

    return UserStats(
        total_predictions=total,
        predictions_this_month=this_month,
        predictions_last_30_days=last_30,
        top_diseases=top_diseases,
        monthly_trend=monthly_trend,
        last_prediction_at=last_at,
        first_prediction_at=first_at,
    )

@router.get("/public")
def public_stats(db: Session = Depends(get_db)) -> dict:
    """
    Public system stats for the landing page — no auth required.
    Only aggregate counts, never user data.
    """
    from models.user import User as UserModel

    total_users = db.scalar(select(func.count()).select_from(UserModel)) or 0
    total_predictions = db.scalar(select(func.count()).select_from(Prediction)) or 0
    total_diseases = db.scalar(
        select(func.count(func.distinct(Prediction.top_disease)))
    ) or 0

    return {
        "total_users": total_users,
        "total_predictions": total_predictions,
        "diseases_detected": total_diseases,
        "supported_languages": 2,
    }


# ---------- Admin reports ----------
def _parse_range(start_date: str, end_date: str) -> tuple[datetime, datetime]:
    """Parse YYYY-MM-DD strings into timezone-aware datetimes."""
    try:
        s = datetime.strptime(start_date, "%Y-%m-%d").replace(tzinfo=timezone.utc)
        e = datetime.strptime(end_date, "%Y-%m-%d").replace(
            hour=23, minute=59, second=59, tzinfo=timezone.utc
        )
    except ValueError:
        raise HTTPException(status_code=422, detail="Dates must be in YYYY-MM-DD format")
    if s > e:
        raise HTTPException(status_code=422, detail="start_date must be before end_date")
    return s, e


@router.get("/reports", response_model=DateRangeReport)
def reports(
    start_date: str = Query(..., description="YYYY-MM-DD"),
    end_date: str = Query(..., description="YYYY-MM-DD"),
    _admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> DateRangeReport:
    """Aggregate prediction report for a date range (admin only)."""
    s, e = _parse_range(start_date, end_date)

    preds_in_range = select(Prediction).where(
        Prediction.created_at >= s, Prediction.created_at <= e
    )
    sub = preds_in_range.subquery()

    total = db.scalar(select(func.count()).select_from(sub)) or 0
    unique_users = db.scalar(select(func.count(func.distinct(sub.c.user_id)))) or 0

    # Top diseases
    top_rows = db.execute(
        select(Prediction.top_disease, func.count().label("cnt"))
        .where(Prediction.created_at >= s, Prediction.created_at <= e)
        .group_by(Prediction.top_disease)
        .order_by(func.count().desc())
        .limit(10)
    ).all()
    top_diseases = [DiseaseCount(disease=d, count=c) for d, c in top_rows]

    # Daily breakdown
    day_expr = func.to_char(Prediction.created_at, "YYYY-MM-DD")

    daily_rows = db.execute(
        select(
            day_expr.label("d"),
            func.count().label("cnt"),
        )
        .where(Prediction.created_at >= s, Prediction.created_at <= e)
        .group_by(day_expr)
        .order_by(day_expr)
    ).all()
    daily = [{"date": d, "count": c} for d, c in daily_rows]
 
    # Language split
    lang_expr = func.coalesce(Prediction.language, "en")
    lang_rows = db.execute(
        select(Prediction.language, func.count().label("cnt"))
        .where(Prediction.created_at >= s, Prediction.created_at <= e)
        .group_by(Prediction.language)
    ).all()
    lang_split = {lang or "en": cnt for lang, cnt in lang_rows}

    return DateRangeReport(
        start_date=start_date,
        end_date=end_date,
        total_predictions=total,
        unique_users=unique_users,
        top_diseases=top_diseases,
        daily_breakdown=daily,
        language_split=lang_split,
    )


@router.get("/reports/export/predictions")
def export_predictions_csv(
    start_date: str = Query(..., description="YYYY-MM-DD"),
    end_date: str = Query(..., description="YYYY-MM-DD"),
    _admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> StreamingResponse:
    """Export predictions in a date range as CSV (admin only)."""
    s, e = _parse_range(start_date, end_date)

    rows = db.execute(
        select(
            Prediction.id,
            Prediction.user_id,
            User.email,
            Prediction.top_disease,
            Prediction.top_confidence,
            Prediction.model_name,
            Prediction.language,
            Prediction.created_at,
        )
        .join(User, User.id == Prediction.user_id)
        .where(Prediction.created_at >= s, Prediction.created_at <= e)
        .order_by(Prediction.created_at.desc())
    ).all()

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(
        ["id", "user_id", "email", "top_disease", "confidence", "model", "language", "created_at"]
    )
    for row in rows:
        writer.writerow(row)

    buf.seek(0)
    filename = f"predictions_{start_date}_to_{end_date}.csv"
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@router.get("/reports/export/users")
def export_users_csv(
    _admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> StreamingResponse:
    """Export all users as CSV (admin only)."""
    users = db.scalars(select(User).order_by(User.created_at.desc())).all()

    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["id", "email", "full_name", "role", "is_active", "preferred_language", "created_at"])
    for u in users:
        writer.writerow([
            u.id, u.email, u.full_name or "", u.role,
            u.is_active, u.preferred_language, u.created_at.isoformat(),
        ])

    buf.seek(0)
    filename = f"users_{datetime.now().strftime('%Y-%m-%d')}.csv"
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )