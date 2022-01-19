import Image from "next/image"
import { useConnect } from "wagmi"
import clsx from "clsx"
import cls from "./Identicon.module.css"

type Props = {
  arrow?: boolean
  large?: boolean
}

const Connect: React.FC<Props> = ({ arrow, large }) => {
  const [
    {
      data: { connected },
    },
  ] = useConnect()

  return (
    <div className={clsx(cls.identicon, large && cls.isLarge, arrow && cls.hasArrow)}>
      <Image
        src="/identicon.svg"
        alt="Identicon keyhole"
        height={large ? 24 : 16}
        width={large ? 24 : 16}
      />
      <div
        className={clsx(cls.statusJewel, connected && cls.isConnected, large && cls.isLarge)}
      />
    </div>
  )
}

export default Connect
