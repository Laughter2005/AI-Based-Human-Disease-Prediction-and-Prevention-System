"""Session state management backed by PostgreSQL."""
from __future__ import annotations

import json
from datetime import datetime, timedelta, timezone

from sqlalchemy import Column, DateTime, String, Text, create_engine, delete, select
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from config import get_settings
from schemas import SessionState


settings = get_settings()

# --- Database setup (mirrors main API's models, but only for sessions) ---
class Base(DeclarativeBase):
    pass


class USSDSession(Base):
    __tablename__ = "ussd_sessions"

    phone = Column(String(20), primary_key=True)
    state_json = Column(Text, nullable=False)
    last_activity = Column(DateTime(timezone=True), nullable=False)


engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def init_db() -> None:
    """Create the ussd_sessions table if it doesn't exist."""
    Base.metadata.create_all(bind=engine)


# --- Session operations ---
def get_session(phone: str) -> SessionState | None:
    """Retrieve active session for a phone number, or None if expired/missing."""
    db: Session = SessionLocal()
    try:
        row = db.get(USSDSession, phone)
        if row is None:
            return None

        # Check timeout
        now = datetime.now(timezone.utc)
        age = (now - row.last_activity).total_seconds()
        if age > settings.session_timeout_seconds:
            db.delete(row)
            db.commit()
            return None

        data = json.loads(row.state_json)
        return SessionState(**data)
    finally:
        db.close()


def save_session(state: SessionState) -> None:
    """Create or update session state."""
    db: Session = SessionLocal()
    try:
        row = db.get(USSDSession, state.phone)
        state.last_activity = datetime.now(timezone.utc)
        payload = state.model_dump_json()

        if row is None:
            row = USSDSession(
                phone=state.phone,
                state_json=payload,
                last_activity=state.last_activity,
            )
            db.add(row)
        else:
            row.state_json = payload
            row.last_activity = state.last_activity

        db.commit()
    finally:
        db.close()


def delete_session(phone: str) -> None:
    """Explicitly clear a session (e.g. on user cancellation)."""
    db: Session = SessionLocal()
    try:
        db.execute(delete(USSDSession).where(USSDSession.phone == phone))
        db.commit()
    finally:
        db.close()


def cleanup_expired() -> int:
    """Delete all sessions older than the timeout. Returns count deleted."""
    cutoff = datetime.now(timezone.utc) - timedelta(seconds=settings.session_timeout_seconds)
    db: Session = SessionLocal()
    try:
        result = db.execute(
            delete(USSDSession).where(USSDSession.last_activity < cutoff)
        )
        db.commit()
        return result.rowcount or 0
    finally:
        db.close()