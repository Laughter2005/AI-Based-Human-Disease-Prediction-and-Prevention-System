"""
Preprocessing for symptom-disease dataset.

Converts rows of symptom strings into a binary feature matrix:
    X[i, j] = 1 if sample i reported symptom j, else 0.
"""
from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder


def load_raw(path: str | Path) -> pd.DataFrame:
    """
    Load the raw symptom-disease CSV, normalize column names,
    and ensure a 'disease' column exists.
    """
    df = pd.read_csv(path)

    # Strip whitespace from column names
    df.columns = [str(c).strip() for c in df.columns]

    # Drop unnamed index columns
    unnamed = [c for c in df.columns if c.lower().startswith("unnamed") or c == ""]
    if unnamed:
        df = df.drop(columns=unnamed)

    # Case-insensitive match for 'disease' column
    disease_col = next((c for c in df.columns if c.lower() == "disease"), None)
    if disease_col is None:
        raise ValueError(
            f"Dataset must contain a 'disease' column. "
            f"Found columns: {list(df.columns)}"
        )

    # Standardize to lowercase 'disease'
    if disease_col != "disease":
        df = df.rename(columns={disease_col: "disease"})

    return df


def build_feature_matrix(
    df: pd.DataFrame,
) -> tuple[pd.DataFrame, np.ndarray, LabelEncoder]:
    """
    Build a binary symptom matrix and encoded disease labels.

    Returns:
        X: DataFrame (n_samples x n_unique_symptoms), values 0/1
        y: np.ndarray of encoded disease labels
        label_encoder: fitted LabelEncoder (for inverse transform)
    """
    symptom_cols = [c for c in df.columns if c != "disease"]

    # Collect all unique symptoms across all symptom columns
    all_symptoms = sorted(
        {
            str(s).strip().lower()
            for col in symptom_cols
            for s in df[col].dropna()
            if str(s).strip()
        }
    )

    # Build binary matrix
    X = pd.DataFrame(0, index=df.index, columns=all_symptoms, dtype=np.int8)
    for col in symptom_cols:
        for idx, val in df[col].items():
            if pd.notna(val) and str(val).strip():
                X.at[idx, str(val).strip().lower()] = 1

    # Encode labels
    le = LabelEncoder()
    y = le.fit_transform(df["disease"])

    return X, y, le


def split_data(
    X: pd.DataFrame,
    y: np.ndarray,
    test_size: float = 0.2,
    random_state: int = 42,
) -> tuple[pd.DataFrame, pd.DataFrame, np.ndarray, np.ndarray]:
    """Stratified train/test split preserving class distribution."""
    return train_test_split(
        X,
        y,
        test_size=test_size,
        random_state=random_state,
        stratify=y,
    )


def save_processed(
    X_train: pd.DataFrame,
    X_test: pd.DataFrame,
    y_train: np.ndarray,
    y_test: np.ndarray,
    symptom_names: list[str],
    label_encoder: LabelEncoder,
    out_dir: str | Path,
) -> None:
    """Save processed artifacts for reuse by training and prediction scripts."""
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    X_train.to_parquet(out_dir / "X_train.parquet")
    X_test.to_parquet(out_dir / "X_test.parquet")
    np.save(out_dir / "y_train.npy", y_train)
    np.save(out_dir / "y_test.npy", y_test)
    np.save(out_dir / "symptom_names.npy", np.array(symptom_names))
    np.save(out_dir / "disease_classes.npy", label_encoder.classes_)


def load_processed(processed_dir: str | Path) -> dict:
    """Load processed artifacts as a dict."""
    processed_dir = Path(processed_dir)
    return {
        "X_train": pd.read_parquet(processed_dir / "X_train.parquet"),
        "X_test": pd.read_parquet(processed_dir / "X_test.parquet"),
        "y_train": np.load(processed_dir / "y_train.npy"),
        "y_test": np.load(processed_dir / "y_test.npy"),
        "symptom_names": np.load(processed_dir / "symptom_names.npy", allow_pickle=True).tolist(),
        "disease_classes": np.load(processed_dir / "disease_classes.npy", allow_pickle=True),
    }