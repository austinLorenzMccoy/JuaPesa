# Jua Pesa — Smart Contracts (Hardhat)

This folder contains a minimal Solidity scaffold to support the MVP concept: a simple `LiquidityPool` contract with deposit/withdraw flows and tests.

## Prerequisites

- Node.js >= 20
- pnpm, npm, or yarn (examples use npm)

If you created the backend conda env (`environment.yml`) it also includes Node.js, so you can run Hardhat from there.

## Environment

1) Copy the example env and fill in values (do not commit real secrets):

```bash
cp .env.example .env
# Edit .env with your RPC URL(s) and deployer PRIVATE_KEY
```

Required variables (see `.env.example` for guidance):

- `SEPOLIA_RPC_URL` — Your Sepolia RPC endpoint (Alchemy/Infura/QuickNode/etc.)
- `PRIVATE_KEY` — Deployer wallet private key (testnet-only)
- `ETHERSCAN_API_KEY` — Optional, enables auto-verification after deploy

Safety:

- `.env` is gitignored. Never commit real secrets or paste them in PRs/issues.
- Use a dedicated test wallet for Sepolia. Never reuse a production key.

Validate your config quickly:

```bash
npm run check:env
```

This runs `scripts/check-env.js` to test:

- RPC connectivity (fetches latest block)
- Private key format, derived address, and on-chain balance
- Etherscan API key (optional) via a lightweight API call

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Deploy (Sepolia)

Make sure the deployer wallet (from `PRIVATE_KEY`) has some Sepolia ETH for gas.

```bash
# Compile
npm run build

# Deploy to Sepolia
npm run deploy:sepolia
```

After a successful deploy, an artifact is written to `deployments/sepolia.json` with the
contract address and metadata. If `ETHERSCAN_API_KEY` is set, the script attempts verification automatically.

You can also run verification manually if needed:

```bash
npm run verify:sepolia -- <DEPLOYED_CONTRACT_ADDRESS>
```

## Files

- `contracts/LiquidityPool.sol` — Simple ETH pool with owner-controlled withdraw.
- `test/LiquidityPool.test.js` — Tests for deploy, deposit, withdraw, and revert paths.
- `hardhat.config.js` — Hardhat configuration.
- `package.json` — Scripts and dev dependencies.
