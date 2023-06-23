import { FunctionComponent, ReactElement } from "react";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
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
} from "chart.js";

import { Line as LineCanvas } from "react-chartjs-2";
import { numFormat } from "@lib/helpers";
import { ChartCrosshairOption } from "@lib/types";

interface LineProps extends ChartHeaderProps {
  className?: string;
  subheader?: ReactElement | ReactElement[];
  type?: "category" | "linear" | "logarithmic";
  data?: any;
  unitX?: string;
  unitY?: string;
  minY?: number | "auto";
  maxY?: number | "auto";
  enableGridX?: boolean;
  enableGridY?: boolean;
}

const Line: FunctionComponent<LineProps> = ({
  className = "relative w-full h-[500px]", // manage CSS here
  menu,
  controls,
  subheader,
  title,
  state,
  type = "linear",
  unitX,
  unitY,
  data = dummy,
  enableGridX = true,
  enableGridY = true,
  minY,
  maxY,
}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale,
    TimeSeriesScale,
    Filler,
    ChartTooltip
  );

  const options: ChartCrosshairOption<"line"> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      crosshair: {
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
      },
    },
    scales: {
      x: {
        type: type,
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
            return this.getLabelForValue(value as number).concat(unitX ?? "");
          },
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
          callback: function (value: string | number) {
            return numFormat(value as number).concat(unitY ?? "");
          },
        },
        min: minY,
        max: maxY,
      },
    },
  };

  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      {subheader && <div className="py-4">{subheader}</div>}
      <div className={className}>
        <LineCanvas options={options} data={data} />
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
