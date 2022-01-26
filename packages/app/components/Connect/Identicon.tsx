import { useAccount, useConnect } from "wagmi"
import Blockies from "react-blockies"
import clsx from "clsx"
import cls from "./Identicon.module.css"

type Props = {
  large?: boolean
}

const Identicon: React.FC<Props> = ({ large }) => {
  const [{ data: accountData }, disconnect] = useAccount({
    fetchEns: true,
  })

  const avatar = accountData?.ens?.avatar
  const address = accountData?.address

  return (
    <div className={clsx(cls.identicon, large && cls.isLarge)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {avatar && <img src={avatar} alt="ENS Avatar" />}
      {address ? (
        <Blockies seed={address} size={12} scale={large ? 5 : 3} />
      ) : (
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
