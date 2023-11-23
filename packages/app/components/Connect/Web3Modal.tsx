import { createWeb3Modal, defaultConfig } from "@web3modal/ethers5/react"
import { RouterController } from "@web3modal/core"

const isProd =
  typeof window !== "undefined" && window.location.hostname === "lock.gnosis.io"

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = "f0f39635674ae1bc5c5db55ccfbb0f33"

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
}
const gnosis = {
  chainId: 100,
  name: "Gnosis",
  currency: "xDAI",
  explorerUrl: "https://gnosisscan.io",
  rpcUrl: "https://rpc.gnosis.gateway.fm",
}
const goerli = {
  chainId: 5,
  name: "Görli",
  currency: "Görli ETH",
  explorerUrl: "https://goerli.etherscan.io",
  rpcUrl: "https://rpc.goerli.eth.gateway.fm",
}

// 3. Create modal
const metadata = {
  name: "Lock GNO",
  description: "Lock GNO for 12 months to receive a $COW airdrop boost",
  url: "https://lock.gnosis.io",
  icons: ["https://lock.gnosis.io/gno.svg"],
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [mainnet, gnosis, ...(isProd ? [] : [goerli])],
  projectId,
  themeMode: "light",
})

export const Web3ModalProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>
}
