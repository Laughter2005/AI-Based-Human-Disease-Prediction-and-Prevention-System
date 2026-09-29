"""
ML predictor service.

Loads the trained model + metadata from the AI engine and exposes
a predict() method for symptom-based disease prediction.
"""
from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np

from config import get_settings


class DiseasePredictor:
    """Wraps the trained model for inference."""

    def __init__(self) -> None:
        settings = get_settings()

        # Resolve paths relative to backend/api/
        api_dir = Path(__file__).resolve().parents[1]
        model_path = (api_dir / settings.model_path).resolve()
        processed_dir = (api_dir / settings.processed_data_path).resolve()

        if not model_path.exists():
            raise FileNotFoundError(f"Model not found: {model_path}")

        self.model = joblib.load(model_path)
        self.model_name = settings.model_name

        # Load metadata (symptom names + disease classes)
        self.symptom_names: list[str] = np.load(
            processed_dir / "symptom_names.npy", allow_pickle=True
        ).tolist()
        self.disease_classes = np.load(
            processed_dir / "disease_classes.npy", allow_pickle=True
        )

        # Precompute symptom -> index map for fast lookup
        self._symptom_index = {s: i for i, s in enumerate(self.symptom_names)}

    def _vectorize(self, symptoms: list[str]) -> np.ndarray:
        """Convert symptom names into the binary feature vector."""
        vec = np.zeros(len(self.symptom_names), dtype=np.int8)
        for s in symptoms:
            key = str(s).strip().lower()
            if key in self._symptom_index:
                vec[self._symptom_index[key]] = 1
        return vec.reshape(1, -1)

    def predict(self, symptoms: list[str], top_k: int = 3) -> list[dict]:
        """Return the top-k predicted diseases with confidence scores."""
        x = self._vectorize(symptoms)
        proba = self.model.predict_proba(x)[0]
        top_idx = np.argsort(proba)[::-1][:top_k]

        return [
            {
                "disease": str(self.disease_classes[i]),
                "confidence": round(float(proba[i]), 4),
            }
            for i in top_idx
        ]

    @property
    def known_symptoms(self) -> list[str]:
        """All symptom names the model was trained on."""
        return list(self.symptom_names)

    @property
    def known_diseases(self) -> list[str]:
        """All disease labels the model can predict."""
        return [str(d) for d in self.disease_classes]