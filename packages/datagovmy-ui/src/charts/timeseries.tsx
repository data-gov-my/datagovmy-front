import {
  FunctionComponent,
  ReactElement,
  ReactNode,
  useMemo,
  useCallback,
  ForwardedRef,
} from "react";
import Tooltip from "../components/Tooltip";
import { default as ChartHeader, ChartHeaderProps } from "./chart-header";
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
  Scale,
  Tick,
  TooltipItem,
} from "chart.js";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import AnnotationPlugin from "chartjs-plugin-annotation";
import { Chart } from "react-chartjs-2";
import { clx, numFormat } from "../lib/helpers";
import "chartjs-adapter-luxon";
import { ChartCrosshairOption } from "../lib/types";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { useTheme } from "next-themes";
import { AKSARA_COLOR } from "../lib/constants";
import Spinner from "../components/Spinner";

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

type TimeseriesProps = ChartHeaderProps & {
  className?: string;
  description?: string;
  type?: keyof ChartTypeRegistry;
  data?: ChartData<keyof ChartTypeRegistry, any[], string | number>;
  mode?: "grouped" | "stacked";
  subheader?: ReactElement;
  isLoading?: boolean;
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
  enableAnimation?: boolean;
  enableRightScale?: boolean;
  enableCallout?: boolean;
  enableCrosshair?: boolean;
  enableLegend?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  tickXCallback?: (
    this: Scale,
    tickValue: number | string,
    index: number,
    ticks: Tick[]
  ) => string | string[] | number | number[] | null | undefined;
  gridOffsetX?: boolean;
  tooltipCallback?: (item: TooltipItem<"line">) => string | string[];
  stats?: Array<StatProps> | null;
  displayNumFormat?: (
    value: number,
    type: "compact" | "standard" | "scientific" | "engineering" | undefined,
    precision: number | [min: number, max: number]
  ) => string;
  _ref?: ForwardedRef<ChartJSOrUndefined<keyof ChartTypeRegistry, any[], unknown>>;
};

const Timeseries: FunctionComponent<TimeseriesProps> = ({
  className = "w-full h-[450px]", // manage CSS here
  menu,
  title,
  description,
  controls,
  isLoading = false,
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
  enableAnimation = true,
  gridOffsetX = true,
  tooltipCallback,
  tickXCallback,
  beginZero = false,
  minY,
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

  const { theme } = useTheme();

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
      animation: {
        duration: enableAnimation ? 1000 : 0,
      },
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
          labels: {
            usePointStyle: true,
            pointStyle: "rect",
          },
          position: "top",
          align: "start",
        },
        tooltip: {
          enabled: true,
          bodyFont: {
            family: "Inter",
          },
          animation: {
            duration: enableAnimation ? 1000 : 0,
          },
          mode: "index",
          intersect: false,
          callbacks: {
            label: tooltipCallback
              ? tooltipCallback
              : function (item) {
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
              annotations: Object.fromEntries(
                data.datasets.map((set, i) => {
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
                  const xIndex =
                    round && round !== "auto" ? INDEXES[round] : data.labels!.length - 1;
                  const yIndex = data.labels!.length - 1;

                  return [
                    i,
                    {
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
                    },
                  ];
                })
              ),
            }
          : false,
        crosshair: enableCrosshair
          ? {
              line: {
                width: 0,
                color: theme === "dark" ? "#FFF" : "#000",
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
        datalabels: false,
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
              : ["year", "month", "quarter", "day"].includes(interval as string)
              ? { quarter: "qQ yyyy", month: "MMM yyyy", year: "yyyy", day: "dd MMM" }[
                  interval as string
                ]
              : "dd MMM yyyy",
          },
          grid: {
            offset: gridOffsetX,
            display: enableGridX,
            borderWidth: 1,
            borderDash: [5, 10],
          },
          ticks: {
            callback: tickXCallback,
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
            color: theme === "dark" ? AKSARA_COLOR.WASHED_DARK : AKSARA_COLOR.OUTLINE,
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
          min: minY,
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
  }, [data, interval, theme]);

  const autoScale = useMemo(() => (data.labels!.length > 200 ? "month" : "day"), [data.labels]);
  const autoRound = useMemo(() => (data.labels!.length > 720 ? "week" : "day"), [data.labels]);

  return (
    <div>
      {isLoading ? (
        <div className={clx("flex items-center justify-center", className)}>
          <Spinner loading={isLoading} />
        </div>
      ) : (
        <div className="flex flex-col gap-y-6">
          <div className="flex flex-col gap-y-3">
            <ChartHeader title={title} menu={menu} controls={controls} state={state} />
            {stats && <Stats data={stats} />}
            {subheader && <div>{subheader}</div>}
          </div>
          <div className={className}>
            <Chart
              ref={_ref}
              data={data}
              options={options()}
              type={type}
              plugins={[
                {
                  id: "increase-legend-spacing",
                  beforeInit(chart) {
                    const originalFit = (chart.legend as any).fit;
                    (chart.legend as any).fit = function fit() {
                      originalFit.bind(chart.legend)();
                      this.height += 20;
                    };
                  },
                },
              ]}
            />
          </div>
        </div>
      )}
      {description && <p className="text-dim pt-4 text-sm">{description}</p>}
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

export type StatProps = {
  title: ReactNode;
  value?: string | false;
  tooltip?: string;
};

export const Stats: FunctionComponent<StatsProps> = ({ data, className }) => {
  return (
    <div className={clx("flex flex-row space-x-6 lg:space-x-8", className)}>
      {data.map(({ title, value, tooltip }: StatProps) => (
        <div key={`${title}_${value}`}>
          <p className="text-dim text-sm">{title}</p>
          {tooltip ? (
            <Tooltip tip={tooltip}>
              {open => (
                <>
                  <p
                    className="font-medium underline decoration-dashed underline-offset-4"
                    onClick={() => open()}
                  >
                    {value}
                  </p>
                </>
              )}
            </Tooltip>
          ) : (
            value && <p className="text-lg font-medium dark:text-white">{value}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default Timeseries;
