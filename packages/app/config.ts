import { Chain, mainnet, gnosis, goerli } from "wagmi/chains"

export const LOCKED_TOKEN_NAME = "Gnosis"
export const LOCKED_TOKEN_SYMBOL = "GNO"
export const CLAIM_TOKEN_NAME = "Locked Gnosis"
export const CLAIM_TOKEN_SYMBOL = "LGNO"

// used for price lookup
export const COINGECKO_TOKEN_ID = "gnosis"

export const CHAINS = [mainnet, gnosis] as Chain[]

export const CONTRACT_ADDRESSES: { [chainId: number]: string } = {
  1: "0x4f8AD938eBA0CD19155a835f617317a6E788c868",
  100: "0xd4Ca39f78Bf14BfaB75226AC833b1858dB16f9a1",

  // 4: "0x01FD5975E40D16838a7213e2fdfFbBBA4477c14d", // deposit period ongoing
  // 4: "0x88c6501d5C2475F5a0343847A12cEA0090458013", // lock period ongoing
  // 4: "0xF7a579Cc9c27488f13C1F16036a65810fa1Ca3CC", // lock period over
}
