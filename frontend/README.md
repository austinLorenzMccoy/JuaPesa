# Jua Pesa — AI Liquidity Network

**Enable near-instant, low-cost, compliant cross-wallet transfers across African mobile money rails.**

Jua Pesa is building an **AI-driven liquidity network** that lets users send money seamlessly between mobile wallets (M-Pesa, MTN MoMo, Airtel, etc.) using stablecoin pools and intelligent routing.

📱 Users dial a simple USSD code (e.g., `*789#`) to convert between:

* Local mobile money (KES, NGN, GHS, etc.)
* Tokenized local stablecoins (e.g., cNGN)
* International stablecoins (USDC)
* Commodity-backed tokens (XAUt)

⚡ Transfers settle in **seconds**, with fees **under \$0.10**, powered by an **AI liquidity router** that forecasts demand and balances pools automatically.

---

## 🚀 Vision

> "Interoperable, affordable, and instant money movement across Africa."

Mobile money is massive (\~\$1.4T annual volume in Sub-Saharan Africa), but **interoperability gaps cause high failure rates and fees**. Jua Pesa fixes this by bridging fragmented mobile wallets through a compliant, AI-powered stablecoin liquidity layer.

---

## 🔑 Features

* **USSD Access:** Works on feature phones via a simple short code (`*789#`).
* **Custodial Wallets:** Phone number ↔ wallet mapping with KYC/mini-KYC.
* **Stablecoin Pools:** cNGN, USDC (via Circle CCTP), and optional XAUt.
* **AI Liquidity Router:** Predicts demand, rebalances pools to minimize slippage.
* **Settlement Layer:** Hedera Hashgraph (low-fee, sustainable) + Circle CCTP.
* **Security & Compliance:** AML checks, encrypted KYC, audit trails.

---

## 🛠️ Tech Stack

**Frontend (MVP / Pilot UI):**

* [React 18.3.1](https://react.dev/) — latest stable, concurrent features
* [Vite](https://vitejs.dev/) — fast modern build tool
* [TypeScript](https://www.typescriptlang.org/) — type-safe codebase
* [React Router v6](https://reactrouter.com/) — routing
* [Tailwind CSS](https://tailwindcss.com/) — styling

**Backend & Infra:**

* USSD Gateway + Telco API integrations (e.g., M-Pesa Daraja)
* Node.js / TypeScript microservices
* PostgreSQL + TimescaleDB / ClickHouse (wallet + forecasting data)
* Hedera Token Service + Hedera EVM (settlement ledger)
* Circle CCTP for cross-chain USDC liquidity
* Redis (session + cache)

**AI/ML:**

* Time-series forecasting (TFT, N-BEATS, Prophet, LSTM)
* Mistral 7B fine-tuned for natural language explanations & routing insights

---

## 📊 Impact

* <15s transfer latency for most flows
* <0.5% failed transfer rate
* <\$0.10 transaction cost
* Estimated \$400M+/year savings in failed interoperability fees across Africa

---

## 🏃‍♂️ Getting Started

### Prerequisites

* Node.js (>=18.x)
* pnpm or yarn
* Postgres / TimescaleDB instance
* Hedera testnet account
* Circle CCTP dev credentials
* Telco sandbox access (M-Pesa Daraja or local APIs)

### Setup

```bash
# Clone the repo
git clone https://github.com/<your-org>/jua-pesa.git
cd jua-pesa

# Install dependencies (within ./frontend)
pnpm install   # or npm install / yarn install

# Run frontend (Vite dev server)
pnpm dev       # starts on http://localhost:5173

# Run backend (example microservice)
cd backend && pnpm dev
```

### Build for Production

```bash
pnpm build
pnpm preview
```

---

## 📡 API Contracts (Samples)

**USSD → Backend (Session)**

```http
POST /api/ussd/session
{
  "sessionId": "abc123",
  "phone": "+254700000000",
  "input": "1",
  "menuState": "main"
}
```

**Convert API**

```http
POST /api/convert
{
  "userId": "123",
  "from": { "rail": "m-pesa", "amount": 1000 },
  "to": { "token": "USDC", "chain": "hedera" },
  "mode": "fast"
}
```

---

## ✅ Roadmap

* [x] React + Vite frontend setup
* [x] USSD gateway prototype
* [ ] Wallet service with custodial mapping
* [ ] Hedera + Circle CCTP integration
* [ ] AI forecasting pipeline
* [ ] Pilot launch (Kenya or Nigeria)

---

## ✨ Recent UI Updates

- __Landing page background__: Hero section now uses a branded background image with an accessibility-friendly dark overlay. See `src/pages/Index.tsx`.
- __Dashboard layout__: A new `DashboardLayout` wraps app pages with a responsive, collapsible sidebar and a sticky top bar. See `src/layouts/DashboardLayout.tsx`.
- __Sidebar persistence__: The sidebar open/collapsed state is persisted in `localStorage` for a better UX across reloads. See `src/components/ui/sidebar.tsx`.
- __Settings inside dashboard__: The Settings page now renders within the dashboard layout (with sidebar). See `src/pages/Settings.tsx`.
- __404 redirect__: Unknown routes auto-redirect to `/dashboard` (if logged in) or `/` after 2 seconds, with a fallback link. See `src/pages/NotFound.tsx`.

## 🧪 Mock Data

Front-end demo screens use light mock data aligned with backend models:

- __Transactions__: `src/mocks/data.ts` exports `mockTransactions`. `src/pages/Dashboard.tsx` renders these.
- __User__: `AuthContext` uses localStorage to mock auth state and profile updates.
- __Forecast/summary__: Example shapes provided for potential integration in widgets.

This allows the UI to run without a live backend while preserving wire formats.

## 🧭 Navigation & Layout

- __Home__ (`/`) — Marketing/landing page.
- __Dashboard__ (`/dashboard`) — Sidebar layout (collapsible, persistent, responsive).
- __Settings__ (`/settings`) — Rendered inside the dashboard layout.
- __Not Found__ (`*`) — Redirects to `/` or `/dashboard` with a short delay.

## 📱 Responsiveness

All pages are responsive. The sidebar collapses to an icon rail on smaller viewports and becomes an off-canvas drawer on mobile.

## 📜 License
