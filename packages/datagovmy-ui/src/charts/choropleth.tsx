import { Chart as ChartJS, Tooltip } from "chart.js";
import { ChoroplethController, GeoFeature, ColorScale, ProjectionScale } from "chartjs-chart-geo";
import { ChartHeaderProps, default as ChartHeader } from "./chart-header";
// import { ArrowPathIcon, MinusSmallIcon, PlusSmallIcon } from "@heroicons/react/24/outline";
import { FeatureCollection } from "geojson";
import { Color } from "../hooks/useColor";
import { clx, numFormat } from "../lib/helpers";
import { ChartCrosshairOption, Geotype } from "../../types";
import { useTheme } from "next-themes";
import { Chart } from "react-chartjs-2";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { ForwardedRef, FunctionComponent, useEffect, useState } from "react";

/**
 *Choropleth component
 */

export type ChoroplethData = {
  labels: string[];
  values: number[];
};

type ChoroplethProps = ChartHeaderProps & {
  id?: string;
  className?: string;
  data?: ChoroplethData;
  prefix?: string;
  unit?: string;
  precision?: number | [number, number];
  enableOutline?: boolean;
  enableZoom?: boolean;
  type?: Geotype;
  color?: Color;
  onReady?: (status: boolean) => void;
  _ref?: ForwardedRef<ChartJSOrUndefined<"choropleth", any[], unknown>>;
};

const Choropleth: FunctionComponent<ChoroplethProps> = ({
  id,
  className = "w-full h-[460px]",
  controls,
  menu,
  title,
  type = "state",
  data = dummyData,
  prefix,
  precision = [1, 0],
  unit,
  color,
  enableOutline = true,
  enableZoom = true,
  onReady,
  _ref,
}) => {
  const [desktopMap, setDesktopMap] = useState<FeatureCollection | undefined>(undefined);
  const [mobileMap, setMobileMap] = useState<FeatureCollection | undefined>(undefined);
  ChartJS.register(ChoroplethController, ProjectionScale, ColorScale, GeoFeature, Tooltip);

  useEffect(() => {
    const fetchMaps = async () => {
      const [desktop, mobile] = await Promise.all([
        import(`../lib/geojson/${type}/_desktop`),
        import(`../lib/geojson/${type}/_mobile`),
      ]);

      setDesktopMap(desktop.default as FeatureCollection);
      setMobileMap(mobile.default as FeatureCollection);
      if (onReady) onReady(true);
    };

    fetchMaps();
  }, [type]);
  const { theme } = useTheme();
  const options: ChartCrosshairOption<"choropleth"> = {
    elements: {
      geoFeature: {
        outlineBorderColor: theme === "light" ? "black" : "white",
      },
    },
    maintainAspectRatio: false,
    showOutline: enableOutline,
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
            if (item.raw.value === null) return `${item.raw.feature.properties[type]}: No data`;
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
      datalabels: false,
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
      <div className={clx("p-4 transition-all", className)}>
        {desktopMap && (
          <div className="hidden h-full w-full lg:block">
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
                    outline: desktopMap.features,
                    data: desktopMap
                      ? desktopMap.features.map((feature: any) => ({
                          feature: feature,
                          value: data.values[data.labels.indexOf(feature.properties[type])],
                        }))
                      : [],
                  },
                ],
              }}
              options={options}
            />
          </div>
        )}
        {mobileMap && (
          <div className="block h-full w-full lg:hidden">
            <Chart
              id={id}
              data-testid={id || title}
              ref={_ref}
              type="choropleth"
              data={{
                labels: data.labels,
                datasets: [
                  {
                    label: "",
                    borderWidth: 0.25,
                    borderColor: "#000",
                    outline: mobileMap.features,
                    data: mobileMap
                      ? mobileMap.features.map((feature: any) => ({
                          feature: feature,
                          value: data.values[data.labels.indexOf(feature.properties[type])],
                        }))
                      : [],
                  },
                ],
              }}
              options={options}
            />
          </div>
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
