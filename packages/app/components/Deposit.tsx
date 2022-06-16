import { BigNumber, ethers } from "ethers"
import { useMemo, useState } from "react"
import { useConnect, useAccount, useContract } from "wagmi"
import { CONTRACT_ADDRESSES } from "../config"
import Balance from "./Balance"
import Button from "./Button"
import Card from "./Card"
import AmountInput from "./AmountInput"
import Spinner from "./Spinner"
import {
  useTokenContract,
  useTokenContractRead,
  useTokenContractWrite,
} from "./tokenContract"
import useTokenLockContract, {
  useTokenLockContractWrite,
} from "./tokenLockContract"
import useChainId from "./useChainId"
import useTokenLockConfig from "./useTokenLockConfig"
import utility from "../styles/utility.module.css"
import Notice from "./Notice"
import useArgentWalletDetector from "../hooks/useArgentWalletDetector"

const Deposit: React.FC = () => {
  const [amount, setAmount] = useState<BigNumber | undefined>(undefined)

  const [dismissedError, dismissError] = useState<Error | undefined>(undefined)

  const chainId = useChainId()
  const { decimals, tokenSymbol, tokenAddress } = useTokenLockConfig()
  const [{ data: accountData }] = useAccount()
  const [{ data: isArgentWallet }] = useArgentWalletDetector(
    chainId,
    accountData?.address || ""
  )
  const [{ data: balanceOf }] = useTokenContractRead("balanceOf", {
    args: accountData?.address,
    skip: !accountData?.address,
    watch: true,
  })
  const [
    {
      data: { connector },
    },
  ] = useConnect()
  const balance = balanceOf as undefined | BigNumber
  console.log("connector", connector)

  const tokenLockContractAddress = CONTRACT_ADDRESSES[chainId]
  const allowanceArgs = useMemo(
    () => [accountData?.address, tokenLockContractAddress],
    [accountData?.address, tokenLockContractAddress]
  )
  const [{ data: allowance }] = useTokenContractRead("allowance", {
    args: allowanceArgs,
    skip: !accountData?.address,
    watch: true,
  })
  const tokenContract = useTokenContract()
  const tokenLockContract = useTokenLockContract()

  const [approveStatus, approve] = useTokenContractWrite("approve")
  const [depositStatus, deposit] = useTokenLockContractWrite("deposit")

  const needsAllowance =
    amount && amount.gt(0) && allowance && allowance.lt(amount)

  const error = approveStatus.error || depositStatus.error

  const batch = async () => {
    const signer = await connector?.getSigner()
    const address = accountData?.address
    const argentABI = [
      "function wc_multiCall((address to, uint256 value, bytes data)[] _transactions)",
    ]

    const argentWallet = new ethers.Contract(address || "", argentABI, signer)

    console.log(
      "approve data",
      tokenContract.interface.encodeFunctionData("approve", [
        tokenLockContractAddress,
        amount,
      ])
    )
    console.log(
      "deposit data",
      tokenLockContract.interface.encodeFunctionData("deposit", [amount])
    )
    console.log({ tokenAddress, lockAddress: tokenLockContractAddress })

    await argentWallet.wc_multiCall([
      {
        to: tokenAddress,
        value: 0,
        data: tokenContract.interface.encodeFunctionData("approve", [
          tokenLockContractAddress,
          amount,
        ]),
      },
      {
        to: tokenLockContractAddress,
        value: 0,
        data: tokenLockContract.interface.encodeFunctionData("deposit", [
          amount,
        ]),
      },
    ])
  }

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
      <Button
        primary={!needsAllowance}
        disabled={!amount || amount.isZero() || (balance && amount.gt(balance))}
        onClick={batch}
      >
        Lock {tokenSymbol}
        {depositStatus.loading && <Spinner />}
      </Button>
      )
      <Balance className={utility.mt8} lockToken label="Locked Balance" />
      {error && dismissedError !== error && (
        <Notice
          onDismiss={() => {
            dismissError(error)
          }}
        >
          {error.message}
        </Notice>
      )}
    </Card>
  )
}

export default Deposit
