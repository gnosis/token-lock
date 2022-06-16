import { BaseContract, BigNumber, CallOverrides, providers } from "ethers"
import { erc20ABI, useContractRead, useContractWrite, useContract } from "wagmi"
import useTokenLockConfig from "./useTokenLockConfig"

type Config = Parameters<typeof useContractRead>[2]

export const useTokenContract = () => {
  const { tokenAddress } = useTokenLockConfig()

  const tokenContract = useContract<Erc20Contract>({
    addressOrName: tokenAddress,
    contractInterface: erc20ABI,
  })

  return tokenContract
}

export const useTokenContractRead = (functionName: string, config?: Config) => {
  const { tokenAddress } = useTokenLockConfig()
  return useContractRead<Erc20Contract>(
    {
      addressOrName: tokenAddress,
      contractInterface: erc20ABI,
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
  return useContractWrite<Erc20Contract>(
    {
      addressOrName: tokenAddress,
      contractInterface: erc20ABI,
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

  approve(
    spender: string,
    amount: BigNumber,
    overrides?: CallOverrides
  ): providers.TransactionResponse
}
