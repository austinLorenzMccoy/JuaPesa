# Jua Pesa — AI Liquidity Network

<p align="center">
  <img src="frontend/public/JuaPesa%20logo.jpg" alt="Jua Pesa" width="480" />
</p>
<p align="center">
  <section> Adachukwu Okafor - github.com/adachijioke (Frontend engineer)Austin Chibueze -  github.com/austinLorenzMccoy (Backend/AI Engineer)<section>
<p align="center">
  <a href="https://github.com/adachijioke/JuaPesa/actions/workflows/ci.yml">
    <img alt="CI" src="https://github.com/adachijioke/JuaPesa/actions/workflows/ci.yml/badge.svg" />
  </a>
  <img alt="Python" src="https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white" />
  <img alt="Node" src="https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-Private-lightgrey" />
</p>

Enable near-instant, low-cost, compliant cross-wallet transfers across African mobile money rails by routing liquidity through regulated stablecoin pools and an AI-driven router.

> Interoperable, affordable, and instant money movement across Africa.

---

## ✨ Highlights

- FastAPI backend with modular architecture and 100% test coverage gate
- React + Vite + TypeScript frontend (shadcn/ui + Tailwind, Radix primitives)
- Solidity Hardhat scaffold with `LiquidityPool.sol` and tests
- Prometheus metrics endpoint (`/metrics`) and health probes (`/healthz`)
- Config via `.env` using `pydantic-settings`; safe fallbacks for dev
- Monorepo with `git subtree` for `frontend/` to preserve independent history

---

## 🗂️ Repository Structure

```
JuaPesa/
├─ backend/                 # FastAPI service and tests
│  ├─ app/
│  │  ├─ api/              # API routes (USSD, convert, rebalance, etc.)
│  │  ├─ core/             # Config, DB, cache
│  │  ├─ models/           # Pydantic schemas & SQLAlchemy models
│  │  ├─ services/         # Business logic (wallet, liquidity, forecast, auth)
│  │  ├─ integrations/     # External integrations (Daraja, CCTP, Hedera)
│  │  └─ ai/               # Groq AI client wrapper (mock-friendly)
│  ├─ tests/               # Pytest suite (coverage target 100%)
│  ├─ environment.yml      # Conda environment (includes pip -e .[dev])
│  ├─ pyproject.toml       # Dependencies, tooling configs
│  └─ README.md            # Backend-specific docs
│
├─ frontend/               # React + Vite + TS UI (added via git subtree)
│  ├─ src/                 # Components, hooks, contexts
│  ├─ public/              # Static assets
│  ├─ package.json         # Scripts and deps
│  └─ README.md            # Frontend-specific docs and usage
│
├─ contract/               # Hardhat project (Solidity contracts & tests)
│  ├─ contracts/           # LiquidityPool.sol (MVP)
│  ├─ test/                # Hardhat tests
│  ├─ hardhat.config.js
│  ├─ package.json
│  └─ README.md
│
└─ doc/
   └─ JuaPesaPRD.md        # Product Requirements Document (PRD)
```

---

## 🧰 Prerequisites

- Python 3.10+
- Node.js 20+
- Git
- Optional: Conda (recommended for consistent backend + node toolchain)

---

## ⚙️ Backend (FastAPI)

Located at `backend/`. See also `backend/README.md`.

### Create environment (Conda)

```bash
cd backend
conda env create -f environment.yml
conda activate juapesa
# If needed explicitly (already handled by environment.yml):
pip install -e .[dev]
```

### Environment variables

Create `backend/.env` (already scaffolded):

```
ENV=development
# Optional; if empty, Groq client runs in offline/mock mode
GROQ_API_KEY=
# Optional DB/Cache — defaults are safe for local dev
DATABASE_URL=sqlite+pysqlite:///:memory:
REDIS_URL=
```

Configuration is defined in `backend/app/core/config.py` via `pydantic-settings`.

### Run the API

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

- Docs (Swagger): http://127.0.0.1:8000/docs
- Health: http://127.0.0.1:8000/healthz
- Smoke test: http://127.0.0.1:8000/testall
- Metrics (Prometheus): http://127.0.0.1:8000/metrics

### Key Endpoints (MVP)

- POST `/api/ussd/session`
- POST `/api/convert`
- POST `/api/liquidity/rebalance`

See `backend/app/api/routes.py` and tests in `backend/tests/` for request/response shapes.

### Testing & Linting

```bash
cd backend
pytest                 # runs with --cov-fail-under=100
pytest -q --cov=app --cov-report=term-missing
```

Tooling configured in `pyproject.toml`:
- pytest, pytest-asyncio, pytest-cov
- ruff, mypy

---

## 🖥️ Frontend (React + Vite + TS)

Located at `frontend/`.

### Install & Run (Node 20+)

```bash
cd frontend
npm install
npm run dev           # http://localhost:5173
# Build & Preview
npm run build
npm run preview       # serves production build
```

If the UI needs to call the backend, configure the backend base URL via your chosen method (e.g., `VITE_API_BASE` in an `.env` file at `frontend/.env`). Example:

```
# frontend/.env
VITE_API_BASE=http://127.0.0.1:8000
```

Refer to `frontend/README.md` for a deeper dive into the UI structure and components.

---

## ⛓️ Smart Contracts (Hardhat)

Located at `contract/`.

### Install, Build, Test

```bash
cd contract
npm install
npm run build
npm test
```

Solidity config: `contract/hardhat.config.js`. Example contract is `contracts/LiquidityPool.sol` with tests in `test/`.

### Deploy to Sepolia

Requirements:

- Copy `contract/.env.example` to `contract/.env` and fill in:
  - `SEPOLIA_RPC_URL` — your Alchemy/Infura/QuickNode RPC URL for Sepolia.
  - `PRIVATE_KEY` — private key for a testnet wallet with a small amount of Sepolia ETH. Use a dedicated test account only.
  - `ETHERSCAN_API_KEY` — optional, enables verification.

Steps:

```bash
cd contract
npm ci
npm run build
# Deploy LiquidityPool to Sepolia
npm run deploy:sepolia
```

Outputs:

- The deployed address will be printed in the terminal.
- A deployment artifact is saved at `contract/deployments/sepolia.json` containing `network`, `contract`, `address`, `deployer`, and `timestamp`.

Optional: verify on Etherscan (if `ETHERSCAN_API_KEY` is set):

```bash
# Replace <ADDRESS> with the address from the deploy step
npx hardhat verify --network sepolia <ADDRESS>
# or using npm script
npm run verify:sepolia -- <ADDRESS>
```

Front-end integration tip:

- ABI is available at `contract/artifacts/contracts/LiquidityPool.sol/LiquidityPool.json`.
- You can copy the ABI and deployed address into the frontend (for example, `frontend/src/abi/` and a config file) or add a small script to export them automatically.

---

## 🔗 Monorepo & Subtree Workflow

The `frontend/` folder is managed via `git subtree` to retain its independent history without nesting a Git repository inside this repo.

- Pull latest changes from the frontend repo:

```bash
git subtree pull --prefix=frontend https://github.com/adachijioke/JuaPesa.git main
```

- Push local `frontend/` changes back to the frontend repo (requires write access):

```bash
git subtree push --prefix=frontend https://github.com/adachijioke/JuaPesa.git main
```

Tips:
- Keep backend and frontend changes in separate commits where possible.
- Use conventional commits (e.g., `feat:`, `fix:`, `chore:`) for clarity.

---

## 🧪 Local Development

- Backend on `http://127.0.0.1:8000`
- Frontend on `http://127.0.0.1:5173`
- Point the frontend to the backend using `VITE_API_BASE` (see above).

Recommended workflow:
1. Start backend with `uvicorn` in one terminal.
2. Start frontend with `npm run dev` in another terminal.
3. Run tests frequently: `pytest` (backend) and `npm test` (contracts).

---

## 🔒 Security & Compliance (MVP Scope)

- Backend is structured for pluggable integrations: Daraja (M-Pesa), Circle CCTP, Hedera.
- KYC/AML flows are modeled in schemas and services with room for production adaptations.
- Secrets are loaded via environment variables; never commit real secrets.

---

## 📄 Documentation

- Product Requirements: `doc/JuaPesaPRD.md`
- Backend specifics: `backend/README.md`
- Frontend specifics: `frontend/README.md`
- Contracts specifics: `contract/README.md`
- Deployment Guide: `doc/deployment.md`

---

## 🧯 Troubleshooting

- Backend fails to start
  - Ensure Python 3.10+ and dependencies installed. Try `pip install -e .[dev]` inside `backend/`.
  - Check `.env` values. `DATABASE_URL` defaults to in-memory SQLite for dev.
- Frontend cannot reach backend
  - Confirm backend is running on `http://127.0.0.1:8000`.
  - Set `VITE_API_BASE` in `frontend/.env` and restart `npm run dev`.
- Hardhat tests fail
  - Ensure Node.js 20+, reinstall with `npm ci`, and retry `npm test`.

---

## 📦 Roadmap (suggested next steps)

- CI: GitHub Actions for backend tests, linting, and contract tests
- CD: Preview deployments for frontend (e.g., Vercel/Netlify) and containerized backend
- Observability: Add request metrics, tracing, and structured logs
- Secrets: Standardize `.env.example` files and dev/prod env management
- Integrations: Expand real connectors for M-Pesa, MTN, Circle CCTP, Hedera

---

## 🤝 Contributing

1. Fork and create a feature branch
2. Follow existing code style and tests
3. Open a PR with a clear description and screenshots for UI changes

---

## 📜 License

Copyright © Jua Pesa. All rights reserved.
