import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("LBM", function () {
  async function deployAll() {
    const [owner, user] = await ethers.getSigners();
    const CoreTeam = await ethers.deployContract("CoreTeam", [owner.address]);
    await CoreTeam.waitForDeployment();
    console.log("Core team contract deployed to:", CoreTeam.target);

    const LBM = await ethers.deployContract("LBM", [CoreTeam.target]);
    await LBM.waitForDeployment();
    console.log("LBM contract deployed to:", LBM.target);

    return { owner, user, CoreTeam, LBM }
  }

  describe("Deployment", function () {
    it("Should deploy contracts with the correct balances", async function () {
      const { owner, user, CoreTeam, LBM } = await loadFixture(deployAll);
      expect(await LBM.balanceOf(CoreTeam.target)).to.equal(ethers.parseEther("50000000"));
    });
  });

  describe("Vesting", function () {
    it("Should vest core team tokens correctly", async function () {
      const { owner, user, CoreTeam, LBM } = await loadFixture(deployAll);
      expect(await CoreTeam["releasable(address)"](LBM.target)).to.equal(0);

      await time.increase(time.duration.days(30) * 11);
      expect(await CoreTeam["releasable(address)"](LBM.target)).to.equal(0);

      await time.increase(time.duration.days(60));
      console.log("Core team vesting:", ethers.formatEther(await CoreTeam["releasable(address)"](LBM.target)));

      await CoreTeam["release(address)"](LBM.target);
      console.log("Core team vesting:", ethers.formatEther(await CoreTeam["releasable(address)"](LBM.target)));
      console.log("Contract balance:", ethers.formatEther(await LBM.balanceOf(CoreTeam.target)));
      console.log("User balance:", ethers.formatEther(await LBM.balanceOf(owner.address)));
    });
  });
});
