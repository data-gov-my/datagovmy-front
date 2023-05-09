import type { DownloadOptions } from "@lib/types";
import { FunctionComponent, useContext, useMemo, useState } from "react";
import { default as dynamic } from "next/dynamic";
import { useWatch } from "@hooks/useWatch";
import { AKSARA_COLOR, BREAKPOINTS } from "@lib/constants";
import { CloudArrowDownIcon, DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import { download, exportAs } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { track } from "@lib/mixpanel";
import { WindowContext } from "@hooks/useWindow";
import type { ChartDataset } from "chart.js";
import { ChartJSOrUndefined } from "react-chartjs-2/dist/types";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
interface CatalogueBarProps {
  config: any;
  dataset: any;
  urls: {
    [key: string]: string;
  };
  onDownload?: (prop: DownloadOptions) => void;
  translations: Record<string, string>;
}

const CatalogueBar: FunctionComponent<CatalogueBarProps> = ({
  config,
  dataset,
  urls,
  translations,
  onDownload,
}) => {
  const { t } = useTranslation();
  const [ctx, setCtx] = useState<ChartJSOrUndefined<"bar", any[], unknown> | null>(null);
  const { breakpoint } = useContext(WindowContext);
  const bar_layout = useMemo<"horizontal" | "vertical">(() => {
    if (dataset.type === "HBAR" || breakpoint < BREAKPOINTS.MD) return "horizontal";

    return "vertical";
  }, [dataset.type, breakpoint]);

  const availableDownloads = useMemo<DownloadOptions>(
    () => ({
      chart: [
        {
          key: "png",
          image: ctx && ctx.toBase64Image("png", 1),
          title: t("common:catalogue.image.title"),
          description: t("common:catalogue.image.desc"),
          icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: () => {
            download(ctx!.toBase64Image("png", 1), dataset.meta.unique_id.concat(".png"));
            track("file_download", {
              uid: dataset.meta.unique_id.concat("_png"),
              type: "image",
              id: dataset.meta.unique_id,
              name: dataset.meta.title,
              ext: "png",
            });
          },
        },
        {
          key: "svg",
          image: ctx && ctx.toBase64Image("image/png", 1),
          title: t("common:catalogue.vector.title"),
          description: t("common:catalogue.vector.desc"),
          icon: <CloudArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: () => {
            exportAs("svg", ctx!.canvas)
              .then(dataUrl => download(dataUrl, dataset.meta.unique_id.concat(".svg")))
              .then(() =>
                track("file_download", {
                  uid: dataset.meta.unique_id.concat("_svg"),
                  type: "image",
                  id: dataset.meta.unique_id,
                  name: dataset.meta.title,
                  ext: "svg",
                })
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
          title: t("common:catalogue.csv.title"),
          description: t("common:catalogue.csv.desc"),
          icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: urls.csv,
        },
        {
          key: "parquet",
          image: "/static/images/icons/parquet.png",
          title: t("common:catalogue.parquet.title"),
          description: t("common:catalogue.parquet.desc"),
          icon: <DocumentArrowDownIcon className="text-dim h-6 min-w-[24px]" />,
          href: urls.parquet,
        },
      ],
    }),
    [ctx]
  );

  const _datasets = useMemo<ChartDataset<"bar", any[]>[]>(() => {
    const sets = Object.entries(dataset.chart).filter(([key, _]) => key !== "x");
    const colors = [
      AKSARA_COLOR.PRIMARY,
      AKSARA_COLOR.WARNING,
      AKSARA_COLOR.DANGER,
      AKSARA_COLOR.GREY,
    ]; // [blue, red]

    return sets.map(([key, y], index) => ({
      data: y as number[],
      label: sets.length === 1 ? dataset.meta.title : translations[key] ?? key,
      borderColor: colors[index],
      backgroundColor: colors[index].concat("1A"),
      borderWidth: 1,
    }));
  }, [dataset.chart]);

  useWatch(() => {
    if (onDownload) onDownload(availableDownloads);
  }, [dataset.chart.x, ctx]);

  return (
    <>
      <Bar
        _ref={ref => setCtx(ref)}
        className={
          bar_layout === "vertical"
            ? "h-[450px] w-full lg:h-[350px]"
            : "mx-auto h-[500px] w-full lg:h-[600px] lg:w-3/4"
        }
        type="category"
        enableStack={dataset.type === "STACKED_BAR"}
        layout={bar_layout}
        enableGridX={bar_layout !== "vertical"}
        enableGridY={bar_layout === "vertical"}
        enableLegend={_datasets.length > 1}
        precision={config?.precision !== undefined ? [config.precision, config.precision] : [1, 1]}
        formatX={value => {
          if (t(`catalogue.show_filters.${value}`).includes(".show_filters")) return value;
          return t(`catalogue.show_filters.${value}`);
        }}
        data={{
          labels: dataset.chart.x,
          datasets: _datasets,
        }}
      />
    </>
  );
};

export default CatalogueBar;
