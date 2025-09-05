from __future__ import annotations
from typing import Any

class HederaClient:
    """Stub for Hedera HTS/EVM interactions (mint/burn/transfer)."""

    def __init__(self, network: str = "testnet"):
        self.network = network

    def mint(self, token: str, amount: float) -> dict[str, Any]:
        if amount <= 0:
            raise ValueError("amount must be positive")
        return {"status": "minted", "token": token, "amount": amount}

    def burn(self, token: str, amount: float) -> dict[str, Any]:
        if amount <= 0:
            raise ValueError("amount must be positive")
        return {"status": "burned", "token": token, "amount": amount}
