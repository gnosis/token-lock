import { BigNumber } from "ethers"
import cls from "./TotalLockedBreakdown.module.css"
import useTokenLockConfig from "../useTokenLockConfig"
import useTotalLocked from "../useTotalLocked"
import { formatToken } from "./formatToken"

const TotalLockedBreakdown: React.FC<{ balance?: BigNumber }> = () => {
  const config = useTokenLockConfig()
  const [totalLocked, breakdown] = useTotalLocked()

  return (
    <div className={cls.infoBubble}>
      <img src="/info.svg" alt="Show details" title="Show details" />
      <div className={cls.dropdown}>
        <dl className={cls.breakdown}>
          <div>
            <dt>GNO locked on Mainnet:</dt>
            <dd>
              {breakdown.mainnet
                ? formatToken(breakdown.mainnet, config.decimals)
                : "…"}
            </dd>
          </div>
          <div>
            <dt>GNO locked on Gnosis Chain:</dt>
            <dd>
              {breakdown.gnosisChain
                ? formatToken(breakdown.gnosisChain, config.decimals)
                : "…"}
            </dd>
          </div>
          <div>
            <dt>GNO staked by Gnosis Beacon Chain validators:</dt>
            <dd>
              {breakdown.staked
                ? formatToken(breakdown.staked, config.decimals)
                : "…"}
            </dd>
          </div>
          <div className={cls.total}>
            <dt>Total locked GNO:</dt>
            <dd>
              {totalLocked ? formatToken(totalLocked, config.decimals) : "…"}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default TotalLockedBreakdown
