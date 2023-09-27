import { DCChartKeys, DownloadOptions } from "../../types";
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

interface CatalogueContextProps {
  bind: {
    chartjs: Dispatch<
      SetStateAction<ChartJSOrUndefined<keyof ChartTypeRegistry, any[], unknown> | null>
    >;
    leaflet: MutableRefObject<GeoChoroplethRef | null>;
  };
  dataset: {
    type: DCChartKeys;
    chart: any;
    table: Record<string, any>[];
    meta: { title: string; desc: string; unique_id: string };
  };
  downloads: DownloadOptions;
}

interface CatalogueProviderProps {
  dataset: {
    type: DCChartKeys;
    chart: any;
    table: Record<string, any>[];
    meta: { title: string; desc: string; unique_id: string };
  };
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
        const numOfValidItems: Array<number> = [];
        const chart = Object.entries(dataset.chart)
          .filter(([key, _]) => key !== "x")
          .map(([key, y]) => [key, (y as number[]).filter(item => Boolean(item))]);

        chart.forEach(([key, y]) => {
          numOfValidItems.push((y as number[]).length);
        });

        const finalChart = {
          x: dataset.chart.x.slice(
            dataset.chart.x.length - numOfValidItems.sort((a, b) => b - a)[0]
          ),
          ...Object.fromEntries(chart),
        };

        return { ...dataset, chart: finalChart };
        // return { ...dataset}
      }
      return dataset;
    }, [dataset]);

    const _downloads = (() => {
      switch (dataset.type) {
        // Case: Leaflet based maps
        case "GEOJSON":
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
