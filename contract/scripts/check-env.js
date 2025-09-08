/*
  Checks each credential from .env and reports clear pass/fail reasons.
  - SEPOLIA_RPC_URL: attempts provider connection and getBlockNumber
  - PRIVATE_KEY: derives address, fetches balance via the RPC
  - ETHERSCAN_API_KEY: calls Etherscan API (sepolia) to validate the key
*/

require("dotenv").config();
const https = require("https");

async function withTimeout(promise, ms, label) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function testRpc(url) {
  const { ethers } = require("ethers");
  const provider = new ethers.JsonRpcProvider(url);
  const start = Date.now();
  const bn = await withTimeout(provider.getBlockNumber(), 10_000, "RPC getBlockNumber");
  const ms = Date.now() - start;
  return { ok: true, blockNumber: bn, latencyMs: ms };
}

async function testPrivateKey(pk, url) {
  const { ethers } = require("ethers");
  const provider = new ethers.JsonRpcProvider(url);
  let wallet;
  try {
    wallet = new ethers.Wallet(pk, provider);
  } catch (e) {
    return { ok: false, reason: `Invalid private key format: ${e.message}` };
  }
  const address = await wallet.getAddress();
  const bal = await withTimeout(provider.getBalance(address), 10_000, "Get balance");
  return { ok: true, address, balanceEth: ethers.formatEther(bal) };
}

function httpGetJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Non-JSON response from ${url}: ${data?.slice(0, 200)}`));
          }
        });
      })
      .on("error", reject);
  });
}

async function testEtherscanKey(key) {
  // Minimal, low-cost call; should return a JSON object with status/message.
  const addrZero = "0x0000000000000000000000000000000000000000";
  const url = `https://api-sepolia.etherscan.io/api?module=account&action=balance&address=${addrZero}&tag=latest&apikey=${key}`;
  const res = await withTimeout(httpGetJson(url), 10_000, "Etherscan API call");
  // Etherscan returns { status: "1", message: "OK", result: "0x... or number string" } for success
  if (res && (res.status === "1" || res.message === "OK")) {
    return { ok: true };
  }
  return { ok: false, reason: `Unexpected response: ${JSON.stringify(res)}` };
}

(async () => {
  const errors = [];
  const { SEPOLIA_RPC_URL, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

  console.log("\n== Checking SEPOLIA_RPC_URL ==");
  if (!SEPOLIA_RPC_URL) {
    errors.push("SEPOLIA_RPC_URL is missing");
    console.log("FAIL: Missing SEPOLIA_RPC_URL");
  } else {
    try {
      const r = await testRpc(SEPOLIA_RPC_URL);
      console.log(`OK: Connected. Latest block ${r.blockNumber} (latency ${r.latencyMs}ms)`);
    } catch (e) {
      errors.push(`SEPOLIA_RPC_URL invalid or unreachable: ${e.message}`);
      console.log(`FAIL: ${e.message}`);
    }
  }

  console.log("\n== Checking PRIVATE_KEY ==");
  if (!PRIVATE_KEY) {
    errors.push("PRIVATE_KEY is missing");
    console.log("FAIL: Missing PRIVATE_KEY");
  } else if (!/^(0x)?[0-9a-fA-F]{64}$/.test(PRIVATE_KEY)) {
    errors.push("PRIVATE_KEY format looks invalid (must be 64 hex chars, with or without 0x)");
    console.log("FAIL: PRIVATE_KEY format invalid");
  } else if (!SEPOLIA_RPC_URL) {
    console.log("SKIP: Cannot validate PRIVATE_KEY without a working RPC URL");
  } else {
    try {
      const r = await testPrivateKey(PRIVATE_KEY.startsWith("0x") ? PRIVATE_KEY : `0x${PRIVATE_KEY}`, SEPOLIA_RPC_URL);
      console.log(`OK: Derived address ${r.address}, balance ${r.balanceEth} ETH`);
    } catch (e) {
      errors.push(`PRIVATE_KEY invalid or cannot query balance: ${e.message}`);
      console.log(`FAIL: ${e.message}`);
    }
  }

  console.log("\n== Checking ETHERSCAN_API_KEY (optional) ==");
  if (!ETHERSCAN_API_KEY) {
    console.log("SKIP: ETHERSCAN_API_KEY not set. Verification will be skipped during deploy.");
  } else {
    try {
      const r = await testEtherscanKey(ETHERSCAN_API_KEY);
      if (r.ok) console.log("OK: Etherscan API key appears valid.");
      else {
        errors.push(`ETHERSCAN_API_KEY appears invalid: ${r.reason}`);
        console.log(`FAIL: ${r.reason}`);
      }
    } catch (e) {
      errors.push(`ETHERSCAN_API_KEY test failed: ${e.message}`);
      console.log(`FAIL: ${e.message}`);
    }
  }

  console.log("\n== Summary ==");
  if (errors.length === 0) {
    console.log("All checks passed or optional keys skipped.");
    process.exit(0);
  } else {
    for (const err of errors) console.log("- ", err);
    process.exit(1);
  }
})();
