import { expect } from "chai";
import { deployments, waffle, ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { BigNumber } from "@ethersproject/bignumber";

const ZeroState =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
const ZeroAddress = "0x0000000000000000000000000000000000000000";
const FirstAddress = "0x0000000000000000000000000000000000000001";

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

    return { owner, Token, token, TokenLock };
  });

  describe("setUp()", async () => {
    it("should emit event because of successful set up", async () => {
      const { owner, token, TokenLock } = await setupTest();
      const oneWeek = 7 * 24 * 60 * 60;
      const tokenLock = await TokenLock.deploy(
        owner.address,
        token.address,
        now + oneWeek,
        now + 2 * oneWeek
      );
      await tokenLock.deployed();
      await expect(tokenLock.deployTransaction)
        .to.emit(module, "TokenLockSetup")
        .withArgs(user1.address, user1.address, user1.address, user1.address);
    });
  });
});
