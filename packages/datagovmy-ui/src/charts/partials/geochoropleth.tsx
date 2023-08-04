import { DownloadOptions } from "../../../types";
import { useAnalytics, useExport, useTranslation } from "../../hooks";
import { download } from "../../lib/helpers";
import { GeoChoroplethRef } from "../geochoropleth";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

const GeoChoropleth = dynamic(() => import("../geochoropleth"), {
  ssr: false,
});

interface CatalogueChoroplethProps {
  className?: string;
  config: any;
  dataset: any;
  urls: {
    [key: string]: string;
  };
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueChoropleth: FunctionComponent<CatalogueChoroplethProps> = ({
  className = "h-[350px] w-full lg:h-[450px]",
  dataset,
  config,
  urls,
  onDownload,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const ctx = useRef<GeoChoroplethRef | null>(null);
  const [mounted, setMounted] = useState(false);
  const { png } = useExport(mounted, dataset.meta.unique_id);
  const { track } = useAnalytics(dataset);

  useEffect(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [mounted, png]);

  const availableDownloads = useMemo<DownloadOptions>(() => {
    return {
      chart: [
        {
          id: "png",
          image: png,
          title: t("image.title"),
          description: t("image.desc"),
          icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: () => {
            if (!ctx) return;
            ctx.current?.print(dataset.meta.unique_id);
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
    };
  }, [png, ctx]);
  return (
    <GeoChoropleth
      _ref={ctx}
      id={dataset.meta.unique_id}
      className={className}
      data={{
        labels: dataset.chart.x,
        values: dataset.chart.y,
      }}
      color={config.color}
      type={config.geojson}
      onReady={mounted => setMounted(mounted)}
    />
  );
};

export default CatalogueChoropleth;
