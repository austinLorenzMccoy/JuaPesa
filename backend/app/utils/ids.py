import os
import time
import random


def new_tx_id(prefix: str = "tx") -> str:
    # Simple unique id: prefix-timestamp-rand
    return f"{prefix}-{int(time.time()*1000)}-{random.randint(1000,9999)}"
