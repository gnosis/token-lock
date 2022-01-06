import { expect } from "chai";
import { deployments, waffle, ethers, upgrades } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { TokenLock as TokenLockT } from "../typechain-types";

describe("TokenLock", async () => {
  const [owner, user1, user2] = waffle.provider.getWallets();
  const now = Math.round(Date.now() / 1000);
  const oneWeek = 7 * 24 * 60 * 60;

  const setupTest = deployments.createFixture(async () => {
    await deployments.fixture();
    const Token = await ethers.getContractFactory("TestToken");
    const token = await Token.deploy(18);
    const TokenLock = await ethers.getContractFactory("TokenLock");

    await token.mint(user1.address, BigNumber.from(10).pow(18));
    await token.mint(user2.address, BigNumber.from(10).pow(18).mul(2));

    return { Token, token, TokenLock };
  });

  it("should be upgradable", async () => {
    const { TokenLock, token } = await setupTest();

    const instance = await upgrades.deployProxy(TokenLock, [
      owner.address,
      token.address,
      now + oneWeek,
      2 * oneWeek,
      "Locked TestToken",
      "LTT",
    ]);

    const TokenLockV2 = await ethers.getContractFactory("TokenLock");
    expect(TokenLockV2).to.not.equal(TokenLock);

    const upgraded = (await upgrades.upgradeProxy(
      instance.address,
      TokenLockV2
    )) as TokenLockT;
    expect(await upgraded.name()).to.equal("Locked TestToken");
  });

  describe("deposit()", async () => {
    it("should emit Deposit event", async () => {
      const { token, TokenLock } = await setupTest();
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT;

      tokenLock.deposit(BigNumber.from(10).pow(18), { from: user1.address });

      await expect(tokenLock.deployTransaction)
        .to.emit(module, "TokenLockSetup")
        .withArgs(user1.address, user1.address, user1.address, user1.address);
    });
  });
});
