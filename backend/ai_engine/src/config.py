"""Configuration loader for the AI engine."""
from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml


# Project root = ai_engine/ (two levels up from src/config.py)
PROJECT_ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = PROJECT_ROOT / "configs" / "training_config.yaml"


def load_config(path: str | Path = CONFIG_PATH) -> dict[str, Any]:
    """Load YAML config and resolve relative paths against PROJECT_ROOT."""
    with open(path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    # Resolve data and output paths to absolute paths
    cfg["data"]["raw_path"] = str(PROJECT_ROOT / cfg["data"]["raw_path"])
    cfg["data"]["processed_dir"] = str(PROJECT_ROOT / cfg["data"]["processed_dir"])
    cfg["output"]["model_dir"] = str(PROJECT_ROOT / cfg["output"]["model_dir"])
    cfg["output"]["results_file"] = str(PROJECT_ROOT / cfg["output"]["results_file"])

    return cfg