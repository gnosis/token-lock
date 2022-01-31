import { BigNumber } from "ethers"
import { CONTRACT_ADDRESSES } from "../config"
import { useTokenContractRead } from "./tokenContract"

interface Breakdown {
  mainnet?: BigNumber
  gnosisChain?: BigNumber
  staked?: BigNumber
}

const useTotalLocked = (): [BigNumber | undefined, Breakdown] => {
  const [{ data: gnoLockedOnMainnetData }] = useTokenContractRead("balanceOf", {
    args: CONTRACT_ADDRESSES[1],
    chainId: 1,
    watch: true,
  })
  const [{ data: gnoLockedOnGnosisChainData }] = useTokenContractRead(
    "balanceOf",
    {
      args: CONTRACT_ADDRESSES[100],
      chainId: 100,
      watch: true,
    }
  )
  const [{ data: gnoStakedData }] = useTokenContractRead("balanceOf", {
    args: "0x722fc4DAABFEaff81b97894fC623f91814a1BF68", // mGNO contract
    chainId: 100,
    watch: true,
  })

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
