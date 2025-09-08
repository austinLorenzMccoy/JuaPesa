from __future__ import annotations
from app.core.config import get_settings
from app.integrations.daraja import DarajaClient as DarajaStub
from app.integrations.cctp import CCTPClient as CCTPStub
from app.integrations.hedera import HederaClient as HederaStub

# Live placeholders are optional imports; fallback to stubs if not available
try:  # pragma: no cover - only used when live clients implemented
    from app.integrations.daraja_live import DarajaClient as DarajaLive  # type: ignore
except Exception:  # pragma: no cover
    DarajaLive = None  # type: ignore

try:  # pragma: no cover
    from app.integrations.cctp_live import CCTPClient as CCTPLive  # type: ignore
except Exception:  # pragma: no cover
    CCTPLive = None  # type: ignore

try:  # pragma: no cover
    from app.integrations.hedera_live import HederaClient as HederaLive  # type: ignore
except Exception:  # pragma: no cover
    HederaLive = None  # type: ignore


def get_daraja_client():
    s = get_settings()
    if getattr(s, "USE_STUB_DARAJA", True) or DarajaLive is None:
        return DarajaStub()
    return DarajaLive()


def get_cctp_client():
    s = get_settings()
    if getattr(s, "USE_STUB_CCTP", True) or CCTPLive is None:
        return CCTPStub()
    return CCTPLive()


def get_hedera_client():
    s = get_settings()
    if getattr(s, "USE_STUB_HEDERA", True) or HederaLive is None:
        return HederaStub()
    return HederaLive()
