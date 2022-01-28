import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import cls from "./PercentOfTotal.module.css"
import useTokenLockConfig from "./useTokenLockConfig"
import useTotalLocked from "./useTotalLocked"

const SUPPLY_OF_COW = 50000000

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 6,
  }).format(amount)

const PercentOfTotalHint: React.FC<{ balance?: BigNumber }> = ({ balance }) => {
  const config = useTokenLockConfig()
  const [totalLocked, breakdown] = useTotalLocked()

  const percent =
    balance && totalLocked && totalLocked.gt(0)
      ? balance.mul(100).mul(1e4).div(totalLocked).toNumber() / 1e4 // precision to 4 decimal places
      : 0

  if (percent === 0) return null

  return (
    <div className={cls.container}>
      {percent}% of total
      <div className={cls.infoBubble}>
        <img src="/info.svg" alt="Learn more" />
        <div className={cls.dropdown}>
          <p>
            Your current share of the total locked GNO would give you a grant of
            <strong>
              ~{formatAmount((percent / 100) * SUPPLY_OF_COW)} $COW.
            </strong>{" "}
            This value will go down as more people lock their GNO.
          </p>
          <p>
            A total of 50M $COW are distributed to people committing to hold
            their GNO long-term. The following balances are taken into account:
          </p>
          <dl className={cls.breakdown}>
            <div>
              <dt>GNO locked on Mainnet:</dt>
              <dd>
                {breakdown.mainnet
                  ? formatUnits(breakdown.mainnet, config.decimals)
                  : "…"}
              </dd>
            </div>
            <div>
              <dt>GNO locked on Gnosis Chain:</dt>
              <dd>
                {breakdown.gnosisChain
                  ? formatUnits(breakdown.gnosisChain, config.decimals)
                  : "…"}
              </dd>
            </div>
            <div>
              <dt>GNO staked by Gnosis Beacon Chain validators:</dt>
              <dd>
                {breakdown.staked
                  ? formatUnits(breakdown.staked, config.decimals)
                  : "…"}
              </dd>
            </div>
            <div className={cls.total}>
              <dt>Total locked GNO:</dt>
              <dd>
                {totalLocked ? formatUnits(totalLocked, config.decimals) : "…"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default PercentOfTotalHint
