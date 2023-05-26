import type { DownloadOptions } from "@lib/types";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { default as dynamic } from "next/dynamic";
import { useTranslation } from "@hooks/useTranslation";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download, exportAs } from "@lib/helpers";
import { track } from "@lib/mixpanel";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import type { HeatmapData, HeatmapDatum } from "@components/Chart/Heatmap";
import { toast } from "@components/Toast";

const Heatmap = dynamic(() => import("@components/Chart/Heatmap"), {
  ssr: false,
});

interface CatalogueHeatmapProps {
  config: any;
  dataset: any;
  urls: {
    [key: string]: string;
  };
  translations: any;
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueHeatmap: FunctionComponent<CatalogueHeatmapProps> = ({
  dataset,
  config,
  urls,
  translations,
  onDownload,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const [ctx, setCtx] = useState<ChartJSOrUndefined<"matrix", any[], unknown> | null>(null);
  useEffect(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [ctx]);

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
          image: ctx && ctx.toBase64Image("png", 1),
          title: t("vector.title"),
          description: t("vector.desc"),
          icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
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
          icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: urls.csv,
        },
        {
          id: "parquet",
          image: "/static/images/icons/parquet.png",
          title: t("parquet.title"),
          description: t("parquet.desc"),
          icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: urls.parquet,
        },
      ],
    }),
    [ctx]
  );

  const _datasets = useMemo<HeatmapData>(() => {
    return dataset.chart.map((item: HeatmapDatum) => ({
      x: translations[item.x] ?? item.x,
      y: translations[item.y] ?? item.y,
      z: item.z,
    }));
  }, [dataset.chart]);

  return <Heatmap _ref={ref => setCtx(ref)} data={_datasets} color={config.color} />;
};

export default CatalogueHeatmap;
