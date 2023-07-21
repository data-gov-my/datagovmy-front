import cn from "clsx";
import { FunctionComponent, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  className?: string;
  variant: "default" | "primary";
  type?: "button" | "reset" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  children?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  title?: string;
}

export const Button: FunctionComponent<ButtonProps> = ({
  className = "",
  variant,
  title,
  type = "button",
  onClick,
  children,
  disabled = false,
}) => {
  const style = {
    base: "rounded-md px-3 py-1.5 font-medium transition flex items-center gap-2",
    default:
      "border border-outline hover:border-outlineHover active:bg-washed dark:active:border-outlineHover-dark bg-white text-black",
    primary: "from-primary hover:to-primary bg-gradient-to-t to-[#3E7AFF] text-white hover:shadow",
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
