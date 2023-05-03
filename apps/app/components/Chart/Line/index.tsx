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
import AnnotationPlugin from "chartjs-plugin-annotation";

import { Line as LineCanvas } from "react-chartjs-2";
import { numFormat } from "@lib/helpers";
import { ChartCrosshairOption } from "@lib/types";
import { Stats, StatProps } from "../Timeseries";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";
import { useTheme } from "next-themes";

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
  stats?: Array<StatProps> | null;
  annotation?: any;
  graceX?: number | string;
  enableTooltip?: boolean;
  enableCrosshair?: boolean;
  enableLegend?: boolean;
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
  stats,
  annotation = null,
  graceX = 0,
  enableTooltip = false,
  enableCrosshair = false,
  enableLegend = false,
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
    AnnotationPlugin
  );

  const { theme } = useTheme();

  const options: ChartCrosshairOption<"line"> = {
    maintainAspectRatio: false,
    responsive: true,
    normalized: true,
    plugins: {
      legend: {
        display: enableLegend,
        position: "chartArea" as const,
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
    <div className="space-y-6">
      <div className="space-y-3">
        <ChartHeader title={title} menu={menu} controls={controls} state={state} />
        {subheader && <div className="text-dim text-sm">{subheader}</div>}
        {stats && <Stats data={stats} />}
      </div>
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
