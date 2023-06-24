import { clx } from "@lib/helpers";
import { FunctionComponent, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  className?: string;
  variant?: "default" | "primary" | "light" | "dropdown" | "box";
  type?: "button" | "reset" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  children?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

const Button: FunctionComponent<ButtonProps> = ({
  className = "",
  variant,
  icon,
  type = "button",
  onClick,
  children,
  disabled = false,
}) => {
  // TODO: Make this reusable and readable
  const base = `flex items-center gap-2 rounded-md 
    px-3 py-1.5 text-sm font-medium transition 
    hover:bg-washed dark:hover:bg-washed-dark`;

  const borders = `border border-outline dark:border-washed-dark 
    hover:border-outlineHover hover:dark:border-outlineHover-dark`;

  const disables = `disabled:bg-outline dark:disabled:bg-washed-dark 
    disabled:border-outline dark:disabled:border-washed-dark 
    disabled:text-outlineHover dark:disabled:text-outlineHover-dark 
    disabled:pointer-events-none disabled:cursor-not-allowed`;

  const style = {
    primary: "bg-gradient-to-t from-primary to-primary-dark hover:to-[#5B8EFF] text-white shadow",
    default: clx(
      borders,
      disables,
      `bg-white dark:bg-black active:bg-washed 
      text-black dark:text-white`
    ),
    light: clx(
      borders,
      `bg-white text-black active:bg-washed dark:active:bg-washed-dark 
      dark:active:border-outlineHover-dark dark:active:text-white`
    ),
    dropdown: clx(
      borders,
      disables,
      `relative flex gap-1.5 pl-3 pr-7 shadow-sm outline-none
      bg-white dark:bg-black active:bg-washed hover:dark:bg-washed-dark/50 
      text-black dark:text-white text-start text-sm`
    ),
    // TODO: refactor buttons, all buttons yet to refactor use box for now
    box: `flex p-2 gap-2 items-center self-center 
    text-start text-sm text-dim leading-none 
    hover:bg-washed dark:hover:bg-washed-dark
    rounded-md transition hover:bg-opacity-50
    disabled:cursor-not-allowed disabled:opacity-50`,
  };
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={clx(variant ? base + " " + style[variant] : style["box"], className)}
      >
        {icon}
        {children}
      </button>
    </>
  );
};

export default Button;
