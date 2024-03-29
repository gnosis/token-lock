import {
  BaseContract,
  BigNumber,
  BigNumberish,
  CallOverrides,
  Contract,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  providers,
  Signer,
} from "ethers"
import { Interface } from "ethers/lib/utils"

import * as React from "react"
import { type PublicClient } from "wagmi"
import { type HttpTransport } from "viem"
import {
  erc20ABI,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi"
import { CONTRACT_ADDRESSES } from "../config"
import useChainId from "./useChainId"
import { useEthersProvider } from "./useEthersProvider"

export const TOKEN_LOCK_ABI = [
  {
    type: "function",
    name: "balanceOf",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [
      {
        type: "address",
      },
    ],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "decimals",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "deposit",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "amount",
      },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "depositDeadline",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "lockDuration",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "token",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "address",
      },
    ],
  },
  {
    type: "function",
    name: "name",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "string",
      },
    ],
  },
  {
    type: "function",
    name: "symbol",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "string",
      },
    ],
  },
  {
    type: "function",
    name: "totalSupply",
    constant: true,
    stateMutability: "view",
    payable: false,
    inputs: [],
    outputs: [
      {
        type: "uint256",
      },
    ],
  },
  {
    type: "function",
    name: "withdraw",
    constant: false,
    payable: false,
    inputs: [
      {
        type: "uint256",
        name: "amount",
      },
    ],
    outputs: [],
  },
]

const useTokenLockContract = (
  signerOrProvider?: Signer | providers.Provider | undefined
): TokenLockContract | null => {
  const chainId = useChainId()
  const provider = useEthersProvider({ chainId })

  return React.useMemo(() => {
    return new Contract(
      CONTRACT_ADDRESSES[chainId],
      contractInterface,
      provider
    ) as TokenLockContract
  }, [chainId, provider])
}

export default useTokenLockContract

type Config = { enabled?: boolean; watch?: boolean; args?: any }

export const useTokenLockContractRead = (
  functionName: string,
  config: Config = {}
) => {
  const chainId = useChainId()
  return useContractRead({
    ...config,
    address: CONTRACT_ADDRESSES[chainId] as `0x${string}`,
    abi,
    functionName,
  })
}

export const useTokenLockContractWrite = (
  functionName: string,
  args: any,
  enabled = true
) => {
  const chainId = useChainId()
  const { config, error } = usePrepareContractWrite({
    address: CONTRACT_ADDRESSES[chainId] as `0x${string}`,
    abi,
    functionName: functionName as any,
    args,
    enabled,
  })
  console.log({ error, config })
  return useContractWrite(config)
}

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

const abi = JSON.parse(contractInterface.format("json") as string)

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

export function publicClientToProvider(publicClient: PublicClient) {
  const { chain, transport } = publicClient
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }
  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<HttpTransport>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    )
  return new providers.JsonRpcProvider(transport.url, network)
}
