import { ReactNode } from "react"
import clsx from "clsx"
import cls from "./Field.module.css"

type Props = {
  className?: string
  label?: ReactNode
  meta?: ReactNode
}

const Field: React.FC<Props> = ({ label, meta, children, className }) => (
  <label className={clsx(className, cls.container)}>
    <div className={cls.header}>
      {label && <span className={cls.label}>{label}</span>}
      {meta && <span className={cls.meta}>{meta}</span>}
    </div>
    {children}
  </label>
)

export default Field
