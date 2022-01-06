import { task, types } from "hardhat/config";

task("verifyEtherscan", "Verifies the contract on etherscan")
  .addParam(
    "contract",
    "Address of the contract to verify",
    undefined,
    types.string
  )
  .addParam("owner", "Address of the owner", undefined, types.string)
  .addParam("token", "Address of the token to lock", undefined, types.string)
  .addParam(
    "depositDeadline",
    "Unix timestamp (seconds) of the deposit deadline",
    undefined,
    types.int
  )
  .addParam(
    "lockDuration",
    "Lock duration in seconds, period starts after the deposit deadline",
    undefined,
    types.int
  )
  .addParam(
    "name",
    "Name of the token representing the claim on the locked token",
    undefined,
    types.string
  )
  .addParam(
    "symbol",
    "Symbol of the token representing the claim on the locked token",
    undefined,
    types.string
  )
  .setAction(async (taskArgs, hardhatRuntime) => {
    await hardhatRuntime.run("verify", {
      address: taskArgs.contract,
      constructorArgsParams: [
        taskArgs.owner,
        taskArgs.token,
        taskArgs.depositDeadline,
        taskArgs.lockDuration,
        taskArgs.name,
        taskArgs.symbol,
      ],
    });
  });
