from __future__ import annotations
from typing import Tuple

class AuthService:
    def verify_kyc(self, phone: str, id_number: str, full_name: str) -> Tuple[str, int]:
        if not phone or not id_number or not full_name:
            raise ValueError("missing required fields")
        # naive rule: approve if id_number length >= 6
        level = 1 if len(id_number) >= 6 else 0
        status = "approved" if level >= 1 else "rejected"
        return status, level
