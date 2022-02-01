import "@typechain/hardhat"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-waffle"
import "@nomiclabs/hardhat-etherscan"
import "@openzeppelin/hardhat-upgrades"
import "solidity-coverage"
import "hardhat-deploy"
import "hardhat-gas-reporter"
import dotenv from "dotenv"
import { HttpNetworkUserConfig } from "hardhat/types"
import yargs from "yargs"

const argv = yargs
  .option("network", {
    type: "string",
    default: "hardhat",
  })
  .help(false)
  .version(false).argv as { network: string }

// Load environment variables.
dotenv.config()
const { INFURA_KEY, MNEMONIC, ETHERSCAN_API_KEY, PK } = process.env

import "./src/tasks/initialDeploy"
import "./src/tasks/upgrade"
import "./src/tasks/verify"
import "./src/tasks/initializeImplementation"

const DEFAULT_MNEMONIC =
  "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"

const sharedNetworkConfig: HttpNetworkUserConfig = {}
if (PK) {
  sharedNetworkConfig.accounts = [PK]
} else {
  sharedNetworkConfig.accounts = {
    mnemonic: MNEMONIC || DEFAULT_MNEMONIC,
  }
}

if (["rinkeby", "mainnet"].includes(argv.network) && INFURA_KEY === undefined) {
  throw new Error(
    `Could not find Infura key in env, unable to connect to network ${argv.network}`
  )
}

export default {
  paths: {
    artifacts: "build/artifacts",
    cache: "build/cache",
    sources: "contracts",
  },
  solidity: {
    compilers: [{ version: "0.8.6" }],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    mainnet: {
      ...sharedNetworkConfig,
      url: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    },
    rinkeby: {
      ...sharedNetworkConfig,
      url: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
    },
    gnosischain: {
      ...sharedNetworkConfig,
      url: "https://xdai.poanetwork.dev",
    },
  },
  namedAccounts: {
    deployer: 0,
  },
  mocha: {
    timeout: 2000000,
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
}
