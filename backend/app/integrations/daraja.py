from __future__ import annotations
from typing import Any, Optional

class DarajaClient:
    """M-Pesa Daraja API stub client.
    In production, implement OAuth, STK push, C2B/B2C endpoints.
    """

    def __init__(self, base_url: str = "https://sandbox.safaricom.co.ke", api_key: Optional[str] = None):
        self.base_url = base_url
        self.api_key = api_key

    def simulate_debit(self, phone: str, amount: float) -> dict[str, Any]:
        if amount <= 0:
            raise ValueError("amount must be positive")
        return {"status": "queued", "ref": f"daraja-{phone[-4:]}-{int(amount)}"}
