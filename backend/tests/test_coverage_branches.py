from fastapi.testclient import TestClient
import pytest

from app.main import app
from app.core.db import get_session
from app.services.forecast import ForecastService
from app.integrations.hedera import HederaClient
from app.integrations.cctp import CCTPClient


def test_startup_creates_tables():
    # Using context manager ensures startup/shutdown events fire
    with TestClient(app) as client:
        r = client.get("/healthz")
        assert r.status_code == 200


def test_db_rollback_branch():
    # Trigger the except/rollback branch inside get_session context manager
    try:
        with get_session() as s:  # noqa: F841
            raise RuntimeError("force failure")
    except RuntimeError:
        # Expected
        pass


def test_forecast_service_invalid_inputs():
    f = ForecastService()
    with pytest.raises(ValueError):
        f.predict("", "4h")  # operator required
    with pytest.raises(ValueError):
        f.predict("safaricom", "0h")  # invalid window


def test_routes_error_paths():
    client = TestClient(app)
    # forecast invalid window => 422 (validation error from Pydantic Literal)
    r = client.post("/api/forecast", json={"operator": "safaricom", "window": "0h"})
    assert r.status_code == 422
    # forecast empty operator => triggers ValueError in service, route returns 400
    r = client.post("/api/forecast", json={"operator": "", "window": "4h"})
    assert r.status_code == 400
    # operator summary invalid window => 400
    r = client.get("/api/operators/safaricom/summary", params={"window": "0h"})
    assert r.status_code == 400


def test_hedera_and_cctp_error_branches():
    h = HederaClient()
    with pytest.raises(ValueError):
        h.mint("USDC", 0)
    with pytest.raises(ValueError):
        h.burn("USDC", -1)

    c = CCTPClient()
    with pytest.raises(ValueError):
        c.initiate_burn("ethereum", 0)
    with pytest.raises(ValueError):
        c.fetch_attestation("")
    with pytest.raises(ValueError):
        c.mint_on_destination("hedera", "")
