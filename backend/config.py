"""Tunable configuration for the local preview/logging server.

Every value has a sensible default, can be overridden with an environment
variable, and (see app.py) can also be overridden with a CLI flag. Nothing
here is required for the website itself to work — it only affects the
optional local Flask server used for preview and submission logging.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def _env_int(name: str, default: int) -> int:
    value = os.environ.get(name)
    return int(value) if value else default


@dataclass(frozen=True)
class Config:
    host: str = os.environ.get("DOD_HOST", "127.0.0.1")
    port: int = _env_int("DOD_PORT", 5000)
    debug: bool = os.environ.get("DOD_DEBUG", "false").lower() == "true"

    static_dir: Path = Path(os.environ.get("DOD_STATIC_DIR", PROJECT_ROOT / "frontend"))

    log_dir: Path = Path(os.environ.get("DOD_LOG_DIR", PROJECT_ROOT / "data"))
    log_file_name: str = os.environ.get("DOD_LOG_FILE", "submissions.log")
    log_level: str = os.environ.get("DOD_LOG_LEVEL", "INFO").upper()
    log_max_bytes: int = _env_int("DOD_LOG_MAX_BYTES", 1_000_000)
    log_backup_count: int = _env_int("DOD_LOG_BACKUP_COUNT", 5)

    @property
    def log_file_path(self) -> Path:
        return self.log_dir / self.log_file_name
