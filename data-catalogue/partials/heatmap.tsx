import type { DownloadOptions } from "@lib/types";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { default as dynamic } from "next/dynamic";
import { useTranslation } from "@hooks/useTranslation";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download, exportAs } from "@lib/helpers";
// import { track } from "mixpanel-browser";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";
import type { HeatmapData, HeatmapDatum } from "@components/Chart/Heatmap";

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
  const { t } = useTranslation();
  const [ctx, setCtx] = useState<ChartJSOrUndefined<"matrix", any[], unknown> | null>(null);
  useEffect(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [ctx]);

  const availableDownloads = useMemo<DownloadOptions>(
    () => ({
      chart: [
        {
          key: "png",
          image: ctx && ctx.toBase64Image("png", 1),
          title: t("catalogue.image.title"),
          description: t("catalogue.image.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            download(ctx!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"));
            // track("file_download", {
            //   uid: dataset.meta.unique_id.concat("_png"),
            //   type: "image",
            //   id: dataset.meta.unique_id,
            //   name_en: dataset.meta.en.title,
            //   name_bm: dataset.meta.bm.title,
            //   ext: "png",
            // });
          },
        },
        {
          key: "svg",
          image: ctx && ctx.toBase64Image("png", 1),
          title: t("catalogue.vector.title"),
          description: t("catalogue.vector.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            exportAs("svg", ctx!.canvas)
              .then(dataUrl => download(dataUrl, dataset.meta.unique_id.concat(".svg")))
              .then(
                () => {}
                // track("file_download", {
                //   uid: dataset.meta.unique_id.concat("_svg"),
                //   type: "image",
                //   id: dataset.meta.unique_id,
                //   name_en: dataset.meta.en.title,
                //   name_bm: dataset.meta.bm.title,
                //   ext: "svg",
                // })
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
