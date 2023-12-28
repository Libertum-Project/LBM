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
      console.log("TOTAL LBM SUPPLY", ethers.formatEther(await LBM.totalSupply()));
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

  describe("Vesting", function () {
    it("Should vest core team tokens correctly", async function () {
      const {
        admin,
        treasuryWallet,
        presaleWallet,
        cexWallet,
        liquidityWallet,
        stakingWallet,
        projectDevelopmentWallet,
        CoreTeam,
        LBM,
      } = await loadFixture(deployAll);
      expect(await CoreTeam["releasable(address)"](LBM.target)).to.equal(0);

      await time.increase(time.duration.days(30) * 11);
      expect(await CoreTeam["releasable(address)"](LBM.target)).to.equal(0);

      await time.increase(time.duration.days(60));
      console.log(
        "Core team vesting:",
        ethers.formatEther(await CoreTeam["releasable(address)"](LBM.target))
      );

      await CoreTeam["release(address)"](LBM.target);
      console.log(
        "Core team vesting:",
        ethers.formatEther(await CoreTeam["releasable(address)"](LBM.target))
      );
      console.log(
        "Contract balance:",
        ethers.formatEther(await LBM.balanceOf(CoreTeam.target))
      );
      console.log(
        "treasuryWallet, presaleWallet, cexWallet, liquidityWallet, stakingWallet, projectDevelopmentWallet balance:",
        ethers.formatEther(await LBM.balanceOf(admin.address))
      );
    });
  });
});
