from __future__ import annotations
import os
from typing import Any

try:
    import redis  # type: ignore
except Exception:  # pragma: no cover - import guarded
    redis = None  # type: ignore


class Cache:
    def __init__(self, url: str | None = None):
        self.url = url or os.getenv("REDIS_URL")
        self._client = None
        if self.url and redis is not None:  # pragma: no cover - external service
            try:
                self._client = redis.from_url(self.url, decode_responses=True)  # pragma: no cover
            except Exception:  # pragma: no cover - external service
                self._client = None
        # fallback simple dict
        self._store: dict[str, str] = {}

    def set(self, key: str, value: str, ex: int | None = None) -> None:
        if self._client is not None:  # pragma: no cover - external service
            self._client.set(key, value, ex=ex)  # pragma: no cover
        else:
            self._store[key] = value

    def get(self, key: str) -> str | None:
        if self._client is not None:  # pragma: no cover - external service
            val = self._client.get(key)  # pragma: no cover
            return val  # pragma: no cover
        return self._store.get(key)

    def incr(self, key: str) -> int:
        if self._client is not None:  # pragma: no cover - external service
            return int(self._client.incr(key))  # pragma: no cover
        v = int(self._store.get(key, "0")) + 1
        self._store[key] = str(v)
        return v
