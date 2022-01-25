import { BigNumber } from "ethers"
import { useMemo, useState } from "react"
import { useConnect, useAccount } from "wagmi"
import { CONTRACT_ADDRESSES } from "../config"
import Balance from "./Balance"
import Button from "./Button"
import Card from "./Card"
import ConnectHint from "./ConnectHint"
import AmountInput from "./AmountInput"
import Spinner from "./Spinner"
import { useTokenContractRead, useTokenContractWrite } from "./tokenContract"
import { useTokenLockContractWrite } from "./tokenLockContract"
import useChainId from "./useChainId"
import useTokenLockConfig from "./useTokenLockConfig"

const Deposit: React.FC = () => {
  const [amount, setAmount] = useState<BigNumber | undefined>(undefined)

  const chainId = useChainId()
  const { decimals, tokenSymbol } = useTokenLockConfig()
  const [{ data: accountData }] = useAccount()
  const [{ data: balanceOf }] = useTokenContractRead("balanceOf", {
    args: accountData?.address,
    skip: !accountData?.address,
    watch: true,
  })
  const [{ data: { connected }}] = useConnect()
  const balance = balanceOf as undefined | BigNumber

  const contractAddress = CONTRACT_ADDRESSES[chainId]
  const allowanceArgs = useMemo(
    () => [accountData?.address, contractAddress],
    [accountData?.address, contractAddress]
  )
  const [{ data: allowance }] = useTokenContractRead("allowance", {
    args: allowanceArgs,
    skip: !accountData?.address,
    watch: true,
  })

  const [approvePending, setApprovePending] = useState(false)

  const [approveStatus, approve] = useTokenContractWrite("approve")
  const [depositStatus, deposit] = useTokenLockContractWrite("deposit")

  const needsAllowance =
    amount && amount.gt(0) && allowance && allowance.lt(amount)

  return (
    <Card>
      <Balance label="Balance" />
      <AmountInput
        unit="GNO"
        id="lockMax"
        value={amount}
        decimals={decimals}
        onChange={setAmount}
        meta={
          <Button
            link
            disabled={!balance || balance.isZero()}
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
      {!connected ? (
        <ConnectHint />
      ) : needsAllowance ? (
        <Button
          primary
          disabled={amount.isZero() || approvePending}
          onClick={async () => {
            setApprovePending(true)
            const { data, error } = await approve({
              args: [contractAddress, amount],
            })
            if (data) {
              await data.wait()
            }
            setApprovePending(false)
          }}
        >
          Allow locking contract to use your {tokenSymbol}
          {approvePending && <Spinner />}
        </Button>
      ) : (
        <Button
          primary={!needsAllowance}
          disabled={
            needsAllowance ||
            !amount ||
            amount.isZero() ||
            depositStatus.loading
          }
          onClick={() =>
            deposit({
              args: [amount],
            })
          }
        >
          Lock {tokenSymbol}
          {depositStatus.loading && <Spinner />}
        </Button>
      )}

      <Balance lockToken label="Locked Balance" />
    </Card>
  )
}

export default Deposit
