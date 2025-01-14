import { BigNumber } from "ethers"
import cls from "./PercentOfTotal.module.css"
import useTotalLocked from "./useTotalLocked"

const SUPPLY_OF_COW = 50000000

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 6,
  }).format(amount)

const PercentOfTotalHint: React.FC<{ balance?: BigNumber }> = ({ balance }) => {
  const [totalLocked] = useTotalLocked()

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
            their GNO long-term.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PercentOfTotalHint
