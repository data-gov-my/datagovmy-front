import { FunctionComponent, MouseEventHandler, ReactNode } from "react";
import { clx } from "../../lib/helpers";

interface ButtonProps {
  className?: string;
  type?: "button" | "reset" | "submit";
  variant?: keyof typeof style;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  children?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

const style = {
  base: "font-medium transition flex items-center gap-1 disabled:opacity-50",
  reset: "",
  default:
    "border border-outline hover:border-outlineHover active:bg-washed dark:active:border-outlineHover-dark bg-white text-black",
  primary:
    "from-primary to-primary-dark shadow-button bg-gradient-to-t text-white hover:to-[#5B8EFF]",
};

const Button: FunctionComponent<ButtonProps> = ({
  className,
  icon,
  type = "button",
  variant = "base",
  onClick,
  children,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={clx(variant !== "reset" && style.base, style[variant], className)}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
