import { FunctionComponent, ReactNode, useMemo } from "react";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import { CountryAndStates } from "@lib/constants";
import { minMax, maxBy, numFormat } from "@lib/helpers";
import Image from "next/image";

interface BarMeterProps extends ChartHeaderProps {
  className?: string;
  max?: number;
  data?: Array<BarMeterData>;
  color?: string;
  unit?: string;
  relative?: boolean;
  sort?: "asc" | "desc" | ((a: BarMeterData, b: BarMeterData) => number);
  layout?: "horizontal" | "vertical" | "state-horizontal";
  formatY?: (value: number, key?: string) => ReactNode;
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
  color = "#0F172A",
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
    return `${minMax((value / maximum()) * 100)}%`;
  };

  const _data = useMemo(() => {
    if (!sort) return data;

    if (typeof sort === "string") {
      return data.sort((a, b) => (sort === "asc" ? a.y - b.y : b.y - a.y));
    } else {
      return data.sort(sort);
    }
  }, [data]);

  const renderBars = (item: BarMeterData, index: number) => {
    switch (layout) {
      case "horizontal":
        return (
          <div className="space-y-1 pb-2" key={item.x.concat(`_${index}`)}>
            <div className="flex justify-between">
              <p>{formatX ? formatX(item.x) : item.x}</p>
              <p className="text-dim">
                {formatY ? formatY(item.y, item.x) : numFormat(item.y, "standard", [1, 1])}
                {unit}
              </p>
            </div>

            <div className="flex h-2.5 w-full overflow-x-hidden bg-washed">
              <div
                className="h-full items-center overflow-hidden"
                style={{
                  backgroundColor: color,
                  width: percentFill(item.y),
                }}
              />
            </div>
          </div>
        );

      /**
       * xKey must indicate a 'state' code (eg. 'mlk', 'jhr', 'png' etc).
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
              <p className="text-sm text-dim">{CountryAndStates[item.x]}</p>
            </div>

            <div className="flex flex-grow items-center gap-2">
              <p className="w-[40px] text-sm text-dim">
                {(item.y as number).toFixed(1)}
                {unit}
              </p>
              <div className="h-2.5 flex-grow overflow-x-hidden bg-washed">
                <div
                  className="h-full items-center overflow-hidden"
                  style={{
                    backgroundColor: color,
                    width: percentFill(item.y),
                  }}
                />
              </div>
            </div>
          </div>
        );

      default:
        return (
          <>
            <div
              className="hidden h-full flex-col items-center space-y-2 lg:flex"
              key={item.x.concat(`_${index}`)}
            >
              <p>
                {(item.y as number).toFixed(1)}
                {unit}
              </p>
              <div className="relative flex h-[80%] w-8 overflow-x-hidden bg-washed">
                <div
                  className="absolute bottom-0 w-full items-center overflow-hidden"
                  style={{
                    backgroundColor: color,
                    height: percentFill(item.y),
                  }}
                />
              </div>
              <p>{item.x}</p>
            </div>
            <div className="block space-y-2 lg:hidden" key={item.x.concat(`__${index}`)}>
              <div className="flex justify-between">
                <p>{item.x}</p>
                <p className="text-dim">
                  {(item.y as number).toFixed(1)}
                  {unit}
                </p>
              </div>

              <div className="flex h-2.5 w-full overflow-x-hidden bg-washed">
                <div
                  className="h-full items-center overflow-hidden"
                  style={{
                    backgroundColor: color,
                    width: percentFill(item.y),
                  }}
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
      <div
        className={[
          "flex",
          layout !== "vertical" ? "flex-col" : "flex-row justify-between lg:h-[400px]",
          className,
        ].join(" ")}
      >
        {_data &&
          _data.map((item, index) => {
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
