import type { DownloadOptions } from "@lib/types";
import { FunctionComponent, useMemo, useState } from "react";
import { default as dynamic } from "next/dynamic";
import { useWatch } from "@hooks/useWatch";
import { AKSARA_COLOR } from "@lib/constants";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download, exportAs } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { track } from "@lib/mixpanel";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

const Scatter = dynamic(() => import("@components/Chart/Scatter"), { ssr: false });

interface CatalogueScatterProps {
  className?: string;
  config: {
    precision: number;
  };
  dataset:
    | {
        chart: {
          label: string;
          data: Array<{ x: number; y: number }>;
        };
        meta: {
          en: {
            title: string;
          };
          bm: {
            title: string;
          };
        };
      }
    | any;
  urls: {
    [key: string]: string;
  };
  lang: "en" | "bm";
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueScatter: FunctionComponent<CatalogueScatterProps> = ({
  className = "h-[450px] lg:h-[400px] max-w-lg mx-auto",
  config,
  lang,
  dataset,
  urls,
  onDownload,
}) => {
  const { t } = useTranslation();
  const [ctx, setCtx] = useState<ChartJSOrUndefined<"scatter", any[], unknown> | null>(null);

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
          image: ctx && ctx.toBase64Image("image/png", 1),
          title: t("catalogue.vector.title"),
          description: t("catalogue.vector.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            exportAs("svg", ctx!.canvas)
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
    [ctx]
  );

  useWatch(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [dataset.chart.x, ctx]);

  return (
    <>
      <Scatter _ref={ref => setCtx(ref)} className={className} data={dataset.chart} />
    </>
  );
};

export default CatalogueScatter;
