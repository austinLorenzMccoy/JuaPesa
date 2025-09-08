from typing import Optional
from app.core.config import get_settings


class GroqClient:
    """Lightweight wrapper; returns mocked text if no API key set."""

    _SENTINEL = object()

    def __init__(self, api_key: Optional[str] | object = _SENTINEL):
        # If api_key is explicitly None, force mock branch. If omitted, read from settings.
        if api_key is self._SENTINEL:
            self.api_key = get_settings().GROQ_API_KEY
        else:
            self.api_key = api_key  # may be None

    def summarize(self, text: str) -> str:
        if not text:
            raise ValueError("text must be non-empty")
        if not self.api_key:
            # Offline deterministic summary
            return f"[mock-summary:{min(32, len(text))}]{text[:32]}"
        # In real integration: call Groq API here.
        # We intentionally avoid network calls in this scaffold.
        return f"[would-call-groq]{text[:32]}"  # pragma: no cover