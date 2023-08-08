import { DownloadOptions, Precision } from "../../../types";
import { Slider, toast } from "../../components";
import { SliderProvider } from "../../contexts/slider";
import { useAnalytics, useData, useSlice, useTranslation, useWatch } from "../../hooks";
import { CATALOGUE_COLORS, SHORT_PERIOD } from "../../lib/constants";
import { download, exportAs } from "../../lib/helpers";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useMemo } from "react";

const Timeseries = dynamic(() => import("../timeseries"), { ssr: false });
interface CatalogueTimeseriesProps {
  config: {
    precision: number | Precision;
  };
  className?: string;
  dataset: any;
  filter: any;
  urls: {
    [key: string]: string;
  };
  translations: Record<string, string>;
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueTimeseries: FunctionComponent<CatalogueTimeseriesProps> = ({
  config,
  className = "h-[350px] w-full lg:h-[450px]",
  dataset,
  urls,
  filter,
  translations,
  onDownload,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const { data, setData } = useData({
    ctx: undefined,
    minmax: [0, dataset.chart.x.length - 1],
  });
  const { coordinate } = useSlice(dataset.chart, data.minmax);
  const { track } = useAnalytics(dataset);

  const availableDownloads = useMemo<DownloadOptions>(
    () => ({
      chart: [
        {
          id: "png",
          image: Boolean(data?.ctx) && data.ctx.toBase64Image("png", 1),
          title: t("image.title"),
          description: t("image.desc"),
          icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: () => {
            download(data.ctx!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"));
            track("png");
          },
        },
        {
          id: "svg",
          image: Boolean(data?.ctx) && data.ctx.toBase64Image("image/png", 1),
          title: t("vector.title"),
          description: t("vector.desc"),
          icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: () => {
            exportAs("svg", data.ctx!.canvas)
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
    }),
    [data.ctx]
  );

  const _datasets = useMemo<ChartDataset<keyof ChartTypeRegistry, any[]>[]>(() => {
    const sets = Object.entries(coordinate).filter(([key, _]) => key !== "x");
    const NON_OVERLAPPING_BGCOLOR = ["#ecf0fd", "#f2f5f7", "#fff8ec", "#fde8e8"]; // [blue, gray, red, yellow]
    return sets.map(([key, y], index) => ({
      type: "line",
      data: y as number[],
      label: translations[key] ?? key,
      borderColor: CATALOGUE_COLORS[index],
      backgroundColor: NON_OVERLAPPING_BGCOLOR[index],
      borderWidth: 1,
      fill: dataset.type === "STACKED_AREA" || sets.length <= 1,
    }));
  }, [coordinate]);

  useWatch(() => {
    setData("minmax", [0, dataset.chart.x.length - 1]);
    if (onDownload) onDownload(availableDownloads);
  }, [filter.range, dataset.chart.x, data.ctx]);

  return (
    <SliderProvider>
      {play => (
        <>
          <Timeseries
            className={className}
            _ref={ref => setData("ctx", ref)}
            interval={SHORT_PERIOD[filter.range.value as keyof typeof SHORT_PERIOD]}
            precision={
              typeof config.precision === "number" ? config.precision : config.precision.default
            }
            enableAnimation={!play}
            enableLegend={_datasets.length > 1}
            mode={dataset.type === "STACKED_AREA" ? "stacked" : "grouped"}
            data={{
              labels: coordinate.x,
              datasets: _datasets,
            }}
            beginZero={dataset.type === "STACKED_AREA"}
          />
          <Slider
            className="pt-4"
            type="range"
            data={dataset.chart.x}
            value={data.minmax}
            period={SHORT_PERIOD[filter.range?.value as keyof typeof SHORT_PERIOD] ?? "auto"}
            onChange={e => setData("minmax", e)}
          />
        </>
      )}
    </SliderProvider>
  );
};

export default CatalogueTimeseries;