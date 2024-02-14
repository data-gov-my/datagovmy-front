import {
  ArrowTopRightOnSquareIcon as ExternalLinkIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Chips, Tooltip } from "datagovmy-ui/components";
import { BREAKPOINTS } from "datagovmy-ui/constants";
import { CatalogueContext } from "datagovmy-ui/contexts/catalogue";
import { WindowContext, WindowProvider } from "datagovmy-ui/contexts/window";
import { clx, toDate } from "datagovmy-ui/helpers";
import { useFilter, useTranslation } from "datagovmy-ui/hooks";
import { UNIVERSAL_TABLE_SCHEMA } from "datagovmy-ui/schema/data-catalogue";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FunctionComponent, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { DCDataViz, DCVariable } from "../../../types/data-catalogue";

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
    currentVisual: string;
  };
  data: DCVariable;
  selectedViz: DCDataViz;
  query: any;
}

const CatalogueWidget: FunctionComponent<CatalogueWidgetProps> = ({
  params,
  data,
  query,
  selectedViz,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const { config, ...viz } = selectedViz;
  const { filter, setFilter } = useFilter(
    Object.fromEntries(
      data.dropdown.map(item => [
        item.name,
        query[item.name]
          ? item.options.find(opt => query[item.name] === opt)
            ? {
                value: query[item.name],
                label: data.translations[query[item.name]] ?? query[item.name],
              }
            : {
                value: item.options[0],
                label: data.translations[item.options[0]] ?? item.options[0],
              }
          : {
              value: item.selected,
              label: data.translations[item.selected] ?? item.selected,
            },
      ])
    ),
    {
      id: params.id,
      theme: params.theme,
      visual: query.visual,
    }
  );
  const { dataset } = useContext(CatalogueContext);
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
              range: data.frequency ?? "DAILY",
            }}
            translations={data.translations}
          />
        );
      case "CHOROPLETH":
        return (
          <CatalogueChoropleth
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            config={selectedViz?.config}
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
              translations={data.translations}
            />
          </WindowProvider>
        );
      case "PYRAMID":
        return (
          <CataloguePyramid
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            config={config}
            translations={data.translations}
          />
        );
      case "HEATTABLE":
        return (
          <CatalogueHeatmap
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "w-full")}
            config={config}
            translations={data.translations}
          />
        );
      case "SCATTER":
        return (
          <CatalogueScatter
            className={clx(chips.length ? "h-[70vh]" : "h-[75vh]", "mx-auto aspect-square")}
            translations={data.translations}
          />
        );
      case "LINE":
        return (
          <CatalogueLine
            className={clx(chips.length ? "h-[75vh]" : "h-[80vh]", "w-full")}
            config={config}
            translations={data.translations}
          />
        );
      case "TABLE":
        return (
          <div className="flex h-full w-full flex-col">
            <Table
              className="table-stripe table-default table-sticky-header grow"
              responsive={true}
              data={dataset.table}
              freeze={config.freeze_columns}
              config={UNIVERSAL_TABLE_SCHEMA(
                Object.keys(dataset.table[0]),
                data.translations,
                config.freeze_columns,
                (item, key) => item[key]
              )}
              enablePagination={rows}
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col gap-3 overflow-scroll p-4 pb-8">
      <div className="space-y-1">
        <div className="flex flex-row items-center justify-start gap-2 md:justify-between">
          <h4 className="inline-block truncate" data-testid="catalogue-title">
            {dataset.meta.title}
          </h4>

          <div>
            <Tooltip
              tip={t("common:common.data_of", {
                date: toDate(data.data_as_of, "dd MMM yyyy", i18n.language),
              })}
            >
              {open => (
                <>
                  <InformationCircleIcon
                    className="text-outlineHover mb-1 inline-block h-4 w-4 md:hidden"
                    onClick={() => open}
                  />
                </>
              )}
            </Tooltip>
            <span className="text-dim hidden text-right text-sm md:block">
              {t("common:common.data_of", {
                date: toDate(data.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
              })}
            </span>
          </div>
        </div>
        <Chips className="text-sm" data={chips} onRemove={null} onClearAll={null} />
      </div>

      {/* Chart */}
      <div className="grow">{renderChart()}</div>

      <div className="bg-washed h- fixed bottom-0 left-0 flex w-full gap-2 px-3 py-1">
        <Image src="/static/images/logo.png" width={16} height={14} alt="datagovmy logo" />
        <small className="text-dim space-x-2 ">
          <a
            href={`https://data.gov.my/data-catalogue/${dataset.meta.unique_id}`}
            target="_blank"
            className="space-x-1 hover:underline"
          >
            <span>{t("view_full_chart")}</span>
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

export default CatalogueWidget;
