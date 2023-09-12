import { ChartCrosshairOption } from "../../types";
import { WindowContext } from "../contexts/window";
import { numFormat } from "../lib/helpers";
import { AKSARA_COLOR, BREAKPOINTS } from "../lib/constants";
import { default as ChartHeader, ChartHeaderProps } from "./chart-header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip as ChartTooltip,
  ChartData,
  Legend,
} from "chart.js";
import { useTheme } from "next-themes";
import { FunctionComponent, useContext, useMemo, useRef } from "react";
import { Bar as BarCanvas, getElementAtEvent } from "react-chartjs-2";
import { ChartJSOrUndefined, ForwardedRef } from "react-chartjs-2/dist/types";

interface BarProps extends ChartHeaderProps {
  id?: string;
  className?: string;
  layout?: "vertical" | "horizontal";
  data?: ChartData<"bar", any[], string | number>;
  type?: "category" | "linear" | "logarithmic";
  unitX?: string;
  unitY?: string;
  prefixY?: string;
  minY?: number;
  maxY?: number;
  suggestedMaxY?: number;
  precision?: [number, number] | number;
  formatX?: (key: string) => string | string[];
  onClick?: (label: string, index: number) => void;
  reverse?: boolean;
  enableLegend?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  enableStack?: boolean;
  enableStep?: boolean;
  interactive?: boolean;
  tooltipEnabled?: boolean;
  _ref?: ForwardedRef<ChartJSOrUndefined<"bar", any[], string | number>>;
}

const Bar: FunctionComponent<BarProps> = ({
  id,
  className = "w-full h-full", // manage CSS here
  menu,
  title,
  controls,
  type = "category",
  unitX,
  enableStep,
  unitY,
  prefixY,
  layout = "vertical",
  data = dummy,
  formatX,
  onClick,
  reverse = false,
  precision = [1, 0],
  enableLegend = false,
  enableStack = false,
  enableGridX = true,
  enableGridY = true,
  minY,
  maxY,
  suggestedMaxY,
  tooltipEnabled = true,
  _ref,
}) => {
  const ref = useRef<ChartJSOrUndefined<"bar", any[], string | number>>();
  const isVertical = useMemo(() => layout === "vertical", [layout]);
  const { size } = useContext(WindowContext);
  ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ChartTooltip, Legend);
  const { theme = "light" } = useTheme();

  const display = (
    value: number,
    type: "compact" | "standard",
    precision: number | [number, number]
  ): string => {
    return (prefixY ?? "") + numFormat(value, type, precision) + (unitY ?? "");
  };

  const displayLabel = (value: string) => {
    const label = formatX ? formatX(value) : value;
    if (label.length > 25 && size.width < BREAKPOINTS.SM) return label.slice(0, 25).concat("..");
    return label;
  };

  const _data = useMemo<ChartData<"bar", any[], string | number>>(() => {
    if (!reverse) return data;
    return {
      labels: data.labels?.slice().reverse(),
      datasets: data.datasets.map(set => ({ ...set, data: set.data.slice().reverse() })),
    };
  }, [data]);

  const options: ChartCrosshairOption<"bar"> = {
    indexAxis: !isVertical ? "y" : "x",
    maintainAspectRatio: false,
    responsive: true,
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
        enabled: tooltipEnabled,
        bodyFont: {
          family: "Inter",
        },
        callbacks: {
          label: function (item) {
            const tip: Record<typeof layout, string> = {
              vertical:
                item.parsed.y !== undefined || item.parsed.y !== null
                  ? display(item.parsed.y, "standard", precision)
                  : "-",
              horizontal:
                item.parsed.x !== undefined || item.parsed.x !== null
                  ? display(item.parsed.x, "standard", precision)
                  : "-",
            };
            return `${item.dataset.label}: ${tip[layout]}`;
          },
          title(item) {
            return formatX ? formatX(item[0].label) : item[0].label;
          },
        },
      },
      crosshair: false,
      annotation: false,
      datalabels: false,
    },
    scales: {
      x: {
        // type: isVertical ? type : "linear",
        grid: {
          display: enableGridX,
          borderWidth: 1,
          borderDash: [5, 10],
          color: theme === "light" ? AKSARA_COLOR.OUTLINE : AKSARA_COLOR.WASHED_DARK,
          drawTicks: true,
          drawBorder: true,
        },
        ticks: {
          font: {
            family: "Inter",
          },
          padding: 6,
          major: {
            enabled: true,
          },
          stepSize:
            enableStep && Math.min.apply(Math, _data.datasets[0].data) <= 0
              ? Math.ceil(Math.abs(Math.floor(Math.min.apply(Math, _data.datasets[0].data))))
              : 0,
          callback: function (value: string | number) {
            if (!formatX) {
              return isVertical
                ? this.getLabelForValue(value as number).concat(unitX ?? "")
                : display(value as number, "compact", precision);
            }
            let text = isVertical
              ? formatX(this.getLabelForValue(value as number))
              : display(value as number, "compact", precision);
            if (text.length > 25) text = text.slice(0, 25).concat("..");
            return text;
          },
        },
        stacked: enableStack,
      },
      y: {
        // reverse: !isVertical,
        suggestedMax: suggestedMaxY,
        grid: {
          display: enableGridY,
          borderWidth: 1,
          drawTicks: false,
          drawBorder: false,
          offset: false,
          color: theme === "light" ? AKSARA_COLOR.OUTLINE : AKSARA_COLOR.WASHED_DARK,
          borderDash(ctx) {
            if (ctx.tick.value === 0) return [0, 0];
            return [5, 5];
          },
          lineWidth(ctx) {
            if (ctx.tick.value === 0) return 2;
            return 1;
          },
        },
        ticks: {
          font: {
            family: "Inter",
          },
          precision: Array.isArray(precision) ? precision[1] : precision,
          callback: function (value: string | number) {
            return displayLabel(
              isVertical
                ? display(value as number, "compact", precision)
                : this.getLabelForValue(value as number).concat(unitX ?? "")
            );
          },
        },

        min: minY,
        max: maxY,
        stacked: enableStack,
      },
    },
  };
  return (
    <div className="space-y-4">
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <BarCanvas
          id={id}
          data-testid={id}
          ref={_ref ?? ref}
          onClick={event => {
            if (ref?.current) {
              const element = getElementAtEvent(ref.current, event);
              onClick &&
                element.length &&
                onClick(_data?.labels![element[0].index].toString(), element[0].index);
            }
          }}
          data={_data}
          options={options}
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

const dummy = {
  labels: ["0-4", "5-10", "11-14"], // x-values
  datasets: [
    // grouped y-values
    {
      label: "Moving Average (MA)",
      data: [1, 2, 3], // y-values
      fill: true,
      backgroundColor: "#000",
    },
    {
      label: "Primary",
      data: [4, 1, 7], // y-values
      fill: true,
      backgroundColor: "#a4a4a4",
      stack: "primary",
    },
  ],
};

export default Bar;
