import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("LBM", function () {
  async function deployAll() {
    const [
      deployer,
      treasuryWallet,
      stakingWallet,
      marketingWallet,
      ecosystemWallet,
      tokenSaleWallet,
    ] = await ethers.getSigners();

    const CoreTeam = await ethers.deployContract("CoreTeam", [deployer]);
    await CoreTeam.waitForDeployment();

    const LBM = await ethers.deployContract("LBM", [
      CoreTeam.target,
      treasuryWallet.address,
      stakingWallet.address,
      marketingWallet.address,
      ecosystemWallet.address,
      tokenSaleWallet.address,
    ]);
    await LBM.waitForDeployment();

    return {
      deployer,
      treasuryWallet,
      stakingWallet,
      marketingWallet,
      ecosystemWallet,
      tokenSaleWallet,
      CoreTeam,
      LBM,
    };
  }

  describe("Deployment", function () {
    it("Should deploy the LBM contract with the correct name and symbol", async function () {
      const { LBM } = await loadFixture(deployAll);
      expect(await LBM.name()).to.equal("Libertum");
      expect(await LBM.symbol()).to.equal("LBM");
    });

    it("Should have a total supply of 200M tokens", async function () {
      const { LBM } = await loadFixture(deployAll);
      expect(await LBM.totalSupply()).to.equal(ethers.parseEther("200000000"));
    });
  });

  describe("Core Team Vesting Contract", function () {
    it("Should mint 50M tokens to the Core Team Vesting Contract", async function () {
      const { CoreTeam, LBM } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(CoreTeam.target)).to.equal(
        ethers.parseEther("50000000")
      );
    });

    it("Should not allow vesting before the 12 month cliff", async function () {
      const { CoreTeam, LBM } = await loadFixture(deployAll);
      expect(await CoreTeam["releasable(address)"](LBM.target)).to.equal(0);

      // Advance time by 11 months to check that the 12 month cliff works
      await time.increase(time.duration.days(30) * 11);
      expect(await CoreTeam["releasable(address)"](LBM.target)).to.equal(0);
    });

    it("Should allow linear vesting over 48 months after the 12 month cliff", async function () {
      const { deployer, CoreTeam, LBM } = await loadFixture(deployAll);

      // Advance time by 13 months (1 month into the 48 month vesting period)
      await time.increase(time.duration.days(30) * 13);

      // Find the expected release amount (1/48 of the total amount)
      const expectedReleaseAmount =
        ethers.parseEther("50000000") / ethers.getBigInt("48");

      // Calculate an acceptable delta due to block time differences (1 min)
      const delta =
        ethers.parseEther("50000000") /
        ethers.getBigInt("48") /
        ethers.getBigInt("43200");

      // Check that the releasable amount is 1/48 of the total amount (within acceptable delta)
      expect(await CoreTeam["releasable(address)"](LBM.target)).to.be.closeTo(
        expectedReleaseAmount,
        delta
      );

      // Release the tokens to the core team wallet and check that the balance is correct
      await CoreTeam["release(address)"](LBM.target);
      expect(await LBM.balanceOf(deployer.address)).to.be.closeTo(
        expectedReleaseAmount,
        delta
      );
    });

    it("Should fully vest after 60 months (48 months + 12 months cliff)", async function () {
      const { deployer, CoreTeam, LBM } = await loadFixture(deployAll);

      // Advance time by 60 months
      await time.increase(time.duration.days(30) * 60);

      // Check that the entire amount is releaseable
      expect(await CoreTeam["releasable(address)"](LBM.target)).to.equal(
        ethers.parseEther("50000000")
      );

      // Release the tokens to the core team wallet and check that the balance is correct
      await CoreTeam["release(address)"](LBM.target);
      expect(await LBM.balanceOf(deployer.address)).to.equal(
        ethers.parseEther("50000000")
      );
    });
  });

  describe("Treasury Wallet", function () {
    it("Should mint 50M tokens to the Treasury Wallet", async function () {
      const { treasuryWallet, LBM } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(treasuryWallet.address)).to.equal(
        ethers.parseEther("50000000")
      );
    });
  });

  describe("Staking Wallet", function () {
    it("Should mint 8M tokens to the Staking Wallet", async function () {
      const { stakingWallet, LBM } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(stakingWallet.address)).to.equal(
        ethers.parseEther("8000000")
      );
    });
  });

  describe("Marketing Wallet", function () {
    it("Should mint 6M tokens to the Marketing Wallet", async function () {
      const { marketingWallet, LBM } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(marketingWallet.address)).to.equal(
        ethers.parseEther("6000000")
      );
    });
  });

  describe("Ecosystem Wallet", function () {
    it("Should mint 28M tokens to the Ecosystem Wallet", async function () {
      const { ecosystemWallet, LBM } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(ecosystemWallet.address)).to.equal(
        ethers.parseEther("28000000")
      );
    });
  });

  describe("Token Sale Wallet", function () {
    it("Should mint 58M tokens to the Token Sale Wallet", async function () {
      const { tokenSaleWallet, LBM } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(tokenSaleWallet.address)).to.equal(
        ethers.parseEther("58000000")
      );
    });
  });
});
