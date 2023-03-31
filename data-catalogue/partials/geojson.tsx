import type { ChoroplethColors, DownloadOptions } from "@lib/types";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { default as dynamic } from "next/dynamic";
import canvasToSvg from "canvas2svg";
import { useTranslation } from "@hooks/useTranslation";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download } from "@lib/helpers";
import { track } from "mixpanel-browser";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), {
  ssr: false,
});

type ChoroPoint = {
  id: string;
  value: number;
};

interface CatalogueGeojsonProps {
  config: {
    color: ChoroplethColors;
    geojson: "state" | "dun" | "parlimen" | "district";
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

const CatalogueGeojson: FunctionComponent<CatalogueGeojsonProps> = ({
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

  //   const yieldDummy = () => {
  //     const geojson_dict: Record<typeof config.geojson, any> = {
  //       state: STATES,
  //       dun: DUNS,
  //       parlimen: PARLIMENS,
  //       district: DISTRICTS,
  //     };

  //     return Object.values(geojson_dict[config.geojson])
  //       .flat()
  //       .map(item => ({ id: (item as unknown as OptionType).label, value: -1.1 }));
  //   };

  const availableDownloads = useMemo(
    () => ({
      chart: [
        {
          key: "png",
          image: ctx && ctx.toBase64Image("png", 1),
          title: t("catalogue.image.title"),
          description: t("catalogue.image.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            download(ctx!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"), () =>
              track("file_download", {
                uid: dataset.meta.unique_id.concat("_png"),
                type: "image",
                id: dataset.meta.unique_id,
                name_en: dataset.meta.en.title,
                name_bm: dataset.meta.bm.title,
                ext: "png",
              })
            );
          },
        },
        {
          key: "svg",
          image: ctx && ctx.toBase64Image("png", 1),
          title: t("catalogue.vector.title"),
          description: t("catalogue.vector.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            let canvas = canvasToSvg(ctx!.canvas.width, ctx!.canvas.height);
            canvas.drawImage(ctx?.canvas, 0, 0);
            download(
              "data:svg+xml;utf8,".concat(canvas.getSerializedSvg()),
              dataset.meta.unique_id.concat(".svg"),
              () =>
                track("file_download", {
                  uid: dataset.meta.unique_id.concat("_svg"),
                  id: dataset.meta.unique_id,
                  name_en: dataset.meta.en.title,
                  name_bm: dataset.meta.bm.title,
                  type: "image",
                  ext: "svg",
                })
            );
          },
        },
      ],
      data: [
        {
          key: "geojson",
          image: "/static/images/icons/geojson.png",
          title: t("catalogue.geojson.title"),
          description: t("catalogue.geojson.desc"),
          icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: urls[Object.keys(urls)[0]],
        },
      ],
    }),
    [ctx]
  );

  return (
    <Choropleth
      _ref={_ref => setCtx(_ref)}
      className="h-[350px] w-full lg:h-[600px]"
      type={config.geojson}
    />
  );
};

export default CatalogueGeojson;
