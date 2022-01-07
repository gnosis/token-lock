import "hardhat-deploy"
import "@nomiclabs/hardhat-ethers"

import { task, types } from "hardhat/config"

task("upgrade", "Upgrades the logic of an existing TokenLock contract")
  .addParam(
    "proxy",
    "Address of the existing token lock proxy",
    undefined,
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const [caller] = await hre.ethers.getSigners()
    console.log("Using the account:", caller.address)
    const TokenLock = await hre.ethers.getContractFactory("TokenLock")
    const tokenLock = await hre.upgrades.upgradeProxy(taskArgs.proxy, TokenLock)

    console.log(
      `Latest version of the implementation deployed to: ${tokenLock.address}`
    )

    console.log(
      `Proxy at ${taskArgs.proxy} upgraded to use implementation at ${tokenLock.address}`
    )
  })

export {}
