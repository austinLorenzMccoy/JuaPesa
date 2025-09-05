from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_ussd_session():
    r = client.post(
        "/api/ussd/session",
        json={"sessionId": "s1", "phone": "+254700", "input": "1", "menuState": "start"},
    )
    assert r.status_code == 200
    data = r.json()
    assert data["nextMenuState"].endswith(":next")
    assert data["actions"] == ["confirm"]


def test_convert_success():
    r = client.post(
        "/api/convert",
        json={
            "userId": "u1",
            "from": {"rail": "m-pesa", "operator": "safaricom", "amount": 10.0},
            "to": {"token": "USDC", "chain": "hedera"},
            "mode": "fast",
        },
    )
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "submitted"
    assert data["txId"].startswith("cv-")


def test_convert_bad_amount():
    r = client.post(
        "/api/convert",
        json={
            "userId": "u1",
            "from": {"rail": "m-pesa", "operator": "safaricom", "amount": 0},
            "to": {"token": "USDC", "chain": "hedera"},
            "mode": "fast",
        },
    )
    assert r.status_code == 400
    assert "amount must be positive" in r.text


def test_rebalance_success():
    r = client.post(
        "/api/liquidity/rebalance",
        json={
            "sourcePool": "poolA",
            "destPool": "poolB",
            "amount": 5.5,
            "reason": "test",
            "predictedDemandWindow": "4h",
        },
    )
    assert r.status_code == 200
    data = r.json()
    assert data["status"] == "placed"
    assert data["orderId"].startswith("rb-")


def test_rebalance_bad_amount():
    r = client.post(
        "/api/liquidity/rebalance",
        json={
            "sourcePool": "poolA",
            "destPool": "poolB",
            "amount": 0,
        },
    )
    assert r.status_code == 400
    assert "amount must be positive" in r.text
