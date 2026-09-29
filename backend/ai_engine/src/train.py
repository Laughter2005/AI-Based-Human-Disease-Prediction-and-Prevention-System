"""
Train and compare XGBoost, SVM, and Random Forest on symptom-disease data.
"""
from __future__ import annotations

import json
import time
from pathlib import Path

import joblib
import numpy as np
from sklearn.calibration import CalibratedClassifierCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.svm import SVC
from xgboost import XGBClassifier

from config import load_config
from evaluate import compute_metrics, top_k_accuracy
from preprocess import (
    build_feature_matrix,
    load_raw,
    save_processed,
    split_data,
)


def build_models(n_classes: int) -> dict:
    """Return model name -> (estimator, param_grid)."""
    return {
        "svm": (
            CalibratedClassifierCV(
                SVC(class_weight="balanced", random_state=42),
                method="sigmoid",
                cv=5,
                ensemble=False,
            ),
            {
                "estimator__C": [0.1, 1, 10],
                "estimator__kernel": ["rbf"],
                "estimator__gamma": ["scale", "auto"],
            },
        ),
        "random_forest": (
            RandomForestClassifier(
                n_estimators=300,
                class_weight="balanced",
                random_state=42,
                n_jobs=-1,
            ),
            {
                "max_depth": [None, 20, 40],
                "min_samples_split": [2, 5],
            },
        ),
        "xgboost": (
            XGBClassifier(
                n_estimators=300,
                objective="multi:softprob",
                num_class=n_classes,
                tree_method="hist",
                random_state=42,
                n_jobs=-1,
                eval_metric="mlogloss",
            ),
            {
                "max_depth": [4, 6, 8],
                "learning_rate": [0.05, 0.1],
                "subsample": [0.8, 1.0],
            },
        ),
    }


def train_and_evaluate(
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray,
    n_classes: int,
    model_dir: Path,
    cv_folds: int = 5,
    top_k: int = 3,
) -> dict:
    """Train each model, evaluate, save artifacts, return results dict."""
    results: dict[str, dict] = {}
    cv = StratifiedKFold(n_splits=cv_folds, shuffle=True, random_state=42)

    for name, (estimator, grid) in build_models(n_classes).items():
        print(f"\n{'=' * 70}\nTraining: {name}\n{'=' * 70}")

        search = GridSearchCV(
            estimator,
            grid,
            cv=cv,
            scoring="f1_macro",
            n_jobs=-1,
            verbose=1,
        )

        t0 = time.time()
        search.fit(X_train, y_train)
        train_time = time.time() - t0

        best = search.best_estimator_
        print(f"Best params    : {search.best_params_}")
        print(f"CV f1_macro    : {search.best_score_:.4f}")
        print(f"Train time     : {train_time:.1f}s")

        metrics = compute_metrics(best, X_test, y_test)
        metrics["top_3_accuracy"] = top_k_accuracy(y_test, best.predict_proba(X_test), k=top_k)
        metrics["train_time_sec"] = round(train_time, 2)
        metrics["best_params"] = {k: str(v) for k, v in search.best_params_.items()}
        metrics["cv_f1_macro"] = round(float(search.best_score_), 4)

        model_path = model_dir / f"{name}.joblib"
        joblib.dump(best, model_path)
        print(f"Saved model    : {model_path}")

        results[name] = metrics

    return results


def main() -> None:
    cfg = load_config()
    model_dir = Path(cfg["output"]["model_dir"])
    model_dir.mkdir(parents=True, exist_ok=True)

    print("Loading raw dataset...")
    df = load_raw(cfg["data"]["raw_path"])
    print(f"  Rows: {len(df)}   Diseases: {df['disease'].nunique()}")

    print("Building feature matrix...")
    X, y, le = build_feature_matrix(df)
    print(f"  Feature shape: {X.shape}")

    print("Splitting data...")
    X_train, X_test, y_train, y_test = split_data(
        X, y,
        test_size=cfg["data"]["test_size"],
        random_state=cfg["data"]["random_state"],
    )
    print(f"  Train: {X_train.shape[0]}   Test: {X_test.shape[0]}")

    save_processed(
        X_train, X_test, y_train, y_test,
        X.columns.tolist(), le,
        cfg["data"]["processed_dir"],
    )

    n_classes = len(le.classes_)
    results = train_and_evaluate(
        X_train.values, y_train,
        X_test.values, y_test,
        n_classes=n_classes,
        model_dir=model_dir,
        cv_folds=cfg["training"]["cv_folds"],
        top_k=cfg["evaluation"]["top_k"],
    )

    # Save comparison results
    results_path = Path(cfg["output"]["results_file"])
    results_path.write_text(json.dumps(results, indent=2))

    # Print summary table
    print("\n" + "=" * 88)
    print(f"{'Model':<16}{'Acc':<10}{'F1-macro':<12}{'Recall':<10}{'AUC':<10}{'Top-3':<10}")
    print("=" * 88)
    for name, m in results.items():
        print(
            f"{name:<16}{m['accuracy']:<10.4f}{m['f1_macro']:<12.4f}"
            f"{m['recall_macro']:<10.4f}{m['roc_auc_ovr']:<10.4f}"
            f"{m['top_3_accuracy']:<10.4f}"
        )
    print("=" * 88)
    print(f"\nResults saved to: {results_path}")


if __name__ == "__main__":
    main()