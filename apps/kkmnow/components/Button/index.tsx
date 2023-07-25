import { FunctionComponent, MouseEventHandler, ReactElement } from "react";

interface ButtonProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactElement | ReactElement[] | string;
  icon?: ReactElement;
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
        className={`flex items-center gap-2 rounded-md  transition-all hover:bg-opacity-50 disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:bg-transparent ${className} p-2 `}
      >
        {icon}
        {children}
      </button>
    </>
  );
};

export default Button;
