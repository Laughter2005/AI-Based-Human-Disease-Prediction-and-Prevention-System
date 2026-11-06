"""USSD service configuration."""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    app_name: str = "Malawi Health AI - USSD Handler"
    debug: bool = True
    port: int = 8001
    main_api_url: str = "http://localhost:8000/api"
    database_url: str = "postgresql+psycopg://disease_app:password@localhost:5432/disease_db"
    session_timeout_seconds: int = 180
    at_username: str = ""
    at_api_key: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()