import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import type { Color } from "@hooks/useColor";
import { useTranslation } from "@hooks/useTranslation";
import { download, exportAs } from "@lib/helpers";
import type { DownloadOptions } from "@lib/types";
// import { track } from "mixpanel-browser";
import { default as dynamic } from "next/dynamic";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import type { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), {
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
  const [ctx, setCtx] = useState<ChartJSOrUndefined<"choropleth", any[], unknown> | null>(null);
  useEffect(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [ctx]);

  const availableDownloads = useMemo<DownloadOptions>(
    () => ({
      chart: [
        {
          key: "png",
          image: ctx && ctx.toBase64Image("png", 1),
          title: t("catalogue.image.title"),
          description: t("catalogue.image.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            download(ctx!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"));
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
        {
          key: "svg",
          image: ctx && ctx.toBase64Image("png", 1),
          title: t("catalogue.vector.title"),
          description: t("catalogue.vector.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            exportAs("svg", ctx!.canvas)
              .then(dataUrl => download(dataUrl, dataset.meta.unique_id.concat(".svg")))
              .then(
                () => {}
                // track("file_download", {
                //   uid: dataset.meta.unique_id.concat("_svg"),
                //   type: "image",
                //   id: dataset.meta.unique_id,
                //   name_en: dataset.meta.en.title,
                //   name_bm: dataset.meta.bm.title,
                //   ext: "svg",
                // })
              )
              .catch(e => {
                console.error(e);
              });
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
    [ctx]
  );

  return (
    <Choropleth
      _ref={_ref => setCtx(_ref)}
      className="h-[350px] w-full lg:h-[400px]"
      data={{
        labels: dataset.chart.map(({ id }: ChoroPoint) => id),
        values: dataset.chart.map(({ value }: ChoroPoint) => value),
      }}
      color={config.color}
      type={config.geojson}
    />
  );
};

export default CatalogueChoropleth;
