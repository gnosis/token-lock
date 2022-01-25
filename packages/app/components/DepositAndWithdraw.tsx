import cn from "classnames"
import { useState } from "react"
import Deposit from "./Deposit"
import Withdraw from "./Withdraw"
import cls from "./DepositAndWithdraw.module.css"

const DepositAndWithdraw: React.FC<{}> = () => {
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit")
  return (
    <div>
      <div className={cls.header}>
        <button
          className={cn(cls.title, activeTab === "deposit" && cls.active)}
          onClick={() => setActiveTab("deposit")}
        >
          Lock
        </button>
        <button
          className={cn(cls.title, activeTab === "withdraw" && cls.active)}
          onClick={() => setActiveTab("withdraw")}
        >
          Unlock
        </button>
      </div>
      <div>
        {activeTab === "deposit" && <Deposit />}
        {activeTab === "withdraw" && <Withdraw />}
      </div>
    </div>
  )
}

export default DepositAndWithdraw
