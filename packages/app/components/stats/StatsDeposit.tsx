import Card from "../Card"
import cls from "./Stats.module.css"
import useTokenLockConfig from "../useTokenLockConfig"
import formatDuration from "./formatDuration"
import TotalLockedStat from "./TotalLockedStat"

const StatsDeposit: React.FC = () => {
  const config = useTokenLockConfig()
  const deadlineIsToday =
    config.depositDeadline.toDateString() === new Date().toDateString()
  return (
    <Card>
      <dl className={cls.container}>
        <div className={cls.item}>
          <dt className={cls.label}>Lock Deadline</dt>
          <dd>
            {new Intl.DateTimeFormat("default", { dateStyle: "medium" }).format(
              config.depositDeadline
            )}

            <div className={cls.time}>
              {deadlineIsToday &&
                new Intl.DateTimeFormat("default", {
                  timeStyle: "long",
                }).format(config.depositDeadline)}
            </div>
          </dd>
        </div>
        <div className={cls.item}>
          <dt className={cls.label}>Lock Duration</dt>
          <dd>{formatDuration(config.lockDuration)}</dd>
        </div>

        <TotalLockedStat />
      </dl>
    </Card>
  )
}

export default StatsDeposit
