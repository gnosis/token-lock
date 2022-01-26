import Image from "next/image"
import cls from "./LockedGnoLogo.module.css"

type Props = {
  locked?: boolean
}

const LockedGnoLogo: React.FC<Props> = ({locked}) => (
  <div className={cls.container}>
    <Image
      className={cls.logo}
      src={locked ? `/lock.svg` : `/unlocked.svg`}
      alt="Locked GNO"
      height={36}
      width={36}
    />
    <div className={cls.logoText}>GNO</div>
  </div>
)

export default LockedGnoLogo
