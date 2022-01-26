import { ComponentProps } from "react"
import Image from "next/image"

import Field from "./Field"
import cls from "./Balance.module.css"
import { useTokenContractRead } from "./tokenContract"
import { useAccount } from "wagmi"
import { useTokenLockContractRead } from "./tokenLockContract"
import { useTokenLockConfig } from "."
import { BigNumber } from "ethers"
import { formatUnits } from "ethers/lib/utils"
import useTokenPrice from "./useTokenPrice"
import clsx from "clsx"

const CIRCLE_RADIUS = 26
const CIRCUMFERENCE = CIRCLE_RADIUS * 2 * Math.PI

export const formatToken = (bigNumber: BigNumber, decimals: number) =>
  new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 6,
  }).format(parseFloat(formatUnits(bigNumber, decimals)))

const formatUsd = (number: number) =>
  new Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 2,
  }).format(number)

type Props = ComponentProps<typeof Field> & {
  lockToken?: boolean
}
const Balance: React.FC<Props> = ({ lockToken, ...rest }) => {
  const { decimals, tokenName, lockTokenName, tokenSymbol, lockTokenSymbol } =
    useTokenLockConfig()
  const [{ data: accountData }] = useAccount()
  const [{ data: balanceTokenData }] = useTokenContractRead("balanceOf", {
    args: accountData?.address,
    skip: !accountData?.address,
    watch: true,
  })
  const [{ data: balanceLockTokenData }] = useTokenLockContractRead(
    "balanceOf",
    {
      args: accountData?.address,
      skip: !accountData?.address,
      watch: true,
    }
  )
  const balanceToken = balanceTokenData as BigNumber | undefined
  const balanceLockToken = balanceLockTokenData as BigNumber | undefined

  const percentLocked =
    balanceLockToken && balanceToken && balanceLockToken.gt(0)
      ? balanceLockToken
          .mul(100)
          .div(balanceLockToken.add(balanceToken))
          .toNumber()
      : 0

  const balance = lockToken ? balanceLockToken : balanceToken

  const tokenPrice = useTokenPrice()
  const balanceInUsd =
    tokenPrice &&
    balance &&
    parseFloat(formatUnits(balance, decimals)) * tokenPrice

  return (
    <Field {...rest}>
      <div className={clsx(cls.wrapper, balance && lockToken && cls.hasLocked)}>
        <div className={cls.icon}>
          <Image
            src="/gno.svg"
            width={32}
            height={32}
            alt={lockToken ? lockTokenName : tokenName}
          />
        </div>

        <div className={cls.balances}>
          <div className={cls.balance}>
            {balance ? formatToken(balance, decimals) : "…"}{" "}
            {lockToken ? lockTokenSymbol : tokenSymbol}
          </div>
          {balanceInUsd !== undefined && (
            <div className={cls.balanceInUsd}>
              {!balance?.isZero() && "~"}$ {formatUsd(balanceInUsd)}
            </div>
          )}
        </div>
        {balance && lockToken && (
          <div className={cls.percentLockedWrapper}>
            <svg
              className={cls.percentLockedIndicator}
              viewBox="0 0 56 56"
              width={56}
              height={56}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className={cls.percentLockedCircle}
                stroke="#001428"
                strokeWidth="4"
                fill="transparent"
                r={CIRCLE_RADIUS}
                cx="28"
                cy="28"
                style={{
                  strokeDasharray: `${CIRCUMFERENCE} ${CIRCUMFERENCE}`,
                  strokeDashoffset:
                    CIRCUMFERENCE - (percentLocked / 100) * CIRCUMFERENCE,
                }}
              />
            </svg>
            {balanceToken && balanceLockToken && (
              <>
                <div className={cls.percentLockedAmount}>{percentLocked}%</div>
                <div className={cls.percentLockedTitle}>Locked</div>
              </>
            )}
          </div>
        )}
      </div>
    </Field>
  )
}

export default Balance
