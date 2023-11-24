import { BigNumber } from "ethers"
import { erc20ABI, useContractRead } from "wagmi"
import { CHAINS, CONTRACT_ADDRESSES } from "../config"

interface Breakdown {
  mainnet?: BigNumber
  gnosisChain?: BigNumber
  staked?: BigNumber
}

const GNO_ON_MAINNET = "0x6810e776880c02933d47db1b9fc05908e5386b96"
const GNO_ON_GNOSIS_CHAIN = "0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb"
const GNO_TO_MGNO = "0x647507A70Ff598F386CB96ae5046486389368C66"

const useTotalLocked = (): [BigNumber | undefined, Breakdown] => {
  const { data: gnoLockedOnMainnetData } = useContractRead({
    address: GNO_ON_MAINNET,
    abi: erc20ABI,
    chainId: 1,
    functionName: "balanceOf",
    args: [CONTRACT_ADDRESSES[1] as `0x${string}`],
  })

  const { data: gnoLockedOnGnosisChainData } = useContractRead({
    address: GNO_ON_GNOSIS_CHAIN,
    abi: erc20ABI,
    chainId: 100,
    functionName: "balanceOf",
    args: [CONTRACT_ADDRESSES[100] as `0x${string}`],
  })

  const { data: gnoStakedData } = useContractRead({
    address: GNO_ON_GNOSIS_CHAIN,
    abi: erc20ABI,
    chainId: 100,
    functionName: "balanceOf",
    args: [GNO_TO_MGNO as `0x${string}`],
  })

  const gnoLockedOnMainnet =
    gnoLockedOnMainnetData === undefined
      ? undefined
      : BigNumber.from(gnoLockedOnMainnetData)
  const gnoLockedOnGnosisChain =
    gnoLockedOnGnosisChainData === undefined
      ? undefined
      : BigNumber.from(gnoLockedOnGnosisChainData)
  const gnoStaked =
    gnoStakedData === undefined ? undefined : BigNumber.from(gnoStakedData)

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
