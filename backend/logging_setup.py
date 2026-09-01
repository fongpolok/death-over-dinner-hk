"""Central logging configuration.

Kept separate from app.py so the log setup can be reused by other entry
points (tests, a future CLI tool) without importing Flask.
"""

from __future__ import annotations

import logging
from logging.handlers import RotatingFileHandler

from .config import Config

LOGGER_NAME = "dod"


def configure_logging(config: Config) -> logging.Logger:
    logger = logging.getLogger(LOGGER_NAME)
    logger.setLevel(config.log_level)
    logger.handlers.clear()  # avoid duplicate handlers if called more than once

    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )

    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    config.log_dir.mkdir(parents=True, exist_ok=True)
    file_handler = RotatingFileHandler(
        config.log_file_path,
        maxBytes=config.log_max_bytes,
        backupCount=config.log_backup_count,
        encoding="utf-8",
    )
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger
