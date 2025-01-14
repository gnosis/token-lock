import { BigNumber } from "ethers"
import { useEffect, useMemo, useState } from "react"
import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { CONTRACT_ADDRESSES } from "../config"
import Balance from "./Balance"
import Button from "./Button"
import Card from "./Card"
import AmountInput from "./AmountInput"
import Spinner from "./Spinner"
import { useTokenContractRead } from "./tokenContract"
import useTokenLockConfig from "./useTokenLockConfig"
import utility from "../styles/utility.module.css"
import Notice from "./Notice"
import { erc20Abi } from "viem"
import { TOKEN_LOCK_ABI } from "../abi/tokenLock"

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

  const balance =
    balanceOf === undefined ? undefined : BigNumber.from(balanceOf)

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
    data: hash,
    error: txError,
    isPending,
    writeContract,
  } = useWriteContract()
  const { tokenAddress } = useTokenLockConfig()

  function approve() {
    writeContract({
      address: tokenAddress as `0x${string}`,
      abi: erc20Abi,
      functionName: "approve",
      args: [contractAddress as `0x${string}`, amount?.toBigInt() || BigInt(0)],
    })
  }

  const approveWait = useWaitForTransactionReceipt({
    hash: hash,
  })

  function deposit() {
    writeContract({
      address: CONTRACT_ADDRESSES[chainId] as `0x${string}`,
      abi: TOKEN_LOCK_ABI,
      functionName: "deposit",
      args: [amount?.toBigInt()],
    })
  }

  const depositWait = useWaitForTransactionReceipt({
    hash: hash,
  })

  const needsAllowance =
    amount && amount.gt(0) && allowance && BigNumber.from(allowance).lt(amount)

  const approvePending = isPending || approveWait.isLoading
  const depositPending = isPending || depositWait.isLoading

  const error = txError || approveWait.error || depositWait.error

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
