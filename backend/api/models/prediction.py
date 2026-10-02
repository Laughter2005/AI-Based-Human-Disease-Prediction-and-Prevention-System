"""Prediction history model."""
from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from db.base import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )

    # JSON-encoded lists stored as text (portable across SQLite/Postgres)
    symptoms: Mapped[str] = mapped_column(Text, nullable=False)
    unknown_symptoms: Mapped[str] = mapped_column(Text, default="[]", nullable=False)

    top_disease: Mapped[str] = mapped_column(String(120), nullable=False)
    top_confidence: Mapped[float] = mapped_column(nullable=False)
    model_name: Mapped[str] = mapped_column(String(50), nullable=False)
    language: Mapped[str] = mapped_column(String(5), default="en", nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    user: Mapped["User"] = relationship(back_populates="predictions")