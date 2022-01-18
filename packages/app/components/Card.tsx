import cls from "./Card.module.css"

const Card: React.FC = ({ children }) => (
  <div className={cls.card}>{children}</div>
)

export default Card
