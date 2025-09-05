const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityPool", function () {
  it("deploys and sets owner", async function () {
    const [owner] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("LiquidityPool");
    const pool = await Factory.deploy();
    await pool.waitForDeployment();

    expect(await pool.owner()).to.equal(owner.address);
  });

  it("accepts deposits via receive() and tracks balances", async function () {
    const [owner, user] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("LiquidityPool");
    const pool = await Factory.deploy();
    await pool.waitForDeployment();

    // user deposits 1 ether
    await user.sendTransaction({ to: await pool.getAddress(), value: ethers.parseEther("1.0") });

    const tracked = await pool.balances(user.address);
    expect(tracked).to.equal(ethers.parseEther("1.0"));

    const bal = await pool.poolBalance();
    expect(bal).to.equal(ethers.parseEther("1.0"));
  });

  it("only owner can withdraw", async function () {
    const [owner, user, other] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("LiquidityPool");
    const pool = await Factory.deploy();
    await pool.waitForDeployment();

    await user.sendTransaction({ to: await pool.getAddress(), value: ethers.parseEther("0.5") });

    // non-owner attempt should revert
    await expect(
      pool.connect(other).withdraw(other.address, ethers.parseEther("0.1"))
    ).to.be.revertedWith("only owner");

    // owner withdraws 0.1 ether
    const toBalBefore = await ethers.provider.getBalance(other.address);
    const tx = await pool.connect(owner).withdraw(other.address, ethers.parseEther("0.1"));
    await tx.wait();
    const toBalAfter = await ethers.provider.getBalance(other.address);
    expect(toBalAfter - toBalBefore).to.equal(ethers.parseEther("0.1"));
  });

  it("reverts when withdrawing more than pool balance", async function () {
    const [owner, user] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("LiquidityPool");
    const pool = await Factory.deploy();
    await pool.waitForDeployment();

    await expect(
      pool.connect(owner).withdraw(user.address, ethers.parseEther("1"))
    ).to.be.revertedWith("insufficient pool balance");
  });
});
