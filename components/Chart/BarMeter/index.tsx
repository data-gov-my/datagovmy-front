import { FunctionComponent, useMemo } from "react";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import { CountryAndStates } from "@lib/constants";
import { clx, limitMax, maxBy, numFormat } from "@lib/helpers";
import Image from "next/image";

interface BarMeterProps extends ChartHeaderProps {
  className?: string;
  max?: number;
  data?: BarMeterData[];
  unit?: string;
  relative?: boolean;
  sort?: "asc" | "desc" | ((a: BarMeterData, b: BarMeterData) => number);
  layout?: "horizontal" | "vertical" | "state-horizontal";
  formatY?: (value: number) => string;
  formatX?: (key: string) => string;
}

export type BarMeterData = {
  x: string;
  y: number;
};

const BarMeter: FunctionComponent<BarMeterProps> = ({
  className = "relative",
  title,
  menu,
  controls,
  state,
  max = 100,
  data = dummy,
  layout = "vertical",
  unit = "",
  sort = undefined,
  relative = false,
  formatY,
  formatX,
}) => {
  const maximum = () => {
    if (relative) return maxBy(data, "y").y;
    return max;
  };
  const percentFill = (value: number): string => {
    return `${limitMax((value / maximum()) * 100)}%`;
  };

  const _data = useMemo(() => {
    if (!sort) return data;

    if (typeof sort === "string") {
      return data.sort((a, b) => (sort === "asc" ? a.y - b.y : b.y - a.y));
    } else {
      return data.sort(sort);
    }
  }, [data, sort]);

  const layout_style: Record<typeof layout, string> = {
    "horizontal": "flex flex-col w-full space-y-2",
    "state-horizontal": "flex flex-col w-full space-y-2",
    "vertical": "flex flex-col lg:flex-row justify-around lg:h-[400px] ",
  };

  const renderBars = (item: BarMeterData, index: number) => {
    switch (layout) {
      case "horizontal":
        return (
          <div className="space-y-1 pb-2" key={item.x.concat(`_${index}`)}>
            <div className="flex justify-between">
              <p>{formatX ? formatX(item.x) : item.x}</p>
              <p className="text-dim dark:text-white">
                {formatY ? formatY(item.y) : numFormat(item.y, "standard", 1)}
                {unit}
              </p>
            </div>

            <div className="flex h-2.5 w-full overflow-x-hidden rounded-full bg-washed dark:bg-washed-dark">
              <div
                className="h-full items-center overflow-hidden rounded-full bg-[#0F172A] dark:bg-white"
                style={{ width: percentFill(item.y) }}
              />
            </div>
          </div>
        );

      /**
       * x-key must indicate a 'state' code (eg. 'mlk', 'jhr', 'png' etc).
       * Used in /dashboard/covid
       */
      case "state-horizontal":
        return (
          <div className="flex w-full items-center" key={item.x.concat(`_${index}`)}>
            <div className="flex w-[40%] items-center gap-2 lg:w-[35%]">
              <Image
                src={`/static/images/states/${item.x}.jpeg`}
                width={20}
                height={12}
                alt={CountryAndStates[item.x]}
              />
              <p className="truncate text-sm text-dim dark:text-white">
                {CountryAndStates[item.x]}
              </p>
            </div>

            <div className="flex flex-grow items-center gap-2">
              <p className="w-[40px] text-sm text-dim">
                {numFormat(item.y, "standard", [1, 1])}
                {unit}
              </p>
              <div className="flex h-2.5 w-full overflow-x-hidden rounded-full bg-washed dark:bg-washed-dark">
                <div
                  className="h-full items-center overflow-hidden rounded-full bg-[#0F172A] dark:bg-white"
                  style={{ width: percentFill(item.y) }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <>
            <div
              className="hidden h-full flex-col items-center space-y-2 pt-4 lg:flex"
              key={item.x.concat(`_${index}`)}
            >
              <p>
                {numFormat(item.y, "standard", [1, 1])}
                {unit}
              </p>
              <div className="relative flex h-[80%] w-6 overflow-x-hidden rounded-full bg-washed dark:bg-washed-dark">
                <div
                  className="absolute bottom-0 w-full items-center overflow-hidden rounded-full bg-[#0F172A] dark:bg-white"
                  style={{
                    height: percentFill(item.y),
                  }}
                />
              </div>
              <p>{item.x}</p>
            </div>

            <div className="block space-y-1 pb-2 lg:hidden" key={item.x.concat(`_${index}`)}>
              <div className="flex justify-between">
                <p>{formatX ? formatX(item.x) : item.x}</p>
                <p className="text-dim dark:text-white">
                  {formatY ? formatY(item.y) : numFormat(item.y, "standard", 1)}
                  {unit}
                </p>
              </div>

              <div className="flex h-2.5 w-full overflow-x-hidden rounded-full bg-washed dark:bg-washed-dark">
                <div
                  className="h-full items-center overflow-hidden rounded-full bg-[#0F172A] dark:bg-white"
                  style={{ width: percentFill(item.y) }}
                />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="space-y-2">
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      <div className={clx(layout_style[layout], className)}>
        {_data?.map((item, index) => {
          return (
            <div className="h-full" key={index}>
              {renderBars(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const dummy = [
  {
    x: "80+",
    y: 80.6,
  },
  {
    x: "70-79",
    y: 90.8,
  },
  {
    x: "60-69",
    y: 98.4,
  },
  {
    x: "50-59",
    y: 97.6,
  },
  {
    x: "40-49",
    y: 102.3,
  },
  {
    x: "30-39",
    y: 96.4,
  },
  {
    x: "20-29",
    y: 91.2,
  },
  {
    x: "10-19",
    y: 94.7,
  },
  {
    x: "5-9",
    y: 49.9,
  },
  {
    x: "0-4",
    y: 0,
  },
];

export default BarMeter;
