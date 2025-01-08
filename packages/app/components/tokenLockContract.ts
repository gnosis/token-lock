import { useChainId } from "wagmi"
import {
  useReadContract,
} from "wagmi"
import { CONTRACT_ADDRESSES } from "../config"
import { TOKEN_LOCK_ABI } from "../abi/tokenLock"

type Config = { enabled?: boolean; watch?: boolean; args?: any }

export const useTokenLockContractRead = (
  functionName: string,
  config: Config = {}
) => {
  const chainId = useChainId()
  return useReadContract({
    ...config,
    address: CONTRACT_ADDRESSES[chainId] as `0x${string}`,
    abi: TOKEN_LOCK_ABI,
    functionName,
  })
}