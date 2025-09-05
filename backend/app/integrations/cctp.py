from __future__ import annotations
from typing import Any

class CCTPClient:
    """Stub for Circle CCTP flows: burn, attestation, mint."""

    def __init__(self, network: str = "testnet"):
        self.network = network

    def initiate_burn(self, chain: str, amount: float) -> dict[str, Any]:
        if amount <= 0:
            raise ValueError("amount must be positive")
        return {"status": "burn_initiated", "chain": chain, "amount": amount, "tx": f"burn-{chain}-{amount}"}

    def fetch_attestation(self, burn_tx: str) -> dict[str, Any]:
        if not burn_tx:
            raise ValueError("burn_tx required")
        return {"status": "attested", "burn_tx": burn_tx, "attestation": f"att-{burn_tx}"}

    def mint_on_destination(self, chain: str, attestation: str) -> dict[str, Any]:
        if not attestation:
            raise ValueError("attestation required")
        return {"status": "minted", "chain": chain, "attestation": attestation}
