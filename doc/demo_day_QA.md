# JuaPesa Backend – Demo Day Q&A

This document provides likely questions and succinct answers about the backend architecture, AI features, and integrations for demo day.

## Overview

- The backend is a FastAPI app exposing endpoints in `backend/app/api/routes.py`.
- Core services live in `backend/app/services/` and are intentionally minimal, deterministic, and test-friendly.
- External rails/integrations are modeled with light stubs in `backend/app/integrations/` to show intended flows without relying on real APIs.
- An AI helper (`backend/app/ai/groq_client.py`) provides summarization that runs fully offline when no API key is configured.

---

## API and Routing

- __What endpoints are available?__
  - `POST /ussd/session` – Simulates a USSD session prompt/next state. See `routes.py:ussd_session()`.
  - `POST /convert` – Initiates a conversion request across rails/tokens. See `routes.py:convert()`.
  - `POST /liquidity/rebalance` – Places a liquidity rebalance order. See `routes.py:liquidity_rebalance()`.
  - `POST /kyc/verify` – Simple KYC check returning status/level. See `routes.py:kyc_verify()`.
  - `POST /daraja/debit` – Simulates an M-Pesa debit via the Daraja client stub. See `routes.py:daraja_debit()`.
  - `POST /forecast` – Predicts net flow and returns a value. See `routes.py:forecast()`.
  - `GET  /operators/{operator}/summary` – Generates a summarized operator view using AI. See `routes.py:operator_summary()`.

- __Why FastAPI?__
  - Type hints and pydantic models, async-friendly, excellent developer ergonomics, auto-generated docs via OpenAPI.

- __How do you handle validation and errors?__
  - Services raise `ValueError` for invalid inputs. Routes trap these and reply with `HTTP 400` and a descriptive message (see try/except blocks in `routes.py`).

- __Example request: forecast__
  ```bash
  curl -X POST \
    -H "Content-Type: application/json" \
    -d '{"operator":"safaricom","window":"4h"}' \
    http://localhost:8000/api/forecast
  ```

- __Example request: operator summary (AI)__
  ```bash
  curl http://localhost:8000/api/operators/safaricom/summary?window=4h
  ```

---

## Services

- __WalletService.convert(...)__ (`backend/app/services/wallet.py`)
  - Validates amount > 0 and returns a deterministic transaction id via `app.utils.ids.new_tx_id(prefix="cv")`.
  - In production, this is where orchestration for on-/off-ramp providers and token mint/burn would occur.

- __LiquidityService.rebalance(...)__ (`backend/app/services/liquidity.py`)
  - Validates amount > 0, returns `(order_id, "placed")` with deterministic id via `new_tx_id(prefix="rb")`.
  - In production, this would queue an order and fan out to execution bots.

- __ForecastService__ (`backend/app/services/forecast.py`)
  - `predict(operator, window)`: deterministic pseudo-forecast from a hash for hermetic tests.
  - `operator_summary(operator, window)`: builds natural language and calls AI summarizer.

- __AuthService.verify_kyc(...)__ (`backend/app/services/auth.py`)
  - Minimal rule-based KYC (approve if id_number length >= 6). Placeholder for a real KYC provider.

---

## Integrations

- __Daraja (M-Pesa)__ – `backend/app/integrations/daraja.py`
  - `simulate_debit(phone, amount)` validates input and returns a mocked reference.
  - Production would implement OAuth, STK push, and callbacks.

- __Hedera__ – `backend/app/integrations/hedera.py`
  - `mint(token, amount)` and `burn(token, amount)` are simple validators with mocked responses.
  - Production would call HTS/EVM via an SDK and handle receipts.

- __Circle CCTP__ – `backend/app/integrations/cctp.py`
  - `initiate_burn`, `fetch_attestation`, `mint_on_destination` return mocked lifecycle payloads.
  - Production would execute burn/attestation/mint across chains.

- __Why stubs?__
  - Demo-ready, deterministic, no external dependencies, fast tests. Clear swap-in points for real clients.

---

## AI Router and Summarization

- __Where is AI used?__
  - `ForecastService.operator_summary()` builds a sentence from a forecast and calls `GroqClient.summarize()`.
  - Route: `GET /operators/{operator}/summary`.

- __How does `GroqClient` work?__ (`backend/app/ai/groq_client.py`)
  - If no API key is configured, it returns a local, deterministic summary like `[mock-summary:32]...`.
  - If an API key is present, the class is wired to call a real provider (placeholder in this scaffold). Network calls are intentionally avoided in the MVP.

- __Why an offline/online split?__
  - Guarantees stable demo/tests without network flakiness while preserving a drop-in seam for a real LLM provider when keys are set.

---

## Configuration and Secrets

- The backend reads settings using `app.core.config.get_settings()` (see usage in `GroqClient`).
- Do not commit secrets. `.env` is gitignored, and examples live in `.env.example` files.
- The repo includes safe defaults and mocks so the app starts without external keys.

---

## Testing and Reliability

- Unit tests are under `backend/tests/` and cover routes and services with deterministic behavior.
- Deterministic IDs and mock AI summaries keep tests hermetic and CI-friendly.

---

## Running Locally

1) Install backend dependencies (see `backend/README.md` if present):
```bash
uvicorn app.main:app --reload
```

2) Explore API docs:
```text
http://localhost:8000/docs
```

3) Call endpoints (examples above).

---

## Productionization Roadmap (High-Level)

### Phase 1 — Stabilize and Observe

- Add structured logging and error taxonomy (request IDs, correlation IDs).
- Add metrics (request count/latency, external call success rates).
- Add tracing around integrations and critical paths.
- Wire basic health/ready endpoints.

### Phase 2 — Real Integrations (behind flags)

- Daraja: OAuth, STK Push, callback handlers, retries with backoff.
- CCTP: burn/attestation/mint with idempotent job orchestration.
- Hedera: HTS/EVM SDK flows (mint/burn/transfer) with receipt checks.
- Feature flags to switch between "stub" and "live" per environment.

---

## Sample Demo Script (Flow)

1) USSD session progression (`POST /ussd/session`) → shows prompt and next state.
2) Conversion submit (`POST /convert`) → returns tx id immediately.
3) Liquidity rebalance (`POST /liquidity/rebalance`) → returns order id and status.
4) Forecast (`POST /forecast`) → returns a numeric prediction.
5) Operator summary (`GET /operators/{op}/summary`) → shows AI-generated summary.
6) Daraja debit simulation (`POST /daraja/debit`) → returns a mocked reference.

Each call returns quickly with deterministic outputs suitable for a live demo.
