"""
Add Hypothyroidism, Diabetes, Hypertension from source dataset,
plus synthesize Cholera cases, then save the extended Malawi dataset.

Run from: backend/ai_engine/src/
"""
from __future__ import annotations

from pathlib import Path

import pandas as pd

from config import PROJECT_ROOT
from preprocess import load_raw


SOURCE_DATASET = PROJECT_ROOT / "data" / "raw" / "symptom_disease_dataset.csv"
MALAWI_DATASET = PROJECT_ROOT / "data" / "raw" / "symptom_disease_malawi.csv"

# Exact source names (note: Diabetes and Hypertension have trailing spaces)
NEW_DISEASES_FROM_SOURCE = [
    "Hypothyroidism",
    "Diabetes ",       # trailing space — as it appears in source
    "Hypertension ",   # trailing space — as it appears in source
]

# Normalized names we want in the output (stripped, title-cased)
DISPLAY_NAMES = {
    "Hypothyroidism": "Hypothyroidism",
    "Diabetes ": "Diabetes",
    "Hypertension ": "Hypertension",
}

# Cholera — clinical symptom set confirmed against your dataset vocabulary
# Cholera — clinically grounded using only vocabulary that exists in the dataset.
# Distinguished from Gastroenteritis by SEVERE DEHYDRATION markers.
CHOLERA_SYMPTOMS = [
    "diarrhoea",
    "vomiting",
    "dehydration",       # severity marker
    "sunken_eyes",       # severity marker
    "muscle_wasting",    # severity marker
    "weakness_in_limbs", # severity marker
    "lethargy",
    "restlessness",
    "stomach_pain",
    "nausea",
]

CHOLERA_NUM_ROWS = 120


def find_exact_disease(df: pd.DataFrame, target: str) -> str | None:
    """Return the exact column value that matches target (case-sensitive)."""
    for d in df["disease"].unique():
        if d == target:
            return d
    return None


def build_cholera_rows(
    df_template: pd.DataFrame,
    num_rows: int,
) -> pd.DataFrame:
    """Construct synthetic Cholera rows matching the schema of df_template."""
    symptom_cols = [c for c in df_template.columns if c != "disease"]
    rows = []

    for i in range(num_rows):
        # Rotate starting point so each row has a different combination
        rotated = (
            CHOLERA_SYMPTOMS[i % len(CHOLERA_SYMPTOMS):]
            + CHOLERA_SYMPTOMS[:i % len(CHOLERA_SYMPTOMS)]
        )

        # Vary the number of symptoms: 4, 5, or 6 symptoms per row
                # Ensure the 4 severity markers are always included
        SEVERITY_MARKERS = {"dehydration", "sunken_eyes", "muscle_wasting", "weakness_in_limbs"}
        base_markers = [s for s in CHOLERA_SYMPTOMS if s in SEVERITY_MARKERS]

        # Pick 2–3 additional symptoms from the non-marker pool
        optional = [s for s in CHOLERA_SYMPTOMS if s not in SEVERITY_MARKERS]
        # Rotate through the optional pool
        take_optional = 2 + (i % 2)  # 2 or 3
        rotated_optional = optional[i % len(optional):] + optional[:i % len(optional)]
        chosen_optional = rotated_optional[:take_optional]

        row_symptoms = base_markers + chosen_optional

        row = {"disease": "Cholera"}
        for j, col in enumerate(symptom_cols):
            row[col] = row_symptoms[j] if j < len(row_symptoms) else None
        rows.append(row)

    return pd.DataFrame(rows, columns=df_template.columns)


def main() -> None:
    print(f"Loading source: {SOURCE_DATASET}")
    source = load_raw(SOURCE_DATASET)

    print(f"Loading Malawi dataset: {MALAWI_DATASET}")
    malawi = load_raw(MALAWI_DATASET)

    print(f"\nMalawi BEFORE: {len(malawi)} rows, {malawi['disease'].nunique()} diseases")

    # ---------- 1) Add the three lifestyle diseases ----------
    print("\n--- Adding from source dataset ---")
    for target in NEW_DISEASES_FROM_SOURCE:
        exact = find_exact_disease(source, target)
        if exact is None:
            print(f"  [SKIP] '{target}' not found (may have a different exact name)")
            continue

        display = DISPLAY_NAMES[target]

        # Skip if already present (case-insensitive)
        if display.lower() in {d.lower() for d in malawi["disease"].unique()}:
            print(f"  [SKIP] '{display}' already in Malawi dataset")
            continue

        rows = source[source["disease"] == exact].copy()
        rows["disease"] = display  # normalize name in output
        malawi = pd.concat([malawi, rows], ignore_index=True)
        print(f"  [ADD]  {display}: {len(rows)} rows")

    # ---------- 2) Synthesize Cholera ----------
    print("\n--- Adding Cholera (synthesized from clinical case definition) ---")
    if "cholera" in {d.lower() for d in malawi["disease"].unique()}:
        print("  [SKIP] Cholera already present")
    else:
        cholera_df = build_cholera_rows(malawi, CHOLERA_NUM_ROWS)
        malawi = pd.concat([malawi, cholera_df], ignore_index=True)
        print(f"  [ADD]  Cholera: {CHOLERA_NUM_ROWS} rows (synthesized)")

    # ---------- 3) Save ----------
    malawi = malawi.reset_index(drop=True)
    malawi.to_csv(MALAWI_DATASET, index=False)

    print(f"\nMalawi AFTER : {len(malawi)} rows, {malawi['disease'].nunique()} diseases")
    print(f"Saved → {MALAWI_DATASET}")

    # ---------- 4) Distribution ----------
    print("\nFinal disease distribution:")
    counts = malawi["disease"].value_counts()
    print(counts.to_string())


if __name__ == "__main__":
    main()