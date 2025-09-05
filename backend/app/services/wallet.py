from app.utils.ids import new_tx_id


class WalletService:
    def convert(
        self,
        user_id: str,
        from_rail: str,
        from_operator: str | None,
        amount: float,
        to_token: str,
        to_chain: str | None,
        mode: str,
    ) -> str:
        # Minimal stub that returns a deterministic ID format
        if amount <= 0:
            raise ValueError("amount must be positive")
        return new_tx_id(prefix="cv")
