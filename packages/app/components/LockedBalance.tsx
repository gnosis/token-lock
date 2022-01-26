import Balance from "./Balance"
import Card from "./Card"
import utility from "../styles/utility.module.css"

const LockedBalance: React.FC = () => (
  <Card className={utility.pb8}>
    <Balance lockToken label="Balance" />
  </Card>
)

export default LockedBalance
