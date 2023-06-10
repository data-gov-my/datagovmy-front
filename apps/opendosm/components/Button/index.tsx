import { FunctionComponent, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  children?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

const Button: FunctionComponent<ButtonProps> = ({
  className = "text-dim text-sm hover:bg-washed",
  icon,
  onClick,
  children,
  disabled = false,
}) => {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled}
        className={[
          "flex items-center gap-2 self-center rounded-md p-2 text-start text-sm leading-none transition-all hover:bg-opacity-50 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        ].join(" ")}
      >
        {icon}
        {children}
      </button>
    </>
  );
};

export default Button;
