import { BigNumber, providers } from "ethers"
import { erc20ABI, useContractRead } from "wagmi"
import { CHAINS, CONTRACT_ADDRESSES } from "../config"

interface Breakdown {
  mainnet?: BigNumber
  gnosisChain?: BigNumber
  staked?: BigNumber
}

const mainnetProvider = new providers.StaticJsonRpcProvider(
  CHAINS.find((chain) => chain.id === 1)?.rpcUrls[0],
  1
)
const gnosisChainProvider = new providers.StaticJsonRpcProvider(
  CHAINS.find((chain) => chain.id === 100)?.rpcUrls[0],
  100
)

const GNO_ON_MAINNET = "0x6810e776880c02933d47db1b9fc05908e5386b96"
const GNO_ON_GNOSIS_CHAIN = "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb"
const GNO_TO_MGNO = "0x647507A70Ff598F386CB96ae5046486389368C66"

const useTotalLocked = (): [BigNumber | undefined, Breakdown] => {
  const [{ data: gnoLockedOnMainnetData }] = useContractRead(
    {
      addressOrName: GNO_ON_MAINNET,
      contractInterface: erc20ABI,
      signerOrProvider: mainnetProvider,
    },
    "balanceOf",
    {
      args: CONTRACT_ADDRESSES[1],
    }
  )

  const [{ data: gnoLockedOnGnosisChainData }] = useContractRead(
    {
      addressOrName: GNO_ON_GNOSIS_CHAIN,
      contractInterface: erc20ABI,
      signerOrProvider: gnosisChainProvider,
    },
    "balanceOf",
    {
      args: CONTRACT_ADDRESSES[100],
    }
  )

  const [{ data: gnoStakedData }] = useContractRead(
    {
      addressOrName: GNO_ON_GNOSIS_CHAIN,
      contractInterface: erc20ABI,
      signerOrProvider: gnosisChainProvider,
    },
    "balanceOf",
    {
      args: GNO_TO_MGNO,
    }
  )

  const gnoLockedOnMainnet = gnoLockedOnMainnetData as BigNumber | undefined
  const gnoLockedOnGnosisChain = gnoLockedOnGnosisChainData as
    | BigNumber
    | undefined
  const gnoStaked = gnoStakedData as BigNumber | undefined

  return [
    gnoLockedOnMainnet &&
      gnoLockedOnGnosisChain &&
      gnoStaked &&
      gnoLockedOnMainnet.add(gnoLockedOnGnosisChain).add(gnoStaked),
    {
      mainnet: gnoLockedOnMainnet,
      gnosisChain: gnoLockedOnGnosisChain,
      staked: gnoStaked,
    },
  ]
}

export default useTotalLocked
