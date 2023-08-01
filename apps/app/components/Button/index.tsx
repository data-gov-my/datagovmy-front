import { FunctionComponent, MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  className?: string;
  type?: "button" | "reset" | "submit";
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
  children?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

// FIXME: This component is really not that useful now
const Button: FunctionComponent<ButtonProps> = ({
  className = "btn",
  icon,
  type = "button",
  onClick,
  children,
  disabled = false,
}) => {
  return (
    <button onClick={onClick} disabled={disabled} type={type} className={className}>
      {icon}
      {children}
    </button>
  );
};

export default Button;
