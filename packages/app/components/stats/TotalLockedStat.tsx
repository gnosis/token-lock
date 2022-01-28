import { BigNumber } from "ethers"
import { formatToken } from "../Balance"
import cls from "./Stats.module.css"
import useTokenLockConfig from "../useTokenLockConfig"
import { useTokenLockContractRead } from "../tokenLockContract"
import useTotalLocked from "../useTotalLocked"

const TotalLockedStat: React.FC = () => {
  const config = useTokenLockConfig()
  const [totalLocked] = useTotalLocked()

  return (
    <div className={`${cls.item} ${cls.fullWidth}`}>
      <dt>Total GNO Locked</dt>
      <dd>{totalLocked ? formatToken(totalLocked, config.decimals) : "…"}</dd>
    </div>
  )
}

export default TotalLockedStat
