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
        "rounded-xl border border-outline transition",
        type === "gray"
          ? " bg-background p-4.5 dark:border-outlineHover-dark dark:bg-washed-dark"
          : "",
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
