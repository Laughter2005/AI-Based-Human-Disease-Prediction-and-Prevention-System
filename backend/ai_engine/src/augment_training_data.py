"""
Augment the Malawi dataset with synthetic variations of each disease's rows.

For each disease:
  1. Collect all unique symptoms that appear in any of its rows (the "symptom pool")
  2. Compute per-symptom frequency within that disease
  3. Generate new rows that sample 4-8 symptoms from the pool, weighted by frequency
  4. This mimics realistic patient variability — some patients report only a
     subset of symptoms, and different patients report different combinations.

Result: model learns that ANY reasonable subset of a disease's symptoms
should still predict that disease. This dramatically improves performance
on sparse inputs.
"""
from __future__ import annotations

import random
from pathlib import Path

import pandas as pd

from config import PROJECT_ROOT
from preprocess import load_raw


DATASET = PROJECT_ROOT / "data" / "raw" / "symptom_disease_malawi.csv"
SYNTHETIC_ROWS_PER_DISEASE = 120   # add this many rows per disease
RANDOM_SEED = 42


def main() -> None:
    rng = random.Random(RANDOM_SEED)

    print(f"Loading {DATASET}")
    df = load_raw(DATASET)
    symptom_cols = [c for c in df.columns if c != "disease"]

    print(f"Original: {len(df)} rows, {df['disease'].nunique()} diseases")
    print()

    # Build a symptom pool + frequency for each disease
    disease_profiles: dict[str, tuple[list[str], list[float]]] = {}

    for disease, group in df.groupby("disease"):
        symptom_counts: dict[str, int] = {}
        for _, row in group.iterrows():
            for c in symptom_cols:
                val = row[c]
                if pd.notna(val) and str(val).strip():
                    key = str(val).strip().lower()
                    symptom_counts[key] = symptom_counts.get(key, 0) + 1

        if not symptom_counts:
            continue

        symptoms = list(symptom_counts.keys())
        weights = [symptom_counts[s] for s in symptoms]
        disease_profiles[disease] = (symptoms, weights)

    # Generate synthetic rows
    new_rows: list[dict] = []
    print(f"{'Disease':<20}{'Pool':<8}{'Synth':<8}")
    print("-" * 40)

    for disease, (symptoms, weights) in disease_profiles.items():
        for _ in range(SYNTHETIC_ROWS_PER_DISEASE):
            # Choose how many symptoms to include (4-8)
            n = rng.randint(4, 8)
            n = min(n, len(symptoms))

            # Weighted sample WITHOUT replacement
            chosen = []
            remaining_symptoms = list(symptoms)
            remaining_weights = list(weights)
            for _ in range(n):
                total = sum(remaining_weights)
                pick = rng.uniform(0, total)
                cum = 0.0
                for i, w in enumerate(remaining_weights):
                    cum += w
                    if pick <= cum:
                        chosen.append(remaining_symptoms.pop(i))
                        remaining_weights.pop(i)
                        break

            rng.shuffle(chosen)

            row = {"disease": disease}
            for j, col in enumerate(symptom_cols):
                row[col] = chosen[j] if j < len(chosen) else None
            new_rows.append(row)

        print(f"{disease:<20}{len(symptoms):<8}{SYNTHETIC_ROWS_PER_DISEASE:<8}")

    synth_df = pd.DataFrame(new_rows, columns=df.columns)

    # Combine original + synthetic, shuffle
    combined = pd.concat([df, synth_df], ignore_index=True)
    combined = combined.sample(frac=1, random_state=RANDOM_SEED).reset_index(drop=True)

    # Save to a new file so we keep the original
    out_path = DATASET.parent / "symptom_disease_malawi_augmented.csv"
    combined.to_csv(out_path, index=False)

    print()
    print(f"Original rows : {len(df)}")
    print(f"Synthetic rows: {len(synth_df)}")
    print(f"Total rows    : {len(combined)}")
    print(f"Diseases      : {combined['disease'].nunique()}")
    print()
    print(f"Saved → {out_path}")
    print()
    print("To use the augmented dataset, update configs/training_config.yaml:")
    print(f"  raw_path: {out_path.name}")


if __name__ == "__main__":
    main()