import { DownloadOptions } from "../../types";
import { toast } from "../components/Toast";
import { useAnalytics, useExport, useTranslation } from "../hooks";
import { download, exportAs } from "../lib/helpers";
import {
  Dispatch,
  ForwardRefExoticComponent,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  createContext,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";

import { ChartTypeRegistry } from "chart.js";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { GeoChoroplethRef } from "../charts/geochoropleth";
import { DCChartKeys } from "../../types/data-catalogue";

export type DatasetType = {
  type: DCChartKeys;
  chart: any;
  table: Record<string, any>[];
  meta: { title: string; desc: string; unique_id: string };
};

interface CatalogueContextProps {
  bind: {
    chartjs: Dispatch<
      SetStateAction<ChartJSOrUndefined<keyof ChartTypeRegistry, any[], unknown> | null>
    >;
    leaflet: MutableRefObject<GeoChoroplethRef | null>;
  };
  dataset: DatasetType;
  downloads: DownloadOptions;
}

interface CatalogueProviderProps {
  dataset: DatasetType;
  urls: {
    [key: string]: string;
  };
  children: ReactNode;
}

export const CatalogueContext = createContext<CatalogueContextProps>({
  bind: {
    chartjs: () => {},
    leaflet: { current: null },
  },
  downloads: { chart: [], data: [] },
  dataset: {
    type: "TABLE",
    chart: undefined,
    table: [],
    meta: {
      title: "",
      desc: "",
      unique_id: "",
    },
  },
});

export const CatalogueProvider: ForwardRefExoticComponent<CatalogueProviderProps> = forwardRef(
  ({ children, dataset, urls }, ref) => {
    const { t } = useTranslation(["catalogue", "common"]);
    const [chartjs, setChartjs] = useState<ChartJSOrUndefined<
      keyof ChartTypeRegistry,
      any[],
      unknown
    > | null>(null);
    const leaflet = useRef<GeoChoroplethRef | null>(null);
    const { png } = useExport(Boolean(leaflet.current), dataset.meta.unique_id);
    const { track } = useAnalytics(dataset);

    const _dataset = useMemo(() => {
      if (["TIMESERIES", "STACKED_AREA", "INTRADAY"].includes(dataset.type)) {
        const { x, ...y } = dataset.chart as Record<string, (number | null)[]> & { x: string[] };

        let x_vals = x;
        // trim null values off start and end
        const trimmed_y = Object.fromEntries(
          Object.entries(y).map(([key, y_values], index, ori_arr) => {
            let y_vals = y_values;

            // loop from start
            for (let i = 0; i < y_values.length; i++) {
              // check if y-value for each dataset is not null (y[i], y1[i], ...)
              if (ori_arr.some(([_, y_vals]) => y_vals[i] !== null)) {
                // slice previous null values and break loop
                y_vals = y_vals.slice(i);
                // only slice x-values for first dataset
                if (index === 0) x_vals = x_vals.slice(i);
                break;
              }
            }

            // loop from end
            for (let i = y_values.length - 1; i >= 0; i--) {
              // check if y-value for each dataset is not null (y[i], y1[i], ...)
              if (ori_arr.some(([_, y_vals]) => y_vals[i] !== null)) {
                // slice null values and break loop
                y_vals = y_vals.slice(0, i + 1);
                // only slice x-values for first dataset
                if (index === 0) x_vals = x_vals.slice(0, i + 1);
                break;
              }
            }

            return [key, y_vals];
          })
        );

        return { ...dataset, chart: { x: x_vals, ...trimmed_y } };
      }
      return dataset;
    }, [dataset]);

    const _downloads = (() => {
      switch (dataset.type) {
        // Case: Leaflet based maps
        case "GEOCHOROPLETH":
          return {
            chart: [
              {
                id: "png",
                image: png,
                title: t("image.title"),
                description: t("image.desc"),
                icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
                href: () => {
                  if (!leaflet) return;
                  leaflet.current?.print(dataset.meta.unique_id.concat(".png"));
                  track("png");
                },
              },
            ],
            data: [
              {
                id: "csv",
                image: "/static/images/icons/csv.png",
                title: t("csv.title"),
                description: t("csv.desc"),
                icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
                href: () => {
                  download(urls.csv, dataset.meta.unique_id.concat(".csv"));
                  track("csv");
                },
              },
              {
                id: "parquet",
                image: "/static/images/icons/parquet.png",
                title: t("parquet.title"),
                description: t("parquet.desc"),
                icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
                href: () => {
                  download(urls.parquet, dataset.meta.unique_id.concat(".parquet"));
                  track("parquet");
                },
              },
            ],
          };
        // Case: GEOJSON
        case "GEOJSON":
          return {
            chart: [
              {
                id: "png",
                image: png,
                title: t("image.title"),
                description: t("image.desc"),
                icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
                href: () => {
                  if (!leaflet) return;
                  leaflet.current?.print(dataset.meta.unique_id.concat(".png"));
                  track("png");
                },
              },
            ],
            data: [
              {
                id: "geojson",
                image: "/static/images/icons/geojson.png",
                title: t("geojson.title"),
                description: t("geojson.desc"),
                icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
                href: () => {
                  download(urls.link_geojson, dataset.meta.unique_id.concat(".geojson"));
                  track("parquet"); // TODO: Fix GeoJSON analytics
                },
              },
            ],
          };

        // Case: Table
        case "TABLE":
          return {
            chart: [],
            data: [
              {
                id: "csv",
                image: "/static/images/icons/csv.png",
                title: t("csv.title"),
                description: t("csv.desc"),
                icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
                href() {
                  download(urls.csv, dataset.meta.unique_id.concat(".csv"));
                  track("csv");
                },
              },
              {
                id: "parquet",
                image: "/static/images/icons/parquet.png",
                title: t("parquet.title"),
                description: t("parquet.desc"),
                icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
                href() {
                  download(urls.parquet, dataset.meta.unique_id.concat(".parquet"));
                  track("parquet");
                },
              },
            ],
          };

        // Default: ChartJS based charts
        default:
          return {
            chart: [
              {
                id: "png",
                image: chartjs && chartjs.toBase64Image("png", 1),
                title: t("image.title"),
                description: t("image.desc"),
                icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
                href: () => {
                  download(chartjs!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"));
                  track("png");
                },
              },
              {
                id: "svg",
                image: chartjs && chartjs.toBase64Image("image/png", 1),
                title: t("vector.title"),
                description: t("vector.desc"),
                icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
                href: () => {
                  exportAs("svg", chartjs!.canvas)
                    .then(dataUrl => download(dataUrl, dataset.meta.unique_id.concat(".svg")))
                    .then(() => track("svg"))
                    .catch(e => {
                      toast.error(
                        t("common:error.toast.image_download_failure"),
                        t("common:error.toast.try_again")
                      );
                      console.error(e);
                    });
                },
              },
            ],
            data: [
              {
                id: "csv",
                image: "/static/images/icons/csv.png",
                title: t("csv.title"),
                description: t("csv.desc"),
                icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
                href: () => {
                  download(urls.csv, dataset.meta.unique_id.concat(".csv"));
                  track("csv");
                },
              },
              {
                id: "parquet",
                image: "/static/images/icons/parquet.png",
                title: t("parquet.title"),
                description: t("parquet.desc"),
                icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
                href: () => {
                  download(urls.parquet, dataset.meta.unique_id.concat(".parquet"));
                  track("parquet");
                },
              },
            ],
          };
      }
    })();

    return (
      <CatalogueContext.Provider
        value={{
          bind: {
            chartjs: setChartjs,
            leaflet: leaflet,
          },
          downloads: _downloads,
          dataset: _dataset,
        }}
      >
        {children}
      </CatalogueContext.Provider>
    );
  }
);

CatalogueProvider.displayName = "CatalogueProvider";
