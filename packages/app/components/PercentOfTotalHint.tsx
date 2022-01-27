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
            ~{formatAmount((percent / 100) * SUPPLY_OF_COW)} $COW. This value
            will go down as more people lock their GNO.
          </p>
          <p>
            Note: 50M $COW are distributed to people committing to hold their
            GNO for the long-term. The following balances are taken into
            account:
          </p>
          <ul>
            <li>
              Total GNO locked on Mainnet:{" "}
              {breakdown.mainnet
                ? formatUnits(breakdown.mainnet, config.decimals)
                : "…"}
            </li>
            <li>
              Total GNO locked on Gnosis Chain:{" "}
              {breakdown.gnosisChain
                ? formatUnits(breakdown.gnosisChain, config.decimals)
                : "…"}
            </li>
            <li>
              Total GNO staked by Gnosis Beacon Chain validators:{" "}
              {breakdown.staked
                ? formatUnits(breakdown.staked, config.decimals)
                : "…"}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default PercentOfTotalHint
