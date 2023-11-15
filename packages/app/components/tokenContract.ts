import { BaseContract, BigNumber, CallOverrides } from "ethers"
import { erc20ABI, useContractRead, useContractWrite } from "wagmi"
import useTokenLockConfig from "./useTokenLockConfig"

type Config = Parameters<typeof useContractRead>[2]

export const useTokenContractRead = (functionName: string, config?: Config) => {
  const { tokenAddress } = useTokenLockConfig()
  return useContractRead<Erc20Contract>(
    {
      ...config,
      address: tokenAddress,
      abi: erc20ABI,
      functionName,
    },
  )
}

export const useTokenContractWrite = (
  functionName: string,
  config?: Parameters<typeof useContractWrite>[2]
) => {
  const { tokenAddress } = useTokenLockConfig()
  return useContractWrite<Erc20Contract>(
    {
      ...config,
      address: tokenAddress,
      abi: erc20ABI,
      functionName,
    },

  )
}

interface Erc20Contract extends BaseContract {
  balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>

  decimals(overrides?: CallOverrides): Promise<BigNumber>

  name(overrides?: CallOverrides): Promise<string>

  symbol(overrides?: CallOverrides): Promise<string>

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>
}
