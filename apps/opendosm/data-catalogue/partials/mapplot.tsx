import type { GeoChoroplethRef } from "datagovmy-ui/charts/geochoropleth";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useExport, useTranslation } from "datagovmy-ui/hooks";
import type { DownloadOptions } from "@lib/types";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useEffect, useMemo, useRef } from "react";

// const MapPlot = dynamic(() => import("@components/Chart/MapPlot"), {
//   ssr: false,
// });
interface CatalogueMapPlotProps {
  dataset: any;
  urls: {
    [key: string]: string;
  };
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueMapPlot: FunctionComponent<CatalogueMapPlotProps> = ({
  dataset,
  urls,
  onDownload,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const ctx = useRef<GeoChoroplethRef | null>(null);
  const { png } = useExport(Boolean(ctx.current), dataset.meta.unique_id);

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
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            if (ctx) ctx.current?.print(dataset.meta.unique_id.concat(".png"));
            // TODO: Add track by mixpanel
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
    [png, ctx]
  );
  return (
    <></>
    // <MapPlot
    //   _ref={ctx}
    //   id={dataset.meta.unique_id}
    //   className="h-[350px] w-full lg:h-[450px]"
    //   markers={dataset.chart}
    // />
  );
};

export default CatalogueMapPlot;
