from app.utils.ids import new_tx_id


class LiquidityService:
    def rebalance(self, source_pool: str, dest_pool: str, amount: float, reason: str | None, window: str | None):
        if amount <= 0:
            raise ValueError("amount must be positive")
        order_id = new_tx_id(prefix="rb")
        status = "placed"
        return order_id, status
