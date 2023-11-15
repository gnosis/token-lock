import React from "react"
import { createClient, WagmiConfig } from "wagmi"
import { configureChains } from "@wagmi/core"
import { mainnet, gnosis } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
// import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { WC_PROJECT_ID } from "../config"
// import GnosisSafeConnector, { safePromise } from "./safeConnector"

const { chains, provider } = configureChains(
  [mainnet, gnosis],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: chain.id == 1 ? process.env.RPC_URL_ETHEREUM : process.env.RPC_URL_GNOSIS,
        chainId: 1
      }),
    })
  ]
)

const config = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true
      }
    }),
    new WalletConnectConnector({
      options: {
        showQrModal: true,
        projectId: WC_PROJECT_ID
      }
    })
  ],
  provider
})


const Provider: React.FC = ({ children }) => {
  return (
    <WagmiConfig client={config}>
      {children}
    </WagmiConfig>
  )
}

export default Provider
