from fastapi.testclient import TestClient
from app.main import app
from app.core.cache import Cache


def test_metrics_endpoint():
    client = TestClient(app)
    r = client.get("/metrics")
    assert r.status_code == 200
    assert b"python_info" in r.content or b"process_start_time_seconds" in r.content


def test_cache_in_memory_fallback():
    c = Cache(url=None)  # force in-memory
    c.set("a", "1")
    assert c.get("a") == "1"
    assert c.incr("a:count") == 1
    assert c.incr("a:count") == 2
