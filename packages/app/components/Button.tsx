import React, {
  ButtonHTMLAttributes,
  ComponentProps,
  DetailedHTMLProps,
} from "react"
import clsx from "clsx"
import cls from "./Button.module.css"

type Props = ComponentProps<"button"> & {
  primary?: boolean
  link?: boolean
}
const Button: React.FC<Props> = ({ className, primary, link, ...rest }) => (
  <button
    className={clsx(className, {
      [cls.default]: !primary && !link,
      [cls.primary]: primary,
      [cls.link]: link,
    })}
    {...rest}
  />
)

export default Button
