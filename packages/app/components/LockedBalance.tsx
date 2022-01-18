import Balance from "./Balance"
import Card from "./Card"

const LockedBalance: React.FC = () => (
  <Card>
    <Balance lockToken label="Your Locked Balance" />
  </Card>
)

export default LockedBalance
