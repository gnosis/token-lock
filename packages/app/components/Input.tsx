import { ComponentProps, ReactNode } from "react";
import cls from "./Input.module.css";
import Field from "./Field";
import React from "react";

type Props = ComponentProps<"input"> &
  ComponentProps<typeof Field> & {
    unit?: ReactNode;
  };

const Input = React.forwardRef<HTMLInputElement, Props>(
  ({ label, meta, unit, className, ...rest }, ref) => (
    <Field className={className} label={label} meta={meta}>
      <div className={cls.wrapper}>
        <input ref={ref} className={cls.input} {...rest} />
        {unit && <span className={cls.unit}>{unit}</span>}
      </div>
    </Field>
  )
);
Input.displayName = "Input";

export default Input;
