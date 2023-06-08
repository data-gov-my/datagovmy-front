import {
  FunctionComponent,
  ReactElement,
  ReactNode,
  useMemo,
  useCallback,
  ForwardedRef,
} from "react";
import Tooltip from "@components/Tooltip";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineController,
  BarElement,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  TimeScale,
  TimeSeriesScale,
  Legend,
  ChartData,
  ChartTypeRegistry,
  Filler,
  BarController,
  ChartDataset,
} from "chart.js";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import AnnotationPlugin from "chartjs-plugin-annotation";

import { Chart } from "react-chartjs-2";
import { chunkSplit, numFormat } from "@lib/helpers";
import "chartjs-adapter-luxon";
import { ChartCrosshairOption } from "@lib/types";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

export type Periods =
  | false
  | "auto"
  | "millisecond"
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year";
export interface TimeseriesProps extends ChartHeaderProps {
  className?: string;
  description?: string;
  type?: keyof ChartTypeRegistry;
  data?: ChartData<keyof ChartTypeRegistry, any[], string | number>;
  mode?: "grouped" | "stacked";
  subheader?: ReactElement;
  interval?: Periods;
  tooltipFormat?: string;
  round?: Periods;
  prefixY?: string;
  unitY?: string;
  axisY?: Record<string, any>;
  beginZero?: boolean;
  lang?: string;
  gridXValues?: Array<number> | undefined;
  gridYValues?: Array<number> | undefined;
  minY?: number;
  maxY?: number;
  precision?: number | [min: number, max: number];
  enableRightScale?: boolean;
  enableCallout?: boolean;
  enableCrosshair?: boolean;
  enableLegend?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  stats?: Array<StatProps> | null;
  displayNumFormat?: (
    value: number,
    type: "compact" | "standard" | "scientific" | "engineering" | undefined,
    precision: number | [min: number, max: number]
  ) => string;
  _ref?: ForwardedRef<ChartJSOrUndefined<keyof ChartTypeRegistry, any[], unknown>>;
}

const Timeseries: FunctionComponent<TimeseriesProps> = ({
  className = "w-full h-[450px]", // manage CSS here
  menu,
  title,
  description,
  controls,
  interval = "auto",
  tooltipFormat,
  prefixY,
  unitY,
  round = "day",
  mode = "stacked",
  data = dummy,
  stats,
  state,
  subheader,
  type = "bar",
  axisY = undefined,
  precision = 1,
  enableRightScale = false,
  enableCallout = false,
  enableCrosshair = true,
  enableLegend = false,
  enableGridX = false,
  enableGridY = true,
  beginZero = false,
  maxY,
  displayNumFormat = numFormat,
  _ref,
}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    PointElement,
    LineElement,
    LineController,
    TimeScale,
    TimeSeriesScale,
    Legend,
    Filler,
    ChartTooltip,
    CrosshairPlugin,
    AnnotationPlugin
  );

  const display = (
    value: number,
    type: "compact" | "standard",
    precision: number | [min: number, max: number]
  ): string => {
    return (prefixY ?? "") + displayNumFormat(value, type, precision) + (unitY ?? "");
  };
  const options = useCallback((): ChartCrosshairOption<"line"> => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      normalized: true,
      elements: {
        point: {
          borderWidth: 0,
          radius: 0,
          hoverRadius: 2,
        },
      },
      plugins: {
        legend: {
          display: enableLegend,
          position: "chartArea" as const,
          align: "start",
        },
        tooltip: {
          enabled: true,
          bodyFont: {
            family: "Inter",
          },
          mode: "index",
          intersect: false,
          callbacks: {
            label: function (item) {
              return `${item.dataset.label as string}: ${
                item.parsed.y !== undefined || item.parsed.y !== null
                  ? display(item.parsed.y, "standard", precision)
                  : "-"
              }`;
            },
          },
          filter: function (tooltipItem) {
            return !!tooltipItem.dataset.label;
          },
        },
        annotation: enableCallout
          ? {
              clip: false,
              common: {
                drawTime: "afterDraw",
              },
              annotations: data.datasets.map((set, index) => {
                const INDEXES = {
                  year: data.labels!.length - 200,
                  quarter: data.labels!.length - 45,
                  month: data.labels!.length - 15,
                  week: data.labels!.length - 4,
                  millisecond: data.labels!.length - 1,
                  second: data.labels!.length - 1,
                  minute: data.labels!.length - 1,
                  hour: data.labels!.length - 1,
                  day: data.labels!.length - 1,
                };
                const xIndex = round && round !== "auto" ? INDEXES[round] : data.labels!.length - 1;
                const yIndex = data.labels!.length - 1;

                return {
                  type: "label",
                  callout: {
                    display: true,
                  },
                  content() {
                    let text: string = set.label!;
                    if (text.length > 25) text = text.slice(0, 25).concat("..");
                    // if (text.length > 25) return chunkSplit(text, 25);
                    return text;
                  },
                  font: {
                    family: "Inter",
                    style: "normal",
                    lineHeight: 1,
                    weight: "400",
                    size: 12,
                  },
                  color: set.borderColor as string,
                  position: {
                    x: "start",
                    y: "center",
                  },
                  xAdjust: 0,
                  xValue: data.labels![xIndex] as string | number,
                  yAdjust: (data.datasets as any[]).reduce((prev: any, current: any) => {
                    if (Math.abs(current.data[yIndex] - set.data[yIndex]) < 3) {
                      return prev + 1;
                    }
                    return prev;
                  }, -1) as number,
                  yValue: set.data[yIndex],
                };
              }),
            }
          : false,
        crosshair: enableCrosshair
          ? {
              line: {
                width: 0,
                color: "#000",
                dashPattern: [6, 4],
              },
              zoom: {
                enabled: false,
              },
              sync: {
                enabled: false,
              },
            }
          : false,
      },
      layout: {
        padding: {
          right: enableCallout ? 160 : 0,
          top: enableCallout ? 20 : 0,
        },
      },
      scales: {
        x: {
          type: "time",
          time: {
            unit: interval === "auto" ? autoScale : interval,
            round: round === "auto" ? autoRound : round,
            displayFormats: {
              quarter: "qQ yyyy",
              month: "MMM",
              week: "dd MMM",
            },
            tooltipFormat: tooltipFormat
              ? tooltipFormat
              : ["year", "month", "quarter"].includes(interval as string)
              ? { quarter: "qQ yyyy", month: "MMM yyyy", year: "yyyy" }[interval as string]
              : "dd MMM yyyy",
          },
          grid: {
            display: enableGridX,
            borderWidth: 1,
            borderDash: [5, 10],
          },
          ticks: {
            major: {
              enabled: true,
            },
            minRotation: 0,
            maxRotation: 0,
            font: {
              family: "Inter",
            },
          },
          stacked: mode === "stacked",
        },
        y: {
          grid: {
            display: enableGridY,
            borderWidth: 1,
            borderDash(ctx) {
              if (ctx.tick.value === 0) return [0, 0];
              return [5, 5];
            },
            drawTicks: false,
            drawBorder: false,
            offset: false,
            lineWidth(ctx) {
              if (ctx.tick.value === 0) return 2;
              return 1;
            },
          },
          ticks: {
            padding: 6,
            callback: (value: string | number) => {
              return value && display(value as number, "compact", precision);
            },
            font: {
              family: "Inter",
            },
          },
          max: maxY,
          stacked: mode === "stacked",
          beginAtZero: beginZero,
        },
        ...(enableRightScale
          ? {
              y1: {
                position: "right" as const,
                grid: {
                  drawOnChartArea: false,
                  drawTicks: false,
                  drawBorder: false,
                  offset: false,
                },
                ticks: {
                  padding: 6,
                  callback: (value: string | number) => {
                    return numFormat(value as number).concat("%");
                  },
                  font: {
                    family: "Inter",
                  },
                },
                stacked: mode === "stacked",
              },
            }
          : {}),
        ...axisY,
      },
    };
  }, [data, interval]);

  const autoScale = useMemo(
    () => data.labels && (data.labels.length > 200 ? "month" : "day"),
    [data.labels]
  );
  const autoRound = useMemo(
    () => data.labels && (data.labels.length > 720 ? "week" : "day"),
    [data.labels]
  );

  return (
    <div className="space-y-2">
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      {stats && <Stats data={stats}></Stats>}
      {subheader && <div>{subheader}</div>}
      <div className={className}>
        <Chart ref={_ref} data={data} options={options()} type={type} />
      </div>
      {description && <p className="pt-4 text-sm text-dim">{description}</p>}
    </div>
  );
};
const dummy: ChartData = {
  labels: [1111111111111, 1579478400000], // x-values - must be epoch millis eg. [168231311000, 16856172321, ...] etc
  datasets: [
    // stacked y-values
    {
      type: "line",
      label: "Moving Average (MA)",
      data: [1, 2, 3], // y-values
      borderColor: "red",
    },
    {
      type: "bar",
      label: "Primary",
      data: [4, 5, 6], // y-values
      backgroundColor: "blue",
    },
    {
      type: "bar",
      label: "Booster 1",
      data: [1, 2, 3], // y-values
      backgroundColor: "teal",
    },
    {
      type: "bar",
      label: "Booster 2",
      data: [10, 11, 12], // y-values
      backgroundColor: "green",
    },
  ],
};

/**
 * Stats Component
 */
interface StatsProps {
  data: Array<StatProps>;
  className?: string;
}

type StatProps = {
  title: ReactNode;
  value?: string | false;
  tooltip?: string;
};

const Stats: FunctionComponent<StatsProps> = ({ data, className }) => {
  const cols: Record<number, string> = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
  };
  return (
    <div className={`grid w-full pt-2 ${cols[data.length] ?? "grid-cols-3"} ${className}`}>
      {data.map(({ title, value, tooltip }: StatProps, index) => (
        <div key={index}>
          <p className="text-sm text-dim">{title}</p>
          {tooltip ? (
            <Tooltip tip={tooltip}>
              {open => (
                <>
                  <h4
                    className="font-medium underline decoration-dashed underline-offset-4"
                    onClick={() => open()}
                  >
                    {value}
                  </h4>
                </>
              )}
            </Tooltip>
          ) : (
            value && <h4 className="font-medium">{value}</h4>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeseries;
