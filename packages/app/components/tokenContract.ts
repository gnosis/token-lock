import {
  useReadContract,
  useWriteContract,
} from "wagmi"
import useTokenLockConfig from "./useTokenLockConfig"
import { erc20Abi } from 'viem'

type Config = { enabled?: boolean; watch?: boolean; args?: any }

export const useTokenContractRead = (
  functionName: string,
  config: Config = {}
) => {
  const { tokenAddress } = useTokenLockConfig()
  return useReadContract({
    ...config,
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: functionName as any,
  })
}

export const useTokenContractWrite = (functionName: string, args: any) => {
  const { data: hash, writeContract } = useWriteContract()
  const { tokenAddress } = useTokenLockConfig()
  return writeContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: functionName as any,
    args,
  })
}
