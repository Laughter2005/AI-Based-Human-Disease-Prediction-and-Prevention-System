"""
Robustness evaluation for the trained disease prediction models.

Simulates real-world imperfect symptom reporting by:
  1. Randomly dropping symptoms (patients forget to mention some)
  2. Randomly adding unrelated symptoms (patients report extra symptoms)

Produces honest metrics report in Chapter IV.
"""
from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
from sklearn.metrics import accuracy_score, f1_score, recall_score

from config import load_config, PROJECT_ROOT
from preprocess import load_processed


# Noise conditions to test
NOISE_LEVELS = [0.0, 0.10, 0.20, 0.30]  # 0% = clean, 30% = worst case
RANDOM_SEED = 42


def drop_symptoms(X: np.ndarray, drop_rate: float, rng: np.random.Generator) -> np.ndarray:
    """
    Randomly flip 1s to 0s (simulate patient forgetting to mention symptoms).
    Only drops symptoms that are present (1s).
    """
    X_noisy = X.copy()
    for i in range(X_noisy.shape[0]):
        present_indices = np.where(X_noisy[i] == 1)[0]
        if len(present_indices) == 0:
            continue
        n_drop = max(1, int(len(present_indices) * drop_rate))
        to_drop = rng.choice(present_indices, size=n_drop, replace=False)
        X_noisy[i, to_drop] = 0
    return X_noisy


def add_symptoms(X: np.ndarray, add_rate: float, rng: np.random.Generator) -> np.ndarray:
    """
    Randomly flip some 0s to 1s (simulate patient reporting unrelated symptoms).
    Uses a small rate so we don't completely corrupt the input.
    """
    X_noisy = X.copy()
    n_features = X_noisy.shape[1]
    for i in range(X_noisy.shape[0]):
        n_add = max(1, int(n_features * add_rate * 0.1))  # 10% of add_rate
        absent_indices = np.where(X_noisy[i] == 0)[0]
        if len(absent_indices) == 0:
            continue
        to_add = rng.choice(absent_indices, size=min(n_add, len(absent_indices)), replace=False)
        X_noisy[i, to_add] = 1
    return X_noisy


def evaluate_model(model, X_test: np.ndarray, y_test: np.ndarray) -> dict:
    """Compute clean-set metrics."""
    y_pred = model.predict(X_test)
    return {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "f1_macro": float(f1_score(y_test, y_pred, average="macro", zero_division=0)),
        "recall_macro": float(recall_score(y_test, y_pred, average="macro", zero_division=0)),
    }


def evaluate_under_noise(
    model,
    X_test: np.ndarray,
    y_test: np.ndarray,
    drop_rate: float,
    add_rate: float,
    rng: np.random.Generator,
) -> dict:
    """Compute metrics after applying noise."""
    if drop_rate == 0 and add_rate == 0:
        return evaluate_model(model, X_test, y_test)

    X_noisy = X_test
    if drop_rate > 0:
        X_noisy = drop_symptoms(X_noisy, drop_rate, rng)
    if add_rate > 0:
        X_noisy = add_symptoms(X_noisy, add_rate, rng)

    y_pred = model.predict(X_noisy)
    return {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "f1_macro": float(f1_score(y_test, y_pred, average="macro", zero_division=0)),
        "recall_macro": float(recall_score(y_test, y_pred, average="macro", zero_division=0)),
    }


def main() -> None:
    cfg = load_config()

    print("Loading processed data...")
    artifacts = load_processed(cfg["data"]["processed_dir"])
    X_test = artifacts["X_test"].values
    y_test = artifacts["y_test"]

    print(f"Test set: {X_test.shape[0]} samples, {X_test.shape[1]} features")

    model_dir = Path(cfg["output"]["model_dir"])

    print("\n" + "=" * 92)
    print("ROBUSTNESS EVALUATION — Simulated Real-World Input")
    print("=" * 92)

    results: dict[str, dict] = {}

    for model_name in ["svm", "random_forest", "xgboost"]:
        model_path = model_dir / f"{model_name}.joblib"
        if not model_path.exists():
            print(f"[SKIP] {model_name} — file not found")
            continue

        model = joblib.load(model_path)
        results[model_name] = {}

        print(f"\n--- {model_name.upper()} ---")
        print(f"{'Condition':<28}{'Accuracy':<12}{'F1-macro':<12}{'Recall-macro':<12}")
        print("-" * 64)

        rng = np.random.default_rng(RANDOM_SEED)

        # Clean
        clean = evaluate_model(model, X_test, y_test)
        results[model_name]["clean"] = clean
        print(f"{'Clean (no noise)':<28}{clean['accuracy']:<12.4f}{clean['f1_macro']:<12.4f}{clean['recall_macro']:<12.4f}")

        # Drop 10% / 20% / 30% of reported symptoms
        for rate in [0.10, 0.20, 0.30]:
            rng = np.random.default_rng(RANDOM_SEED)  # reset for reproducibility
            metrics = evaluate_under_noise(model, X_test, y_test, drop_rate=rate, add_rate=0.0, rng=rng)
            key = f"drop_{int(rate * 100)}"
            results[model_name][key] = metrics
            print(
                f"{'Drop ' + str(int(rate * 100)) + '% symptoms':<28}"
                f"{metrics['accuracy']:<12.4f}{metrics['f1_macro']:<12.4f}{metrics['recall_macro']:<12.4f}"
            )

        # Combine drop 20% + add 5% noise
        rng = np.random.default_rng(RANDOM_SEED)
        combo = evaluate_under_noise(model, X_test, y_test, drop_rate=0.20, add_rate=0.05, rng=rng)
        results[model_name]["combined_20_5"] = combo
        print(
            f"{'Drop 20% + add 5% noise':<28}"
            f"{combo['accuracy']:<12.4f}{combo['f1_macro']:<12.4f}{combo['recall_macro']:<12.4f}"
        )

    # Save results
    import json
    out_path = model_dir / "robustness_results.json"
    out_path.write_text(json.dumps(results, indent=2))
    print(f"\nSaved results → {out_path}")

    # Summary for the report
    print("\n" + "=" * 92)
    print("SUMMARY FOR REPORT")
    print("=" * 92)
    for model_name, metrics in results.items():
        clean = metrics["clean"]["accuracy"]
        drop_20 = metrics["drop_20"]["accuracy"]
        drop_30 = metrics["drop_30"]["accuracy"]
        print(
            f"{model_name:<16} clean={clean:.4f}  "
            f"drop20={drop_20:.4f}  drop30={drop_30:.4f}"
        )


if __name__ == "__main__":
    main()