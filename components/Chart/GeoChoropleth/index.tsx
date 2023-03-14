import { Chart } from "react-chartjs-2";
import * as ChartGeo from "chartjs-chart-geo";
import { FunctionComponent, useMemo, useRef, useEffect, forwardRef, ForwardedRef } from "react";
import { default as ChartHeader, ChartHeaderProps } from "@components/Chart/ChartHeader";
import ParliamentDesktop from "@lib/geojson/parlimen_desktop.json";
import ParliamentMobile from "@lib/geojson/parlimen_mobile.json";
import DistrictDesktop from "@lib/geojson/district_desktop.json";
import DistrictMobile from "@lib/geojson/district_mobile.json";
import DunDesktop from "@lib/geojson/dun_desktop.json";
import DunMobile from "@lib/geojson/dun_mobile.json";
import StateDesktop from "@lib/geojson/state_desktop.json";
import StateMobile from "@lib/geojson/state_mobile.json";
import { numFormat } from "@lib/helpers";
import { BREAKPOINTS } from "@lib/constants";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { useTranslation } from "@hooks/useTranslation";
import { useZoom } from "@hooks/useZoom";
import { ArrowPathIcon, MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import type { ChoroplethColors, ChartCrosshairOption } from "@lib/types";
import { Chart as ChartJS, ChartTypeRegistry } from "chart.js";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

/**
 *GeoChoropleth component
 */

export type GeoChoroplethData = {
  labels: string[];
  values: number[];
};

interface GeoChoroplethProps extends ChartHeaderProps {
  className?: string;
  data?: GeoChoroplethData;
  prefixY?: string;
  unitY?: string;
  precision?: number | [number, number];
  enableZoom?: boolean;
  enableScale?: boolean;
  graphChoice?: "state" | "parlimen" | "dun" | "district";
  colorScale?:
    | "blues"
    | "brBG"
    | "buGn"
    | "buPu"
    | "cividis"
    | "cool"
    | "cubehelixDefault"
    | "gnBu"
    | "greens"
    | "greys"
    | "inferno"
    | "magma"
    | "orRd"
    | "oranges"
    | "pRGn"
    | "piYG"
    | "plasma"
    | "puBu"
    | "puBuGn"
    | "puOr"
    | "puRd"
    | "purples"
    | "rainbow"
    | "rdBu"
    | "rdGy"
    | "rdPu"
    | "rdYlBu"
    | "rdYlGn"
    | "reds"
    | "sinebow"
    | "spectral"
    | "turbo"
    | "viridis"
    | "warm"
    | "ylGn"
    | "ylGnBu"
    | "ylOrBr"
    | "ylOrRd";
  hideValue?: boolean;
  borderWidth?: any;
  borderColor?: any;
  projectionTranslation?: any;
  projectionScaleSetting?: number;
  onReady?: (status: boolean) => void;
  _ref?: ForwardedRef<ChartJSOrUndefined<keyof ChartTypeRegistry, any[], unknown>>;
}

const GeoChoropleth: FunctionComponent<GeoChoroplethProps> = forwardRef(
  (
    {
      className = "w-full h-[460px]",
      controls,
      menu,
      title,
      data = dummyData,
      prefixY,
      precision = 1,
      unitY,
      graphChoice = "state",
      colorScale,
      borderWidth = 0.25,
      borderColor = "#13293d",
      enableZoom = true,
      hideValue = false,
      onReady,
    },
    _ref: ForwardedRef<ChartJSOrUndefined<keyof ChartTypeRegistry, any[], unknown>>
  ) => {
    const { t } = useTranslation();
    const zoomRef = useRef(null);
    const { onWheel, onMove, onDown, onUp, onReset, zoomIn, zoomOut } = useZoom(
      enableZoom,
      zoomRef
    );

    ChartJS.register(
      ChartGeo.ChoroplethController,
      ChartGeo.ProjectionScale,
      ChartGeo.ColorScale,
      ChartGeo.GeoFeature
    );

    const windowWidth = useWindowWidth();
    const presets = useMemo(
      () => ({
        parlimen: {
          feature:
            windowWidth < BREAKPOINTS.MD ? ParliamentMobile.features : ParliamentDesktop.features,
        },
        dun: { feature: windowWidth < BREAKPOINTS.MD ? DunMobile.features : DunDesktop.features },
        district: {
          feature:
            windowWidth < BREAKPOINTS.MD ? DistrictMobile.features : DistrictDesktop.features,
        },
        state: {
          feature: windowWidth < BREAKPOINTS.MD ? StateMobile.features : StateDesktop.features,
        },
      }),
      [windowWidth]
    );

    const config = useMemo(
      () => ({
        feature: presets[graphChoice].feature,
        colors: colorScale,
        borderWidth: borderWidth,
        borderColor: borderColor,
      }),
      [colorScale, borderWidth, borderColor, windowWidth]
    );

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

    const options: ChartCrosshairOption<"choropleth"> = {
      elements: {
        geoFeature: {
          outlineBorderColor: "black",
        },
      },
      maintainAspectRatio: false,
      showOutline: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          // enabled: false,
          // external: externalTooltipHandler,
          animation: {
            duration: 0,
          },
          bodyFont: {
            family: "Inter",
          },
          callbacks: {
            label: function (item: any) {
              if (!item.raw.feature.id) return "";
              if (!item.raw.value) return ` ${item.raw.feature.id}: ${t("common.no_data")}`;
              const special_code: Record<string, any> = {
                "-1.1": "",
              };

              return ` ${item.raw.feature.id}${
                hideValue
                  ? ""
                  : special_code[item.raw.value.toString()]
                  ? special_code[item.raw.value.toString()]
                  : `: ${prefixY ?? ""}${numFormat(item.raw.value, "standard", precision)}${
                      unitY ?? ""
                    }`
              }`;
            },
          },
        },
        crosshair: false,
      },
      scales: {
        xy: {
          projection: "mercator",
        },
        color: {
          display: false,
          interpolate: colorScale,
          missing: "#fff",
        },
      },
    };

    useEffect(() => {
      if (onReady) onReady(true);
    }, []);
    return (
      <div className="relative">
        <ChartHeader title={title} menu={menu} controls={controls} />

        <div
          className={`border border-outline border-opacity-0 transition-all active:border-opacity-100 ${className}`}
          ref={zoomRef}
          // onWheel={onWheel}
          onMouseMove={onMove}
          onMouseDown={onDown}
          onMouseUp={onUp}
          onTouchStart={onDown}
          onTouchEnd={onUp}
          onTouchMove={onMove}
          // onMouseOut={onUp}
        >
          <Chart
            ref={_ref}
            type="choropleth"
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: "",
                  borderWidth: config.borderWidth,
                  borderColor: config.borderColor,
                  outline: config.feature,
                  data: config.feature.map((feature: any, index: number) => ({
                    feature: feature,
                    value: data.values[index] === -1 ? Number.NaN : data.values[index],
                  })),
                },
              ],
            }}
            options={options}
          />
        </div>
        {enableZoom && (
          <div className="absolute right-1 top-1 z-10 flex w-fit justify-end gap-2">
            <button className="rounded border bg-white p-1 active:bg-outline" onClick={onReset}>
              <ArrowPathIcon className="h-4 w-4 p-0.5" />
            </button>
            <div>
              <button
                className="rounded rounded-r-none border bg-white p-1 active:bg-outline"
                onClick={zoomIn}
              >
                <PlusSmallIcon className="h-4 w-4" />
              </button>
              <button
                className="rounded rounded-l-none border border-l-0 bg-white p-1 active:bg-outline"
                onClick={zoomOut}
              >
                <MinusSmallIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

const dummyData = {
  labels: [
    "Johor",
    "Kedah",
    "Kelantan",
    "Melaka",
    "Negeri Sembilan",
    "Pahang",
    "Pulau Pinang",
    "Perak",
    "Perlis",
    "Selangor",
    "Terengganu",
    "Sabah",
    "Sarawak",
    "W.P. Kuala Lumpur",
    "W.P. Labuan",
    "W.P. Putrajaya",
  ],
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
};

export default GeoChoropleth;
