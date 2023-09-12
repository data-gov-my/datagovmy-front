import { ComponentProps, FunctionComponent, MouseEventHandler, ReactNode } from "react";
import { clx } from "../../lib/helpers";

interface ButtonProps extends ComponentProps<"button"> {
  className?: string;
  type?: "button" | "reset" | "submit";
  variant?: keyof typeof style;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  children?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

const style = {
  base: "flex select-none items-center gap-1.5 rounded-md text-start text-sm font-medium outline-none transition disabled:opacity-50 px-3 py-1.5",
  reset: "",
  default:
    "border border-outline dark:border-washed-dark hover:border-outlineHover hover:dark:border-outlineHover-dark active:bg-washed hover:dark:bg-washed-dark/50 active:dark:bg-washed-dark bg-white text-black dark:bg-black dark:text-white",
  primary:
    "from-primary to-primary-dark shadow-button bg-gradient-to-t text-white hover:to-[#5B8EFF]",
  ghost:
    "hover:bg-washed dark:hover:bg-washed-dark text-dim hover:text-black dark:hover:text-white",
};

const Button: FunctionComponent<ButtonProps> = ({
  className,
  icon,
  type = "button",
  variant = "base",
  onClick,
  children,
  disabled = false,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={clx(variant !== "reset" && style.base, style[variant], className)}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};

export default Button;
