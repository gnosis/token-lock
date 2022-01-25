import Card from "../Card"
import cls from "./Stats.module.css"
import TotalLockedStat from "./TotalLockedStat"

const StatsWithdraw: React.FC = () => (
  <Card>
    <dl className={cls.container}>
      <div className={`${cls.item} ${cls.fullWidth}`}>
        <dt>Unlock Date</dt>
        <dd>Lock Period Over 🎉</dd>
      </div>

      <TotalLockedStat />
    </dl>
  </Card>
)

export default StatsWithdraw
