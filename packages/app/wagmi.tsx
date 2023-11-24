import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react"
import React from "react"
import { WagmiConfig, configureChains } from "wagmi"
import { goerli, gnosis, mainnet } from "wagmi/chains"
import { publicProvider } from "@wagmi/core/providers/public"

export let walletConnectProjectId = "f0f39635674ae1bc5c5db55ccfbb0f33"
if (
  typeof window !== "undefined" &&
  window.location.hostname === "lock.dev.gnosisdev.com"
) {
  walletConnectProjectId = "38ed7bec7b29a2a2a06c81d565d0a421"
}

const { chains } = configureChains(
  [
    mainnet,
    gnosis,
    ...(process.env.NODE_ENV === "development" ? [goerli] : []),
  ],
  [publicProvider()]
)

export { chains }

export const config = defaultWagmiConfig({
  chains,
  projectId: walletConnectProjectId,
  metadata: {
    name: "Lock GNO",
    description: "Lock GNO for 12 months to receive a $COW airdrop boost",
    url: "https://lock.gnosis.io",
    icons: ["https://lock.gnosis.io/gno.svg"],
  },
})

createWeb3Modal({
  wagmiConfig: config,
  projectId: walletConnectProjectId,
  chains,
  themeMode: "light",
})

export function Providers({ children }: { children: React.ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>
}
