import Image from "next/image"
import cls from "./LockedGnoLogo.module.css"

const LockedGnoLogo: React.FC = () => (
  <div className={cls.container}>
    <Image
      className={cls.logo}
      src="/lock.svg"
      alt="Locked GNO"
      height={36}
      width={36}
    />
    <div className={cls.logoText}>GNO</div>
  </div>
)

export default LockedGnoLogo
