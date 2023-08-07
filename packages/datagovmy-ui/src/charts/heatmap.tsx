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
import ChartDataLabels from "chartjs-plugin-datalabels";
import { default as ChartHeader, ChartHeaderProps } from "./chart-header";
import { ChartCrosshairOption } from "../../types";
import { Color, useColor } from "../hooks/useColor";
import { DeepPartial } from "chart.js/types/utils";
import "chartjs-adapter-luxon";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { clx, minMax, normalize, numFormat } from "../lib/helpers";

type HeatmapProps = ChartHeaderProps & {
  className?: string;
  width?: number;
  height?: number;
  data?: HeatmapData;
  color?: Color;
  prefix?: string;
  unit?: string;
  precision?: [number, number] | number;
  _ref?: ForwardedRef<ChartJSOrUndefined<"matrix", any[], unknown>>;
};

export type HeatmapDatum = {
  x: string | number;
  y: string | number;
  z: number | null;
};
export type HeatmapData = Array<HeatmapDatum>;

// type HeatmapScaleType = "time" | "category";

const Heatmap: FunctionComponent<HeatmapProps> = ({
  className = "h-[350px]",
  width = 900,
  height = 350,
  title,
  data = dummyCategory,
  menu,
  color = "blues",
  prefix,
  unit,
  controls,
  precision = [1, 0],
  _ref,
}) => {
  ChartJS.register(
    MatrixController,
    MatrixElement,
    LinearScale,
    CategoryScale,
    TimeScale,
    Tooltip,
    ChartDataLabels
  );
  const [min, max, uniqueXs, uniqueYs] = useMemo<
    [number, number, Array<string | number>, Array<string | number>]
  >(() => {
    if (!data) return [0, 1, [], []];
    const [min, max] = minMax(data.map(item => item!.z));
    return [
      min,
      max,
      [...new Set(data.map(item => item.x))],
      [...new Set(data.map(item => item.y))],
    ];
  }, [data]);

  const { interpolate } = useColor(color, [min, max]);

  const display = (
    value: number,
    type: "compact" | "standard",
    precision: number | [min: number, max: number]
  ): string => {
    return (prefix ?? "") + numFormat(value, type, precision) + (unit ?? "");
  };

  const scale = (): {
    x: DeepPartial<ScaleOptionsByType<keyof CartesianScaleTypeRegistry>>;
    y: DeepPartial<ScaleOptionsByType<keyof CartesianScaleTypeRegistry>>;
  } => {
    return {
      x: {
        type: "category",
        labels: uniqueXs as string[],
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
        position: "top",
      },
      y: {
        type: "category",
        labels: uniqueYs.slice().reverse() as string[],
        offset: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
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
    responsive: false,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color(context: { dataIndex: number }) {
          if ([null, 0].includes(data[context.dataIndex].z)) return "#71717A";
          const n_value = normalize(data[context.dataIndex].z!, min, max);
          return n_value > 0.7 ? "#fff" : "#000";
        },
        font: {
          size: 16,
          lineHeight: 24,
        },
        formatter(v: HeatmapDatum) {
          return display(v.z!, "standard", precision);
        },
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
            const v = data[context.dataIndex];
            return `${v.y}, ${v.x}: ${
              v.z === null ? "No data" : display(v.z!, "standard", precision)
            }`;
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
      <ChartHeader title={title} menu={menu} controls={controls} />

      <div className={clx("overflow-x-auto", className)}>
        <Chart
          ref={_ref}
          type="matrix"
          width={width}
          height={height}
          data={{
            datasets: [
              {
                data: data,
                backgroundColor(ctx: ScriptableContext<"matrix">) {
                  return interpolate((ctx.dataset.data[ctx.dataIndex] as HeatmapDatum).z);
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
  { x: 1, y: 1, z: 11 },
  { x: 1, y: 2, z: 12 },
  { x: 1, y: 3, z: 13 },
  { x: 2, y: 1, z: 40 },
  { x: 2, y: 2, z: 22 },
  { x: 2, y: 3, z: 23 },
  { x: 3, y: 1, z: 31 },
  { x: 3, y: 2, z: 36 },
  { x: 3, y: 3, z: 33 },
];

const dummyCategory = [
  { x: "A", y: "X", z: 11 },
  { x: "A", y: "Y", z: 12 },
  { x: "A", y: "Z", z: 13 },
  { x: "B", y: "X", z: 21 },
  { x: "B", y: "Y", z: 22 },
  { x: "B", y: "Z", z: 23 },
  { x: "C", y: "X", z: 31 },
  { x: "C", y: "Y", z: 32 },
  { x: "C", y: "Z", z: 33 },
];

const dummyTime = [
  { x: 1420070400000, y: 1443657600000, z: 11 },
  { x: 1420070400000, y: 1446336000000, z: 12 },
  { x: 1420070400000, y: 1448928000000, z: 13 },

  { x: 1422748800000, y: 1443657600000, z: 21 },
  { x: 1422748800000, y: 1446336000000, z: 22 },
  { x: 1422748800000, y: 1448928000000, z: 23 },

  { x: 1425168000000, y: 1443657600000, z: 31 },
  { x: 1425168000000, y: 1446336000000, z: 32 },
  { x: 1425168000000, y: 1448928000000, z: 33 },
];

export default Heatmap;
