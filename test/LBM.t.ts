import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("LBM", function () {
  async function deployAll() {
    const [
      admin,
      treasuryWallet,
      presaleWallet,
      cexWallet,
      liquidityWallet,
      stakingWallet,
      projectDevelopmentWallet,
    ] = await ethers.getSigners();

    // Deploy core team vesting contract
    const CoreTeam = await ethers.deployContract("CoreTeam", [admin.address]);
    await CoreTeam.waitForDeployment();

    // Deploy primary token contract
    const LBM = await ethers.deployContract("LBM", [
      treasuryWallet.address,
      CoreTeam.target,
      presaleWallet.address,
      cexWallet.address,
      liquidityWallet.address,
    ]);
    await LBM.waitForDeployment();

    return {
      admin,
      treasuryWallet,
      presaleWallet,
      cexWallet,
      liquidityWallet,
      stakingWallet,
      projectDevelopmentWallet,
      CoreTeam,
      LBM,
    };
  }

  describe("Deployment", function () {
    it("Should deploy the LBM contract with the correct name and symbol", async function () {
      const { LBM } = await loadFixture(deployAll);
      expect(await LBM.name()).to.equal("Libertum");
      expect(await LBM.symbol()).to.equal("LBM");
      console.log(
        "TOTAL LBM SUPPLY",
        ethers.formatEther(await LBM.totalSupply())
      );
    });
  });

  describe("Treasury Reserve Wallet", function () {
    it("Should mint 70M tokens to the treasury reserve wallet", async function () {
      const { LBM, treasuryWallet } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(treasuryWallet.address)).to.equal(
        ethers.parseEther("70000000")
      );
    });
  });

  describe("Core Team Vesting Contract", function () {
    it("Should not allow vesting before the 12 month cliff", async function () {
      const { CoreTeam, LBM } = await loadFixture(deployAll);
      expect(await CoreTeam["releasable(address)"](LBM.target)).to.equal(0);
    });

    it("Should allow vesting after the 12 month cliff, linearly over 48 months", async function () {
      const { admin, CoreTeam, LBM } = await loadFixture(deployAll);

      // 13 months into vesting period
      await time.increase(time.duration.days(30) * 13);

      // Expected release amount: 50,000,000 tokens / 48 months ~= 1,041 tokens
      const expectedReleaseAmount = ethers.getBigInt(
        "1041666666666666666666666"
      );
      // Acceptable delta (approximately 5 minutes) ~= 120 tokens
      const delta = ethers.getBigInt("120563271604938271600");
      const actualReleaseAmount = await CoreTeam["releasable(address)"](
        LBM.target
      );

      expect(actualReleaseAmount).to.be.closeTo(expectedReleaseAmount, delta);
      await CoreTeam["release(address)"](LBM.target);
      const adminBalance = await LBM.balanceOf(admin.address);
      expect(adminBalance).to.be.closeTo(expectedReleaseAmount, delta);

      // At 47 months
      await time.increase(time.duration.days(30) * 46);
      await CoreTeam["release(address)"](LBM.target);
      expect(await LBM.balanceOf(CoreTeam.target)).to.not.equal(0);

      // At 48 months
      await time.increase(time.duration.days(30) * 1);
      await CoreTeam["release(address)"](LBM.target);
      expect(await LBM.balanceOf(CoreTeam.target)).to.equal(0);
    });
  });

  describe("Presale Exchange Wallet", function () {
    it("Should mint 12M tokens to the presale exchange wallet", async function () {
      const { LBM, presaleWallet } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(presaleWallet.address)).to.equal(
        ethers.parseEther("12000000")
      );
    });
  });

  describe("CEX Listing Wallet", function () {
    it("Should mint 20M tokens to the presale exchange wallet", async function () {
      const { LBM, cexWallet } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(cexWallet.address)).to.equal(
        ethers.parseEther("20000000")
      );
    });
  });

  describe("Liquidity Wallet", function () {
    it("Should mint 2M tokens to the presale exchange wallet", async function () {
      const { LBM, liquidityWallet } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(liquidityWallet.address)).to.equal(
        ethers.parseEther("2000000")
      );
    });
  });
});
