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
  LegendItem,
  TimeUnit,
} from "chart.js";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import AnnotationPlugin, { AnnotationOptions } from "chartjs-plugin-annotation";
import { Chart } from "react-chartjs-2";
import { clx, numFormat } from "../lib/helpers";
import "chartjs-adapter-luxon";
import { ChartCrosshairOption } from "../../types";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { useTheme } from "next-themes";
import { AKSARA_COLOR } from "../lib/constants";
import Spinner from "../components/Spinner";
import { flatten } from "lodash";

type Bounds = { y: number; height: number };
export type Periods = TimeUnit | "auto" | false;
export interface TimeseriesProps extends ChartHeaderProps {
  id?: string;
  className?: string;
  description?: string;
  type?: keyof ChartTypeRegistry;
  data?: ChartData<keyof ChartTypeRegistry, any[], string | number>;
  mode?: "grouped" | "stacked";
  subheader?: ReactElement;
  isLoading?: boolean;
  interval?: Periods;
  tooltipFormat?: string;
  displayType?: "compact" | "standard" | "scientific" | "engineering";
  displayXAxis?: boolean;
  displayYAxis?: boolean;
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
  suggestedMaxY?: number;
  suggestedMinY?: number;
  stepSize?: number;
  precision?: number | [max: number, min: number];
  enableAnimation?: boolean;
  enableRightScale?: boolean;
  enableCallout?: boolean;
  enableCrosshair?: boolean;
  enableLegend?: boolean;
  enableTooltip?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  enableMajorTick?: boolean;
  forcedTheme?: string;
  tickXCallback?: (
    this: Scale,
    tickValue: number | string,
    index: number,
    ticks: Tick[]
  ) => string | string[] | number | number[] | null | undefined;
  tickSource?: "auto" | "data" | "labels";
  gridOffsetX?: boolean;
  tooltipCallback?: (item: TooltipItem<"line">) => string | string[];
  tooltipFontStyle?: "normal" | "italic" | "oblique" | "initial" | "inherit";
  stats?: Array<StatProps> | null;
  tooltipItemSort?: (a: TooltipItem<"line">, b: TooltipItem<"line">) => number;
  generateLabels?: (chart: ChartJS<"line">) => LegendItem[];
  displayNumFormat?: (
    value: number,
    type: "compact" | "standard" | "scientific" | "engineering" | undefined,
    precision: number | [min: number, max: number]
  ) => string;
  _ref?: ForwardedRef<ChartJSOrUndefined<keyof ChartTypeRegistry, any[], unknown>>;
}

const Timeseries: FunctionComponent<TimeseriesProps> = ({
  id,
  className = "w-full h-[450px]", // manage CSS here
  menu,
  title,
  description,
  controls,
  isLoading = false,
  interval = "auto",
  tooltipFormat,
  displayType = "standard",
  displayXAxis = true,
  displayYAxis = true,
  prefixY,
  unitY,
  round = "day",
  mode = "stacked",
  data = dummy,
  stats,
  subheader,
  type = "bar",
  axisY = undefined,
  precision = [1, 0],
  enableRightScale = false,
  enableCallout = false,
  enableCrosshair = true,
  enableLegend = false,
  enableGridX = false,
  enableGridY = true,
  enableMajorTick = true,
  enableAnimation = true,
  enableTooltip = true,
  gridOffsetX = true,
  tooltipCallback,
  tooltipFontStyle = "normal",
  tooltipItemSort,
  generateLabels,
  tickXCallback,
  tickSource = "auto",
  forcedTheme,
  beginZero = true,
  minY,
  maxY,
  stepSize,
  suggestedMaxY,
  suggestedMinY,
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
  const isLightMode = forcedTheme ? forcedTheme === "light" : theme === "light";

  const display = (
    value: number,
    type: typeof displayType,
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
          onClick: (e, legendItem, legend) => {
            const index = legendItem.datasetIndex as number;
            const ci = legend.chart;
            if (ci.isDatasetVisible(index)) {
              ci.hide(index);
              legendItem.hidden = true;
            } else {
              ci.show(index);
              legendItem.hidden = false;
            }
          },
          labels: {
            usePointStyle: true,
            pointStyle: "rect",
            generateLabels: generateLabels,
          },
          position: "top",
          align: "start",
        },
        tooltip: {
          enabled: enableTooltip,
          itemSort: tooltipItemSort,
          bodyFont: {
            family: "Inter",
            style: tooltipFontStyle,
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
                      ? display(item.parsed.y, displayType, precision)
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
                drawTime: "afterDatasetsDraw",
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
                    display: false,
                  },
                  beforeDraw: ({ chart, element }) => {
                    const HALF_FONT_SIZE = 6;
                    const MIN_SPACING = 2;
                    const bounds = chart.getSortedVisibleDatasetMetas().map(e => ({
                      index: e.index,
                      y: e.data[e.data.length - 1].y - HALF_FONT_SIZE,
                      height: 2 * HALF_FONT_SIZE + MIN_SPACING,
                    }));

                    const sortedBounds = bounds.sort((a, b) => a.y - b.y);

                    const groupBounds = (group: Bounds[]) => {
                      const first = group[0];
                      const last = group[group.length - 1];
                      return { y: first.y, height: last.y + last.height - first.y };
                    };

                    const isOverlapping = (e1: Bounds, e2: Bounds) =>
                      e1.y + e1.height < e2.y || e2.y + e2.height < e1.y ? false : true;

                    const stackGroupsVertically = (group: Bounds[], y: number) => {
                      let currentY = y;
                      group.forEach(bound => {
                        bound.y = currentY;
                        currentY += bound.height + MIN_SPACING;
                      });
                      return group;
                    };

                    const groups = sortedBounds.map(bound => [bound]);
                    let hasOverlap;

                    do {
                      hasOverlap = false;
                      for (let i = 0; i < groups.length - 1; i++) {
                        const topGrp = groups[i];
                        const btmGrp = groups[i + 1];
                        const top = groupBounds(topGrp);
                        const btm = groupBounds(btmGrp);
                        if (isOverlapping(top, btm)) {
                          const overlap = top.y + top.height - btm.y + MIN_SPACING;
                          const targetY =
                            top.y - overlap * (btmGrp.length / (topGrp.length + btmGrp.length));
                          const newGroup = [...topGrp, ...btmGrp];
                          stackGroupsVertically(newGroup, targetY);
                          groups.splice(i, 2, newGroup);
                          hasOverlap = true;
                          break;
                        }
                      }
                    } while (hasOverlap && groups.length > 1);

                    const centerY =
                      flatten(groups).find(e => e.index === element.options.z)?.y ?? 0;

                    element.y = centerY - HALF_FONT_SIZE;
                    element.y2 = centerY + HALF_FONT_SIZE;
                    return;
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
                  xAdjust: 10,
                  xValue: data.labels![xIndex] as string | number,
                  yAdjust: 0,
                  yValue: set.data[yIndex],
                  z: index,
                } as AnnotationOptions;
              }),
            }
          : false,
        crosshair: enableCrosshair
          ? {
              line: {
                width: 0,
                color: isLightMode ? "#000" : "#FFF",
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
          top: 0,
        },
      },
      scales: {
        x: {
          display: displayXAxis,
          type: "time",
          time: {
            unit: interval === "auto" ? autoScale : interval,
            round: round === "auto" ? autoRound : round,
            displayFormats: {
              quarter: "qQ yyyy",
              month: "MMM",
              week: "dd MMM",
              hour: "dd MMM yyyy HH:mm",
            },
            tooltipFormat: tooltipFormat
              ? tooltipFormat
              : ["year", "month", "quarter", "day", "minute", "hour"].includes(interval as string)
                ? {
                    quarter: "qQ yyyy",
                    month: "MMM yyyy",
                    year: "yyyy",
                    day: "dd MMM yyyy",
                    minute: "dd MMM yyyy HH:mm",
                    hour: "dd MMM yyyy HH:mm",
                  }[interval as string]
                : "dd MMM yyyy",
          },
          grid: {
            offset: gridOffsetX,
            display: enableGridX,
            borderWidth: 1,
            borderDash: [5, 10],
          },
          ticks: {
            autoSkipPadding: 10,
            source: tickSource,
            callback: tickXCallback,
            major: {
              enabled: enableMajorTick,
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
          display: displayYAxis,
          suggestedMax: suggestedMaxY,
          suggestedMin: suggestedMinY,
          grid: {
            display: enableGridY,
            borderWidth: 1,
            borderDash(ctx) {
              if (ctx.tick.value === 0) return [0, 0];
              return [5, 5];
            },
            drawTicks: false,
            drawBorder: false,
            color: isLightMode ? AKSARA_COLOR.OUTLINE : AKSARA_COLOR.WASHED_DARK,
            offset: false,
            lineWidth(ctx) {
              if (ctx.tick.value === 0) return 2;
              return 1;
            },
          },
          ticks: {
            autoSkipPadding: 10,
            precision: Array.isArray(precision) ? precision[1] : precision,
            stepSize: stepSize,
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
        <div className="flex flex-col gap-y-3">
          {[menu, title, controls, stats, subheader].some(Boolean) && (
            <div className="flex flex-col gap-y-3">
              <ChartHeader title={title} menu={menu} controls={controls} />
              {stats && <Stats data={stats} />}
              {subheader && <>{subheader}</>}
            </div>
          )}
          <div className={className}>
            <Chart
              data-testid={id || title}
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
  labels: [
    0, 300000, 600000, 900000, 1200000, 1500000, 1800000, 2100000, 2400000, 2700000, 3000000,
    3300000, 3600000,
  ], //[1111111111111, 1579478400000], // x-values - must be epoch millis eg. [168231311000, 16856172321, ...] etc
  datasets: [
    // stacked y-values
    {
      type: "line",
      label: "Moving Average (MA)",
      data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // y-values
      // data: [1, 2, 3], // y-values
      borderColor: "red",
    },
    // {
    //   type: "bar",
    //   label: "Primary",
    //   data: [4, 5, 6], // y-values
    //   backgroundColor: "blue",
    // },
    // {
    //   type: "bar",
    //   label: "Booster 1",
    //   data: [1, 2, 3], // y-values
    //   backgroundColor: "teal",
    // },
    // {
    //   type: "bar",
    //   label: "Booster 2",
    //   data: [10, 11, 12], // y-values
    //   backgroundColor: "green",
    // },
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
                    className="font-medium underline decoration-dashed [text-underline-position:from-font]"
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
