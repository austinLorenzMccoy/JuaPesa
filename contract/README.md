# Jua Pesa — Smart Contracts (Hardhat)

This folder contains a minimal Solidity scaffold to support the MVP concept: a simple `LiquidityPool` contract with deposit/withdraw flows and tests.

## Prerequisites

- Node.js >= 20
- pnpm, npm, or yarn (examples use npm)

If you created the backend conda env (`environment.yml`) it also includes Node.js, so you can run Hardhat from there.

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

## Files

- `contracts/LiquidityPool.sol` — Simple ETH pool with owner-controlled withdraw.
- `test/LiquidityPool.test.js` — Tests for deploy, deposit, withdraw, and revert paths.
- `hardhat.config.js` — Hardhat configuration.
- `package.json` — Scripts and dev dependencies.
