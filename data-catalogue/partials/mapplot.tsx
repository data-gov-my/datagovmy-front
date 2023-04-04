import type { GeoChoroplethRef } from "@components/Chart/Choropleth/geochoropleth";
import type { MarkerData } from "@components/Chart/MapPlot";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useExport } from "@hooks/useExport";
import { useTranslation } from "@hooks/useTranslation";
import type { DownloadOptions } from "@lib/types";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useEffect, useMemo, useRef } from "react";

const MapPlot = dynamic(() => import("@components/Chart/MapPlot"), {
  ssr: false,
});
interface CatalogueMapPlotProps {
  config: {
    precision: number;
  };
  dataset: {
    chart: MarkerData;
    meta: {
      en: {
        title: string;
      };
      bm: {
        title: string;
      };
      unique_id: string;
    };
  };
  lang: "en" | "bm";
  urls: {
    [key: string]: string;
  };
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueMapPlot: FunctionComponent<CatalogueMapPlotProps> = ({
  dataset,
  config,
  lang,
  urls,
  onDownload,
}) => {
  const { t } = useTranslation();
  const ctx = useRef<GeoChoroplethRef | null>(null);
  const { png } = useExport(Boolean(ctx.current), dataset.meta.unique_id);

  useEffect(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [png]);

  const availableDownloads = useMemo<DownloadOptions>(
    () => ({
      chart: [
        {
          key: "png",
          image: png,
          title: t("catalogue.image.title"),
          description: t("catalogue.image.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            if (ctx) ctx.current?.print(dataset.meta.unique_id.concat(".png"));
            // TODO: Add track by mixpanel
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
    [png, ctx]
  );
  return (
    <>
      <MapPlot
        _ref={ctx}
        id={dataset.meta.unique_id}
        className="h-[350px] w-full lg:h-[450px]"
        markers={dataset.chart}
      />
    </>
  );
};

export default CatalogueMapPlot;
