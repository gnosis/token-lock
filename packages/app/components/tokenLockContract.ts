import {
  BaseContract,
  BigNumber,
  BigNumberish,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  providers,
  Signer,
} from "ethers"
import { Interface } from "ethers/lib/utils"
import { useContract, useContractRead, useContractWrite,  } from "wagmi"
import { CONTRACT_ADDRESSES } from "../config"
import useChainId from "./useChainId"

const useTokenLockContract = (
  signerOrProvider?: Signer | providers.Provider | undefined
): TokenLockContract => {
  const chainId = useChainId()

  return useContract({
    address: CONTRACT_ADDRESSES[chainId],
    abi: ABI,
    signerOrProvider,
  })
}

export default useTokenLockContract

export const useTokenLockContractRead = (
  functionName: string,
  config?: Parameters<typeof useContractRead>[2]
) => {
  const chainId = useChainId()
  return useContractRead<TokenLockContract>(
    {
      ...config,
      address: CONTRACT_ADDRESSES[chainId],
      abi: ABI,
      functionName,
    },
  )
}

export const useTokenLockContractWrite = (
  functionName: string,
  config?: Parameters<typeof useContractWrite>[2]
) => {
  const chainId = useChainId()
  return useContractWrite<TokenLockContract>(
    {
      ...config,
      address: CONTRACT_ADDRESSES[chainId],
      abi: ABI,
      functionName,
    }
  )
}

const ABI = [{"inputs":[],"name":"DepositPeriodOver","type":"error"},{"inputs":[],"name":"ExceedsBalance","type":"error"},{"inputs":[],"name":"LockPeriodOngoing","type":"error"},{"inputs":[],"name":"NotSupported","type":"error"},{"inputs":[],"name":"TransferFailed","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"depositDeadline","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_depositDeadline","type":"uint256"},{"internalType":"uint256","name":"_lockDuration","type":"uint256"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"lockDuration","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token","outputs":[{"internalType":"contract ERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]

const contractInterface = new Interface([
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint256)",
  "function deposit(uint256 amount)",
  "function depositDeadline() view returns (uint256)",
  "function lockDuration() view returns (uint256)",
  "function token() view returns (address)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function withdraw(uint256 amount)",
])
export interface TokenLockContract extends BaseContract {
  functions: {
    balanceOf(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>

    decimals(overrides?: CallOverrides): Promise<[BigNumber]>

    deposit(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>

    depositDeadline(overrides?: CallOverrides): Promise<[BigNumber]>

    lockDuration(overrides?: CallOverrides): Promise<[BigNumber]>

    token(overrides?: CallOverrides): Promise<[string]>

    name(overrides?: CallOverrides): Promise<[string]>

    symbol(overrides?: CallOverrides): Promise<[string]>

    totalSupply(overrides?: CallOverrides): Promise<[BigNumber]>

    withdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>
  }

  balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>

  decimals(overrides?: CallOverrides): Promise<BigNumber>

  deposit(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  depositDeadline(overrides?: CallOverrides): Promise<BigNumber>

  lockDuration(overrides?: CallOverrides): Promise<BigNumber>

  token(overrides?: CallOverrides): Promise<string>

  name(overrides?: CallOverrides): Promise<string>

  symbol(overrides?: CallOverrides): Promise<string>

  totalSupply(overrides?: CallOverrides): Promise<BigNumber>

  withdraw(
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>

  callStatic: {
    balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>

    decimals(overrides?: CallOverrides): Promise<BigNumber>

    deposit(amount: BigNumberish, overrides?: CallOverrides): Promise<void>

    depositDeadline(overrides?: CallOverrides): Promise<BigNumber>

    lockDuration(overrides?: CallOverrides): Promise<BigNumber>

    token(overrides?: CallOverrides): Promise<string>

    name(overrides?: CallOverrides): Promise<string>

    symbol(overrides?: CallOverrides): Promise<string>

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>

    withdraw(amount: BigNumberish, overrides?: CallOverrides): Promise<void>
  }

  estimateGas: {
    balanceOf(arg0: string, overrides?: CallOverrides): Promise<BigNumber>

    decimals(overrides?: CallOverrides): Promise<BigNumber>

    deposit(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>

    depositDeadline(overrides?: CallOverrides): Promise<BigNumber>

    lockDuration(overrides?: CallOverrides): Promise<BigNumber>

    token(overrides?: CallOverrides): Promise<BigNumber>

    name(overrides?: CallOverrides): Promise<BigNumber>

    symbol(overrides?: CallOverrides): Promise<BigNumber>

    totalSupply(overrides?: CallOverrides): Promise<BigNumber>

    withdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>
  }

  populateTransaction: {
    balanceOf(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>

    deposit(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>

    depositDeadline(overrides?: CallOverrides): Promise<PopulatedTransaction>

    lockDuration(overrides?: CallOverrides): Promise<PopulatedTransaction>

    token(overrides?: CallOverrides): Promise<PopulatedTransaction>

    name(overrides?: CallOverrides): Promise<PopulatedTransaction>

    symbol(overrides?: CallOverrides): Promise<PopulatedTransaction>

    totalSupply(overrides?: CallOverrides): Promise<PopulatedTransaction>

    withdraw(
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>
  }
}
