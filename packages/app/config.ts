import { Chain, chain } from "wagmi"

export const LOCKED_TOKEN_NAME = "Gnosis"
export const LOCKED_TOKEN_SYMBOL = "GNO"
export const CLAIM_TOKEN_NAME = "Locked Gnosis"
export const CLAIM_TOKEN_SYMBOL = "LGNO"

export const INFURA_ID = "e301e57e9a51407eb39df231874e0563"

const addInfuraProjectId = (chain: Chain) => ({
  ...chain,
  rpcUrls: chain.rpcUrls.map((url) =>
    url.endsWith("infura.io/v3") ? `${url}/${INFURA_ID}` : url
  ),
})

// used for price lookup
export const COINGECKO_TOKEN_ID = "gnosis"

// The first item will be used as the default chain
export const CHAINS: Chain[] = [
  ...(process.env.NODE_ENV === "development"
    ? [addInfuraProjectId(chain.rinkeby)]
    : []),

  // addInfuraProjectId(chain.mainnet),

  // {
  //   id: 100,
  //   name: "Gnosis Chain",
  //   nativeCurrency: {
  //     decimals: 18,
  //     name: "xDai",
  //     symbol: "xDAI",
  //   },
  //   rpcUrls: ["https://rpc.xdaichain.com/"],
  //   blockExplorers: [
  //     { name: "Blockscout", url: "https://blockscout.com/xdai/mainnet" },
  //   ],
  // },
]

export const CONTRACT_ADDRESSES: { [chainId: number]: string } = {
  // 4: "0x01FD5975E40D16838a7213e2fdfFbBBA4477c14d", // deposit period ongoing
  // 4: "0x88c6501d5C2475F5a0343847A12cEA0090458013", // lock period ongoing
  4: "0xF7a579Cc9c27488f13C1F16036a65810fa1Ca3CC", // lock period over
}
