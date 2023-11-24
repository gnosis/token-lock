import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/react"
import React from "react"
import { WagmiConfig, configureChains } from "wagmi"
import { goerli, gnosis, mainnet } from "wagmi/chains"
import { publicProvider } from "@wagmi/core/providers/public"

export const walletConnectProjectId = "f0f39635674ae1bc5c5db55ccfbb0f33"

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
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return (
    <WagmiConfig config={config}>
      {mounted && children}
      {children}
    </WagmiConfig>
  )
}
