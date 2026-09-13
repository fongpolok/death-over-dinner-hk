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

try:
    # Optional convenience: populate os.environ from a local backend/.env
    # file (gitignored -- see .env.example) before the Config dataclass
    # below reads it. Not a hard dependency: real deployments can just set
    # environment variables directly, so this degrades to a no-op if the
    # package isn't installed yet rather than crashing the whole server.
    from dotenv import load_dotenv

    load_dotenv(PROJECT_ROOT / "backend" / ".env")
except ImportError:
    pass


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

    # Item 9.6: real invitation-email sending. Unset by default -- see
    # .env.example. is_email_configured is what /api/send-invitation checks
    # before attempting smtplib.SMTP at all, so an unconfigured install
    # degrades to "logged, not sent" rather than raising.
    smtp_host: str = os.environ.get("DOD_SMTP_HOST", "")
    smtp_port: int = _env_int("DOD_SMTP_PORT", 587)
    smtp_user: str = os.environ.get("DOD_SMTP_USER", "")
    smtp_password: str = os.environ.get("DOD_SMTP_PASSWORD", "")
    smtp_from_email: str = os.environ.get("DOD_SMTP_FROM_EMAIL", "")
    smtp_from_name: str = os.environ.get("DOD_SMTP_FROM_NAME", "三渡棧 Mementos")

    @property
    def log_file_path(self) -> Path:
        return self.log_dir / self.log_file_name

    @property
    def is_email_configured(self) -> bool:
        return bool(self.smtp_host and self.smtp_user and self.smtp_password and self.smtp_from_email)
