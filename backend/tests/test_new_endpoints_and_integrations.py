from fastapi.testclient import TestClient
from app.main import app
from app.integrations.hedera import HederaClient
from app.integrations.cctp import CCTPClient

client = TestClient(app)


def test_kyc_verify_success_and_failure():
    # success
    r = client.post(
        "/api/kyc/verify",
        json={"phone": "+254700000000", "idNumber": "ABC123456", "fullName": "Ada Lovelace"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["status"] in {"approved", "rejected", "pending"}
    assert isinstance(data["level"], int)

    # failure (missing fields)
    r = client.post(
        "/api/kyc/verify",
        json={"phone": "", "idNumber": "", "fullName": ""},
    )
    assert r.status_code == 400


def test_daraja_debit_success_and_failure():
    r = client.post(
        "/api/daraja/debit",
        json={"phone": "+254700000001", "amount": 10.5},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "queued"
    assert data["ref"].startswith("daraja-")

    r = client.post(
        "/api/daraja/debit",
        json={"phone": "+254700000001", "amount": 0},
    )
    assert r.status_code == 400


def test_forecast_and_summary():
    r = client.post("/api/forecast", json={"operator": "safaricom", "window": "4h"})
    assert r.status_code == 200
    data = r.json()
    assert data["operator"] == "safaricom"
    assert data["window"] == "4h"
    assert isinstance(data["predictedNetFlow"], float)

    r = client.get("/api/operators/safaricom/summary")
    assert r.status_code == 200
    s = r.json()["summary"]
    assert s.startswith("[mock-summary:") or s.startswith("[would-call-groq]")


def test_hedera_and_cctp_stubs():
    h = HederaClient()
    assert h.mint("USDC", 1.0)["status"] == "minted"
    assert h.burn("USDC", 1.0)["status"] == "burned"

    c = CCTPClient()
    b = c.initiate_burn("ethereum", 1.0)
    att = c.fetch_attestation(b["tx"])
    m = c.mint_on_destination("hedera", att["attestation"])
    assert b["status"] == "burn_initiated"
    assert att["status"] == "attested"
    assert m["status"] == "minted"
