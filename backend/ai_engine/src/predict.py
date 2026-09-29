"""Inference module — load a trained model and predict from raw symptom names."""
from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
import pandas as pd

from config import load_config
from preprocess import load_processed


class DiseasePredictor:
    """Loads a trained model + metadata and predicts disease from symptom names."""

    def __init__(self, model_name: str = "xgboost"):
        cfg = load_config()
        self.model_dir = Path(cfg["output"]["model_dir"])
        self.processed_dir = Path(cfg["data"]["processed_dir"])

        artifacts = load_processed(self.processed_dir)
        self.symptom_names: list[str] = artifacts["symptom_names"]
        self.disease_classes: np.ndarray = artifacts["disease_classes"]

        model_path = self.model_dir / f"{model_name}.joblib"
        if not model_path.exists():
            raise FileNotFoundError(f"Model not found: {model_path}")
        self.model = joblib.load(model_path)
        self.model_name = model_name

    def _symptoms_to_vector(self, symptoms: list[str]) -> np.ndarray:
        """Convert a list of symptom names into the binary feature vector."""
        vec = np.zeros(len(self.symptom_names), dtype=np.int8)
        index = {s: i for i, s in enumerate(self.symptom_names)}
        for s in symptoms:
            key = str(s).strip().lower()
            if key in index:
                vec[index[key]] = 1
        return vec.reshape(1, -1)

    def predict(self, symptoms: list[str], top_k: int = 3) -> dict:
        """Predict top-k diseases for a list of symptom names."""
        x = self._symptoms_to_vector(symptoms)
        proba = self.model.predict_proba(x)[0]
        top_idx = np.argsort(proba)[::-1][:top_k]

        return {
            "model": self.model_name,
            "input_symptoms": symptoms,
            "top_predictions": [
                {
                    "disease": str(self.disease_classes[i]),
                    "confidence": round(float(proba[i]), 4),
                }
                for i in top_idx
            ],
        }


if __name__ == "__main__":
    predictor = DiseasePredictor(model_name="xgboost")
    demo_symptoms = ["fever", "headache", "vomiting", "chills"]
    result = predictor.predict(demo_symptoms, top_k=3)
    import json
    print(json.dumps(result, indent=2))