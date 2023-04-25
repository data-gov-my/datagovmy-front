import type { GeoChoroplethRef } from "@components/Chart/Choropleth/geochoropleth";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { useExport } from "@hooks/useExport";
import { useTranslation } from "@hooks/useTranslation";
import type { DownloadOptions } from "@lib/types";
// import { track } from "mixpanel-browser";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

const GeoChoropleth = dynamic(() => import("@components/Chart/Choropleth/geochoropleth"), {
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
  const { t } = useTranslation();
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
          key: "png",
          image: png,
          title: t("common:catalogue.image.title"),
          description: t("common:catalogue.image.desc"),
          icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: () => {
            if (ctx) ctx.current?.print(dataset.meta.unique_id);
            // TODO: Add track by mixpanel

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
      ],
      data: [
        {
          key: "geojson",
          image: "/static/images/icons/geojson.png",
          title: t("common:catalogue.geojson.title"),
          description: t("common:catalogue.geojson.desc"),
          icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
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
