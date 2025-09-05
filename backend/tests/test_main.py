from app.main import app
from fastapi.testclient import TestClient


def test_healthz():
    client = TestClient(app)
    r = client.get("/healthz")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_testall():
    client = TestClient(app)
    r = client.get("/testall")
    assert r.status_code == 200
    data = r.json()
    assert data["ok"] is True
    assert "api" in data["services"]
    assert data["version"] == "0.1.0"
