import cn from "clsx";
import { FunctionComponent, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  className?: string;
  variant: "reset" | "default" | "primary";
  type?: "button" | "reset" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  children?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  title?: string;
}

const Button: FunctionComponent<ButtonProps> = ({
  className = "rounded-md px-3 py-1.5",
  variant,
  title,
  type = "button",
  onClick,
  children,
  disabled = false,
}) => {
  const style = {
    base: "font-medium transition flex items-center gap-1 disabled:opacity-50 cursor-pointer",
    reset: "",
    default:
      "border border-outline hover:border-outlineHover active:bg-washed dark:border-outlineHover-dark dark:hover:border-primary-300 bg-white text-black dark:bg-black dark:text-white",
    primary:
      "from-primary-dgm to-primary-dark shadow-button bg-gradient-to-t text-white hover:to-[#5B8EFF]",
  };

  return (
    <>
      <button
        title={title}
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={cn(style.base, style[variant], className)}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
