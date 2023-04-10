import type { DownloadOptions } from "@lib/types";
import { FunctionComponent, useMemo } from "react";
import { default as Slider } from "@components/Chart/Slider";
import { default as dynamic } from "next/dynamic";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useWatch } from "@hooks/useWatch";
import { AKSARA_COLOR, SHORT_PERIOD } from "@lib/constants";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download, exportAs } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { track } from "@lib/mixpanel";
import type { ChartDataset, ChartTypeRegistry } from "chart.js";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
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
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueTimeseries: FunctionComponent<CatalogueTimeseriesProps> = ({
  config,
  className = "h-[350px] w-full",
  dataset,
  urls,
  filter,
  onDownload,
}) => {
  const { t } = useTranslation();
  const { data, setData } = useData({
    ctx: undefined,
    minmax: [0, dataset.chart.x.length - 1],
  });
  const { coordinate } = useSlice(dataset.chart, data.minmax);
  const availableDownloads = useMemo<DownloadOptions>(
    () => ({
      chart: [
        {
          key: "png",
          image: Boolean(data?.ctx) && data.ctx.toBase64Image("png", 1),
          title: t("catalogue.image.title"),
          description: t("catalogue.image.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            download(data.ctx!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"));
            track("file_download", {
              uid: dataset.meta.unique_id.concat("_png"),
              type: "image",
              id: dataset.meta.unique_id,
              name_en: dataset.meta.en.title,
              name_bm: dataset.meta.bm.title,
              ext: "png",
            });
          },
        },
        {
          key: "svg",
          image: Boolean(data?.ctx) && data.ctx.toBase64Image("image/png", 1),
          title: t("catalogue.vector.title"),
          description: t("catalogue.vector.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            exportAs("svg", data.ctx!.canvas)
              .then(dataUrl => download(dataUrl, dataset.meta.unique_id.concat(".svg")))
              .then(() =>
                track("file_download", {
                  uid: dataset.meta.unique_id.concat("_svg"),
                  type: "image",
                  id: dataset.meta.unique_id,
                  name_en: dataset.meta.en.title,
                  name_bm: dataset.meta.bm.title,
                  ext: "svg",
                })
              )
              .catch(e => {
                console.error(e);
              });
          },
        },
      ],
      data: [
        {
          key: "csv",
          image: "/static/images/icons/csv.png",
          title: t("catalogue.csv.title"),
          description: t("catalogue.csv.desc"),
          icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: urls.csv,
        },
        {
          key: "parquet",
          image: "/static/images/icons/parquet.png",
          title: t("catalogue.parquet.title"),
          description: t("catalogue.parquet.desc"),
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
      AKSARA_COLOR.DIM,
      AKSARA_COLOR.DANGER,
      AKSARA_COLOR.WARNING,
    ]; // [blue, red]

    return sets.map(([key, y], index) => ({
      type: "line",
      data: y as number[],
      label: dataset.table.columns[key],
      borderColor: colors[index],
      backgroundColor: colors[index].concat("33"),
      borderWidth: 1,
      fill: sets.length <= 1,
    }));
  }, [coordinate]);

  useWatch(() => {
    setData("minmax", [0, dataset.chart.x.length - 1]);
    if (onDownload) onDownload(availableDownloads);
  }, [filter.range, dataset.chart.x, data.ctx]);

  return (
    <>
      <Timeseries
        className={className}
        _ref={ref => setData("ctx", ref)}
        interval={SHORT_PERIOD[filter.range.value as keyof typeof SHORT_PERIOD]}
        precision={config?.precision !== undefined ? [config.precision, config.precision] : [1, 1]}
        mode="grouped"
        data={{
          labels: coordinate.x,
          datasets: _datasets,
        }}
      />
      <Slider
        // ref={sliderRef}
        className="pt-7"
        type="range"
        data={dataset.chart.x}
        value={data.minmax}
        period={SHORT_PERIOD[filter.range?.value as keyof typeof SHORT_PERIOD] ?? "auto"}
        onChange={e => setData("minmax", e)}
      />
    </>
  );
};

export default CatalogueTimeseries;
