import {
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Chips, Slider, Tooltip } from "datagovmy-ui/components";
import { BREAKPOINTS, SHORT_PERIOD } from "datagovmy-ui/constants";
import { WindowContext, WindowProvider } from "datagovmy-ui/contexts/window";
import { clx, toDate } from "datagovmy-ui/helpers";
import { useFilter, useTranslation } from "datagovmy-ui/hooks";
import { UNIVERSAL_TABLE_SCHEMA } from "datagovmy-ui/schema/data-catalogue";
import { DCChartKeys, DCConfig, OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FunctionComponent, ReactNode, useContext, useEffect, useMemo, useState } from "react";

/**
 * Catalogue Show
 * @overview Status: Live
 */

const Table = dynamic(() => import("datagovmy-ui/charts/table"), { ssr: false });
const CatalogueTimeseries = dynamic(() => import("datagovmy-ui/dc-charts/timeseries"), {
  ssr: false,
});
const CatalogueChoropleth = dynamic(() => import("datagovmy-ui/dc-charts/choropleth"), {
  ssr: false,
});
const CatalogueGeoChoropleth = dynamic(() => import("datagovmy-ui/dc-charts/geochoropleth"), {
  ssr: false,
});
const CatalogueScatter = dynamic(() => import("datagovmy-ui/dc-charts/scatter"), {
  ssr: false,
});
const CatalogueMapPlot = dynamic(() => import("datagovmy-ui/dc-charts/mapplot"), {
  ssr: false,
});
const CatalogueGeojson = dynamic(() => import("datagovmy-ui/dc-charts/geojson"), {
  ssr: false,
});
const CatalogueBar = dynamic(() => import("datagovmy-ui/dc-charts/bar"), {
  ssr: false,
});
const CataloguePyramid = dynamic(() => import("datagovmy-ui/dc-charts/pyramid"), {
  ssr: false,
});
const CatalogueHeatmap = dynamic(() => import("datagovmy-ui/dc-charts/heatmap"), {
  ssr: false,
});
const CatalogueLine = dynamic(() => import("datagovmy-ui/dc-charts/line"), {
  ssr: false,
});

interface CatalogueWidgetProps {
  params: {
    id: string;
    theme: string;
  };
  config: DCConfig;
  dataset: {
    type: DCChartKeys;
    chart: any;
    table: Record<string, any>[];
    meta: { title: string; desc: string; unique_id: string };
  };
  metadata: {
    data_as_of: string;
    url: {
      csv?: string;
      parquet?: string;
      [key: string]: string | undefined;
    };
    source: string[];
    definitions: Array<{
      id: number;
      unique_id?: string;
      name: string;
      desc: string;
      title: string;
    }>;
    next_update: string;
    description: string;
    last_updated: string;
  };
  urls: {
    [key: string]: string;
  };
  translations: {
    [key: string]: string;
  };
}

const CatalogueShow: FunctionComponent<CatalogueWidgetProps> = ({
  params,
  config,
  dataset,
  metadata,
  translations,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const { filter, setFilter } = useFilter(config.context, { id: params.id, theme: params.theme });
  const { size } = useContext(WindowContext);
  const chips = useMemo<OptionType[]>(
    () =>
      Object.entries(filter)
        .filter(([key, _]: [string, unknown]) => {
          return key !== "date_slider";
        })
        .map(([_, value]) => value as OptionType),
    [filter]
  );
  const [rows, setRows] = useState<number>(10);
  const ROW_HEIGHT = 40;

  useEffect(
    () =>
      setRows(
        Math.floor(
          (size.height - (size.width > BREAKPOINTS.MD ? ROW_HEIGHT * 4 : ROW_HEIGHT * 6)) /
            ROW_HEIGHT
        )
      ),
    [size.height, size.width]
  );

  const renderChart = (): ReactNode | undefined => {
    switch (dataset.type) {
      case "TIMESERIES":
      case "STACKED_AREA":
      case "INTRADAY":
        return (
          <CatalogueTimeseries
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            config={{
              precision: config.precision,
              range: filter?.range?.value ?? "INTRADAY",
            }}
            translations={translations}
          />
        );
      case "CHOROPLETH":
        return (
          <CatalogueChoropleth
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            config={config}
          />
        );
      case "GEOCHOROPLETH":
        return (
          <CatalogueGeoChoropleth
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            config={config}
          />
        );
      case "GEOPOINT":
        return (
          <CatalogueMapPlot className={clx(chips.length ? "h-[80vh]" : "h-[85vh]", "w-full")} />
        );
      case "GEOJSON":
        return (
          <CatalogueGeojson
            className={clx(chips.length ? "h-[80vh]" : "h-[85vh]", "w-full")}
            config={config}
          />
        );
      case "BAR":
      case "HBAR":
      case "STACKED_BAR":
        return (
          <WindowProvider>
            <CatalogueBar
              className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
              config={config}
              translations={translations}
            />
          </WindowProvider>
        );
      case "PYRAMID":
        return (
          <CataloguePyramid
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            config={config}
            translations={translations}
          />
        );
      case "HEATTABLE":
        return (
          <CatalogueHeatmap
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            config={config}
            translations={translations}
          />
        );
      case "SCATTER":
        return (
          <CatalogueScatter
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "mx-auto aspect-square")}
            translations={translations}
          />
        );
      case "LINE":
        return (
          <CatalogueLine
            className={clx(chips.length ? "h-[75vh]" : "h-[80vh]", "w-full")}
            config={config}
            translations={translations}
          />
        );
      case "TABLE":
        return (
          <div className="flex h-full w-full flex-col">
            <Table
              className="table-stripe table-default table-sticky-header grow"
              responsive={true}
              data={dataset.table}
              freeze={config.freeze}
              config={UNIVERSAL_TABLE_SCHEMA(
                Object.keys(dataset.table[0]),
                translations,
                config.freeze,
                (item, key) => item[key]
              )}
              enablePagination={rows}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex h-[100vh] flex-col gap-3 p-2 lg:p-3">
      <div className="space-y-1">
        <div className="flex flex-row items-center justify-start gap-2 md:justify-between">
          <h4 className="inline-block truncate" data-testid="catalogue-title">
            {dataset.meta.title}
          </h4>

          <div>
            <Tooltip
              tip={t("common:common.data_of", {
                date: toDate(metadata.data_as_of, "dd MMM yyyy", i18n.language),
              })}
            >
              {open => (
                <>
                  <InformationCircleIcon
                    className="mb-1 inline-block h-4 w-4 text-outlineHover md:hidden"
                    onClick={() => open}
                  />
                </>
              )}
            </Tooltip>
            <span className="hidden text-right text-sm text-dim md:block">
              {t("common:common.data_of", {
                date: toDate(metadata.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
              })}
            </span>
          </div>
        </div>
        <Chips className="text-sm" data={chips} onRemove={null} onClearAll={null} />
      </div>

      {/* Chart */}
      <div className="grow">
        {renderChart()}
        {config.dates !== null && (
          <Slider
            className="pt-4"
            type="single"
            value={config.dates?.options.indexOf(
              filter[config.dates.key].value ?? config.dates.default
            )}
            data={config.dates.options}
            period={SHORT_PERIOD[config.dates.interval]}
            onChange={e =>
              config.dates !== null && setFilter(config.dates.key, config.dates.options[e])
            }
          />
        )}
      </div>

      <div className="fixed bottom-0 left-0 flex w-full gap-2 bg-washed px-3 py-1">
        <div className="flex h-4 w-4 items-end">
          <Image src="/static/images/logo.png" width={16} height={16} alt="datagovmy logo" />
        </div>
        <small className="space-x-2 text-dim ">
          <a
            href={`https://open.dosm.gov.my/data-catalogue/${dataset.meta.unique_id}`}
            target="_blank"
            className="space-x-1 hover:underline"
          >
            <span>{t("view_full_chart")}</span>
            <ExternalLinkIcon className="inline-block h-3 w-3" />
          </a>

          <span>|</span>

          <a href="https://open.dosm.gov.my" className="text-primary">
            open.dosm.gov.my
          </a>
        </small>
      </div>
    </div>
  );
};

export default CatalogueShow;
