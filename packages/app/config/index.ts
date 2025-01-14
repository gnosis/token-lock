import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, gnosis } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = "af31daed827da866f82e0b2141bb0bee"

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [mainnet, gnosis]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
