import type { ChoroplethColors, DownloadOptions } from "@lib/types";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { default as dynamic } from "next/dynamic";
import { useExport } from "@hooks/useExport";
import { useTranslation } from "@hooks/useTranslation";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download } from "@lib/helpers";
import { track } from "mixpanel-browser";

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), {
  ssr: false,
});

type ChoroPoint = {
  id: string;
  value: number;
};

interface CatalogueChoroplethProps {
  config: {
    color: ChoroplethColors;
    geojson: "state" | "dun" | "parlimen" | "district";
    precision: number;
  };
  dataset: {
    chart: Array<ChoroPoint>;
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
  const [mounted, setMounted] = useState<boolean>(false);
  const { onRefChange, svg, png } = useExport(mounted);

  useEffect(() => {
    onDownload && onDownload(availableDownloads());
  }, [svg, png, mounted]);

  const availableDownloads = useCallback(
    () => ({
      chart: [
        {
          key: "png",
          image: png,
          title: t("catalogue.image.title"),
          description: t("catalogue.image.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            if (png) {
              download(png, dataset.meta.unique_id.concat(".png"), () =>
                track("file_download", {
                  uid: dataset.meta.unique_id.concat("_png"),
                  id: dataset.meta.unique_id,
                  ext: "svg",
                  name_en: dataset.meta.en.title,
                  name_bm: dataset.meta.bm.title,
                  type: "image",
                })
              );
            }
          },
        },
        {
          key: "svg",
          image: png,
          title: t("catalogue.vector.title"),
          description: t("catalogue.vector.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            if (svg) {
              download(svg, dataset.meta.unique_id.concat(".svg"), () =>
                track("file_download", {
                  uid: dataset.meta.unique_id.concat("_svg"),
                  id: dataset.meta.unique_id,
                  ext: "svg",
                  name_en: dataset.meta.en.title,
                  name_bm: dataset.meta.bm.title,
                  type: "image",
                })
              );
            }
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
    [mounted, svg, png]
  );

  return (
    <>
      <div ref={onRefChange}>
        <Choropleth
          className="h-[350px] w-full lg:h-[600px]"
          data={dataset.chart}
          colorScale={config.color}
          graphChoice={config.geojson}
          onReady={e => setMounted(e)}
        />
      </div>
    </>
  );
};

export default CatalogueChoropleth;
