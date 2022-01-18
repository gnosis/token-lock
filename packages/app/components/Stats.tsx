import { BigNumber } from "ethers"
import { formatToken } from "./Balance"
import Card from "./Card"
import cls from "./Stats.module.css"
import useTokenLockConfig from "./useTokenLockConfig"
import { useTokenLockContractRead } from "./tokenLockContract"

const MILLIS_PER_DAY = 24 * 60 * 60 * 1000

const pluralize = (number: number, unit: string) => {
  const rounded = Math.round(number)
  return `${rounded} ${unit}${rounded === 1 ? "" : "s"}`
}

const closeToFull = (dividend: number, divisor: number, fuzziness = 2) => {
  const remainder = dividend % divisor
  return remainder <= fuzziness || divisor - remainder <= fuzziness
}

const formatDuration = (millis: number) => {
  const days = millis / MILLIS_PER_DAY

  if ((days >= 365 && closeToFull(days, 365)) || days > 3 * 365) {
    return pluralize(days / 365, "Year")
  }

  if ((days >= 30 && closeToFull(days, 30)) || days > 90) {
    return pluralize(days / 30, "Month")
  }

  return pluralize(days, "Day")
}

const Stats: React.FC = () => {
  const config = useTokenLockConfig()
  const [{ data: totalSupply }] = useTokenLockContractRead("totalSupply", {
    watch: true,
  })

  return (
    <Card>
      <dl className={cls.container}>
        <div className={cls.item}>
          <dt>Lock Deadline</dt>
          <dd>
            {new Intl.DateTimeFormat("default", { dateStyle: "medium" }).format(
              config.depositDeadline
            )}
          </dd>
        </div>
        <div className={cls.item}>
          <dt>Lock Duration</dt>
          <dd>{formatDuration(config.lockDuration)}</dd>
        </div>
        {
          <div className={`${cls.item} ${cls.fullWidth}`}>
            <dt>Total GNO Locked</dt>
            <dd>
              {totalSupply
                ? formatToken(
                    totalSupply as unknown as BigNumber,
                    config.decimals
                  )
                : "…"}
            </dd>
          </div>
        }
      </dl>
    </Card>
  )
}

export default Stats
