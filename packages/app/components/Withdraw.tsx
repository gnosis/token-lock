import { BigNumber } from "ethers"
import { useEffect, useState } from "react"
import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import Balance from "./Balance"
import Button from "./Button"
import Card from "./Card"
import AmountInput from "./AmountInput"
import Spinner from "./Spinner"
import utility from "../styles/utility.module.css"
import {
  useTokenLockContractRead,
} from "./tokenLockContract"
import useTokenLockConfig from "./useTokenLockConfig"
import Notice from "./Notice"
import { CONTRACT_ADDRESSES } from "../config"
import { TOKEN_LOCK_ABI } from "../abi/tokenLock"

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

  const balance =
    balanceOf === undefined ? undefined : BigNumber.from(balanceOf)

  const {
    data: hash,
    error: txError,
    isPending,
    writeContract,
  } = useWriteContract()

  const chainId = useChainId()
  function withdraw() {
    writeContract({
      address: CONTRACT_ADDRESSES[chainId] as `0x${string}`,
      abi: TOKEN_LOCK_ABI,
      functionName: "withdraw",
      args: [amount?.toBigInt()],
    })
  }

  const wait = useWaitForTransactionReceipt({
    hash: hash,
  })

  const pending = isPending || wait.isLoading
  const error = txError || wait.error

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
          pending ||
          !withdraw
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
