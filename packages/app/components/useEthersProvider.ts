import * as React from "react"
import { usePublicClient } from "wagmi"
import { publicClientToProvider } from "./tokenLockContract"

/** Hook to convert a viem Public Client to an ethers.js Provider. */

export function useEthersProvider({ chainId }: { chainId?: number } = {}) {
  const publicClient = usePublicClient({ chainId })
  return React.useMemo(
    () => publicClientToProvider(publicClient),
    [publicClient]
  )
}
