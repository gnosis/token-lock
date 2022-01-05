import { expect } from "chai";
import hre, { deployments, ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import { AbiCoder } from "ethers/lib/utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
const saltNonce = "0xfa";

const depositEnd = 1641380528;
const lockEnd = 1672358400;

describe("Module works with factory", () => {
  const paramsTypes = ["address", "address", "uint256", "uint256"];
  let owner: SignerWithAddress;
  let token: SignerWithAddress;

  const baseSetup = deployments.createFixture(async () => {
    const signers = await ethers.getSigners();
    owner = signers[0];
    token = signers[1];
    await deployments.fixture();
    const Factory = await hre.ethers.getContractFactory(
      "GnosisSafeProxyFactory"
    );
    const factory = await Factory.deploy();

    const TokenLock = await hre.ethers.getContractFactory("TokenLock");

    const masterCopy = await TokenLock.deploy(
      owner.address,
      token.address,
      depositEnd,
      lockEnd
    );

    return { factory, masterCopy };
  });

  it.only("should throw because master copy is already initialized", async () => {
    const { masterCopy } = await baseSetup();
    const encodedParams = new AbiCoder().encode(paramsTypes, [
      owner.address,
      token.address,
      depositEnd,
      lockEnd,
    ]);

    await expect(masterCopy.setUp(encodedParams)).to.be.revertedWith(
      "Initializable: contract is already initialized"
    );
  });

  it("should deploy new TokenLock proxy", async () => {
    const { factory, masterCopy } = await baseSetup();
    const [owner, token] = await ethers.getSigners();
    const paramsValues = [owner.address, token.address, depositEnd, lockEnd];
    const initParams = masterCopy.interface.encodeFunctionData("setUp", [
      new AbiCoder().encode(paramsTypes, paramsValues),
    ]);
    const receipt = await factory
      .deployModule(masterCopy.address, initParams, saltNonce)
      .then((tx: any) => tx.wait());

    // retrieve new address from event
    const {
      args: [newProxyAddress],
    } = receipt.events.find(
      ({ event }: { event: string }) => event === "ModuleProxyCreation"
    );

    const newProxy = await hre.ethers.getContractAt(
      "TokenLock",
      newProxyAddress
    );
    expect(await newProxy.token()).to.be.eq(token.address);
    expect(await newProxy.depositEnd()).to.be.eq(depositEnd);
    expect(await newProxy.lockEnd()).to.be.eq(lockEnd);
  });
});
