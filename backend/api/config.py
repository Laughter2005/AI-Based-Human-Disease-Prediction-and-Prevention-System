"""Application configuration loaded from environment variables and .env."""
from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Typed application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    # Application
    app_name: str = "AI Disease Prediction API"
    debug: bool = True
    api_prefix: str = "/api"

    # ML model
    model_name: str = "xgboost"
    model_path: str = "../ai_engine/models/xgboost.joblib"
    processed_data_path: str = "../ai_engine/data/processed"

    # CORS — comma-separated string in .env
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Database (used later)
    database_url: str = "postgresql+psycopg://USER:PASSWORD@localhost:5432/DB_NAME"

    # Redis (used later)
    redis_url: str = "redis://localhost:6379/0"

    # JWT
    jwt_secret_key: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expiration_minutes: int = 30

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse comma-separated origins into a list."""
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — loaded once per process."""
    return Settings()