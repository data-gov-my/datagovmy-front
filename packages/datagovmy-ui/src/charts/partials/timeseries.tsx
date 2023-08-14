import { DownloadOptions, Precision } from "../../../types";
import { Slider, Spinner, toast } from "../../components";
import { SliderProvider } from "../../contexts/slider";
import { useAnalytics, useData, useSlice, useTranslation, useWatch } from "../../hooks";
import { CATALOGUE_COLORS, SHORT_PERIOD } from "../../lib/constants";
import { clx, download, exportAs, numFormat } from "../../lib/helpers";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useMemo } from "react";
import isEmpty from "lodash/isEmpty";

const Timeseries = dynamic(() => import("../timeseries"), { ssr: false });
interface CatalogueTimeseriesProps {
  config: {
    precision: number | Precision;
    range: keyof typeof SHORT_PERIOD;
  };
  className?: string;
  dataset: any;
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
  translations,
  onDownload,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const { data, setData } = useData({
    ctx: undefined,
    minmax: [0, dataset.chart?.x ? dataset.chart?.x.length - 1 : 0],
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

  const getPrecision = (key: string, precision: number | Precision): number | [number, number] => {
    if (!precision) return [1, 0];
    else if (typeof precision === "number") return precision;
    else if (precision.columns && key in precision.columns) return precision.columns[key];
    else return precision.default;
  };

  const getPrecisionMinMax = (precision: Precision): number => {
    if (precision.columns) return Math.min(...Object.values(precision.columns), precision.default);
    else return precision.default;
  };

  const _datasets = useMemo<ChartDataset<keyof ChartTypeRegistry, any[]>[]>(() => {
    const sets = Object.entries(coordinate).filter(([key, _]) => key !== "x");
    // FIXME: bg colours too bright in dark mode, but dark colours makes it too dark in embed (which only has light mode)
    const NON_OVERLAPPING_BGCOLOR = ["#ecf0fd", "#f2f5f7", "#fff8ec", "#fde8e8"]; // [blue, gray, yellow, red]
    return sets.map(([key, y], index) => ({
      type: "line",
      data: (y as number[]).map(e => numFormat(e, "standard", getPrecision(key, config.precision))),
      label: translations[key] ?? key,
      borderColor: CATALOGUE_COLORS[index],
      backgroundColor: NON_OVERLAPPING_BGCOLOR[index],
      borderWidth: 1,
      fill: dataset.type === "STACKED_AREA" || sets.length <= 1,
    }));
  }, [coordinate]);

  useWatch(() => {
    if (dataset.chart.x) setData("minmax", [0, dataset.chart.x.length - 1]);
    if (onDownload) onDownload(availableDownloads);
  }, [config.range, dataset.chart.x, data.ctx]);

  return (
    <SliderProvider>
      {play =>
        !isEmpty(dataset.chart.x) ? (
          <>
            <Timeseries
              className={className}
              _ref={ref => setData("ctx", ref)}
              interval={SHORT_PERIOD[config.range]}
              round={SHORT_PERIOD[config.range]}
              precision={
                typeof config.precision === "number"
                  ? config.precision
                  : getPrecisionMinMax(config.precision)
              }
              tooltipCallback={function (item: any) {
                return `${item.dataset.label as string}: ${
                  item.raw !== undefined || item.raw !== null ? item.raw : "-"
                }`;
              }}
              enableAnimation={!play}
              enableLegend={_datasets.length > 1}
              mode={dataset.type === "STACKED_AREA" ? "stacked" : "grouped"}
              data={{
                labels: coordinate.x,
                datasets: _datasets,
              }}
              beginZero={["STACKED_AREA", "INTRADAY"].includes(dataset.type)}
            />
            <Slider
              className="pt-4"
              type="range"
              data={dataset.chart.x}
              value={data.minmax}
              period={SHORT_PERIOD[config.range]}
              onChange={e => setData("minmax", e)}
            />
          </>
        ) : (
          <div className={clx(className, "flex items-center justify-center")}>
            <Spinner loading={isEmpty(dataset.chart.x)} />
          </div>
        )
      }
    </SliderProvider>
  );
};

export default CatalogueTimeseries;
