import type { DownloadOptions } from "@lib/types";
import { FunctionComponent, useMemo, useState } from "react";
import { default as dynamic } from "next/dynamic";
import { AKSARA_COLOR } from "@lib/constants";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download, exportAs } from "datagovmy-ui/helpers";
import { useWatch, useTranslation } from "datagovmy-ui/hooks";
import { track } from "datagovmy-ui/mixpanel";
import type { ChartDataset } from "chart.js";
import { toast } from "datagovmy-ui/components";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

const Line = dynamic(() => import("datagovmy-ui/charts/line"), { ssr: false });
interface CatalogueLineProps {
  config: {
    line_variables?: Record<string, any>;
    precision: number;
  };
  dataset: any;
  urls: {
    [key: string]: string;
  };
  onDownload?: (prop: DownloadOptions) => void;
  translations: Record<string, string>;
}

const CatalogueLine: FunctionComponent<CatalogueLineProps> = ({
  config,
  dataset,
  urls,
  onDownload,
  translations,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const [ctx, setCtx] = useState<ChartJSOrUndefined<"line", any[], unknown> | null>(null);

  const availableDownloads = useMemo<DownloadOptions>(
    () => ({
      chart: [
        {
          id: "png",
          image: ctx && ctx.toBase64Image("png", 1),
          title: t("image.title"),
          description: t("image.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            download(ctx!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"));
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
          image: ctx && ctx.toBase64Image("image/png", 1),
          title: t("vector.title"),
          description: t("vector.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            exportAs("svg", ctx!.canvas)
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
    [ctx]
  );

  const _datasets = useMemo<ChartDataset<"line", any[]>[]>(() => {
    const sets = Object.entries(dataset.chart).filter(([key, _]) => key !== "x");
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
      fill: sets.length === 1,
      backgroundColor: colors[index].concat("1A"),
      borderColor: colors[index],
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
      className="h-[350px] w-full lg:h-[450px]"
      _ref={ref => setCtx(ref)}
      precision={config?.precision !== undefined ? [config.precision, config.precision] : [1, 1]}
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
