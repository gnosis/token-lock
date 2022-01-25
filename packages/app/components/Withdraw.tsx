import { BigNumber } from "ethers"
import { useState } from "react"
import { useConnect, useAccount } from "wagmi"
import Balance from "./Balance"
import Button from "./Button"
import Card from "./Card"
import ConnectHint from "./ConnectHint"
import AmountInput from "./AmountInput"
import Spinner from "./Spinner"
import { useTokenContractRead } from "./tokenContract"
import {
  useTokenLockContractRead,
  useTokenLockContractWrite,
} from "./tokenLockContract"
import useTokenLockConfig from "./useTokenLockConfig"

const Withdraw: React.FC = () => {
  const [amount, setAmount] = useState<BigNumber | undefined>(undefined)

  const { decimals, tokenSymbol } = useTokenLockConfig()
  const [{ data: accountData }] = useAccount()
  const [{ data: balanceOf }] = useTokenLockContractRead("balanceOf", {
    args: accountData?.address,
    skip: !accountData?.address,
    watch: true,
  })
  const [{ data: { connected }}] = useConnect()
  const balance = balanceOf as undefined | BigNumber

  const [status, withdraw] = useTokenLockContractWrite("withdraw")

  return (
    <Card>
      <Balance lockToken label="Locked Balance" />
      <AmountInput
        value={amount}
        decimals={decimals}
        onChange={setAmount}
        unit="LGNO"
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
            Unlock Max
          </Button>
        }
      />
      {!connected ? (
        <ConnectHint />
      ) : (
        <Button
          primary
          disabled={!amount || amount.isZero()}
          onClick={() => {
            withdraw({ args: [amount] })
          }}
        >
          Unlock {tokenSymbol}
          {status.loading && <Spinner />}
        </Button>
      )}

      <Balance label="GNO Balance" />
    </Card>
  )
}

export default Withdraw
