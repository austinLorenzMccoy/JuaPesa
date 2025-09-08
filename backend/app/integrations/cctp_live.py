from __future__ import annotations
from typing import Any

class CCTPClient:
    """Placeholder for real Circle CCTP client.

    Expected to implement cross-chain flows:
    - initiate_burn(chain, amount)
    - fetch_attestation(burn_tx)
    - mint_on_destination(chain, attestation)
    """

    def __init__(self, network: str = "mainnet"):
        self.network = network

    def initiate_burn(self, chain: str, amount: float) -> dict[str, Any]:
        raise NotImplementedError("CCTP live client not implemented in this scaffold")

    def fetch_attestation(self, burn_tx: str) -> dict[str, Any]:
        raise NotImplementedError("CCTP live client not implemented in this scaffold")

    def mint_on_destination(self, chain: str, attestation: str) -> dict[str, Any]:
        raise NotImplementedError("CCTP live client not implemented in this scaffold")
