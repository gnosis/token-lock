import Balance from "./Balance"
import Card from "./Card"
import ConnectHint from "./ConnectHint"
import utility from "../styles/utility.module.css"
import { useConnect } from "wagmi"

const LockedBalance: React.FC = () => {
  const [{ data: { connected }}] = useConnect()

  return (
    <Card className={utility.pb8}>
      {!connected ? (
          <ConnectHint />
        ) : (
          <Balance lockToken label="Balance" />
        )
      }
    </Card>
  )
}

export default LockedBalance
