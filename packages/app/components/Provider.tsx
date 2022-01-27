import { providers } from "ethers"
import React from "react"
import { InjectedConnector, Provider as WagmiProvider } from "wagmi"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { WalletLinkConnector } from "wagmi/connectors/walletLink"
import { CHAINS, INFURA_ID, LOCKED_TOKEN_NAME } from "../config"
import GnosisSafeConnector from "./safeConnector"

export const provider = ({ chainId }: { chainId?: number }) => {
  const rpcUrl =
    CHAINS.find((x) => x.id === chainId)?.rpcUrls?.[0] ?? CHAINS[0].rpcUrls[0]
  return new providers.JsonRpcBatchProvider(rpcUrl, "any")
}

const connectors = ({ chainId }: { chainId?: number }) => {
  const rpcUrl =
    CHAINS.find((x) => x.id === chainId)?.rpcUrls?.[0] ?? CHAINS[0].rpcUrls[0]
  return [
    new GnosisSafeConnector({ chains: CHAINS }),
    new InjectedConnector({ chains: CHAINS }),
    new WalletConnectConnector({
      options: {
        infuraId: INFURA_ID,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: `Lock ${LOCKED_TOKEN_NAME}`,
        jsonRpcUrl: `${rpcUrl}/${INFURA_ID}`,
      },
    }),
  ]
}

const Provider: React.FC = ({ children }) => (
  <WagmiProvider autoConnect provider={provider} connectors={connectors}>
    {children}
  </WagmiProvider>
)

export default Provider
