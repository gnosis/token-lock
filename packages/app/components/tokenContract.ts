import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi"
import useTokenLockConfig from "./useTokenLockConfig"

type Config = { enabled?: boolean; watch?: boolean; args?: any }

export const useTokenContractRead = (
  functionName: string,
  config: Config = {}
) => {
  const { tokenAddress } = useTokenLockConfig()
  return useContractRead({
    ...config,
    address: tokenAddress as `0x${string}`,
    abi: erc20ABI,
    functionName: functionName as any,
  })
}

export const useTokenContractWrite = (functionName: string, args: any) => {
  const { tokenAddress } = useTokenLockConfig()
  const { config } = usePrepareContractWrite({
    address: tokenAddress as `0x${string}`,
    abi: erc20ABI,
    functionName: functionName as any,
    args,
  })
  return useContractWrite(config)
}
