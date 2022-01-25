import Card from "../Card"
import cls from "./Stats.module.css"
import useTokenLockConfig from "../useTokenLockConfig"
import formatDuration, { pluralize } from "./formatDuration"
import TotalLockedStat from "./TotalLockedStat"

const StatsLocked: React.FC = () => {
  const config = useTokenLockConfig()
  const durationPassed = Date.now() - config.depositDeadline.getTime()

  const hoursRemaining = (config.lockDuration - durationPassed) / 1000 / 60 / 60
  const daysRemaining = Math.round(
    (config.lockDuration - durationPassed) / 1000 / 60 / 60 / 24
  )

  return (
    <Card>
      <dl className={cls.container}>
        <div className={cls.item}>
          <dt>Unlock Date</dt>
          <dd>
            {new Intl.DateTimeFormat("default", { dateStyle: "medium" }).format(
              new Date(config.depositDeadline.getTime() + config.lockDuration)
            )}
          </dd>
        </div>
        <div className={cls.item}>
          <dt>Time remaining</dt>
          <dd>
            {hoursRemaining <= 48
              ? pluralize(hoursRemaining, "Hour")
              : `${daysRemaining} Days`}
          </dd>
        </div>

        <TotalLockedStat />
      </dl>
    </Card>
  )
}

export default StatsLocked
