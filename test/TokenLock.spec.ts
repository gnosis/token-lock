import { expect } from "chai";
import { deployments, ethers, upgrades } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { BigNumber } from "@ethersproject/bignumber";
import { TokenLock as TokenLockT } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("TokenLock", () => {
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;

  const now = Math.round(Date.now() / 1000);
  const oneWeek = 7 * 24 * 60 * 60;

  const setupTest = deployments.createFixture(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    await deployments.fixture();
    const Token = await ethers.getContractFactory("TestToken");
    const token = await Token.deploy(18);
    const TokenLock = await ethers.getContractFactory("TokenLock");

    await token.mint(user1.address, BigNumber.from(10).pow(18));
    await token.mint(user2.address, BigNumber.from(10).pow(18).mul(2));

    return { Token, token, TokenLock };
  });

  it("is upgradable", async () => {
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

  it("cannot be upgraded by others", async () => {
    const { token } = await setupTest();
    const TokenLock = await ethers.getContractFactory("TokenLock", {
      signer: owner,
    });

    const instance = (await upgrades.deployProxy(TokenLock, [
      owner.address,
      token.address,
      now + oneWeek,
      2 * oneWeek,
      "Locked TestToken",
      "LTT",
    ])) as TokenLockT;

    const TokenLockV2 = await ethers.getContractFactory("TokenLock", {
      signer: user1,
    });

    await expect(
      upgrades.upgradeProxy(instance.address, TokenLockV2)
    ).to.be.revertedWith("Ownable: caller is not the owner");
  });

  describe("initialize", () => {
    it("sets the owner and stores the provided arguments", async () => {
      const { TokenLock, token } = await setupTest();

      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT;

      expect(await tokenLock.owner()).to.equal(owner.address);
      expect(await tokenLock.token()).to.equal(token.address);
      expect(await tokenLock.depositDeadline()).to.equal(now + oneWeek);
      expect(await tokenLock.lockDuration()).to.equal(2 * oneWeek);
      expect(await tokenLock.name()).to.equal("Locked TestToken");
      expect(await tokenLock.symbol()).to.equal("LTT");
    });
  });

  describe("deposit()", () => {
    it("reverts if the sender has no sufficient balance", async () => {
      const { token, TokenLock } = await setupTest();
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT;

      await expect(
        tokenLock.connect(user1).deposit(BigNumber.from(10).pow(18).mul(2))
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("reverts if the sender has not provided sufficient allowance", async () => {
      const { token, TokenLock } = await setupTest();
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT;

      await token
        .connect(user1)
        .approve(tokenLock.address, BigNumber.from(10).pow(18).div(2));

      await expect(
        tokenLock.connect(user1).deposit(BigNumber.from(10).pow(18))
      ).to.be.revertedWith("ERC20: transfer amount exceeds allowance");
    });

    it("reverts if the deposit deadline has passed", async () => {
      const { token, TokenLock } = await setupTest();
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now - oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT;

      await token
        .connect(user1)
        .approve(tokenLock.address, BigNumber.from(10).pow(18));

      await expect(
        tokenLock.connect(user1).deposit(BigNumber.from(10).pow(18))
      ).to.be.revertedWith("DepositPeriodOver()");
    });

    it("transfers the deposited tokens into the lock contract", async () => {
      const { token, TokenLock } = await setupTest();
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT;

      await token
        .connect(user1)
        .approve(tokenLock.address, BigNumber.from(10).pow(18));

      await expect(() =>
        tokenLock.connect(user1).deposit(BigNumber.from(10).pow(18))
      ).to.changeTokenBalances(
        token,
        [user1, tokenLock],
        [BigNumber.from(10).pow(18).mul(-1), BigNumber.from(10).pow(18)]
      );
    });

    it("mints lock claim tokens to the sender equal to the deposited amount", async () => {
      const { token, TokenLock } = await setupTest();
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT;

      await token
        .connect(user1)
        .approve(tokenLock.address, BigNumber.from(10).pow(18));

      await expect(() =>
        tokenLock.connect(user1).deposit(BigNumber.from(10).pow(18))
      ).to.changeTokenBalance(tokenLock, user1, BigNumber.from(10).pow(18));
    });

    it("increases the total supply of the lock token", async () => {
      const { token, TokenLock } = await setupTest();
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT;

      await token
        .connect(user1)
        .approve(tokenLock.address, BigNumber.from(10).pow(18));

      await tokenLock.connect(user1).deposit(BigNumber.from(10).pow(18));
      expect(await token.balanceOf(tokenLock.address)).to.equal(
        BigNumber.from(10).pow(18)
      );
    });

    it("emits the Deposit event", async () => {
      const { token, TokenLock } = await setupTest();
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT;

      await token
        .connect(user1)
        .approve(tokenLock.address, BigNumber.from(10).pow(18));

      await expect(tokenLock.connect(user1).deposit(BigNumber.from(10).pow(18)))
        .to.emit(tokenLock, "Deposit")
        .withArgs(user1.address, BigNumber.from(10).pow(18));
    });
  });

  describe("decimals", () => {
    it("has the same value as the token that is locked", async () => {
      const { TokenLock, Token } = await setupTest();
      const tokenWith17Decimals = await Token.deploy(17);
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        tokenWith17Decimals.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT;

      expect(await tokenLock.decimals()).to.equal(17);
    });
  });
});
