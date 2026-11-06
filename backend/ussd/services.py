"""Service layer — calls the main API for predictions."""
from __future__ import annotations

import httpx

from config import get_settings
from schemas import PredictionAPIResponse


settings = get_settings()


async def call_prediction_api(symptoms: list[str], language: str) -> PredictionAPIResponse | None:
    """Call the main API's /predictions endpoint."""
    url = f"{settings.main_api_url}/predictions"
    payload = {
        "symptoms": symptoms,
        "top_k": 3,
        "language": language,
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            return PredictionAPIResponse(**response.json())
        except httpx.HTTPError:
            return None
        except Exception:
            return None