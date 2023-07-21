import type { GeoChoroplethRef } from "@components/Chart/Choropleth/geochoropleth";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useExport } from "@hooks/useExport";
import { useTranslation } from "@hooks/useTranslation";
import type { DownloadOptions } from "@lib/types";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import { useAnalytics } from "@hooks/useAnalytics";
import { download } from "@lib/helpers";

const GeoChoropleth = dynamic(() => import("@components/Chart/Choropleth/geochoropleth"), {
  ssr: false,
});

interface CatalogueGeojsonProps {
  className?: string;
  config: any;
  dataset: any;
  urls: {
    [key: string]: string;
  };
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueGeojson: FunctionComponent<CatalogueGeojsonProps> = ({
  className = "h-[450px] w-full",
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
  }, [png, ctx]);

  const availableDownloads = useMemo(() => {
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
          id: "geojson",
          image: "/static/images/icons/geojson.png",
          title: t("geojson.title"),
          description: t("geojson.desc"),
          icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: () => {
            download(urls[Object.keys(urls)[0]], dataset.meta.unique_id.concat(".geojson"));
            track("csv");
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
      type={config.geojson}
      color={config.color}
      enableFill={false}
      onReady={mounted => setMounted(mounted)}
    />
  );
};

export default CatalogueGeojson;
