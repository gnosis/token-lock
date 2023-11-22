import { BigNumber } from "ethers"
import { useEffect, useMemo, useState } from "react"
import { useAccount, useWaitForTransaction } from "wagmi"
import { CONTRACT_ADDRESSES } from "../config"
import Balance from "./Balance"
import Button from "./Button"
import Card from "./Card"
import AmountInput from "./AmountInput"
import Spinner from "./Spinner"
import { useTokenContractRead, useTokenContractWrite } from "./tokenContract"
import { useTokenLockContractWrite } from "./tokenLockContract"
import useChainId from "./useChainId"
import useTokenLockConfig from "./useTokenLockConfig"
import utility from "../styles/utility.module.css"
import Notice from "./Notice"

const Deposit: React.FC = () => {
  const [amount, setAmount] = useState<BigNumber | undefined>(undefined)

  const [dismissedErrors, setDismissedErrors] = useState<Error[]>([])

  const chainId = useChainId()
  const { decimals, tokenSymbol } = useTokenLockConfig()
  const accountData = useAccount()
  const { data: balanceOf } = useTokenContractRead("balanceOf", {
    args: [accountData?.address],
    enabled: !!accountData?.address,
    watch: true,
  })

  const balance = balanceOf as undefined | BigNumber

  const contractAddress = CONTRACT_ADDRESSES[chainId]
  const allowanceArgs = useMemo(
    () => [accountData?.address, contractAddress],
    [accountData?.address, contractAddress]
  )
  const { data: allowance } = useTokenContractRead("allowance", {
    args: allowanceArgs,
    enabled: !!accountData?.address,
    watch: true,
  })

  const {
    isLoading: approveLoading,
    write: approve,
    data: approveData,
    error: approveError,
  } = useTokenContractWrite("approve", [contractAddress, amount])
  const approveWait = useWaitForTransaction({
    hash: approveData?.hash,
  })
  const {
    isLoading: depositLoading,
    write: deposit,
    writeAsync: depositAsync,
    data: depositData,
    error: depositError,
  } = useTokenLockContractWrite("deposit", [amount])
  const depositWait = useWaitForTransaction({
    hash: depositData?.hash,
  })

  const needsAllowance =
    amount && amount.gt(0) && allowance && BigNumber.from(allowance).lt(amount)

  const approvePending = approveLoading || approveWait.isLoading
  const depositPending = depositLoading || depositWait.isLoading

  const error =
    approveError || approveWait.error || depositError || depositWait.error

  // clear input after successful deposit
  const depositedBlock = depositWait.data?.blockHash
  useEffect(() => {
    if (depositedBlock) {
      setAmount(undefined)
    }
  }, [depositedBlock])

  return (
    <Card>
      <Balance label="Balance" />
      <AmountInput
        name="depositAmount"
        unit="GNO"
        className={utility.mt4}
        value={amount}
        max={balance}
        decimals={decimals}
        onChange={setAmount}
        disabled={approvePending || depositPending}
        meta={
          <Button
            link
            disabled={
              !balance || balance.isZero() || approvePending || depositPending
            }
            onClick={() => {
              if (balance) {
                setAmount(balance)
              }
            }}
          >
            Lock Max
          </Button>
        }
      />
      {needsAllowance ? (
        <Button
          primary
          disabled={
            amount.isZero() || (balance && amount.gt(balance)) || approvePending
          }
          onClick={() => {
            if (!approve) throw new Error("approve is undefined")
            approve()
          }}
        >
          Allow locking contract to use your {tokenSymbol}
          {approvePending && <Spinner />}
        </Button>
      ) : (
        <Button
          primary
          disabled={
            !amount ||
            amount.isZero() ||
            (balance && amount.gt(balance)) ||
            depositPending ||
            !deposit
          }
          onClick={async () => {
            if (!deposit) throw new Error("deposit is undefined")
            deposit()
          }}
        >
          Lock {tokenSymbol}
          {depositPending && <Spinner />}
        </Button>
      )}

      <Balance className={utility.mt8} lockToken label="Locked Balance" />

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

export default Deposit
