import { FC, ReactNode } from "react";
import { clx } from "../../lib/helpers";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const type = {
  success: "bg-green-50 text-green-700",
  warning: "bg-yellow-50 text-yellow-700",
  information: "bg-blue-50 text-blue-600",
  danger: "bg-red-50 text-red-600",
};

type CalloutProps = {
  children?: ReactNode;
  className?: string;
  variant: keyof typeof type;
};

const Callout: FC<CalloutProps> = ({ children, className, variant }) => {
  const Icon = {
    success: CheckCircleIcon,
    warning: ExclamationCircleIcon,
    information: InformationCircleIcon,
    danger: ExclamationTriangleIcon,
  }[variant];

  return (
    <span
      className={clx(
        "flex w-fit items-center gap-2 rounded-lg p-3 text-sm",
        type[variant],
        className
      )}
    >
      <Icon className="size-5 shrink-0 self-start" />
      {children}
    </span>
  );
};

export default Callout;
