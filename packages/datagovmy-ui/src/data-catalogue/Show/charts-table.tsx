import {
  Dispatch,
  FunctionComponent,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
} from "react";
import { useRouter } from "next/router";
import { Card, Dropdown, Search, Section, Slider } from "../../components";
import { useAnalytics, useTranslation } from "../../hooks";
import { clx, interpolate, numFormat, toDate } from "../../lib/helpers";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { CatalogueContext } from "../../contexts/catalogue";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import CatalogueEmbed, { EmbedInterface } from "../../charts/partials/embed";
import CataloguePreview from "../Preview";
import { DCDataViz, DCVariable } from "../../../types/data-catalogue";
import dynamic from "next/dynamic";
import { UNIVERSAL_TABLE_SCHEMA } from "../../lib/schema/data-catalogue";
import { SHORT_PERIOD_FORMAT } from "../../lib/constants";
import { TableCellsIcon } from "@heroicons/react/24/outline";

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

type ChartTableProps = {
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
  data: DCVariable;
  selectedViz: DCDataViz;
  setSelectedViz: Dispatch<SetStateAction<DCDataViz>>;
  filter: any;
  setFilter: (key: string, value: any) => void;
  sliderOptions: Array<string> | null;
  slider: string | null;
};

const DCChartsAndTable: FunctionComponent<ChartTableProps> = ({
  scrollRef,
  data,
  selectedViz,
  setSelectedViz,
  filter,
  setFilter,
  sliderOptions,
  slider,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const { downloads, dataset } = useContext(CatalogueContext);
  const { result } = useAnalytics(dataset);
  const embedRef = useRef<EmbedInterface>(null);
  const _downloads = Object.values(downloads).flatMap(option => option);
  const { config, ...viz } = selectedViz;
  const router = useRouter();

  const renderChart = (): ReactNode | undefined => {
    switch (dataset.type) {
      case "TIMESERIES":
      case "STACKED_AREA":
      case "INTRADAY":
        return (
          <CatalogueTimeseries
            translations={data.translations}
            config={{
              precision: config.precision,
              range: data.frequency || "DAILY",
            }}
          />
        );
      case "BAR":
      case "HBAR":
      case "STACKED_BAR":
        return (
          <WindowProvider>
            <CatalogueBar config={config} translations={data.translations} />
          </WindowProvider>
        );
      case "CHOROPLETH":
        return <CatalogueChoropleth config={selectedViz?.config} />;
      case "GEOCHOROPLETH":
        return <CatalogueGeoChoropleth config={config} />;
      case "GEOPOINT":
        return <CatalogueMapPlot />;
      case "GEOJSON":
        return <CatalogueGeojson config={config} />;
      case "PYRAMID":
        return <CataloguePyramid config={config} translations={data.translations} />;
      case "HEATTABLE":
        return <CatalogueHeatmap config={config} translations={data.translations} />;
      case "SCATTER":
        return (
          <CatalogueScatter
            className="mx-auto aspect-square w-full lg:h-[512px] lg:w-1/2"
            translations={data.translations}
          />
        );
      case "LINE":
        return <CatalogueLine config={config} translations={data.translations} />;
      default:
        break;
    }
    return;
  };

  const generateTableSchema = () => {
    const columns = Array.isArray(dataset.table) ? Object.keys(dataset.table[0]) : [];
    switch (dataset.type) {
      case "TIMESERIES":
      case "STACKED_AREA":
        return UNIVERSAL_TABLE_SCHEMA(
          columns,
          data.translations,
          config.freeze_columns,
          (item, key) => {
            if (key === "x")
              return toDate(
                item[key],
                SHORT_PERIOD_FORMAT[data.frequency as keyof typeof SHORT_PERIOD_FORMAT],
                i18n.language
              );
            else return item[key];
          }
        );
      case "INTRADAY":
        return UNIVERSAL_TABLE_SCHEMA(
          columns,
          data.translations,
          config.freeze_columns,
          (item, key) => {
            if (key === "x")
              return toDate(
                item[key],
                SHORT_PERIOD_FORMAT["INTRADAY" as keyof typeof SHORT_PERIOD_FORMAT],
                i18n.language
              );
            else return item[key];
          }
        );
      case "GEOPOINT":
      case "TABLE":
        return UNIVERSAL_TABLE_SCHEMA(
          columns,
          data.translations,
          config.freeze_columns,
          (item, key) => item[key]
        );
      default:
        return UNIVERSAL_TABLE_SCHEMA(columns, data.translations, config.freeze_columns);
    }
  };

  const scrollToChart = () => {
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: "smooth",
      block: "start",
    };
    scrollRef.current[
      i18n.language === "en-GB" ? "Table & Charts" : "Jadual & Carta"
    ]?.scrollIntoView(scrollOptions);
  };

  const urls = {
    csv: data.link_csv,
    parquet: data.link_parquet,
  };

  return (
    <>
      {/* Chart & Table */}
      <Section
        ref={ref =>
          (scrollRef.current[i18n.language === "en-GB" ? "Table & Charts" : "Jadual & Carta"] = ref)
        }
        title={<h4 data-testid="catalogue-title">{dataset.meta.title}</h4>}
        description={
          <p className="text-dim whitespace-pre-line text-base" data-testid="catalogue-description">
            {interpolate(dataset.meta.desc.substring(dataset.meta.desc.indexOf("]") + 1))}
          </p>
        }
        className=""
        date={data.data_as_of}
        menu={
          <>
            <Dropdown
              className={"flex lg:hidden"}
              width="w-fit"
              anchor="left"
              sublabel={<DocumentArrowDownIcon className="h-4 w-4" />}
              placeholder={t("download")}
              options={_downloads
                .map(item => ({
                  label: item.title as string,
                  value: item.id,
                }))
                .concat({ label: t("embed"), value: "embed" })}
              onChange={e => {
                // embed
                if (e.value === "embed") {
                  embedRef.current?.open();
                  return;
                }
                // downloads
                const action = _downloads.find(({ id }) => e.value === id);
                if (!action) return;
                return action.href();
              }}
            />
            <Dropdown
              className={"hidden lg:flex"}
              width="w-fit"
              anchor="right"
              sublabel={<DocumentArrowDownIcon className="h-4 w-4" />}
              placeholder={t("download")}
              options={_downloads
                .map(item => ({
                  label: item.title as string,
                  value: item.id,
                }))
                .concat({ label: t("embed"), value: "embed" })}
              onChange={e => {
                // embed
                if (e.value === "embed") {
                  embedRef.current?.open();
                  return;
                }
                // downloads
                const action = _downloads.find(({ id }) => e.value === id);
                if (!action) return;
                return action.href();
              }}
            />
          </>
        }
      >
        {/* Dataset Filters & Chart / Table */}
        <div
          className={clx(
            "flex gap-3 pb-3",
            Boolean(data.dropdown.length) ? "justify-between" : "justify-end"
          )}
        >
          <div className={clx("flex gap-2")}>
            {data.dropdown.map((item, index) => (
              <Dropdown
                key={item.name}
                width="w-full md:w-fit min-w-[120px]"
                anchor={index > 0 ? "right" : "left"}
                options={item.options.map(option => ({
                  label: data.translations[option] ?? option,
                  value: option,
                }))}
                selected={filter[item.name]}
                onChange={e => setFilter(item.name, e)}
                enableSearch={item.options.length > 20}
              />
            ))}
          </div>
        </div>

        <div className="min-h-[350px] lg:min-h-[450px]">
          <div
            className={clx(
              dataset.type !== "TABLE" && "mx-auto max-h-[500px] overflow-auto",
              dataset.type === "TABLE" ? "block" : "hidden"
            )}
          >
            <Table
              className={clx("table-stripe table-default table-sticky-header")}
              responsive={dataset.type === "TABLE"}
              data={dataset.table}
              freeze={config.freeze_columns}
              precision={config.precision}
              search={
                dataset.type === "TABLE"
                  ? onSearch => (
                      <Search
                        className="w-full border-b lg:w-auto"
                        onChange={query => onSearch(query ?? "")}
                      />
                    )
                  : undefined
              }
              config={generateTableSchema()}
              enablePagination={["TABLE", "GEOPOINT"].includes(dataset.type) ? 15 : false}
              data-testid="catalogue-table"
            />
          </div>
          <div className={clx("space-y-2", dataset.type === "TABLE" ? "hidden" : "block")}>
            {renderChart()}
          </div>
        </div>

        {/* Date Slider (optional) */}
        {sliderOptions !== null && (
          <Slider
            type="single"
            value={sliderOptions.indexOf(
              router.query.date_slider
                ? (router.query.date_slider as string)
                : sliderOptions[sliderOptions.length - 1]
            )}
            data={sliderOptions}
            // NOTE: ASK FOR THIS
            // period={SHORT_PERIOD[config.dates.interval]}
            period={"year"}
            onChange={e => {
              setFilter("date_slider", sliderOptions[e]);
            }}
          />
        )}

        <CatalogueEmbed
          uid={dataset.meta.unique_id}
          ref={embedRef}
          options={data.dropdown}
          defaultOption={filter}
          translations={data.translations}
          selectedVizKey={selectedViz.dataviz_id}
        />

        {/* Views / download count*/}
        <p className="text-dim flex justify-end gap-2 py-6 text-sm">
          <span>
            {`${numFormat(result?.total_views ?? 0, "compact")} ${t("common:common.views", {
              count: result?.total_views ?? 0,
            })}`}
          </span>
          <span>&middot;</span>
          <span>
            {`${numFormat(result?.total_downloads ?? 0, "compact")} ${t("common:common.downloads", {
              count: result?.total_downloads ?? 0,
            })}`}
          </span>
        </p>

        {data.dataviz_set && data.dataviz_set.length > 1 && (
          <Section>
            <div className="hide-scrollbar relative flex h-full w-full items-stretch gap-[0.5rem] overflow-x-scroll">
              <div className="sticky left-0 top-0 flex h-full w-[200px] max-w-[200px] flex-1 flex-col justify-start gap-2 lg:sticky lg:w-[calc(100%_/_5.5)] lg:flex-initial">
                <Card
                  className={clx(
                    "border-outline hover:border-outlineHover hover:bg-background dark:border-washed-dark hover:dark:border-outlineHover-dark dark:hover:bg-washed-dark/50 h-[110px] min-h-[110px] w-full max-w-[200px] p-2 transition-colors lg:min-w-[calc(100%_/_5.5)]",
                    selectedViz.chart_type === "TABLE" && "border-primary dark:border-primary-dark"
                  )}
                  onClick={() => {
                    setSelectedViz(
                      data.dataviz_set.find(item => item.chart_type === "TABLE") ??
                        data.dataviz_set[0]
                    );
                    router.replace(
                      {
                        query: { ...router.query, visual: "table" },
                      },
                      undefined,
                      { shallow: true }
                    );
                    scrollToChart();
                  }}
                >
                  <div className="flex h-full w-full items-center justify-center">
                    <TableCellsIcon className="text-outlineHover-dark h-24 w-24 stroke-[0.5px]" />
                  </div>
                </Card>
                <p className="h-full text-center text-xs">Table</p>
              </div>
              <div className="flex flex-1 gap-[0.5rem] overflow-x-auto pb-4">
                {data.dataviz_set
                  .filter(viz => viz.chart_type !== "TABLE")
                  .map(viz => {
                    return (
                      <CataloguePreview
                        key={viz.dataviz_id}
                        dataviz={viz}
                        dataset={dataset}
                        urls={urls}
                        translations={data.translations}
                        selectedViz={selectedViz}
                        setSelectedViz={setSelectedViz}
                        scrollToChart={scrollToChart}
                      />
                    );
                  })}
              </div>
            </div>
          </Section>
        )}
      </Section>
    </>
  );
};

export default DCChartsAndTable;
