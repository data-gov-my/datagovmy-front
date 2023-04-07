import { ForwardedRef, FunctionComponent, useMemo } from "react";
import {
  CartesianScaleTypeRegistry,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  ScaleOptionsByType,
  ScriptableContext,
  TimeScale,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { MatrixController, MatrixElement } from "chartjs-chart-matrix";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import type { ChartCrosshairOption } from "@lib/types";
import { Color, useColor } from "@hooks/useColor";
import { DeepPartial } from "chart.js/types/utils";
import "chartjs-adapter-luxon";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { minMax } from "@lib/helpers";

interface HeatmapProps extends ChartHeaderProps {
  className?: string;
  data?: HeatmapData;
  color?: Color;
  unitX?: string;
  unitY?: string;
  _ref?: ForwardedRef<ChartJSOrUndefined<"matrix", any[], unknown>>;
}

type HeatmapDatum = {
  x: string | number;
  y: string | number;
  v: number | null;
};
export type HeatmapData = Array<HeatmapDatum>;

// type HeatmapScaleType = "time" | "category";

const Heatmap: FunctionComponent<HeatmapProps> = ({
  className = "h-[400px]",
  title,
  data = dummyCategory,
  menu,
  state,
  color = "blues",
  unitX,
  unitY,
  controls,
  _ref,
}) => {
  ChartJS.register(MatrixController, MatrixElement, LinearScale, CategoryScale, TimeScale, Tooltip);
  const [min, max, uniqueXs, uniqueYs] = useMemo<
    [number, number, Array<string | number>, Array<string | number>]
  >(() => {
    if (!data) return [0, 1, [], []];
    const [min, max] = minMax(data.map(({ v }) => v));
    return [
      min,
      max,
      [...new Set(data.map(item => item.x))],
      [...new Set(data.map(item => item.y))],
    ];
  }, [data]);

  const { interpolate } = useColor(color, [min, max]);

  const scale = (): {
    x: DeepPartial<ScaleOptionsByType<keyof CartesianScaleTypeRegistry>>;
    y: DeepPartial<ScaleOptionsByType<keyof CartesianScaleTypeRegistry>>;
  } => {
    // switch (type) {
    //   case "category":
    return {
      x: {
        type: "category",
        labels: uniqueXs as string[],
        grid: {
          display: false,
        },
      },
      y: {
        type: "category",
        labels: uniqueYs as string[],
        offset: true,
        grid: {
          display: false,
        },
      },
    };
    // TODO: KIV; timeseries in heatmap not important
    //   case "time":
    //     return {
    //       y: {
    //         type: "time",
    //         offset: true,
    //         time: {
    //           displayFormats: {
    //             quarter: "qQ yyyy",
    //             month: "MMM",
    //             week: "dd MMM",
    //           },
    //           tooltipFormat: ["year", "month", "quarter"].includes(interval as string)
    //             ? { quarter: "qQ yyyy", month: "MMM yyyy", year: "yyyy" }[interval as string]
    //             : "dd MMM yyyy",
    //         },
    //         reverse: true,
    //         position: "left",
    //         ticks: {
    //           maxRotation: 0,
    //           autoSkip: true,
    //           padding: 1,
    //           font: {
    //             size: 9,
    //           },
    //         },
    //         grid: {
    //           display: false,
    //           drawBorder: false,
    //           tickLength: 0,
    //         },
    //       },
    //       x: {
    //         type: "time",
    //         position: "bottom",
    //         offset: true,
    //         time: {
    //           isoWeekday: 1,
    //           displayFormats: {
    //             week: "MMM dd",
    //           },
    //         },
    //         ticks: {
    //           maxRotation: 0,
    //           autoSkip: true,
    //           font: {
    //             size: 9,
    //           },
    //         },
    //         grid: {
    //           display: false,
    //           drawBorder: false,
    //         },
    //       },
    //     };
    // }
  };

  const options: ChartCrosshairOption<"matrix"> = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        bodyFont: {
          family: "Inter",
        },
        callbacks: {
          title() {
            return "";
          },
          label(context) {
            const v = context.dataset.data[context.dataIndex] as HeatmapDatum;
            return ["x: " + v.x, "y: " + v.y, "v: " + v.v];
          },
        },
      },
      crosshair: false,
      annotation: false,
    },
    scales: scale(),
  };

  return (
    <div>
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />

      <div className={className}>
        <Chart
          ref={_ref}
          type="matrix"
          data={{
            datasets: [
              {
                data: data,
                borderWidth: 1,
                borderColor: "rgba(0,0,0,0.5)",
                backgroundColor(ctx: ScriptableContext<"matrix">) {
                  return interpolate((ctx.dataset.data[ctx.dataIndex] as HeatmapDatum).v);
                },
                width: ({ chart }) => (chart.chartArea || {}).width / uniqueXs.length - 1,
                height: ({ chart }) => (chart.chartArea || {}).height / uniqueYs.length - 1,
              },
            ],
          }}
          options={options}
        />
      </div>
    </div>
  );
};

const dummyLinear = [
  { x: 1, y: 1, v: 11 },
  { x: 1, y: 2, v: 12 },
  { x: 1, y: 3, v: 13 },
  { x: 2, y: 1, v: 40 },
  { x: 2, y: 2, v: 22 },
  { x: 2, y: 3, v: 23 },
  { x: 3, y: 1, v: 31 },
  { x: 3, y: 2, v: 36 },
  { x: 3, y: 3, v: 33 },
];

const dummyCategory = [
  { x: "A", y: "X", v: 11 },
  { x: "A", y: "Y", v: 12 },
  { x: "A", y: "Z", v: 13 },
  { x: "B", y: "X", v: 21 },
  { x: "B", y: "Y", v: 22 },
  { x: "B", y: "Z", v: 23 },
  { x: "C", y: "X", v: 31 },
  { x: "C", y: "Y", v: 32 },
  { x: "C", y: "Z", v: 33 },
];

const dummyTime = [
  { x: 1420070400000, y: 1443657600000, v: 11 },
  { x: 1420070400000, y: 1446336000000, v: 12 },
  { x: 1420070400000, y: 1448928000000, v: 13 },

  { x: 1422748800000, y: 1443657600000, v: 21 },
  { x: 1422748800000, y: 1446336000000, v: 22 },
  { x: 1422748800000, y: 1448928000000, v: 23 },

  { x: 1425168000000, y: 1443657600000, v: 31 },
  { x: 1425168000000, y: 1446336000000, v: 32 },
  { x: 1425168000000, y: 1448928000000, v: 33 },
];

export default Heatmap;
