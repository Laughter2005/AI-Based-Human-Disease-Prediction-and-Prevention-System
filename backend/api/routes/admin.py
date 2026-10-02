"""Admin routes — user management and analytics. Requires role=admin."""
from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from core.deps import get_current_admin
from db.session import get_db
from models.prediction import Prediction
from models.user import User
from schemas.admin import ActivityPoint, DashboardStats
from schemas.auth import AdminUserUpdate, UserListResponse, UserRead


router = APIRouter(prefix="/admin", tags=["admin"])


# ---------- Dashboard stats ----------
@router.get("/stats", response_model=DashboardStats)
def stats(
    _admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> DashboardStats:
    now = datetime.now(timezone.utc)
    today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

    total_users = db.scalar(select(func.count()).select_from(User)) or 0
    active_users = db.scalar(
        select(func.count()).select_from(User).where(User.is_active.is_(True))
    ) or 0
    total_predictions = db.scalar(select(func.count()).select_from(Prediction)) or 0
    predictions_today = db.scalar(
        select(func.count()).select_from(Prediction).where(Prediction.created_at >= today_start)
    ) or 0

    # Top 5 diseases by count
    top_rows = db.execute(
        select(Prediction.top_disease, func.count(Prediction.top_disease).label("cnt"))
        .group_by(Prediction.top_disease)
        .order_by(func.count(Prediction.top_disease).desc())
        .limit(5)
    ).all()
    top_diseases = [{"disease": d, "count": c} for d, c in top_rows]

    # 5 most recent users
    recent = db.scalars(
        select(User).order_by(User.created_at.desc()).limit(5)
    ).all()
    recent_users = [
        {
            "id": u.id,
            "email": u.email,
            "full_name": u.full_name,
            "role": u.role,
            "created_at": u.created_at.isoformat(),
        }
        for u in recent
    ]

    return DashboardStats(
        total_users=total_users,
        active_users=active_users,
        total_predictions=total_predictions,
        predictions_today=predictions_today,
        top_diseases=top_diseases,
        recent_users=recent_users,
    )


@router.get("/activity", response_model=list[ActivityPoint])
def activity(
    days: int = Query(14, ge=1, le=90),
    _admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> list[ActivityPoint]:
    """Daily prediction counts for the last N days."""
    start = datetime.now(timezone.utc) - timedelta(days=days)
    rows = db.execute(
        select(
            func.date(Prediction.created_at).label("day"),
            func.count().label("cnt"),
        )
        .where(Prediction.created_at >= start)
        .group_by(func.date(Prediction.created_at))
        .order_by(func.date(Prediction.created_at))
    ).all()
    return [ActivityPoint(date=str(d), predictions=c) for d, c in rows]


# ---------- User management ----------
@router.get("/users", response_model=UserListResponse)
def list_users(
    q: str | None = Query(None, description="Search by email or name"),
    role: str | None = Query(None, pattern="^(user|admin)$"),
    is_active: bool | None = None,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    _admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> UserListResponse:
    stmt = select(User)
    if q:
        like = f"%{q.lower()}%"
        stmt = stmt.where(
            (func.lower(User.email).like(like))
            | (func.lower(func.coalesce(User.full_name, "")).like(like))
        )
    if role:
        stmt = stmt.where(User.role == role)
    if is_active is not None:
        stmt = stmt.where(User.is_active.is_(is_active))

    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    users = db.scalars(
        stmt.order_by(User.created_at.desc()).limit(limit).offset(offset)
    ).all()

    return UserListResponse(
        total=total,
        users=[UserRead.model_validate(u) for u in users],
    )


@router.patch("/users/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    payload: AdminUserUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> User:
    """Update a user's role or active status. Admin only."""
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent admin from demoting/deactivating themselves
    if user.id == current_admin.id:
        if payload.role == "user":
            raise HTTPException(status_code=400, detail="You cannot demote yourself.")
        if payload.is_active is False:
            raise HTTPException(status_code=400, detail="You cannot deactivate yourself.")

    if payload.role is not None:
        user.role = payload.role
    if payload.is_active is not None:
        user.is_active = payload.is_active

    db.commit()
    db.refresh(user)
    return user


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db),
) -> None:
    """Permanently delete a user. Admin only. Cannot delete yourself."""
    if user_id == current_admin.id:
        raise HTTPException(status_code=400, detail="You cannot delete your own account here.")

    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()