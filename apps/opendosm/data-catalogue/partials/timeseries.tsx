import type { Periods } from "@components/Chart/Timeseries";
import type { DownloadOptions } from "@lib/types";
import { FunctionComponent, useCallback, useRef } from "react";
import { default as Slider, SliderRef } from "@components/Chart/Slider";
import { default as dynamic } from "next/dynamic";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useWatch } from "@hooks/useWatch";
import { AKSARA_COLOR, SHORT_PERIOD } from "@lib/constants";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import canvasToSvg from "canvas2svg";
import { track } from "@lib/mixpanel";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
interface CatalogueTimeseriesProps {
  config: {
    precision: number;
  };
  className?: string;
  dataset:
    | {
        chart: {
          x: number[];
          y: number[];
          line: number[];
        };
        meta: {
          en: {
            title: string;
          };
          bm: {
            title: string;
          };
        };
      }
    | any;
  filter: any;
  urls: {
    [key: string]: string;
  };
  lang: "en" | "bm";
  onDownload?: (prop: DownloadOptions) => void;
}

const CatalogueTimeseries: FunctionComponent<CatalogueTimeseriesProps> = ({
  config,
  className = "h-[350px] w-full",
  lang,
  dataset,
  urls,
  filter,
  onDownload,
}) => {
  const { t } = useTranslation();
  const { data, setData } = useData({
    ctx: undefined,
    minmax: [0, dataset.chart.x.length - 1],
  });
  const { coordinate } = useSlice(
    {
      x: dataset.chart.x,
      y: dataset.chart.y,
      line: dataset.chart.line,
    },
    data.minmax
  );
  const sliderRef = useRef<SliderRef>(null);

  const availableDownloads = useCallback<() => DownloadOptions>(
    () => ({
      chart: [
        {
          key: "png",
          image: Boolean(data?.ctx) && data.ctx.toBase64Image("png", 1),
          title: t("catalogue.image.title"),
          description: t("catalogue.image.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            download(data.ctx!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"), () =>
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
          image: Boolean(data?.ctx) && data.ctx.toBase64Image("image/png", 1),
          title: t("catalogue.vector.title"),
          description: t("catalogue.vector.desc"),
          icon: <CloudArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
          href: () => {
            let canvas = canvasToSvg(data.ctx!.canvas.width, data.ctx!.canvas.height);
            canvas.drawImage(data.ctx!.canvas, 0, 0);
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
    [data.ctx]
  );

  useWatch(() => {
    setData("minmax", [0, dataset.chart.x.length - 1]);
    sliderRef.current && sliderRef.current.reset();
    onDownload && onDownload(availableDownloads());
  }, [filter.range, dataset.chart.x, data.ctx]);

  return (
    <>
      <Timeseries
        className={className}
        _ref={ref => setData("ctx", ref)}
        interval={
          filter.range?.value
            ? SHORT_PERIOD[filter.range.value as keyof typeof SHORT_PERIOD]
            : "auto"
        }
        precision={config?.precision !== undefined ? [config.precision, config.precision] : [1, 1]}
        data={{
          labels: coordinate.x,
          datasets: [
            {
              type: "line",
              data: coordinate.y,
              label: dataset.meta[lang].title,
              borderColor: AKSARA_COLOR.PRIMARY,
              backgroundColor: AKSARA_COLOR.PRIMARY_H,
              borderWidth: 1.5,
              fill: true,
            },
          ],
        }}
      />
      <Slider
        ref={sliderRef}
        className="pt-7"
        type="range"
        data={dataset.chart.x}
        value={data.minmax}
        period={
          ["YEARLY", "MONTHLY", "QUARTERLY"].includes(filter.range?.value)
            ? filter.range.value.toLowerCase().replace("ly", "")
            : "auto"
        }
        onChange={e => setData("minmax", e)}
      />
    </>
  );
};

export default CatalogueTimeseries;
