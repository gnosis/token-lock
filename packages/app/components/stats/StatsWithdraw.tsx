import Card from "../Card"
import cls from "./Stats.module.css"
import utility from "../../styles/utility.module.css"
import clsx from "clsx"
import TotalLockedStat from "./TotalLockedStat"

const StatsWithdraw: React.FC = () => (
  <Card>
    <dl className={cls.container}>
      <div className={clsx(cls.item, cls.fullWidth, utility.mt8)}>
        <dt>Unlock Date</dt>
        <dd>Lock Period Over 🎉</dd>
      </div>

      <TotalLockedStat />
    </dl>
  </Card>
)

export default StatsWithdraw
