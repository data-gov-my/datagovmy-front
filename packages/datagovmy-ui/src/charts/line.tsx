import { ForwardedRef, FunctionComponent, ReactElement } from "react";
import { default as ChartHeader, ChartHeaderProps } from "./chart-header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip as ChartTooltip,
  TimeScale,
  TimeSeriesScale,
  Filler,
  Legend,
  TooltipItem,
} from "chart.js";
import AnnotationPlugin from "chartjs-plugin-annotation";
import { Line as LineCanvas } from "react-chartjs-2";
import { numFormat } from "../lib/helpers";
import { ChartCrosshairOption } from "../../types";
import { Stats, StatProps } from "./timeseries";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import { useTheme } from "next-themes";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

type LineProps = ChartHeaderProps & {
  className?: string;
  subheader?: ReactElement | ReactElement[];
  type?: "category" | "linear" | "logarithmic";
  data?: any;
  prefixX?: string;
  prefixY?: string;
  unitX?: string;
  unitY?: string;
  minY?: number | "auto";
  maxY?: number | "auto";
  enableGridX?: boolean;
  enableGridY?: boolean;
  precision?: number | [min: number, max: number];
  stats?: Array<StatProps> | null;
  annotation?: any;
  graceX?: number | string;
  enableTooltip?: boolean;
  enableCrosshair?: boolean;
  enableLegend?: boolean;
  tooltipCallback?: (item: TooltipItem<"line">) => string | string[];
  _ref?: ForwardedRef<ChartJSOrUndefined<"line", any[], unknown>>;
};

const Line: FunctionComponent<LineProps> = ({
  className = "relative w-full h-[500px]", // manage CSS here
  menu,
  controls,
  subheader,
  title,
  type = "linear",
  prefixX,
  prefixY,
  unitX,
  unitY,
  data = dummy,
  enableGridX = true,
  enableGridY = true,
  precision = [1, 1],
  minY,
  maxY,
  stats,
  annotation = null,
  graceX = 0,
  enableTooltip = false,
  enableCrosshair = false,
  enableLegend = false,
  tooltipCallback,
  _ref,
}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    TimeSeriesScale,
    Filler,
    ChartTooltip,
    CrosshairPlugin,
    AnnotationPlugin,
    Legend
  );

  const { theme } = useTheme();

  const options: ChartCrosshairOption<"line"> = {
    maintainAspectRatio: false,
    responsive: true,
    normalized: true,
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
      crosshair: enableCrosshair
        ? {
            line: {
              width: 0,
              color: theme === "light" ? "#000" : "#FFF",
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
      tooltip: {
        enabled: enableTooltip,
        mode: "index",
        intersect: false,
        callbacks: {
          label: tooltipCallback
            ? tooltipCallback
            : item =>
                `${item.dataset.label as string}: ${
                  item.parsed.y !== undefined || item.parsed.y !== null
                    ? (prefixY ?? "") +
                      numFormat(item.parsed.y, "standard", precision) +
                      (unitY ?? "")
                    : "-"
                }`,
        },
      },
      annotation: {
        annotations: { annotation },
      },
    },
    scales: {
      x: {
        type: type,
        grace: graceX,
        grid: {
          display: enableGridX,
          borderWidth: 1,
          borderDash: [5, 10],
        },
        ticks: {
          font: {
            family: "Inter",
          },
          padding: 6,
          callback: (value: string | number) =>
            (prefixX ?? "") + numFormat(value as number, "compact", precision) + (unitX ?? ""),
        },
      },
      y: {
        grid: {
          display: enableGridY,
          borderWidth: 1,
          borderDash: [5, 5],
          drawTicks: false,
          drawBorder: false,
          offset: false,
        },
        ticks: {
          font: {
            family: "Inter",
          },
          padding: 6,
          callback: (value: string | number) =>
            (prefixY ?? "") + numFormat(value as number, "compact", precision) + (unitY ?? ""),
        },
        min: minY,
        max: maxY,
      },
    },
  };

  return (
    <div className="flex flex-col gap-y-6">
      {[title, menu, controls, subheader, stats].some(Boolean) && (
        <div className="flex flex-col gap-y-3">
          <ChartHeader title={title} menu={menu} controls={controls} />
          {subheader && <div className="text-dim text-sm">{subheader}</div>}
          {stats && <Stats data={stats} />}
        </div>
      )}

      <div className={className}>
        <LineCanvas
          ref={_ref}
          options={options}
          data={data}
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
  );
};

export default Line;

const dummy = {
  labels: [1, 2, 3], // x-values
  datasets: [
    // stacked y-values
    {
      type: "line",
      label: "Moving Average (MA)",
      data: [1, 2, 3], // y-values
      fill: true,
      backgroundColor: "#000",
    },
  ],
};
