import { ForwardedRef, FunctionComponent, useMemo, useRef } from "react";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Tooltip as ChartTooltip,
  ChartData,
} from "chart.js";
import { Bar as BarCanvas } from "react-chartjs-2";
import { numFormat } from "@lib/helpers";
import { ChartCrosshairOption } from "@lib/types";
import type { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

interface PyramidProps extends ChartHeaderProps {
  className?: string;
  data?: ChartData<"bar", any[], string | number>;
  unitX?: string;
  unitY?: string;
  minX?: number;
  maxX?: number;
  precision?: [number, number] | number;
  enableLegend?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  _ref?: ForwardedRef<ChartJSOrUndefined<"bar", any[], string | number>>;
}

const Pyramid: FunctionComponent<PyramidProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  title,
  controls,
  state,
  unitX,
  unitY,
  precision,
  data = dummy,
  enableLegend = false,
  enableGridX = true,
  enableGridY = false,
  minX,
  maxX,
  _ref,
}) => {
  const ref = useRef<ChartJSOrUndefined<"bar", any[], string | number>>();
  ChartJS.register(CategoryScale, LinearScale, PointElement, BarElement, ChartTooltip);

  const display = (value: number, type: "compact" | "standard"): string => {
    return numFormat(value, type, precision) + (unitY ?? "");
  };

  const equimax = useMemo<number>(() => {
    let raw: number[] = [];
    data.datasets.forEach(item => {
      raw = raw.concat(item.data.map(value => Math.abs(value)));
    });
    return Math.max(...raw);
  }, [data]);

  const options: ChartCrosshairOption<"bar"> = {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: enableLegend,
        position: "chartArea" as const,
        align: "start",
      },
      tooltip: {
        bodyFont: {
          family: "Inter",
        },
        callbacks: {
          label: function (item) {
            return `${item.dataset.label} : ${
              item.parsed.x ? display(Math.abs(item.parsed.x), "standard") : "-"
            }`;
          },
        },
      },
      crosshair: false,
    },
    scales: {
      x: {
        type: "linear",
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
          callback: function (value: string | number) {
            return display(Math.abs(value as number), "compact");
          },
        },
        stacked: true,
        min: minX ?? -1 * equimax,
        max: maxX ?? equimax,
      },
      y: {
        reverse: true,
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
          callback: function (value: string | number) {
            return this.getLabels()[value as number].replace("-above", "+");
          },
        },
        beginAtZero: true,
        stacked: true,
      },
    },
  };
  return (
    <div className={className}>
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      <div className={className}>
        <BarCanvas ref={_ref ?? ref} data={data} options={options} />
      </div>
    </div>
  );
};

const dummy = {
  labels: ["0-4", "5-10", "11-14", "15-19", "20-24", "25-29", "30-34", "35-39"], // x-values
  datasets: [
    // grouped y-values
    {
      label: "Male",
      data: [1, 2, 3, 4, 5, 6, 7, 8], // y-values
      fill: true,
      backgroundColor: "#000",
    },
    {
      label: "Female",
      data: [-1, -2, -3, -4, -5, -6, -7, -8], // y-values
      fill: true,
      backgroundColor: "#a4a4a4",
    },
  ],
};

export default Pyramid;
