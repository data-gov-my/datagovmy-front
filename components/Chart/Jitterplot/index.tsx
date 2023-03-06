import type { ScriptableContext } from "chart.js";
import { FunctionComponent, ReactNode, useCallback, useMemo } from "react";
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip } from "chart.js";
import { Bubble } from "react-chartjs-2";
import { default as ChartHeader, ChartHeaderProps } from "../ChartHeader";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { ChartCrosshairOption } from "@lib/types";

/** ------------------------GROUPED------------------------------------- */

type JitterDatum = {
  x: number;
  y: number;
  id: string;
  tooltip: string | number;
};
export type JitterData = {
  key: string;
  data: JitterDatum[];
};

interface JitterplotsProps extends Pick<ChartHeaderProps, "title"> {
  className?: string;
  data?: Array<JitterData>;
  active?: string;
  actives?: string[];
  formatTitle?: (key: string) => ReactNode;
  formatTooltip?: (key: string, value: number) => ReactNode;
}

const Jitterplots: FunctionComponent<JitterplotsProps> = ({
  title,
  data = dummies,
  className,
  active = "",
  actives = [],
  formatTitle,
  formatTooltip,
}) => {
  return (
    <div>
      <ChartHeader title={title} className="z-10" />
      <div className={["space-y-2 pt-3", className].join(" ")}>
        {data.map((set: JitterData, index: number) => (
          <Jitterplot
            key={index}
            data={set}
            active={active}
            actives={actives}
            formatTitle={formatTitle}
            formatTooltip={formatTooltip}
          />
        ))}
      </div>
    </div>
  );
};

/** -----------------------INDIVIDUAL----------------------------------- */
interface JitterplotProps extends ChartHeaderProps {
  data: JitterData;
  active: string;
  actives: string[];
  formatTitle?: (key: string) => ReactNode;
  formatTooltip?: (key: string, value: number) => ReactNode;
}

const Jitterplot: FunctionComponent<JitterplotProps> = ({
  data,
  active,
  actives,
  formatTitle,
  formatTooltip,
}) => {
  ChartJS.register(LinearScale, PointElement, LineElement, Tooltip);
  const DEFAULT_STYLE = {
    backgroundColor: data.data.length < 20 ? "#E0E0E0" : "#EEEEEE",
    radius: 5,
    hoverRadius: 1,
  };
  const options: ChartCrosshairOption<"bubble"> = {
    plugins: {
      legend: {
        display: false,
        position: "chartArea" as const,
        align: "start",
      },
      tooltip: {
        external: externalTooltipHandler,
        position: "nearest",
        displayColors: false,
        enabled: false,
        bodyFont: {
          family: "Inter",
          size: 14,
        },

        callbacks: {
          label: function (item: any) {
            if (!item.raw.id) return "";
            if (!formatTooltip) return `${item.raw.id}: ${item.raw.tooltip}`;

            return formatTooltip(data.key, item.raw.tooltip)
              ? `${item.raw.id}: ${formatTooltip(data.key, item.raw.tooltip)}`
              : item.raw.id;
          },
        },
      },
      crosshair: false,
    },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        display: false,
        max: 1.01,
        min: -1.01,
      },
      y: {
        display: false,
        beginAtZero: true,
      },
    },
  };

  const activePoints = useCallback<
    (ctx: ScriptableContext<"bubble">) => {
      backgroundColor: string;
      radius: number;
      hoverRadius: number;
    }
  >(
    ({ raw }: ScriptableContext<"bubble">) => {
      if (active.toLowerCase().includes((raw as JitterDatum)?.id.toLowerCase()))
        return { backgroundColor: AKSARA_COLOR.BLACK, radius: 6, hoverRadius: 1 };

      const index = actives.findIndex(item =>
        item.toLowerCase().includes((raw as JitterDatum).id.toLowerCase())
      );

      switch (index) {
        case 0:
          return { backgroundColor: "#DC2626", radius: 6, hoverRadius: 1 };
        case 1:
          return { backgroundColor: "#2563EB", radius: 6, hoverRadius: 1 };
        case 2:
          return { backgroundColor: "#FBBF24", radius: 6, hoverRadius: 1 };
        default:
          return DEFAULT_STYLE;
      }
    },
    [actives, active]
  );

  const _data = useMemo<Record<string, JitterDatum[]>>(() => {
    let result: Record<string, JitterDatum[]> = {
      actives: [],
      default: [],
    };

    data.data.forEach(item => {
      if ([active, ...actives].some(raw => raw.split(",")[0].includes(item.id))) {
        result.actives.push(item);
      } else {
        result.default.push(item);
      }
    });

    return result;
  }, [actives, active]);

  return (
    <>
      {data.data[0].x !== null && (
        <div className="grid w-full grid-cols-1 items-center gap-1 lg:grid-cols-5">
          <p className="bg-white">{formatTitle ? formatTitle(data.key) : data.key}</p>
          <div className="col-span-1 overflow-visible lg:col-span-4">
            <Bubble
              className="h-10 overflow-visible rounded-full border bg-outline/20 px-4"
              options={options}
              data={{
                datasets: [
                  {
                    data: _data.actives,
                    borderWidth: 0,
                    backgroundColor(ctx) {
                      return activePoints(ctx).backgroundColor;
                    },
                    radius(ctx) {
                      return activePoints(ctx).radius;
                    },
                    hoverRadius(ctx) {
                      return activePoints(ctx).hoverRadius;
                    },
                    order: 0,
                  },
                  {
                    data: _data.default,
                    borderWidth: 0,
                    backgroundColor: DEFAULT_STYLE.backgroundColor,
                    radius: DEFAULT_STYLE.radius,
                    hoverRadius: DEFAULT_STYLE.hoverRadius,
                    order: 1,
                  },
                ],
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Jitterplots;

const dummy: JitterDatum[] = Array(Object.keys(CountryAndStates).length)
  .fill(0)
  .map(
    (_, index): JitterDatum => ({
      x: Math.floor(Math.random() * 100 + 0),
      y: Math.floor(Math.random() * 100 + 0),
      id: Object.values(CountryAndStates)[index],
      tooltip: 1,
    })
  );

const dummy_keys = ["Land area", "Population Density", "Household income", "Access to electricity"];
const dummies: JitterData[] = Array(dummy_keys.length)
  .fill(0)
  .map((_, index) => ({ key: dummy_keys[index], data: dummy }));

///

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

        const text = document.createTextNode(body);
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
