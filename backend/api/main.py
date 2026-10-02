"""FastAPI application entry point."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from db.base import Base
from db.session import engine
from dependencies import get_predictor
from routes import admin, auth, health, prediction, stats


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading ML predictor...")
    predictor = get_predictor()
    print(f"  Model: {predictor.model_name}")
    print(f"  Known symptoms: {len(predictor.known_symptoms)}")
    print(f"  Known diseases: {len(predictor.known_diseases)}")

    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("  Database ready.")

    yield
    print("Shutting down.")


app = FastAPI(
    title=settings.app_name,
    description="AI-based disease prediction and prevention API",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix=settings.api_prefix)
app.include_router(prediction.router, prefix=settings.api_prefix)
app.include_router(auth.router, prefix=settings.api_prefix)
app.include_router(admin.router, prefix=settings.api_prefix)
app.include_router(stats.router, prefix=settings.api_prefix)


@app.get("/")
def root() -> dict:
    return {"service": settings.app_name, "status": "ok", "docs": "/docs"}