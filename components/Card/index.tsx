import { FunctionComponent, ReactNode } from "react";

interface CardProps {
  type?: "default" | "gray";
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}

const Card: FunctionComponent<CardProps> = ({ type = "default", children, className, onClick }) => {
  return (
    <div
      className={[
        "rounded-xl border border-outline",
        type === "gray" ? "bg-background p-4.5" : "",
        onClick ? "cursor-pointer" : "",
        className,
      ].join(" ")}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
