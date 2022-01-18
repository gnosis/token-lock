import { task, types } from "hardhat/config"

task("verifyEtherscan", "Verifies the contract on etherscan")
  .addParam(
    "implementation",
    "Address of the implementation contract to verify",
    undefined,
    types.string
  )
  .setAction(async (taskArgs, hardhatRuntime) => {
    await hardhatRuntime.run("verify", {
      address: taskArgs.implementation,
      constructorArgsParams: [],
    })
  })
