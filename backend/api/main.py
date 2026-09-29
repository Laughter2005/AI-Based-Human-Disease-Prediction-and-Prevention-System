"""FastAPI application entry point."""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from dependencies import get_predictor
from routes import health, prediction


settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Warm up the model at startup so the first request isn't slow."""
    print("Loading ML predictor...")
    predictor = get_predictor()
    print(f"  Model: {predictor.model_name}")
    print(f"  Known symptoms: {len(predictor.known_symptoms)}")
    print(f"  Known diseases: {len(predictor.known_diseases)}")
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

# Register routes under /api
app.include_router(health.router, prefix=settings.api_prefix)
app.include_router(prediction.router, prefix=settings.api_prefix)


@app.get("/")
def root() -> dict:
    return {"service": settings.app_name, "status": "ok", "docs": "/docs"}