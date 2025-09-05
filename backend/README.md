# Jua Pesa — Backend (FastAPI)

Jua Pesa is an AI Liquidity Network enabling near-instant, low-cost cross-wallet transfers across African mobile money rails by routing liquidity through regulated stablecoin pools and an AI-driven router.

This backend is a modular FastAPI service implementing MVP endpoints described in the PRD: USSD session handler, conversion flow, and liquidity rebalance. It also includes an AI helper (Groq) mock, full tests with 100% coverage, and developer tooling.

## Features

- FastAPI app with modular packages: `api/`, `core/`, `services/`, `models/`, `utils/`, `ai/`.
- PRD-aligned endpoints:
  - `POST /api/ussd/session`
  - `POST /api/convert`
  - `POST /api/liquidity/rebalance`
  - Health and demo: `GET /healthz`, `GET /testall`
- Config via `.env` using `pydantic-settings`.
- Groq AI client wrapper (`app/ai/groq_client.py`) with mock offline mode.
- Pytest suite with coverage gate at 100%.
- `api_demo.py` script to ping `/testall`.
- `environment.yml` for conda env creation.

## Quickstart (Conda)

1) Create and activate env

```bash
conda env create -f environment.yml
conda activate juapesa
```

2) Install package in editable mode with dev deps

```bash
# Already included in environment.yml via pip: -e .[dev]
# If needed explicitly:
pip install -e .[dev]
```

3) Environment variables

Create `backend/.env` (already scaffolded):

```
ENV=development
GROQ_API_KEY= # optional; if empty, Groq client runs offline mock
```

## Run the API

```bash
uvicorn app.main:app --reload --port 8000
```

Open:
- http://127.0.0.1:8000/healthz
- http://127.0.0.1:8000/testall
- Swagger: http://127.0.0.1:8000/docs

## Endpoints (MVP)

- POST `/api/ussd/session`
  - Body: `{ sessionId, phone, input, menuState }`
  - Response: `{ prompt, nextMenuState, actions }`

- POST `/api/convert`
  - Body: `{ userId, from: { rail, operator, amount }, to: { token, chain }, mode }`
  - Response: `{ status, txId, estimatedCompletion, fees }`

- POST `/api/liquidity/rebalance`
  - Body: `{ sourcePool, destPool, amount, reason, predictedDemandWindow }`
  - Response: `{ orderId, status }`

## Demo script

```bash
python api_demo.py http://127.0.0.1:8000
```

## Tests & Coverage (100%)

```bash
pytest
# Coverage gate is enforced at 100% (see pyproject.toml)
```

## Project layout

- `app/main.py` — FastAPI app, health and test endpoints.
- `app/api/routes.py` — API routers (USSD, Convert, Rebalance).
- `app/models/schemas.py` — Pydantic schemas.
- `app/services/` — Service layer stubs (`wallet.py`, `liquidity.py`).
- `app/core/config.py` — Settings and app info.
- `app/utils/ids.py` — ID generator.
- `app/ai/groq_client.py` — Groq wrapper (mockable/offline).
- `tests/` — Full test suite.

## Notes

- Networking calls to external services (Groq, Hedera, Circle) are stubbed to keep unit tests hermetic.
- Expand services with real adapters (Daraja/M-Pesa, CCTP, Hedera) in subsequent phases.
