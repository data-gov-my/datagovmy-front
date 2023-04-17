import type { GeoChoroplethRef } from "@components/Chart/Choropleth/geochoropleth";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useExport } from "@hooks/useExport";
import { useTranslation } from "@hooks/useTranslation";
import type { DownloadOptions, Geotype } from "@lib/types";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

const GeoChoropleth = dynamic(() => import("@components/Chart/Choropleth/geochoropleth"), {
  ssr: false,
});

interface CatalogueChoroplethProps {
  config: any;
  dataset: any;
  urls: {
    [key: string]: string;
  };
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueChoropleth: FunctionComponent<CatalogueChoroplethProps> = ({
  dataset,
  config,
  urls,
  onDownload,
}) => {
  const { t } = useTranslation();
  const ctx = useRef<GeoChoroplethRef | null>(null);
  const [mounted, setMounted] = useState(false);
  const { png } = useExport(mounted, dataset.meta.unique_id);

  useEffect(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [mounted, png]);

  const availableDownloads = useMemo<DownloadOptions>(
    () => ({
      chart: [
        {
          key: "png",
          image: png,
          title: t("catalogue.image.title"),
          description: t("catalogue.image.desc"),
          icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: () => {
            if (ctx) ctx.current?.print(dataset.meta.unique_id);
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
          icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: urls.csv,
        },
        {
          key: "parquet",
          image: "/static/images/icons/parquet.png",
          title: t("catalogue.parquet.title"),
          description: t("catalogue.parquet.desc"),
          icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: urls.parquet,
        },
      ],
    }),
    [png, ctx]
  );
  return (
    <>
      <GeoChoropleth
        _ref={ctx}
        id={dataset.meta.unique_id}
        className="h-[350px] w-full lg:h-[450px]"
        data={{
          labels: dataset.chart.x,
          values: dataset.chart.y,
        }}
        color={config.color}
        type={config.geojson}
        onReady={mounted => setMounted(mounted)}
      />
    </>
  );
};

export default CatalogueChoropleth;
