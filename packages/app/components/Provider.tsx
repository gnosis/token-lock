import { providers } from "ethers"
import React, { useEffect, useState } from "react"
import { InjectedConnector, Provider as WagmiProvider } from "wagmi"
import { WalletConnectConnector } from "wagmi/connectors/walletConnect"
import { WalletLinkConnector } from "wagmi/connectors/walletLink"
import { CHAINS, INFURA_ID, LOCKED_TOKEN_NAME } from "../config"
import GnosisSafeConnector, { safePromise } from "./safeConnector"

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

let inGnosisSafe = false

const connectors = ({ chainId }: { chainId?: number }) => {
  if (inGnosisSafe) {
    return [new GnosisSafeConnector({ chains: CHAINS })]
  }

  const rpcUrl =
    CHAINS.find((x) => x.id === chainId)?.rpcUrls?.[0] ?? CHAINS[0].rpcUrls[0]
  return [
    new InjectedConnector({ chains: CHAINS }),
    new WalletConnectConnector({
      options: {
        infuraId: INFURA_ID,
        qrcode: true,
        bridge: "https://walletconnect.gnosis.io",
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

const Provider: React.FC = ({ children }) => {
  const [safePromiseResolved, setSafePromiseResolved] = useState(false)
  useEffect(() => {
    safePromise.then((safe) => {
      inGnosisSafe = !!safe
      setSafePromiseResolved(true)
    })
  })

  return safePromiseResolved ? (
    <WagmiProvider
      autoConnect
      provider={provider}
      webSocketProvider={webSocketProvider}
      connectors={connectors}
    >
      {children}
    </WagmiProvider>
  ) : (
    <h1>loading...</h1>
  )
}

export default Provider
