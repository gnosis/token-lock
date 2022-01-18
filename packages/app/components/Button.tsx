import React, {
  ButtonHTMLAttributes,
  ComponentProps,
  DetailedHTMLProps,
} from "react";
import cn from "classnames";
import cls from "./Button.module.css";

type Props = ComponentProps<"button"> & {
  primary?: boolean;
  link?: boolean;
};
const Button: React.FC<Props> = ({ className, primary, link, ...rest }) => (
  <button
    className={cn(className, {
      [cls.default]: !primary && !link,
      [cls.primary]: primary,
      [cls.link]: link,
    })}
    {...rest}
  />
);

export default Button;
