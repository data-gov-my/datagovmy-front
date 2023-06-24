import type { GeoChoroplethRef } from "datagovmy-ui/charts/geochoropleth";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useExport, useTranslation } from "datagovmy-ui/hooks";
import type { DownloadOptions } from "@lib/types";
import { track } from "@lib/mixpanel";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

const GeoChoropleth = dynamic(() => import("datagovmy-ui/charts/geochoropleth"), {
  ssr: false,
});

interface CatalogueGeojsonProps {
  config: any;
  dataset: any;
  urls: {
    [key: string]: string;
  };
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueGeojson: FunctionComponent<CatalogueGeojsonProps> = ({
  dataset,
  config,
  urls,
  onDownload,
}) => {
  const { t } = useTranslation(["catalogue", "common"]);
  const ctx = useRef<GeoChoroplethRef | null>(null);
  const [mounted, setMounted] = useState(false);
  const { png } = useExport(mounted, dataset.meta.unique_id);

  useEffect(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [png, ctx]);

  const availableDownloads = useMemo(
    () => ({
      chart: [
        {
          id: "png",
          image: png,
          title: t("image.title"),
          description: t("image.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            if (ctx) ctx.current?.print(dataset.meta.unique_id);

            track("file_download", {
              uid: dataset.meta.unique_id.concat("_png"),
              type: "image",
              id: dataset.meta.unique_id,
              name: dataset.meta.title,
              ext: "png",
            });
          },
        },
      ],
      data: [
        {
          id: "geojson",
          image: "/static/images/icons/geojson.png",
          title: t("geojson.title"),
          description: t("geojson.desc"),
          icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: urls[Object.keys(urls)[0]],
        },
      ],
    }),
    [png, ctx]
  );

  return (
    <GeoChoropleth
      _ref={ctx}
      id={dataset.meta.unique_id}
      className="h-[450px] w-full"
      type={config.geojson}
      color={config.color}
      enableFill={false}
      onReady={mounted => setMounted(mounted)}
    />
  );
};

export default CatalogueGeojson;
