import { ChartHeaderProps, default as ChartHeader } from "@components/Chart/ChartHeader";
import { Chart as ChartJS } from "chart.js";
import { ChoroplethController, GeoFeature, ColorScale, ProjectionScale } from "chartjs-chart-geo";
import { ForwardedRef, FunctionComponent, useEffect, useMemo, useState } from "react";
import { Chart } from "react-chartjs-2";

// import { ArrowPathIcon, MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { BREAKPOINTS } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import type { ChartCrosshairOption } from "@lib/types";
import type { FeatureCollection } from "geojson";
import type { Color } from "@hooks/useColor";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

/**
 *Choropleth component
 */

export type ChoroplethData = {
  labels: string[];
  values: number[];
};

interface ChoroplethProps extends ChartHeaderProps {
  id?: string;
  className?: string;
  data?: ChoroplethData;
  prefix?: string;
  unit?: string;
  precision?: number | [number, number];
  enableZoom?: boolean;
  type?: "state" | "parlimen" | "dun" | "district";
  color?: Color;
  onReady?: (status: boolean) => void;
  _ref?: ForwardedRef<ChartJSOrUndefined<"choropleth", any[], unknown>>;
}

const Choropleth: FunctionComponent<ChoroplethProps> = ({
  id,
  className = "w-full h-[460px]",
  controls,
  menu,
  title,
  type = "state",
  data = dummyData,
  prefix,
  precision = 1,
  unit,
  color,
  enableZoom = true,
  onReady,
  _ref,
}) => {
  const windowWidth = useWindowWidth();
  const [choromap, setChoromap] = useState<FeatureCollection | undefined>(undefined);
  ChartJS.register(ChoroplethController, ProjectionScale, ColorScale, GeoFeature);

  const viewport = useMemo<"desktop" | "mobile">(() => {
    return windowWidth < BREAKPOINTS.MD ? "mobile" : "desktop";
  }, [windowWidth]);

  useEffect(() => {
    import(`@lib/geojson/${type}/_${viewport}`).then(item => {
      setChoromap(item.default as unknown as FeatureCollection);
      if (onReady) onReady(true);
    });
  }, [type, viewport]);

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
        enabled: true,
        bodyFont: {
          family: "Inter",
        },
        callbacks: {
          label: function (item: any) {
            if (!item.raw.feature.properties[type]) return "";
            if (!item.raw.value) return `${item.raw.feature.properties[type]}: No data`;
            return `${item.raw.feature.properties[type]}${`: ${prefix ?? ""}${numFormat(
              item.raw.value,
              "standard",
              precision
            )}${unit ?? ""}`}`;
          },
        },
      },
      crosshair: false,
      annotation: false,
    },
    scales: {
      xy: {
        projection: "mercator",
      },
      color: {
        display: false,
        interpolate: color,
        missing: "#fff",
      },
    },
  };

  return (
    <div className="relative">
      <ChartHeader title={title} menu={menu} controls={controls} />
      <div className={["p-4 transition-all", className].join(" ")}>
        {choromap && (
          <Chart
            id={id}
            ref={_ref}
            type="choropleth"
            data={{
              labels: data.labels,
              datasets: [
                {
                  label: "",
                  borderWidth: 0.25,
                  borderColor: "#000",
                  outline: choromap.features,
                  data: choromap
                    ? choromap.features.map((feature: any) => ({
                        feature: feature,
                        value: data.values[data.labels.indexOf(feature.properties[type])],
                      }))
                    : [],
                },
              ],
            }}
            options={options}
          />
        )}
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
};
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
