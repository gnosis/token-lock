import { Contract } from "ethers"
import { Interface } from "ethers/lib/utils"
import { createContext, useContext, useEffect, useState } from "react"
import { useProvider } from "wagmi"
import useChainId from "./useChainId"
import useTokenLockContract from "./tokenLockContract"

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
  const provider = useProvider()
  const tokenLockContract = useTokenLockContract(provider)

  useEffect(() => {
    if (!tokenLockContract) return

    Promise.all([
      tokenLockContract.depositDeadline(),
      tokenLockContract.lockDuration(),
      tokenLockContract.token().then((tokenAddress) => {
        const tokenContract = new Contract(
          tokenAddress,
          erc20Interface,
          provider
        )
        return Promise.all([
          tokenAddress,
          tokenContract.name(),
          tokenContract.symbol(),
        ])
      }),
      tokenLockContract.name(),
      tokenLockContract.symbol(),
      tokenLockContract.decimals(),
    ]).then(
      ([
        depositDeadline,
        lockDuration,
        [tokenAddress, tokenName, tokenSymbol],
        lockTokenName,
        lockTokenSymbol,
        decimals,
      ]) => {
        setState({
          depositDeadline: new Date(depositDeadline.toNumber() * 1000),
          lockDuration: lockDuration.toNumber() * 1000,
          tokenAddress,
          tokenName,
          tokenSymbol,
          lockTokenName,
          lockTokenSymbol,
          decimals: decimals.toNumber(),
        })
      }
    )
  }, [tokenLockContract, chainId, provider])

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

const erc20Interface = new Interface([
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint256)",
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
])
