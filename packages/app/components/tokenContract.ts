import { BaseContract, BigNumber, CallOverrides, providers } from "ethers"
import { useMemo } from "react"
import { erc20ABI, useContractRead, useContractWrite, useProvider } from "wagmi"
import { CHAINS } from "../config"
import useTokenLockConfig from "./useTokenLockConfig"

type Config = Parameters<typeof useContractRead>[2] & {
  chainId?: number
}

export const useTokenContractRead = (functionName: string, config?: Config) => {
  const { chainId } = config || {}
  const { tokenAddress } = useTokenLockConfig()

  const defaultProvider = useProvider()
  const provider = useMemo(() => {
    if (!chainId) return defaultProvider

    return new providers.StaticJsonRpcProvider(
      CHAINS.find((chain) => chain.id === chainId)?.rpcUrls[0],
      chainId
    )
  }, [chainId, defaultProvider])

  return useContractRead<Erc20Contract>(
    {
      addressOrName: tokenAddress,
      contractInterface: erc20ABI,
      signerOrProvider: provider,
    },
    functionName,
    config
  )
}

export const useTokenContractWrite = (
  functionName: string,
  config?: Parameters<typeof useContractWrite>[2]
) => {
  const { tokenAddress } = useTokenLockConfig()
  // const provider = useProvider();
  return useContractWrite<Erc20Contract>(
    {
      addressOrName: tokenAddress,
      contractInterface: erc20ABI,
      // signerOrProvider: provider,
    },
    functionName,
    config
  )
}

interface Erc20Contract extends BaseContract {
  balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>

  decimals(overrides?: CallOverrides): Promise<BigNumber>

  name(overrides?: CallOverrides): Promise<string>

  symbol(overrides?: CallOverrides): Promise<string>

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>
}
