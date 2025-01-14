"use client"
import { CONTRACT_ADDRESSES } from "@/config"
import { createContext, useContext, useEffect, useState } from "react"
import { useChainId, useReadContract } from "wagmi"
import { TOKEN_LOCK_ABI } from "../abi/tokenLock"
import { erc20Abi } from "viem"

interface TokeLockConfig {
  depositDeadline: Date
  lockDuration: number
  tokenAddress: string
  tokenName: string
  tokenSymbol: string
  lockTokenName: string
  lockTokenSymbol: string
  decimals: number
}

const ConfigContext = createContext<TokeLockConfig | null>(null)

export const ProvideConfig: React.FC = ({ children }) => {
  const [state, setState] = useState<TokeLockConfig | null>(null)
  const chainId = useChainId()
  const tokenLockContractAddress = CONTRACT_ADDRESSES[chainId]

  const { data: depositDeadline } = useReadContract({
    address: tokenLockContractAddress,
    abi: TOKEN_LOCK_ABI,
    functionName: "depositDeadline",
  })

  const { data: lockDuration } = useReadContract({
    address: tokenLockContractAddress,
    abi: TOKEN_LOCK_ABI,
    functionName: "lockDuration",
  })

  const { data: tokenAddress } = useReadContract({
    address: tokenLockContractAddress,
    abi: TOKEN_LOCK_ABI,
    functionName: "token",
  })

  const { data: lockTokenName } = useReadContract({
    address: tokenLockContractAddress,
    abi: TOKEN_LOCK_ABI,
    functionName: "name",
  })

  const { data: lockTokenSymbol } = useReadContract({
    address: tokenLockContractAddress,
    abi: TOKEN_LOCK_ABI,
    functionName: "symbol",
  })

  const { data: decimals } = useReadContract({
    address: tokenLockContractAddress,
    abi: TOKEN_LOCK_ABI,
    functionName: "decimals",
  })

  const { data: tokenName } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "name",
    query: { enabled: !!tokenAddress },
  })

  const { data: tokenSymbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20Abi,
    functionName: "symbol",
    query: { enabled: !!tokenAddress },
  })

  useEffect(() => {
    if (
      depositDeadline &&
      lockDuration &&
      tokenAddress &&
      lockTokenName &&
      lockTokenSymbol &&
      decimals &&
      tokenName &&
      tokenSymbol
    ) {
      setState({
        depositDeadline: new Date(Number(depositDeadline) * 1000),
        lockDuration: Number(lockDuration) * 1000,
        tokenAddress: tokenAddress as string,
        tokenName: tokenName as string,
        tokenSymbol: tokenSymbol as string,
        lockTokenName: lockTokenName as string,
        lockTokenSymbol: lockTokenSymbol as string,
        decimals: Number(decimals),
      })
    }
  }, [
    depositDeadline,
    lockDuration,
    tokenAddress,
    lockTokenName,
    lockTokenSymbol,
    decimals,
    tokenName,
    tokenSymbol,
  ])

  if (!state) {
    return null
  }

  return (
    <ConfigContext.Provider value={state}>{children}</ConfigContext.Provider>
  )
}

const useTokenLockConfig = () => {
  const config = useContext(ConfigContext)
  if (!config) {
    throw new Error("Must be wrapped in <ProvideConfig>")
  }
  return config
}

export default useTokenLockConfig
