from __future__ import annotations
from typing import Any, Optional

class DarajaClient:
    """Placeholder for real Daraja client.

    Expected to implement:
    - OAuth/token management
    - STK push and C2B/B2C operations
    - Callback validation and idempotency
    """

    def __init__(self, base_url: str = "https://api.safaricom.co.ke", api_key: Optional[str] = None):
        self.base_url = base_url
        self.api_key = api_key

    def simulate_debit(self, phone: str, amount: float) -> dict[str, Any]:
        raise NotImplementedError("Daraja live client not implemented in this scaffold")
