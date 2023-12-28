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

    // Deploy ambassador program vesting contract
    const AmbassadorProgram = await ethers.deployContract("AmbassadorProgram", [
      admin.address,
    ]);
    await AmbassadorProgram.waitForDeployment();

    // Deploy marketing vesting contract
    const Marketing = await ethers.deployContract("Marketing", [admin.address]);
    await Marketing.waitForDeployment();

    // Deploy airdrop vesting contract
    const Airdrop = await ethers.deployContract("Airdrop", [admin.address]);
    await Airdrop.waitForDeployment();

    // Deploy advisors vesting contract
    const Advisors = await ethers.deployContract("Advisors", [admin.address]);
    await Advisors.waitForDeployment();

    // Deploy primary token contract
    const LBM = await ethers.deployContract("LBM", [
      treasuryWallet.address,
      CoreTeam.target,
      presaleWallet.address,
      cexWallet.address,
      liquidityWallet.address,
      stakingWallet.address,
      AmbassadorProgram.target,
      Marketing.target,
      Airdrop.target,
      Advisors.target,
      projectDevelopmentWallet.address,
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
      AmbassadorProgram,
      Marketing,
      Airdrop,
      Advisors,
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

      // 1 month into vesting period
      await time.increase(time.duration.days(30) * 13);

      // Expected release amount: 50,000,000 tokens / 48 months ~= 1.04M tokens
      const expectedReleaseAmount = ethers.getBigInt(
        "1041666666666666666666666"
      );
      // Acceptable delta (approximately 5 minutes) ~= 121 tokens
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

  describe("Staking Rewards Wallet", function () {
    it("Should mint 8M tokens to the presale exchange wallet", async function () {
      const { LBM, stakingWallet } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(stakingWallet.address)).to.equal(
        ethers.parseEther("8000000")
      );
    });
  });

  describe("Ambassador Program Vesting Contract", function () {
    it("Should not allow vesting before the 6 month cliff", async function () {
      const { AmbassadorProgram, LBM } = await loadFixture(deployAll);
      expect(
        await AmbassadorProgram["releasable(address)"](LBM.target)
      ).to.equal(0);
    });

    it("Should allow vesting after the 6 month cliff, linearly over 24 months", async function () {
      const { admin, AmbassadorProgram, LBM } = await loadFixture(deployAll);

      // 1 month into vesting period
      await time.increase(time.duration.days(30) * 7);

      // Expected release amount: 6,000,000 / 24 months ~= 250k tokens
      const expectedReleaseAmount = ethers.getBigInt(
        "250000000000000000000000"
      );
      // Acceptable delta (approximately 5 minutes) ~= 29 tokens
      const delta = ethers.getBigInt("28935185185185185185");
      const actualReleaseAmount = await AmbassadorProgram[
        "releasable(address)"
      ](LBM.target);

      expect(actualReleaseAmount).to.be.closeTo(expectedReleaseAmount, delta);
      await AmbassadorProgram["release(address)"](LBM.target);
      const adminBalance = await LBM.balanceOf(admin.address);
      expect(adminBalance).to.be.closeTo(expectedReleaseAmount, delta);

      // At 23 months
      await time.increase(time.duration.days(30) * 22);
      await AmbassadorProgram["release(address)"](LBM.target);
      expect(await LBM.balanceOf(AmbassadorProgram.target)).to.not.equal(0);

      // At 24 months
      await time.increase(time.duration.days(30) * 1);
      await AmbassadorProgram["release(address)"](LBM.target);
      expect(await LBM.balanceOf(AmbassadorProgram.target)).to.equal(0);
    });
  });

  describe("Marketing Vesting Contract", function () {
    it("Should not allow vesting before the 6 month cliff", async function () {
      const { Marketing, LBM } = await loadFixture(deployAll);
      expect(await Marketing["releasable(address)"](LBM.target)).to.equal(0);
    });

    it("Should allow vesting after the 6 month cliff, linearly over 24 months", async function () {
      const { admin, Marketing, LBM } = await loadFixture(deployAll);

      // 1 month into vesting period
      await time.increase(time.duration.days(30) * 7);

      // Expected release amount: 6,000,000 / 24 months ~= 167k tokens
      const expectedReleaseAmount = ethers.getBigInt(
        "166666666666666666666666"
      );
      // Acceptable delta (approximately 5 minutes) ~= 19 tokens
      const delta = ethers.getBigInt("19290123456790123455");
      const actualReleaseAmount = await Marketing["releasable(address)"](
        LBM.target
      );

      expect(actualReleaseAmount).to.be.closeTo(expectedReleaseAmount, delta);
      await Marketing["release(address)"](LBM.target);
      const adminBalance = await LBM.balanceOf(admin.address);
      expect(adminBalance).to.be.closeTo(expectedReleaseAmount, delta);

      // At 23 months
      await time.increase(time.duration.days(30) * 22);
      await Marketing["release(address)"](LBM.target);
      expect(await LBM.balanceOf(Marketing.target)).to.not.equal(0);

      // At 24 months
      await time.increase(time.duration.days(30) * 1);
      await Marketing["release(address)"](LBM.target);
      expect(await LBM.balanceOf(Marketing.target)).to.equal(0);
    });
  });

  describe("Airdrop Contract", function () {
    it("Should not allow vesting before the 1 month cliff", async function () {
      const { Airdrop, LBM } = await loadFixture(deployAll);
      expect(await Airdrop["releasable(address)"](LBM.target)).to.equal(0);
    });

    it("Should allow full vesting after the 1 month cliff", async function () {
      const { admin, Airdrop, LBM } = await loadFixture(deployAll);

      // 1 month into vesting period
      await time.increase(time.duration.days(30) * 1);

      // Expected release amount: 2M tokens
      const expectedReleaseAmount = ethers.getBigInt(
        "2000000000000000000000000"
      );
      const actualReleaseAmount = await Airdrop["releasable(address)"](
        LBM.target
      );

      expect(actualReleaseAmount).to.be.equal(expectedReleaseAmount);
      await Airdrop["release(address)"](LBM.target);
      const adminBalance = await LBM.balanceOf(admin.address);
      expect(adminBalance).to.be.equal(expectedReleaseAmount);
    });
  });

  describe("Advisors Vesting Contract", function () {
    it("Should not allow vesting before the 6 month cliff", async function () {
      const { Advisors, LBM } = await loadFixture(deployAll);
      expect(await Advisors["releasable(address)"](LBM.target)).to.equal(0);
    });

    it("Should allow vesting after the 6 month cliff, linearly over 24 months", async function () {
      const { admin, Advisors, LBM } = await loadFixture(deployAll);

      // 1 month into vesting period
      await time.increase(time.duration.days(30) * 7);

      // Expected release amount: 2,000,000 / 36 months ~= 55.6k tokens
      const expectedReleaseAmount = ethers.getBigInt("55555555555555555555555");
      // Acceptable delta (approximately 5 minutes) ~= 6 tokens
      const delta = ethers.getBigInt("6430041152263374485");
      const actualReleaseAmount = await Advisors["releasable(address)"](
        LBM.target
      );

      expect(actualReleaseAmount).to.be.closeTo(expectedReleaseAmount, delta);
      await Advisors["release(address)"](LBM.target);
      const adminBalance = await LBM.balanceOf(admin.address);
      expect(adminBalance).to.be.closeTo(expectedReleaseAmount, delta);

      // At 35 months
      await time.increase(time.duration.days(30) * 34);
      await Advisors["release(address)"](LBM.target);
      expect(await LBM.balanceOf(Advisors.target)).to.not.equal(0);

      // At 36 months
      await time.increase(time.duration.days(30) * 1);
      await Advisors["release(address)"](LBM.target);
      expect(await LBM.balanceOf(Advisors.target)).to.equal(0);
    });
  });

  describe("Project Development Wallet", function () {
    it("Should mint 4M tokens to the presale exchange wallet", async function () {
      const { LBM, projectDevelopmentWallet } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(projectDevelopmentWallet.address)).to.equal(
        ethers.parseEther("4000000")
      );
    });
  });
});
