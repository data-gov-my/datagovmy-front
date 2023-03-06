import { FunctionComponent, useMemo } from "react";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  ChartData,
} from "chart.js";
import { Scatter as ScatterCanvas } from "react-chartjs-2";
import { numFormat } from "@lib/helpers";
import { ChartCrosshairOption } from "@lib/types";
import { AKSARA_COLOR } from "@lib/constants";

interface ScatterProps extends ChartHeaderProps {
  className?: string;
  data?: ChartData<"scatter", any[], string | number>;
  unitX?: string;
  unitY?: string;
  prefixY?: string;
  minX?: number;
  minY?: number;
  maxY?: number;
  titleX?: string;
  titleY?: string;
  enableLegend?: boolean;
  enableGridX?: boolean;
  enableGridY?: boolean;
}

const Scatter: FunctionComponent<ScatterProps> = ({
  className = "w-full h-full", // manage CSS here
  menu,
  title,
  controls,
  state,
  unitX,
  unitY,
  prefixY,
  data = dummy,
  enableLegend = false,
  enableGridX = true,
  enableGridY = true,
  titleX,
  titleY,
  minX,
  minY,
  maxY,
}) => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, ChartTooltip);

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
    color: AKSARA_COLOR.BLACK,
    font: {
      size: 14,
      family: "Inter",
      weight: "500",
    },
  });

  const options: ChartCrosshairOption<"scatter"> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: enableLegend,
        position: "chartArea" as const,
        align: "start",
      },
      tooltip: {
        external: externalTooltipHandler,
        enabled: false,
        mode: "nearest",
        bodyFont: {
          family: "Inter",
        },
        callbacks: {
          label: function (item) {
            return JSON.stringify({
              label: item.dataset.label,
              titleX,
              titleY,
              x: display(item.parsed.x, "compact", [1, 1]),
              y: display(item.parsed.y, "compact", [1, 1]),
            });
          },
        },
      },
      crosshair: false,
      annotation: false,
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
  return (
    <div className="space-y-4">
      <ChartHeader title={title} menu={menu} controls={controls} state={state} />
      <div className={className}>
        <ScatterCanvas data={data} options={options} />
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

export default Scatter;
