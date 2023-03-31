import type { GeoChoroplethRef } from "@components/Chart/Choropleth/geochoropleth";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import type { Color } from "@hooks/useColor";
import { useExport } from "@hooks/useExport";
import { useTranslation } from "@hooks/useTranslation";
import type { DownloadOptions } from "@lib/types";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";

const GeoChoropleth = dynamic(() => import("@components/Chart/Choropleth/geochoropleth"), {
  ssr: false,
});

type ChoroPoint = {
  id: string;
  value: number;
};

interface CatalogueChoroplethProps {
  config: {
    color: Color;
    geojson: "state" | "dun" | "parlimen" | "district";
    precision: number;
  };
  dataset: {
    chart: Array<ChoroPoint>; // ChoroplethData
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

const CatalogueChoropleth: FunctionComponent<CatalogueChoroplethProps> = ({
  dataset,
  config,
  lang,
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
      <GeoChoropleth
        _ref={ctx}
        id={dataset.meta.unique_id}
        className="h-[350px] w-full lg:h-[450px]"
        data={{
          labels: dataset.chart.map(({ id }: ChoroPoint) => id),
          values: dataset.chart.map(({ value }: ChoroPoint) => value),
        }}
        color={config.color}
        type={config.geojson}
        onReady={mounted => setMounted(mounted)}
      />
    </>
  );
};

export default CatalogueChoropleth;
