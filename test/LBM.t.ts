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
        const { LBM } = await deployAll();
        expect(await LBM.name()).to.equal("Libertum");
        expect(await LBM.symbol()).to.equal("LBM");
    });
  });
});
