import { Chain, chain } from "wagmi"

export const LOCKED_TOKEN_NAME = "Gnosis"
export const LOCKED_TOKEN_SYMBOL = "GNO"
export const CLAIM_TOKEN_NAME = "Locked Gnosis"
export const CLAIM_TOKEN_SYMBOL = "LGNO"

export const INFURA_ID =
  process.env.NODE_ENV === "development"
    ? "2d043e79a14e4145b4e07dd3eb3a5a4b"
    : "a63b6fb491fa4ad3827b824218e5aa68"

const addInfuraProjectId = (chain: Chain): Chain => ({
  ...chain,
  rpcUrls: {
    default: chain.rpcUrls.infura?.endsWith("infura.io/v3")
      ? `${chain.rpcUrls.infura}/${INFURA_ID}`
      : (chain.rpcUrls.infura as string),
  },
})

// used for price lookup
export const COINGECKO_TOKEN_ID = "gnosis"

// The first item will be used as the default chain
export const CHAINS: Chain[] = [
  ...(process.env.NODE_ENV === "development"
    ? [addInfuraProjectId(chain.rinkeby)]
    : []),

  addInfuraProjectId(chain.mainnet),

  {
    id: 100,
    name: "Gnosis Chain",
    network: "gchain",
    nativeCurrency: {
      decimals: 18,
      name: "xDai",
      symbol: "xDAI",
    },
    rpcUrls: {
      default: "https://rpc.xdaichain.com/",
    },
    blockExplorers: {
      default: {
        name: "Blockscout",
        url: "https://blockscout.com/xdai/mainnet",
      },
    },
  },
]

export const CONTRACT_ADDRESSES: { [chainId: number]: string } = {
  1: "0x4f8AD938eBA0CD19155a835f617317a6E788c868",
  100: "0xd4Ca39f78Bf14BfaB75226AC833b1858dB16f9a1",

  4: "0x01FD5975E40D16838a7213e2fdfFbBBA4477c14d", // deposit period ongoing
  // 4: "0x88c6501d5C2475F5a0343847A12cEA0090458013", // lock period ongoing
  // 4: "0xF7a579Cc9c27488f13C1F16036a65810fa1Ca3CC", // lock period over
}
