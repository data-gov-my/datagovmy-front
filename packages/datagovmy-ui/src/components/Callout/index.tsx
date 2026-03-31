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

const bar_type: Record<string, { bg: string; text: string; bar: string }> = {
  success: { bg: "bg-green-500", text: "text-success", bar: "bg-success" },
  warning: { bg: "bg-yellow-50", text: "text-warning", bar: "bg-warning" },
  information: { bg: "bg-gray-50", text: "text-outlineHover", bar: "bg-outlineHover" },
  danger: { bg: "bg-red-50", text: "text-danger", bar: "bg-danger" },
};

type BarCalloutProps = {
  className?: string;
  variant: keyof typeof type;
  label: string;
  count: string | number;
  suffix?: string;
  description?: string;
};

export const BarCallout: FC<BarCalloutProps> = ({
  variant,
  className,
  count,
  label,
  description,
  suffix,
}) => {
  return (
    <div
      className={clx(
        "dark:bg-washed-dark flex w-full overflow-hidden rounded-md border bg-transparent",
        className
      )}
    >
      <div className={clx("w-1.5 self-stretch ", bar_type[variant].bar)} />
      <div className="w-full p-3 text-black dark:text-white">
        <p className="text-xs font-semibold uppercase">{label}</p>
        <p className="space-x-1.5">
          <span className="text-3xl font-medium">{count}</span>
          <span className={clx("text-xs", bar_type[variant].text)}>{suffix}</span>
        </p>
        <p className="text-xs">{description}</p>
      </div>
    </div>
  );
};
