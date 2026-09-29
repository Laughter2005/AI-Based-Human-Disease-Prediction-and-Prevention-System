"""Evaluation metrics for disease prediction models."""
from __future__ import annotations

import numpy as np
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)


def compute_metrics(model, X_test: np.ndarray, y_test: np.ndarray) -> dict:
    """Compute clinically relevant metrics for a trained classifier."""
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)

    n_classes = len(np.unique(y_test))

    # ROC-AUC: one-vs-rest for multiclass
    try:
        if n_classes > 2:
            roc_auc = roc_auc_score(
                y_test, y_proba, multi_class="ovr", average="macro"
            )
        else:
            roc_auc = roc_auc_score(y_test, y_proba[:, 1])
    except ValueError:
        # Rare class absent in test split
        roc_auc = float("nan")

    return {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "f1_macro": float(f1_score(y_test, y_pred, average="macro", zero_division=0)),
        "f1_weighted": float(f1_score(y_test, y_pred, average="weighted", zero_division=0)),
        "precision_macro": float(precision_score(y_test, y_pred, average="macro", zero_division=0)),
        "recall_macro": float(recall_score(y_test, y_pred, average="macro", zero_division=0)),
        "roc_auc_ovr": float(roc_auc),
    }


def top_k_accuracy(y_true: np.ndarray, y_proba: np.ndarray, k: int = 3) -> float:
    """Fraction of samples where the true class is in the top-k predictions."""
    k = min(k, y_proba.shape[1])
    top_k = np.argsort(y_proba, axis=1)[:, -k:]
    return float(np.mean([y_true[i] in top_k[i] for i in range(len(y_true))]))


def per_class_report(model, X_test: np.ndarray, y_test: np.ndarray, class_names: np.ndarray) -> str:
    """Full per-class precision/recall/F1 — spot weak diseases."""
    y_pred = model.predict(X_test)
    return classification_report(y_test, y_pred, target_names=class_names, zero_division=0)


def confusion(model, X_test: np.ndarray, y_test: np.ndarray) -> np.ndarray:
    """Raw confusion matrix."""
    return confusion_matrix(y_test, model.predict(X_test))