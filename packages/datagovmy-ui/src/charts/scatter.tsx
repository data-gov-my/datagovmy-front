import { ForwardedRef, FunctionComponent } from "react";
import { default as ChartHeader, ChartHeaderProps } from "./chart-header";
import {
  Chart as ChartJS,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  ChartDataset,
  Legend,
} from "chart.js";
import { Scatter as ScatterCanvas } from "react-chartjs-2";
import { maxBy, minBy, numFormat, standardDeviation } from "../lib/helpers";
// import RegressionPlugin from "./regression-line";
import { ChartCrosshairOption } from "../../types";
import { AKSARA_COLOR } from "../lib/constants";
import { useTheme } from "next-themes";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import AnnotationPlugin from "chartjs-plugin-annotation";
import { CrosshairPlugin } from "chartjs-plugin-crosshair";

export type ScatterData = ChartDataset<"scatter", any[]>;

type ScatterProps = ChartHeaderProps & {
  className?: string;
  data?: ScatterData[];
  unitX?: string;
  unitY?: string;
  prefixY?: string;
  minX?: number;
  minY?: number;
  maxY?: number;
  titleX?: string;
  titleY?: string;
  enableCrosshair?: boolean;
  enableRegression?: boolean;
  enableLegend?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
  _ref?: ForwardedRef<ChartJSOrUndefined<"scatter", any[], unknown>>;
};

const Scatter: FunctionComponent<ScatterProps> = ({
  className = "w-full h-full lg:h-[400px]", // manage CSS here
  menu,
  title,
  controls,
  unitX,
  unitY,
  prefixY,
  data = dummy,
  enableCrosshair = false,
  enableRegression = false,
  enableLegend = false,
  enableGridX = true,
  enableGridY = true,
  titleX,
  titleY,
  minX,
  minY,
  maxY,
  _ref,
}) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    ChartTooltip,
    AnnotationPlugin,
    CrosshairPlugin,
    Legend
  );
  const { theme } = useTheme();

  const display = (
    value: number,
    type: "compact" | "standard",
    precision: number | [number, number]
  ): string => {
    return (prefixY ?? "") + numFormat(value, type, precision) + (unitY ?? "");
  };

  const titleConfig = (axis: string | undefined) => ({
    display: Boolean(axis),
    text: axis,
    color: theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.DIM,
    font: {
      size: 14,
      family: "Inter",
      weight: "500",
    },
  });

  const yieldRegressionYs = (_data: ChartDataset<"scatter", any[]>): [min: number, max: number] => {
    const { data } = _data;
    let xSum = 0,
      ySum = 0,
      xySum = 0,
      xSquare = 0,
      ySquare = 0;

    if (data?.length) {
      data.forEach(datum => {
        if (datum.y === null) return;
        xySum += datum.x * datum.y;
        xSum += datum.x;
        ySum += datum.y;
        xSquare += Math.pow(datum.x, 2);
        ySquare += Math.pow(datum.y, 2);
      });

      // Finding coefficient correlation (r)
      const r_num = xySum * data.length - xSum * ySum;
      const r_den_left = data.length * xSquare - Math.pow(xSum, 2);
      const r_den_right = data.length * ySquare - Math.pow(ySum, 2);
      const r_den = Math.sqrt(r_den_left * r_den_right);
      const r = r_num / r_den;

      // Finding slope
      const slope =
        (r * standardDeviation(data.map(({ y }) => (y !== null ? y : 0)))) /
        standardDeviation(data.map(({ x }) => x));

      // Finding y-intercept
      const y_intercept = ySum / data.length - (slope * xSum) / data.length;
      const max_x = maxBy(data, "x").x;
      const min_x = minBy(data, "x").x;

      return [min_x * slope + y_intercept, max_x * slope + y_intercept];
    }
    return [0, 0];
  };

  const options: ChartCrosshairOption<"scatter"> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: enableLegend,
        position: "top",
        align: "start",
        labels: {
          usePointStyle: true,
          pointStyle: "rect",
        },
      },
      tooltip: {
        enabled: true,
        mode: "nearest",
        bodyFont: {
          family: "Inter",
        },
        callbacks: {
          label: function (item) {
            return `${item.dataset.label!}: (${display(
              item.parsed.x,
              "compact",
              [1, 1]
            )}, ${display(item.parsed.y, "compact", [1, 1])})`;
          },
        },
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
      annotation: enableRegression
        ? {
            clip: false,
            common: {
              drawTime: "afterDatasetsDraw",
            },
            annotations: data.map(set => {
              return {
                id: set.label,
                type: "line",
                scaleID: set.label,
                yMin: yieldRegressionYs(set)[0],
                yMax: yieldRegressionYs(set)[1],
                borderColor: set.backgroundColor ? set.backgroundColor + "cc" : "black",
                display(ctx) {
                  return !ctx.chart.legend?.legendItems?.find(item => item.text === set.label)
                    ?.hidden;
                },
                borderWidth: 2,
              };
            }),
          }
        : false,
      datalabels: false,
    },
    scales: {
      x: {
        title: titleConfig(titleX),
        type: "linear",
        grid: {
          display: enableGridX,
          borderWidth: 1,
          drawTicks: true,
          drawBorder: true,
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
          padding: 6,
          callback: function (value: string | number) {
            return display(value as number, "compact", 1);
          },
        },
        min: minX,
      },
      y: {
        title: titleConfig(titleY),
        grid: {
          display: enableGridY,
          borderWidth: 1,
          drawTicks: false,
          drawBorder: false,
          offset: false,
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
          padding: 6,
          callback: function (value: string | number) {
            return display(value as number, "compact", 1).concat(unitX ?? "");
          },
        },
        min: minY,
        max: maxY,
      },
    },
  };

  /**
   * @deprecated To be replaced with line annotations
   *
   * Generate linear regression lines for the scatter plot.
   * @param data ChartDataset<"scatter", any[]>
   * @returns ChartDataset<"line", any[]>
   *
   * @tutorial yieldRegressionLine
   * Formula: y = mx + b
   * m = slope
   * b = y-intercept
   *
   * Slope formula: m = r * sy/sx
   * r = correlation coefficient
   * sy = standard deviation for ys
   * sx = standard deviation for xs
   *
   * Correlation coefficient formula:r = (n*xySum - xSum*ySum) / sqrt([n*xSquareSum - xSum^2] * [n*ySquareSum - ySum^2])
   * n = data length
   * xySum =
   *
   * Y-intercept formula: b = y_bar - m*x_bar
   * y_bar = average y
   * x_bar = average x
   */
  //   const yieldRegressionLine = (_data: ChartDataset<"scatter", any[]>) => {
  //     const { fill: _, data, borderColor: __, backgroundColor: ___, ...config } = _data;
  //     let xSum = 0,
  //       ySum = 0,
  //       xySum = 0,
  //       xSquare = 0,
  //       ySquare = 0;

  //     if (data?.length) {
  //       data.forEach(datum => {
  //         if (datum.y === null) return;
  //         xySum += datum.x * datum.y;
  //         xSum += datum.x;
  //         ySum += datum.y;
  //         xSquare += Math.pow(datum.x, 2);
  //         ySquare += Math.pow(datum.y, 2);
  //       });

  //       // Finding coefficient correlation (r)
  //       const r_num = xySum * data.length - xSum * ySum;
  //       const r_den_left = data.length * xSquare - Math.pow(xSum, 2);
  //       const r_den_right = data.length * ySquare - Math.pow(ySum, 2);
  //       const r_den = Math.sqrt(r_den_left * r_den_right);
  //       const r = r_num / r_den;

  //       // Finding slope
  //       const slope =
  //         (r * standardDeviation(data.map(({ y }) => (y !== null ? y : 0)))) /
  //         standardDeviation(data.map(({ x }) => x));

  //       // Finding y-intercept
  //       const y_intercept = ySum / data.length - (slope * xSum) / data.length;
  //       const max_x = maxBy(data, "x").x;
  //       const min_x = minBy(data, "x").x;

  //       return {
  //         ...config,
  //         type: "line" as "scatter", // hack to avoid TS type mismatch error
  //         data: [
  //           calculatePoint(min_x, slope, y_intercept),
  //           calculatePoint(max_x, slope, y_intercept),
  //         ],
  //         borderWidth: 1,
  //         backgroundColor: _data.backgroundColor,
  //         borderColor: _data.borderColor,
  //       };
  //     }
  //     return {
  //       data: [],
  //     };
  //   };

  const calculatePoint = (x: number, slope: number, intercept: number) => {
    return { x: x, y: slope * x + intercept };
  };

  return (
    <div className="space-y-4">
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={className}>
        <ScatterCanvas
          ref={_ref}
          data={{
            datasets: data.map(({ label, data, ...rest }: ChartDataset<"scatter", any[]>) => ({
              label,
              data,
              ...rest,
            })),
            //   ...(enableRegression
            //     ? data.map((set: ChartDataset<"scatter", any>) => yieldRegressionLine(set))
            //     : [{ data: [] }]),
            // ],
          }}
          options={options}
        />
      </div>
    </div>
  );
};

/**
 * @todo Refactor to component.
 * @param chart
 * @returns <Tooltip />
 */
const getOrCreateTooltip = (chart: any) => {
  let tooltipEl = chart.canvas.parentNode.querySelector("div");

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.style.background = "rgba(0, 0, 0, 0.7)";
    tooltipEl.style.borderRadius = "3px";
    tooltipEl.style.color = "white";
    tooltipEl.style.opacity = 1;
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.transform = "translate(-50%, 0)";
    tooltipEl.style.transition = "all .1s ease";
    tooltipEl.style.zIndex = 20;
    tooltipEl.style.width = "max-content";

    // const ul = document.createElement("ul");
    // ul.style.margin = "0px";
    const table = document.createElement("table");
    table.style.margin = "0px";

    tooltipEl.appendChild(table);
    chart.canvas.parentNode.appendChild(tooltipEl);
  }

  return tooltipEl;
};

const externalTooltipHandler = (context: { chart: any; tooltip: any }) => {
  // Tooltip Element
  const { chart, tooltip } = context;
  const tooltipEl = getOrCreateTooltip(chart);

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = 0;
    return;
  }

  if (tooltip.body) {
    const titleLines = tooltip.title || [];
    const bodyLines = tooltip.body.map((b: { lines: any }) => b.lines);

    const tableHead = document.createElement("thead");

    titleLines.forEach((title: string) => {
      const tr = document.createElement("tr");
      tr.style.borderWidth = "0";

      const th = document.createElement("th");
      th.style.borderWidth = "0";
      const text = document.createTextNode(title);

      th.appendChild(text);
      tr.appendChild(th);
      tableHead.appendChild(tr);
    });

    const tableBody = document.createElement("tbody");

    if (bodyLines.length > 5) {
      for (let i = 0; i < 5; i++) {
        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = "0";

        const td = document.createElement("td");
        td.style.borderWidth = "0";
        td.style.fontSize = "14px";

        const text = document.createTextNode(bodyLines[i]);

        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      }

      const trExtra = document.createElement("tr");
      trExtra.style.backgroundColor = "inherit";
      trExtra.style.borderWidth = "0";
      const tdExtra = document.createElement("td");
      tdExtra.style.borderWidth = "0";
      tdExtra.style.fontSize = "14px";
      const textExtra = document.createTextNode(`and ${bodyLines.length - 5} more.`);
      tdExtra.appendChild(textExtra);
      trExtra.appendChild(tdExtra);
      tableBody.appendChild(trExtra);
    } else {
      bodyLines.forEach((body: string, i: string | number) => {
        const colors = tooltip.labelColors[i];

        const tr = document.createElement("tr");
        tr.style.backgroundColor = "inherit";
        tr.style.borderWidth = "0";

        const td = document.createElement("td");
        td.style.borderWidth = "0";
        td.style.fontSize = "14px";
        td.style.whiteSpace = "pre-line";

        const tip = JSON.parse(body);
        const tip_string = `${tip.label} 
        ${tip.titleX}: ${tip.x}
        ${tip.titleY}: ${tip.y}
        `;

        const text = document.createTextNode(tip_string);

        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });
    }

    const tableRoot = tooltipEl.querySelector("table");

    // Remove old children
    while (tableRoot.firstChild) {
      tableRoot.firstChild.remove();
    }

    // Add new children
    tableRoot.appendChild(tableHead);
    tableRoot.appendChild(tableBody);

    // ulRoot.appendChild(tableHead);
    // tableRoot.appendChild(tableBody);
  }

  const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

  // Display, position, and set styles for font
  tooltipEl.style.opacity = 1;
  tooltipEl.style.left = positionX + tooltip.caretX + "px";
  tooltipEl.style.top = positionY + tooltip.caretY + "px";
  tooltipEl.style.font = tooltip.options.bodyFont.string;
  tooltipEl.style.padding = tooltip.options.padding + "px " + tooltip.options.padding + "px";
};

const dummy: ScatterData[] = [
  {
    label: "category 1", // label
    data: [
      {
        x: 0,
        y: 0,
      },
      {
        x: 1,
        y: 1,
      },
      {
        x: 2,
        y: 2,
      },
      {
        x: 3,
        y: 3,
      },
      {
        x: 4,
        y: 4,
      },
    ],
  },
  {
    label: "category 2",
    data: [
      {
        x: 0,
        y: 4,
      },
      {
        x: 1,
        y: 3,
      },
      {
        x: 2,
        y: 2,
      },
      {
        x: 3,
        y: 1,
      },
      {
        x: 4,
        y: 0,
      },
    ],
  },
];

export default Scatter;
