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
 *Choropleth component
 */

export type ChoroplethData = {
  labels: string[];
  values: number[];
};

interface ChoroplethProps extends ChartHeaderProps {
  className?: string;
  data?: ChoroplethData;
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

const Choropleth: FunctionComponent<ChoroplethProps> = forwardRef(
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

    console.log(data);

    return (
      <div className="relative">
        <ChartHeader title={title} menu={menu} controls={controls} />

        <div
          className={`border border-outline border-opacity-0 p-4 transition-all active:border-opacity-100 ${className}`}
          //   ref={zoomRef}
          //   onWheel={onWheel}
          //   onMouseMove={onMove}
          //   onMouseDown={onDown}
          //   onMouseUp={onUp}
          //   onTouchStart={onDown}
          //   onTouchEnd={onUp}
          //   onTouchMove={onMove}
          //   onMouseOut={onUp}
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
        {/* {enableZoom && (
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
        )} */}
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

export default Choropleth;
