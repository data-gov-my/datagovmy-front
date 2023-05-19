import { FunctionComponent, ReactNode } from "react";
import { clx, limitMax, numFormat } from "@lib/helpers";

interface BarPercProps {
  label?: ReactNode;
  value: number;
  className?: string;
  hidden?: boolean;
  total?: number;
  precision?: number | [number, number];
  unit?: ReactNode;
  size?: string;
}

const BarPerc: FunctionComponent<BarPercProps> = ({
  label,
  value,
  className = "w-fit space-y-1",
  precision = 1,
  hidden = false,
  total = 100,
  unit = "%",
  size = "h-[5px] w-[30px] md:w-[50px]",
}) => {
  const percentFill = (value: number): string => {
    return `${limitMax((value / total) * 100)}%`;
  };

  return (
    <div className={className}>
      {!hidden && (
        <div className="flex justify-between">
          {label && <p>{label}</p>}
          <div className="text-inherit dark:text-white">
            <p>
              {numFormat(value, "standard", precision)}
              {unit}
            </p>
          </div>
        </div>
      )}

      <div
        className={clx("bg-washed dark:bg-washed-dark flex overflow-x-hidden rounded-full", size)}
      >
        <div
          className="h-full items-center overflow-hidden rounded-full bg-[#0F172A] dark:bg-white"
          style={{ width: percentFill(value) }}
        />
      </div>
    </div>
  );
};

export default BarPerc;
