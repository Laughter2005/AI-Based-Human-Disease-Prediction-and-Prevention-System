"""Database engine and session factory."""
from __future__ import annotations

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from config import get_settings


settings = get_settings()

# SQLAlchemy engine — pool_pre_ping handles stale connections gracefully
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    echo=False,  # set True to log SQL during debugging
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    expire_on_commit=False,
)


def get_db():
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()