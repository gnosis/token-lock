import { ReactNode } from "react";
import cn from "classnames";
import cls from "./Field.module.css";

type Props = {
  className?: string;
  label?: ReactNode;
  meta?: ReactNode;
};

const Field: React.FC<Props> = ({ label, meta, children, className }) => (
  <label className={cn(className, cls.container)}>
    <div className={cls.header}>
      {label && <span className={cls.label}>{label}</span>}
      {meta && <span className={cls.meta}>{meta}</span>}
    </div>
    {children}
  </label>
);

export default Field;
