import importlib
import os
import types

from app.core import config as config_module


def reset_settings_cache():
    # Clear lru_cache for get_settings
    try:
        config_module.get_settings.cache_clear()  # type: ignore[attr-defined]
    except Exception:
        pass


def test_factory_returns_live_when_flags_disabled(monkeypatch):
    # Force flags to disable stubs
    monkeypatch.setenv("USE_STUB_DARAJA", "false")
    monkeypatch.setenv("USE_STUB_CCTP", "false")
    monkeypatch.setenv("USE_STUB_HEDERA", "false")

    # Reset cached settings so new env is read
    reset_settings_cache()

    # Reload the factory module to pick up potential optional imports and settings
    factory = importlib.import_module("app.integrations.integration_factory")
    importlib.reload(factory)

    try:
        d = factory.get_daraja_client()
        c = factory.get_cctp_client()
        h = factory.get_hedera_client()

        # Live placeholders should be different types than stubs when flags are false
        # We check they come from the live modules by their module name
        assert type(d).__module__.endswith("daraja_live")
        assert type(c).__module__.endswith("cctp_live")
        assert type(h).__module__.endswith("hedera_live")

        # Calling methods should raise NotImplementedError in placeholders (cover those lines)
        for fn in (
            lambda: d.simulate_debit("+254700000000", 1.0),
            lambda: c.initiate_burn("ethereum", 1.0),
            lambda: c.fetch_attestation("tx123"),
            lambda: c.mint_on_destination("hedera", "att"),
            lambda: h.mint("USDC", 1.0),
            lambda: h.burn("USDC", 1.0),
        ):
            try:
                fn()
            except NotImplementedError:
                pass

        # Now simulate live clients unavailable to cover stub fallback branches
        monkeypatch.setattr(factory, "DarajaLive", None)
        monkeypatch.setattr(factory, "CCTPLive", None)
        monkeypatch.setattr(factory, "HederaLive", None)
        # With flags still false, factory should still return stubs if live is None
        from app.integrations.daraja import DarajaClient as DarajaStub
        from app.integrations.cctp import CCTPClient as CCTPStub
        from app.integrations.hedera import HederaClient as HederaStub

        assert isinstance(factory.get_daraja_client(), DarajaStub)
        assert isinstance(factory.get_cctp_client(), CCTPStub)
        assert isinstance(factory.get_hedera_client(), HederaStub)
    finally:
        # Reset cached settings so other tests see defaults (stubs enabled)
        reset_settings_cache()
