import { useAccount, useConnect } from "wagmi"
import makeBlockie from "ethereum-blockies-base64"
import clsx from "clsx"
import cls from "./Identicon.module.css"
import { useMemo } from "react"

type Props = {
  large?: boolean
}

const Identicon: React.FC<Props> = ({ large }) => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  const avatar = accountData?.ens?.avatar
  const address = accountData?.address

  const blockie = useMemo(() => address && makeBlockie(address), [address])

  const size = large ? { width: 60, height: 60 } : { width: 36, height: 36 }

  return (
    <div className={clsx(cls.identicon, large && cls.isLarge)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {avatar && <img src={avatar} alt="ENS Avatar" {...size} />}
      {!avatar && blockie && <img src={blockie} alt={address} {...size} />}
      {!avatar && !blockie && (
        <img
          src="/identicon.svg"
          alt="Identicon keyhole"
          height={large ? 24 : 16}
          width={large ? 24 : 16}
        />
      )}
      <div
        className={clsx(
          cls.statusJewel,
          accountData && cls.isConnected,
          large && cls.isLarge
        )}
      />
    </div>
  )
}

export default Identicon
