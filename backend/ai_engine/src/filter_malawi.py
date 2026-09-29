"""
Filter the symptom-disease dataset to Malawi-prevalent diseases.

Output: data/raw/symptom_disease_malawi.csv
"""
from __future__ import annotations

from pathlib import Path

import pandas as pd

from config import PROJECT_ROOT
from preprocess import load_raw


# Malawi priority diseases — matched against dataset's 'disease' column.
# Sources: Malawi IDSR Weekly Bulletins, WHO country data.
MALAWI_DISEASES = [
    "Malaria",
    "Typhoid",
    "Tuberculosis",
    "Dengue",
    "Hepatitis A",
    "Hepatitis B",
    "Hepatitis C",
    "Hepatitis D",
    "Hepatitis E",
    "Gastroenteritis",
    "Pneumonia",
]


def filter_dataset(df: pd.DataFrame, diseases: list[str]) -> pd.DataFrame:
    """Keep only rows whose 'disease' is in the target list."""
    # Match case-insensitively so we don't miss 'malaria' vs 'Malaria'
    target = {d.lower() for d in diseases}
    mask = df["disease"].str.lower().isin(target)
    filtered = df[mask].copy()
    return filtered.reset_index(drop=True)


def report(df_before: pd.DataFrame, df_after: pd.DataFrame, diseases: list[str]) -> None:
    """Print a summary table of which diseases survived filtering."""
    print("\n" + "=" * 70)
    print("MALAWI FILTER REPORT")
    print("=" * 70)
    print(f"Before filter : {len(df_before)} samples, {df_before['disease'].nunique()} diseases")
    print(f"After filter  : {len(df_after)} samples, {df_after['disease'].nunique()} diseases")
    print("-" * 70)

    matched = sorted(df_after["disease"].unique())
    missing = [d for d in diseases if d not in matched]

    print(f"\n{'Disease':<22}{'Samples':<10}")
    print("-" * 70)
    for d in matched:
        count = (df_after["disease"] == d).sum()
        print(f"{d:<22}{count:<10}")

    if missing:
        print("\n Requested but NOT found in dataset:")
        for d in missing:
            print(f"  - {d}")

    print("=" * 70)


def main() -> None:
    raw_path = PROJECT_ROOT / "data" / "raw" / "symptom_disease_dataset.csv"
    out_path = PROJECT_ROOT / "data" / "raw" / "symptom_disease_malawi.csv"

    print(f"Loading: {raw_path}")
    df = load_raw(raw_path)

    print(f"Filtering to {len(MALAWI_DISEASES)} Malawi-priority diseases...")
    filtered = filter_dataset(df, MALAWI_DISEASES)

    report(df, filtered, MALAWI_DISEASES)

    filtered.to_csv(out_path, index=False)
    print(f"\nSaved filtered dataset → {out_path}")


if __name__ == "__main__":
    main()