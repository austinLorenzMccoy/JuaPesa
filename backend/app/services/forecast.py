from __future__ import annotations
from typing import Literal
from hashlib import sha256
from app.ai.groq_client import GroqClient

Window = Literal["1h", "4h", "24h"]


class ForecastService:
    def __init__(self):
        self.ai = GroqClient()

    def predict(self, operator: str, window: Window) -> float:
        if not operator:
            raise ValueError("operator required")
        if window not in ("1h", "4h", "24h"):
            raise ValueError("invalid window")
        # Produce deterministic pseudo-forecast based on hash to keep tests hermetic
        seed = int(sha256(f"{operator}-{window}".encode()).hexdigest(), 16)
        # Map to range [-1000, 1000]
        return ((seed % 200000) / 100.0) - 1000.0

    def operator_summary(self, operator: str, window: str = "4h") -> str:
        predicted = self.predict(operator, window)  # will validate inputs
        text = f"Operator {operator} predicted net flow {predicted:.2f} over {window}."
        return self.ai.summarize(text)
