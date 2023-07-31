import type { DownloadOptions } from "@lib/types";
import { FunctionComponent, useMemo } from "react";
import { default as dynamic } from "next/dynamic";
import { useWatch, useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { AKSARA_COLOR, SHORT_PERIOD } from "@lib/constants";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download, exportAs } from "datagovmy-ui/helpers";
import { track } from "datagovmy-ui/mixpanel";
import type { ChartDataset, ChartTypeRegistry } from "chart.js";
import { Slider, toast } from "datagovmy-ui/components";
import { SliderProvider } from "datagovmy-ui/contexts/slider";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
interface CatalogueTimeseriesProps {
  config: {
    precision: number;
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
  const availableDownloads = useMemo<DownloadOptions>(
    () => ({
      chart: [
        {
          id: "png",
          image: Boolean(data?.ctx) && data.ctx.toBase64Image("png", 1),
          title: t("image.title"),
          description: t("image.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            download(data.ctx!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"));
            track("file_download", {
              uid: dataset.meta.unique_id.concat("_png"),
              type: "image",
              id: dataset.meta.unique_id,
              name: dataset.meta.title,
              ext: "png",
            });
          },
        },
        {
          id: "svg",
          image: Boolean(data?.ctx) && data.ctx.toBase64Image("image/png", 1),
          title: t("vector.title"),
          description: t("vector.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            exportAs("svg", data.ctx!.canvas)
              .then(dataUrl => download(dataUrl, dataset.meta.unique_id.concat(".svg")))
              .then(() =>
                track("file_download", {
                  uid: dataset.meta.unique_id.concat("_svg"),
                  type: "image",
                  id: dataset.meta.unique_id,
                  name: dataset.meta.title,
                  ext: "svg",
                })
              )
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
          icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: urls.csv,
        },
        {
          id: "parquet",
          image: "/static/images/icons/parquet.png",
          title: t("parquet.title"),
          description: t("parquet.desc"),
          icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: urls.parquet,
        },
      ],
    }),
    [data.ctx]
  );

  const _datasets = useMemo<ChartDataset<keyof ChartTypeRegistry, any[]>[]>(() => {
    const sets = Object.entries(coordinate).filter(([key, _]) => key !== "x");
    const colors = [
      AKSARA_COLOR.PRIMARY,
      AKSARA_COLOR.WARNING,
      AKSARA_COLOR.DANGER,
      AKSARA_COLOR.GREY,
    ]; // [blue, yellow, red, grey]

    return sets.map(([key, y], index) => ({
      type: "line",
      data: y as number[],
      label: translations[key] ?? key,
      borderColor: colors[index],
      backgroundColor: colors[index].concat("1A"),
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
              config?.precision !== undefined ? [config.precision, config.precision] : [1, 1]
            }
            enableAnimation={!play}
            enableLegend={_datasets.length > 1}
            mode={dataset.type === "STACKED_AREA" ? "stacked" : "grouped"}
            data={{
              labels: coordinate.x,
              datasets: _datasets,
            }}
          />
          <Slider
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
