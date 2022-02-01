import { task, types } from "hardhat/config"

task("initializeImplementation", "Initializes the implementation contract")
  .addParam(
    "implementation",
    "Address of the implementation contract to initialize",
    undefined,
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const [caller] = await hre.ethers.getSigners()
    const TokenLock = await hre.ethers.getContractFactory("TokenLock", caller)
    const tokenLock = TokenLock.attach(taskArgs.implementation)

    const DEAD_ADDRESS = "0x000000000000000000000000000000000000dead"
    try {
      const tx = await tokenLock.initialize(
        DEAD_ADDRESS,
        DEAD_ADDRESS,
        0,
        0,
        "",
        ""
      )
      await tx.wait()
      console.log(
        `Contract at ${taskArgs.implementation} has been successfully initialized`
      )
    } catch (e) {
      const error = e as Error & { error: Error }
      if (
        "error" in error &&
        "message" in error.error &&
        error.error.message ===
          "execution reverted: Initializable: contract is already initialized"
      ) {
        console.warn(
          `Contract at ${taskArgs.implementation} is already initialized`
        )
      } else {
        throw e
      }
    }
  })
