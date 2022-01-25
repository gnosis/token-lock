import cls from "./Card.module.css"
import clsx from "clsx"

type Props = {
  className?: string
}

const Card: React.FC<Props> = ({ children, className }) => (
  <div className={clsx(cls.card, className)}>{children}</div>
)

export default Card
