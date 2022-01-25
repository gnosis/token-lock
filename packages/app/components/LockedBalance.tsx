import Balance from "./Balance"
import Card from "./Card"
import ConnectHint from "./ConnectHint"
import { useConnect } from "wagmi"

const LockedBalance: React.FC = () => {
  const [{ data: { connected }}] = useConnect()

  return (
    <Card>
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
