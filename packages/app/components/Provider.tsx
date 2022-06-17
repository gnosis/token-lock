import { providers } from "ethers"
import React from "react"
import { WagmiConfig, createClient } from "wagmi"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { InjectedConnector } from "wagmi/connectors/injected"
import { CHAINS, INFURA_ID } from "../config"
import { SafeConnector } from "@gnosis.pm/safe-apps-wagmi"

const provider = ({ chainId }: { chainId?: number }) => {
  const rpcUrl =
    CHAINS.find((x) => x.id === chainId)?.rpcUrls?.[0] ?? CHAINS[0].rpcUrls[0]
  const provider = new providers.JsonRpcBatchProvider(rpcUrl, "any")
  provider.pollingInterval = 6000
  return provider
}

const webSocketProvider = ({ chainId }: { chainId?: number }) => {
  if (chainId === 1) {
    return new providers.InfuraWebSocketProvider(chainId, INFURA_ID)
  }
  if (chainId === 100) {
    return new providers.WebSocketProvider("wss://rpc.gnosischain.com/wss", 100)
  }

  return undefined
}

const client = createClient({
  autoConnect: true,
  connectors: [
    new SafeConnector({}),
    new InjectedConnector({ chains: CHAINS }),
    new WalletConnectConnector({
      options: {
        infuraId: INFURA_ID,
        qrcode: true,
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
