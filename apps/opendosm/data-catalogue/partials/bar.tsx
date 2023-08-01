import type { DownloadOptions } from "@lib/types";
import { FunctionComponent, useContext, useMemo, useState } from "react";
import { default as dynamic } from "next/dynamic";
import { useWatch, useTranslation } from "datagovmy-ui/hooks";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { AKSARA_COLOR, BREAKPOINTS } from "@lib/constants";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download, exportAs } from "datagovmy-ui/helpers";
import { track } from "datagovmy-ui/mixpanel";

import type { ChartDataset } from "chart.js";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import { toast } from "datagovmy-ui/components";

const Bar = dynamic(() => import("datagovmy-ui/charts/bar"), { ssr: false });
interface CatalogueBarProps {
  config: any;
  dataset: any;
  urls: {
    [key: string]: string;
  };
  onDownload?: (prop: DownloadOptions) => void;
  translations: Record<string, string>;
}

const CatalogueBar: FunctionComponent<CatalogueBarProps> = ({
  config,
  dataset,
  urls,
  translations,
  onDownload,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const [ctx, setCtx] = useState<ChartJSOrUndefined<"bar", any[], unknown> | null>(null);
  const { size } = useContext(WindowContext);
  const bar_layout = useMemo<"horizontal" | "vertical">(() => {
    if (dataset.type === "HBAR" || size.width < BREAKPOINTS.MD) return "horizontal";
    return "vertical";
  }, [dataset.type, size.width]);

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

  const _datasets = useMemo<ChartDataset<"bar", any[]>[]>(() => {
    const sets = Object.entries(dataset.chart).filter(([key, _]) => key !== "x");
    const colors = [
      AKSARA_COLOR.PRIMARY,
      AKSARA_COLOR.WARNING,
      AKSARA_COLOR.DANGER,
      AKSARA_COLOR.GREY,
    ]; // [blue, red]

    return sets.map(([key, y], index) => ({
      data: y as number[],
      label: sets.length === 1 ? dataset.meta.title : translations[key] ?? key,
      borderColor: colors[index],
      backgroundColor: colors[index].concat("1A"),
      borderWidth: 1,
    }));
  }, [dataset.chart]);

  useWatch(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [dataset.chart.x, ctx]);

  return (
    <Bar
      _ref={ref => setCtx(ref)}
      className={
        bar_layout === "vertical"
          ? "h-[350px] w-full lg:h-[450px]"
          : "mx-auto h-[500px] w-full lg:h-[600px] lg:w-3/4"
      }
      type="category"
      enableStack={dataset.type === "STACKED_BAR"}
      layout={bar_layout}
      enableGridX={bar_layout !== "vertical"}
      enableGridY={bar_layout === "vertical"}
      enableLegend={_datasets.length > 1}
      precision={config?.precision !== undefined ? [config.precision, config.precision] : [1, 1]}
      data={{
        labels: dataset.chart.x,
        datasets: _datasets,
      }}
    />
  );
};

export default CatalogueBar;
