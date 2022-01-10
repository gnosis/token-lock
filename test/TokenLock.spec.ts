import { expect } from "chai"
import { deployments, ethers, upgrades, network } from "hardhat"
import "@nomiclabs/hardhat-ethers"
import { BigNumber } from "@ethersproject/bignumber"

import { TokenLock as TokenLockT } from "../typechain-types"

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("TokenLock", () => {
  let owner: SignerWithAddress
  let user: SignerWithAddress

  const ONE = BigNumber.from(10).pow(18)

  const now = Math.round(Date.now() / 1000)
  const oneWeek = 7 * 24 * 60 * 60

  const setupTest = deployments.createFixture(async () => {
    ;[owner, user] = await ethers.getSigners()

    await deployments.fixture()
    const Token = await ethers.getContractFactory("TestToken")
    const token = await Token.deploy(18)
    const TokenLock = await ethers.getContractFactory("TokenLock")

    await token.mint(user.address, ONE)

    return { Token, token, TokenLock }
  })

  it("is upgradable", async () => {
    const { TokenLock, token } = await setupTest()

    const instance = await upgrades.deployProxy(TokenLock, [
      owner.address,
      token.address,
      now + oneWeek,
      2 * oneWeek,
      "Locked TestToken",
      "LTT",
    ])

    const TokenLockV2 = await ethers.getContractFactory("TokenLock")
    expect(TokenLockV2).to.not.equal(TokenLock)

    const upgraded = (await upgrades.upgradeProxy(
      instance.address,
      TokenLockV2
    )) as TokenLockT
    expect(await upgraded.name()).to.equal("Locked TestToken")
  })

  it("cannot be upgraded by others", async () => {
    const { token } = await setupTest()
    const TokenLock = await ethers.getContractFactory("TokenLock", {
      signer: owner,
    })

    const instance = (await upgrades.deployProxy(TokenLock, [
      owner.address,
      token.address,
      now + oneWeek,
      2 * oneWeek,
      "Locked TestToken",
      "LTT",
    ])) as TokenLockT

    const TokenLockV2 = await ethers.getContractFactory("TokenLock", {
      signer: user,
    })

    await expect(
      upgrades.upgradeProxy(instance.address, TokenLockV2)
    ).to.be.revertedWith("Ownable: caller is not the owner")
  })

  it("should revert with NotSupported() if one the unsupported ERC-20 functions is called", async () => {
    const { TokenLock, token } = await setupTest()

    const tokenLock = (await upgrades.deployProxy(TokenLock, [
      owner.address,
      token.address,
      now + oneWeek,
      2 * oneWeek,
      "Locked TestToken",
      "LTT",
    ])) as TokenLockT

    await expect(
      tokenLock.allowance(user.address, user.address)
    ).to.be.revertedWith("NotSupported()")
    await expect(tokenLock.approve(user.address, 1000)).to.be.revertedWith(
      "NotSupported()"
    )
    await expect(tokenLock.transfer(user.address, 100)).to.be.revertedWith(
      "NotSupported()"
    )
    await expect(
      tokenLock.transferFrom(user.address, user.address, 100)
    ).to.be.revertedWith("NotSupported()")
  })

  describe("initialize", () => {
    it("sets the owner and stores the provided arguments", async () => {
      const { TokenLock, token } = await setupTest()

      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      expect(await tokenLock.owner()).to.equal(owner.address)
      expect(await tokenLock.token()).to.equal(token.address)
      expect(await tokenLock.depositDeadline()).to.equal(now + oneWeek)
      expect(await tokenLock.lockDuration()).to.equal(2 * oneWeek)
      expect(await tokenLock.name()).to.equal("Locked TestToken")
      expect(await tokenLock.symbol()).to.equal("LTT")
    })
  })

  describe("deposit()", () => {
    it("reverts if the sender has no sufficient balance", async () => {
      const { token, TokenLock } = await setupTest()
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      await expect(
        tokenLock.connect(user).deposit(ONE.mul(2))
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance")
    })

    it("reverts if the sender has not provided sufficient allowance", async () => {
      const { token, TokenLock } = await setupTest()
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      await token.connect(user).approve(tokenLock.address, ONE.div(2))

      await expect(tokenLock.connect(user).deposit(ONE)).to.be.revertedWith(
        "ERC20: transfer amount exceeds allowance"
      )
    })

    it("reverts if the deposit deadline has passed", async () => {
      const { token, TokenLock } = await setupTest()
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now - oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      await token.connect(user).approve(tokenLock.address, ONE)

      await expect(tokenLock.connect(user).deposit(ONE)).to.be.revertedWith(
        "DepositPeriodOver()"
      )
    })

    it("reverts if the token transfer is unsuccessful", async () => {
      const { TokenLock } = await setupTest()
      const FailingToken = await ethers.getContractFactory(
        "TestTokenFailingTransferFrom"
      )
      const failingToken = await FailingToken.deploy(18)
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        failingToken.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      await failingToken.mint(user.address, ONE)
      await failingToken.connect(user).approve(tokenLock.address, ONE)

      await expect(tokenLock.connect(user).deposit(ONE)).to.be.revertedWith(
        "TransferFailed()"
      )
    })

    it("transfers the deposited tokens into the lock contract", async () => {
      const { token, TokenLock } = await setupTest()
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      await token.connect(user).approve(tokenLock.address, ONE)

      await expect(() =>
        tokenLock.connect(user).deposit(ONE)
      ).to.changeTokenBalances(token, [user, tokenLock], [ONE.mul(-1), ONE])
    })

    it("mints lock claim tokens to the sender equal to the deposited amount", async () => {
      const { token, TokenLock } = await setupTest()
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      await token.connect(user).approve(tokenLock.address, ONE)

      await expect(() =>
        tokenLock.connect(user).deposit(ONE)
      ).to.changeTokenBalance(tokenLock, user, ONE)

      expect(await tokenLock.totalSupply()).to.equal(ONE)
    })

    it("emits a Transfer event", async () => {
      const { token, TokenLock } = await setupTest()
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      await token.connect(user).approve(tokenLock.address, ONE)

      await expect(tokenLock.connect(user).deposit(ONE))
        .to.emit(tokenLock, "Transfer")
        .withArgs(user.address, tokenLock.address, ONE)
    })
  })

  describe("withdraw", () => {
    const setupWithLocked = async (weeksSinceLockEnd: number) => {
      const { token, TokenLock } = await setupTest()
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      await token.connect(user).approve(tokenLock.address, ONE)
      await tokenLock.connect(user).deposit(ONE)

      await network.provider.send("evm_setNextBlockTimestamp", [
        now + 3 * oneWeek + weeksSinceLockEnd * oneWeek,
      ])

      return { tokenLock, token }
    }

    it("reverts if the lock period is not over yet", async () => {
      const { tokenLock } = await setupWithLocked(-1)
      await expect(tokenLock.connect(user).withdraw(ONE)).to.be.revertedWith(
        "LockPeriodOngoing()"
      )
    })

    it("reverts if the claimed amount exceeds the balance", async () => {
      const { tokenLock } = await setupWithLocked(1)
      await expect(
        tokenLock.connect(user).withdraw(ONE.mul(2))
      ).to.be.revertedWith("ExceedsBalance()")
    })

    it("reverts if the token transfer is unsuccessful", async () => {
      const { TokenLock } = await setupTest()
      const FailingToken = await ethers.getContractFactory(
        "TestTokenFailingTransfer"
      )
      const failingToken = await FailingToken.deploy(18)
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        failingToken.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      await failingToken.mint(user.address, ONE)
      await failingToken.connect(user).approve(tokenLock.address, ONE)
      await tokenLock.connect(user).deposit(ONE)

      await network.provider.send("evm_setNextBlockTimestamp", [
        now + 4 * oneWeek,
      ])

      await expect(tokenLock.connect(user).withdraw(ONE)).to.be.revertedWith(
        "TransferFailed()"
      )
    })

    it("transfers the locked token to the sender", async () => {
      const { tokenLock, token } = await setupWithLocked(1)

      await expect(() =>
        tokenLock.connect(user).withdraw(ONE)
      ).to.changeTokenBalance(token, user, ONE)
    })

    it("burns the redeemed lock tokens", async () => {
      const { tokenLock } = await setupWithLocked(1)

      await expect(() =>
        tokenLock.connect(user).withdraw(ONE)
      ).to.changeTokenBalance(tokenLock, user, ONE.mul(-1))
      expect(await tokenLock.totalSupply()).to.equal(0)
    })

    it("emits a Transfer event", async () => {
      const { tokenLock } = await setupWithLocked(1)

      await expect(tokenLock.connect(user).withdraw(ONE))
        .to.emit(tokenLock, "Transfer")
        .withArgs(tokenLock.address, user.address, ONE)
    })

    it("allows withdrawals during the deposit period", async () => {
      // 2.5 weeks before the lock end, means 0.5 weeks before deposit deadline
      const { tokenLock } = await setupWithLocked(-2.5)

      await expect(tokenLock.connect(user).withdraw(ONE))
        .to.emit(tokenLock, "Transfer")
        .withArgs(tokenLock.address, user.address, ONE)
    })
  })

  describe("decimals", () => {
    it("has the same value as the token that is locked", async () => {
      const { TokenLock, Token } = await setupTest()
      const tokenWith17Decimals = await Token.deploy(17)
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        tokenWith17Decimals.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      expect(await tokenLock.decimals()).to.equal(17)
    })
  })

  describe("balanceOf", () => {
    it("returns the correct balance for the given address", async () => {
      const { token, TokenLock } = await setupTest()
      const tokenLock = (await upgrades.deployProxy(TokenLock, [
        owner.address,
        token.address,
        now + oneWeek,
        2 * oneWeek,
        "Locked TestToken",
        "LTT",
      ])) as TokenLockT

      await token.connect(user).approve(tokenLock.address, ONE)
      await tokenLock.connect(user).deposit(ONE)

      expect(await tokenLock.balanceOf(user.address)).to.equal(ONE)
    })
  })
})
