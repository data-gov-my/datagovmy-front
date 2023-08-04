import { DownloadOptions } from "../../../types";
import { toast } from "../../components";
import { useAnalytics, useTranslation, useWatch } from "../../hooks";
import { AKSARA_COLOR } from "../../lib/constants";
import { download, exportAs } from "../../lib/helpers";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { ChartDataset } from "chart.js";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useMemo, useState } from "react";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

const Pyramid = dynamic(() => import("../pyramid"), { ssr: false });
interface CataloguePyramidProps {
  className?: string;
  config: any;
  dataset: any;
  urls: {
    [key: string]: string;
  };
  translations: Record<string, string>;
  onDownload?: (prop: DownloadOptions) => void;
}

const CataloguePyramid: FunctionComponent<CataloguePyramidProps> = ({
  className = "h-[450px] lg:h-[400px] max-w-lg mx-auto",
  config,
  dataset,
  urls,
  translations,
  onDownload,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const [ctx, setCtx] = useState<ChartJSOrUndefined<"bar", any[], unknown> | null>(null);
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

  const _datasets = useMemo<ChartDataset<"bar", any[]>[]>(() => {
    const sets = Object.entries(dataset.chart);
    const colors = [AKSARA_COLOR.PRIMARY, AKSARA_COLOR.DANGER]; // [blue, red]

    return sets
      .filter(([key, _]) => key !== "x")
      .map(([key, y], index) => ({
        data: y as number[],
        label: translations[key] ?? key,
        backgroundColor: colors[index].concat("1A") ?? AKSARA_COLOR.PRIMARY_H,
        borderColor: colors[index] ?? AKSARA_COLOR.PRIMARY,
        borderWidth: 1,
      }));
  }, [dataset.chart]);

  useWatch(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [dataset.chart.x, ctx]);

  return (
    <Pyramid
      _ref={ref => setCtx(ref)}
      className={className}
      precision={config?.precision !== undefined ? [config.precision, 0] : [1, 0]}
      data={{
        labels: dataset.chart.x,
        datasets: _datasets,
      }}
    />
  );
};

export default CataloguePyramid;
