import { DownloadOptions } from "../../../types";
import { useAnalytics, useExport, useTranslation } from "../../hooks";
import { download } from "../../lib/helpers";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { GeoChoroplethRef } from "../geochoropleth";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useEffect, useMemo, useRef } from "react";
import { MarkerData } from "../map-plot";

const MapPlot = dynamic(() => import("../map-plot"), {
  ssr: false,
});
interface CatalogueMapPlotProps {
  className?: string;
  dataset: any;
  urls: {
    [key: string]: string;
  };
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueMapPlot: FunctionComponent<CatalogueMapPlotProps> = ({
  className = "h-[350px] w-full lg:h-[450px]",
  dataset,
  urls,
  onDownload,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const ctx = useRef<GeoChoroplethRef | null>(null);
  const { png } = useExport(Boolean(ctx.current), dataset.meta.unique_id);
  const { track } = useAnalytics(dataset);

  useEffect(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [png]);

  const availableDownloads = useMemo<DownloadOptions>(
    () => ({
      chart: [
        {
          id: "png",
          image: png,
          title: t("image.title"),
          description: t("image.desc"),
          icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: () => {
            if (!ctx) return;
            ctx.current?.print(dataset.meta.unique_id.concat(".png"));
            track("png");
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
    [png, ctx]
  );

  const markers = useMemo<MarkerData>(() => {
    const _markers: MarkerData = dataset.chart.map((e: any) => {
      const { position, ...tooltip } = e;
      return {
        position: position,
        tooltip: tooltip,
      };
    });
    return _markers;
  }, [dataset.chart]);

  return <MapPlot _ref={ctx} id={dataset.meta.unique_id} className={className} markers={markers} />;
};

export default CatalogueMapPlot;
