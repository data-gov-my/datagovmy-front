import { FunctionComponent, ReactElement, useMemo } from "react";
import { ChartHeader } from "@components/index";
import { CountryAndStates } from "@lib/constants";
import { minMax, maxBy } from "@lib/helpers";
import Image from "next/image";

interface BarMeterProps {
  className?: string;
  title?: string | ReactElement;
  menu?: ReactElement;
  controls?: ReactElement;
  state?: string;
  total?: number;
  data?: Array<any>;
  xKey?: string;
  yKey?: string;
  color?: string;
  unit?: string;
  relative?: boolean;
  sort?: "asc" | "desc";
  layout?: "horizontal" | "vertical" | "state-horizontal";
}

const BarMeter: FunctionComponent<BarMeterProps> = ({
  className = "relative flex w-full flex-col justify-between gap-8 lg:h-[500px] lg:flex-row",
  title,
  menu,
  controls,
  state,
  total = 100,
  color = "#0F172A",
  xKey = "x",
  yKey = "y",
  data = dummy,
  layout = "vertical",
  unit = "",
  sort = undefined,
  relative = false,
}) => {
  const max = () => {
    if (relative) return maxBy(data, yKey)[yKey];
    return total;
  };

  const percentFill = (value: number): string => {
    return `${minMax((value / max()) * 100)}%`;
  };

  const _data = useMemo(() => {
    if (!sort) return data;

    if (sort === "asc") {
      return data.sort((a, b) => a[yKey] - b[yKey]);
    } else if (sort === "desc") {
      return data.sort((a, b) => b[yKey] - a[yKey]);
    }
  }, [data]);

  const renderBars = (item: any, index: number) => {
    switch (layout) {
      case "horizontal":
        return (
          <div className="space-y-1 pb-2" key={item[xKey].concat(`_${index}`)}>
            <div className="flex justify-between">
              <p>{item[xKey]}</p>
              <p className="text-dim">
                {(item[yKey] as number).toFixed(1)}
                {unit}
              </p>
            </div>

            <div className="flex h-2.5 w-full overflow-x-hidden bg-washed">
              <div
                className="h-full items-center overflow-hidden"
                style={{
                  backgroundColor: color,
                  width: percentFill(item[yKey]),
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
          <div className="flex w-full items-center" key={item[xKey].concat(`_${index}`)}>
            <div className="flex w-[40%] items-center gap-2 lg:w-[35%]">
              <Image
                src={`/static/images/states/${item[xKey]}.jpeg`}
                width={20}
                height={12}
                alt={CountryAndStates[item[xKey]]}
              />
              <p className="text-sm text-dim">{CountryAndStates[item[xKey]]}</p>
            </div>

            <div className="flex flex-grow items-center gap-2">
              <p className="w-[40px] text-sm text-dim">
                {(item[yKey] as number).toFixed(1)}
                {unit}
              </p>
              <div className="h-2.5 flex-grow overflow-x-hidden bg-washed">
                <div
                  className="h-full items-center overflow-hidden"
                  style={{
                    backgroundColor: color,
                    width: percentFill(item[yKey]),
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
              key={item[xKey].concat(`_${index}`)}
            >
              <p>
                {(item[yKey] as number).toFixed(1)}
                {unit}
              </p>
              <div className="relative flex h-[80%] w-8 overflow-x-hidden bg-washed">
                <div
                  className="absolute bottom-0 w-full items-center overflow-hidden"
                  style={{
                    backgroundColor: color,
                    height: percentFill(item[yKey]),
                  }}
                />
              </div>
              <p>{item[xKey]}</p>
            </div>
            <div className="block space-y-2 lg:hidden" key={item[xKey].concat(`__${index}`)}>
              <div className="flex justify-between">
                <p>{item[xKey]}</p>
                <p className="text-dim">
                  {(item[yKey] as number).toFixed(1)}
                  {unit}
                </p>
              </div>

              <div className="flex h-2.5 w-full overflow-x-hidden bg-washed">
                <div
                  className="h-full items-center overflow-hidden"
                  style={{
                    backgroundColor: color,
                    width: percentFill(item[yKey]),
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
      <div className={className}>
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
