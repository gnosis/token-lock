import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import { useAccount, useWaitForTransaction } from "wagmi"
import Balance from "./Balance"
import Button from "./Button"
import Card from "./Card"
import AmountInput from "./AmountInput"
import Spinner from "./Spinner"
import utility from "../styles/utility.module.css"
import {
  useTokenLockContractRead,
  useTokenLockContractWrite,
} from "./tokenLockContract"
import useTokenLockConfig from "./useTokenLockConfig"
import Notice from "./Notice"

const Withdraw: React.FC = () => {
  const [amount, setAmount] = useState<BigNumber | undefined>(undefined)

  const [dismissedErrors, setDismissedErrors] = useState<Error[]>([])

  const { decimals, tokenSymbol } = useTokenLockConfig()
  const accountData = useAccount()
  const { data: balanceOf } = useTokenLockContractRead("balanceOf", {
    args: [accountData.address],
    enabled: !!accountData?.address,
    watch: true,
  })

  const balance = balanceOf as undefined | BigNumber

  const {
    isLoading,
    error: withdrawError,
    write: withdraw,
    data,
  } = useTokenLockContractWrite("withdraw", [amount])
  const wait = useWaitForTransaction({
    hash: data?.hash,
  })

  const pending = isLoading || wait.isLoading
  const error = withdrawError || wait.error

  // clear input after successful deposit
  const withdrawnBlock = wait.data?.blockHash
  useEffect(() => {
    if (withdrawnBlock) {
      setAmount(undefined)
    }
  }, [withdrawnBlock])

  return (
    <Card>
      <Balance lockToken label="Locked Balance" />
      <AmountInput
        name="withdrawAmount"
        value={amount}
        max={balance}
        className={utility.mt4}
        decimals={decimals}
        onChange={setAmount}
        disabled={pending}
        unit="LGNO"
        meta={
          <Button
            link
            disabled={!balance || balance.isZero() || pending}
            onClick={() => {
              if (balance) {
                setAmount(balance)
              }
            }}
          >
            Unlock Max
          </Button>
        }
      />

      <Button
        primary
        disabled={
          !amount ||
          amount.isZero() ||
          (balance && amount.gt(balance)) ||
          pending
        }
        onClick={() => {
          if (!withdraw) throw new Error("withdraw is undefined")
          withdraw()
        }}
      >
        Unlock {tokenSymbol}
        {pending && <Spinner />}
      </Button>

      <Balance className={utility.mt8} label="GNO Balance" />

      {error && !dismissedErrors.includes(error) && (
        <Notice
          onDismiss={() => {
            setDismissedErrors([...dismissedErrors, error])
          }}
        >
          {error.message}
        </Notice>
      )}
    </Card>
  )
}

export default Withdraw
