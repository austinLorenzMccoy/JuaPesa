import os
import importlib
from fastapi.testclient import TestClient


def test_cors_and_readyz(monkeypatch):
    # Ensure ALLOWED_ORIGINS is set before importing app
    monkeypatch.setenv("ALLOWED_ORIGINS", "http://localhost:5173,http://example.com")

    # Reload app.main to apply env-based CORS config
    if "app.main" in list(importlib.sys.modules.keys()):
        importlib.reload(importlib.import_module("app.main"))
    from app import main as main_module

    client = TestClient(main_module.app)

    # Exercise /readyz endpoint
    r = client.get("/readyz")
    assert r.status_code == 200
    assert r.json().get("ready") is True

    # Sanity: hit /healthz too (already covered elsewhere but harmless)
    h = client.get("/healthz")
    assert h.status_code == 200

    # Access a simple route under /api to ensure app still works
    t = client.get("/testall")
    assert t.status_code == 200


def test_allowed_origins_property(monkeypatch):
    # Verify parsing logic in Info.allowed_origins
    monkeypatch.setenv("ALLOWED_ORIGINS", " http://a.com , http://b.com ")
    from app.core.config import Info

    info = Info()
    assert info.allowed_origins == ["http://a.com", "http://b.com"]
