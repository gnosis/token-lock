import { createAppKit } from "@reown/appkit/react"
import { mainnet, gnosis } from "@reown/appkit/networks"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"

export let projectId = "82b90020010d4b99d67a28028e036200"
if (
  typeof window !== "undefined" &&
  window.location.hostname === "lock.dev.gnosisdev.com"
) {
  projectId = "38ed7bec7b29a2a2a06c81d565d0a421"
}

export const wagmiAdapter = new WagmiAdapter({
  networks: [mainnet, gnosis],
  projectId,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mainnet, gnosis],
  projectId,
  features: {
    analytics: true,
  },
})
