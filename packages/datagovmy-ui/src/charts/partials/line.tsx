import { DownloadOptions, Precision } from "../../../types";
import { toast } from "../../components";
import { useAnalytics, useTranslation, useWatch } from "../../hooks";
import { CATALOGUE_COLORS } from "../../lib/constants";
import { download, exportAs, numFormat } from "../../lib/helpers";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { ChartDataset } from "chart.js";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useMemo, useState } from "react";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

const Line = dynamic(() => import("../line"), { ssr: false });
interface CatalogueLineProps {
  className?: string;
  config: {
    line_variables?: Record<string, any>;
    precision: number | Precision;
  };
  dataset: any;
  urls: {
    [key: string]: string;
  };
  onDownload?: (prop: DownloadOptions) => void;
  translations: Record<string, string>;
}

const CatalogueLine: FunctionComponent<CatalogueLineProps> = ({
  className = "h-[350px] w-full lg:h-[450px]",
  config,
  dataset,
  urls,
  onDownload,
  translations,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const [ctx, setCtx] = useState<ChartJSOrUndefined<"line", any[], unknown> | null>(null);
  const { track } = useAnalytics(dataset);

  const availableDownloads = useMemo<DownloadOptions>(
    () => ({
      chart: [
        {
          id: "png",
          image: ctx && ctx.toBase64Image("png", 1),
          title: t("image.title"),
          description: t("image.desc"),
          icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: () => {
            download(ctx!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"));
            track("png");
          },
        },
        {
          id: "svg",
          image: ctx && ctx.toBase64Image("image/png", 1),
          title: t("vector.title"),
          description: t("vector.desc"),
          icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: () => {
            exportAs("svg", ctx!.canvas)
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
    [ctx]
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

  const _datasets = useMemo<ChartDataset<"line", any[]>[]>(() => {
    const sets = Object.entries(dataset.chart).filter(([key, _]) => key !== "x");

    return sets.map(([key, y], index) => ({
      type: "line",
      data: (y as number[]).map(e => numFormat(e, "standard", getPrecision(key, config.precision))),
      label: translations[key] ?? key,
      fill: sets.length === 1,
      backgroundColor: CATALOGUE_COLORS[index].concat("1A"),
      borderColor: CATALOGUE_COLORS[index],
      borderWidth: 1,
      pointRadius: 0,
      pointHitRadius: 2,
      stepped: config.line_variables && config.line_variables[key].stepped,
      tension: config.line_variables && config.line_variables[key].tension,
    }));
  }, [dataset.chart]);

  useWatch(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [dataset.chart.x, ctx]);

  return (
    <Line
      className={className}
      _ref={ref => setCtx(ref)}
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
      data={{
        labels: dataset.chart.x,
        datasets: _datasets,
      }}
      enableTooltip
      enableCrosshair
      enableLegend={_datasets.length > 1}
    />
  );
};

export default CatalogueLine;
