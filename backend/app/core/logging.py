from __future__ import annotations
import logging
import os
from typing import Optional


def setup_logging(level: Optional[str] = None) -> None:
    """Configure application logging.

    - Uses a concise format with ISO8601 timestamps.
    - Honors LOG_LEVEL env (defaults to INFO).
    - Idempotent: safe to call multiple times.
    """
    log_level = (level or os.getenv("LOG_LEVEL") or "INFO").upper()

    # Avoid duplicate handlers if setup_logging is called more than once
    root = logging.getLogger()
    if root.handlers:
        for h in list(root.handlers):
            root.removeHandler(h)

    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        fmt="%(asctime)s %(levelname)s %(name)s %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S%z",
    )
    handler.setFormatter(formatter)

    root.addHandler(handler)
    root.setLevel(getattr(logging, log_level, logging.INFO))


def get_logger(name: str | None = None) -> logging.Logger:
    return logging.getLogger(name or __name__)
