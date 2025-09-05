const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const balance = await deployer.provider.getBalance(deployer.address);
  console.log("Deployer balance:", hre.ethers.formatEther(balance), "ETH");

  const LiquidityPool = await hre.ethers.getContractFactory("LiquidityPool");
  const pool = await LiquidityPool.deploy();
  await pool.waitForDeployment();

  const address = await pool.getAddress();
  console.log("LiquidityPool deployed to:", address);

  // Save a simple deployments artifact
  const networkName = hre.network.name;
  const outDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  const outPath = path.join(outDir, `${networkName}.json`);
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        network: networkName,
        contract: "LiquidityPool",
        address,
        deployer: deployer.address,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );
  console.log(`Saved deployment info to ${outPath}`);

  // Optional: Etherscan verification if key is present
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Attempting Etherscan verification...");
    try {
      await hre.run("verify:verify", {
        address,
        constructorArguments: [],
      });
      console.log("Verification submitted.");
    } catch (e) {
      console.warn("Verification step skipped or failed:", e.message || e);
    }
  } else {
    console.log("ETHERSCAN_API_KEY not set; skipping verification.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
