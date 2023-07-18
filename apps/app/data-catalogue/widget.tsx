import { OptionType, isOptionType } from "@components/types";
import { ArrowTopRightOnSquareIcon as ExternalLinkIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { SHORT_PERIOD } from "./utils";
import { clx, toDate } from "@lib/helpers";
import type { DCChartKeys, DCConfig } from "@lib/types";
import { FunctionComponent, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import Slider from "@components/Chart/Slider";
import { useFilter } from "@hooks/useFilter";
import dynamic from "next/dynamic";
import Image from "next/image";
import { WindowContext, WindowProvider } from "@hooks/useWindow";
import Tooltip from "@components/Tooltip";
import { UNIVERSAL_TABLE_SCHEMA } from "@lib/schema/data-catalogue";
import { BREAKPOINTS } from "@lib/constants";
import Chips from "@components/Chips";

/**
 * Catalogue Show
 * @overview Status: Live
 */

const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const CatalogueTimeseries = dynamic(() => import("@data-catalogue/partials/timeseries"), {
  ssr: false,
});
const CatalogueChoropleth = dynamic(() => import("@data-catalogue/partials/choropleth"), {
  ssr: false,
});
const CatalogueGeoChoropleth = dynamic(() => import("@data-catalogue/partials/geochoropleth"), {
  ssr: false,
});
const CatalogueScatter = dynamic(() => import("@data-catalogue/partials/scatter"), {
  ssr: false,
});
const CatalogueMapPlot = dynamic(() => import("@data-catalogue/partials/mapplot"), {
  ssr: false,
});
const CatalogueGeojson = dynamic(() => import("@data-catalogue/partials/geojson"), {
  ssr: false,
});
const CatalogueBar = dynamic(() => import("@data-catalogue/partials/bar"), {
  ssr: false,
});
const CataloguePyramid = dynamic(() => import("@data-catalogue/partials/pyramid"), {
  ssr: false,
});
const CatalogueHeatmap = dynamic(() => import("@data-catalogue/partials/heatmap"), {
  ssr: false,
});
const CatalogueLine = dynamic(() => import("@data-catalogue/partials/line"), {
  ssr: false,
});

interface CatalogueWidgetProps {
  options: OptionType[];
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
  urls,
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
        return (
          <CatalogueTimeseries
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            config={config}
            dataset={dataset}
            filter={filter}
            urls={urls}
            translations={translations}
          />
        );
      case "CHOROPLETH":
        return (
          <CatalogueChoropleth
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            dataset={dataset}
            urls={urls}
            config={config}
          />
        );
      case "GEOCHOROPLETH":
        return (
          <CatalogueGeoChoropleth
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            dataset={dataset}
            urls={urls}
            config={config}
          />
        );
      case "GEOPOINT":
        return (
          <CatalogueMapPlot
            className={clx(chips.length ? "h-[80vh]" : "h-[85vh]", "w-full")}
            dataset={dataset}
            urls={urls}
          />
        );
      case "GEOJSON":
        return (
          <CatalogueGeojson
            className={clx(chips.length ? "h-[80vh]" : "h-[85vh]", "w-full")}
            config={config}
            dataset={dataset}
            urls={urls}
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
              dataset={dataset}
              urls={urls}
              translations={translations}
            />
          </WindowProvider>
        );
      case "PYRAMID":
        return (
          <CataloguePyramid
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            config={config}
            dataset={dataset}
            urls={urls}
            translations={translations}
          />
        );
      case "HEATTABLE":
        return (
          <CatalogueHeatmap
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            config={config}
            dataset={dataset}
            urls={urls}
            translations={translations}
          />
        );
      case "SCATTER":
        return (
          <CatalogueScatter
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "mx-auto aspect-square")}
            dataset={dataset}
            urls={urls}
            translations={translations}
          />
        );
      case "LINE":
        return (
          <CatalogueLine
            className={clx(chips.length ? "h-[75vh]" : "h-[80vh]", "w-full")}
            config={config}
            dataset={dataset}
            urls={urls}
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
    return;
  };

  return (
    <div className="flex h-[100vh] flex-col gap-3">
      <div className="space-y-1">
        <div className="flex flex-row items-center justify-start gap-2 md:justify-between">
          <h4 className="inline-block truncate" data-testid="catalogue-title">
            {dataset.meta.title}
          </h4>

          <>
            <Tooltip
              className="block md:hidden"
              tip={t("common:common.data_of", {
                date: toDate(metadata.data_as_of, "dd MMM yyyy", i18n.language),
              })}
            />
            <span className="text-dim hidden text-right text-sm md:block">
              {t("common:common.data_of", {
                date: toDate(metadata.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
              })}
            </span>
          </>
        </div>
        <Chips data={chips} onRemove={null} />
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

      <div className="bg-washed flex w-full gap-2 px-3 py-1">
        <Image src="/static/images/logo.png" width={16} height={14} alt="datagovmy logo" />
        <small className="text-dim space-x-2 ">
          <a
            href={`https://data.gov.my/data-catalogue/${dataset.meta.unique_id}`}
            target="_blank"
            className="space-x-1 hover:underline"
          >
            <span>View full chart</span>
            <ExternalLinkIcon className="inline-block h-3 w-3" />
          </a>

          <span>|</span>

          <a href="https://data.gov.my" className="text-primary">
            data.gov.my
          </a>
        </small>
      </div>
    </div>
  );
};

export default CatalogueShow;
