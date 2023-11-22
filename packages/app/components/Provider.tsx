import { providers } from "ethers"
import React from "react"
import { WagmiConfig, createClient } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { CHAINS, INFURA_ID, LOCKED_TOKEN_NAME } from "../config"

const mainnetProvider = new providers.JsonRpcBatchProvider(
  `https://mainnet.infura.io/v3/${INFURA_ID}`,
  { chainId: 1, name: "Mainnet" }
)
const goerliProvider = new providers.JsonRpcBatchProvider(
  `https://goerli.infura.io/v3/${INFURA_ID}`,
  { chainId: 5, name: "Goerli" }
)
const gnosisProvider = new providers.JsonRpcBatchProvider(
  "https://rpc.gnosis.gateway.fm",
  { chainId: 100, name: "Gnosis" }
)

const provider = ({ chainId }: { chainId?: number }) => {
  if (!chainId) return mainnetProvider

  let provider: providers.JsonRpcBatchProvider | undefined
  if (chainId === 1) {
    provider = mainnetProvider
  } else if (chainId === 5) {
    provider = goerliProvider
  } else if (chainId === 100) {
    provider = gnosisProvider
  } else {
    throw new Error(`Unsupported chainId: ${chainId}`)
  }
  provider.pollingInterval = 6000
  return provider
}

const mainnetWsProvider = new providers.InfuraWebSocketProvider(1, INFURA_ID)
const gnosisWsProvider = new providers.WebSocketProvider(
  "wss://rpc.gnosischain.com/wss",
  100
)

const webSocketProvider = ({ chainId }: { chainId?: number }) => {
  if (chainId === 1) {
    return mainnetWsProvider
  }
  if (chainId === 100) {
    return gnosisWsProvider
  }

  return undefined
}

const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains: CHAINS,
      options: {
        name: "Injected",
        shimDisconnect: true,
      },
    }),
    new WalletConnectConnector({
      options: {
        projectId: "f0f39635674ae1bc5c5db55ccfbb0f33",
        showQrModal: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

const Provider: React.FC = ({ children }) => {
  return <WagmiConfig client={client}>{children}</WagmiConfig>
}

export default Provider
