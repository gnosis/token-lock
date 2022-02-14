import clsx from "clsx"
import cls from "./LockedGnoLogo.module.css"

type Props = {
  locked?: boolean
}

const LockedGnoLogo: React.FC<Props> = ({ locked }) => (
  <h1 className={cls.heading}>
    <span className={clsx(cls.logo, locked ? cls.locked : cls.unlocked)}>
      Lock
    </span>
    <span className={cls.gno}> GNO</span>
  </h1>
)

export default LockedGnoLogo
