import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { TableCellsIcon } from "@heroicons/react/24/outline";
import CatalogueCode from "datagovmy-ui/charts/partials/code";
import { SampleCode } from "datagovmy-ui/charts/partials/code";
import CatalogueEmbed, { EmbedInterface } from "datagovmy-ui/charts/partials/embed";
import {
  At,
  Card,
  Container,
  Dropdown,
  Metadata,
  Search,
  Section,
  Sidebar,
} from "datagovmy-ui/components";
import { useRouter } from "next/router";
import { SHORT_PERIOD_FORMAT } from "datagovmy-ui/constants";
import { CatalogueContext, CatalogueProvider, DatasetType } from "datagovmy-ui/contexts/catalogue";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { clx, interpolate, numFormat, recurDataMapping, toDate } from "datagovmy-ui/helpers";
import { useAnalytics, useFilter, useTranslation } from "datagovmy-ui/hooks";
import { UNIVERSAL_TABLE_SCHEMA } from "datagovmy-ui/schema/data-catalogue";
import { DCVariable, DCDataViz } from "../../../types/data-catalogue";
import sum from "lodash/sum";
import dynamic from "next/dynamic";
import {
  Dispatch,
  FunctionComponent,
  ReactNode,
  SetStateAction,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import CataloguePreview from "../Preview";
import DCMethodology from "./methodology";
import { AnalyticsProvider, Meta } from "../../contexts/analytics";
import { DownloadCard } from "../Card";
import DCMetadata from "./metadata";

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

type CatalogueShowWrapperProps = {
  meta: Meta;
  params: {
    id: string;
    visual?: string;
  };
  data: DCVariable;
  query: any;
};

const CatalogueShowWrapper: FunctionComponent<CatalogueShowWrapperProps> = ({
  params,
  data,
  meta,
  query,
}) => {
  const [selectedViz, setSelectedViz] = useState<DCDataViz>(
    data.dataviz_set.find(item => item.dataviz_id === query.visual) ?? data.dataviz_set[0]
  );
  const router = useRouter();

  const extractChartDataset = (table_data: Record<string, any>[], currentViz: DCDataViz) => {
    const set = Object.entries(currentViz?.config.format).map(([key, value]) =>
      recurDataMapping(key, value, table_data)
    );
    return {
      ...Object.fromEntries(set.map(array => [array[0][0], array[0][1]])),
    };
  };

  const dataset: DatasetType = useMemo(() => {
    return {
      type: selectedViz.chart_type,
      chart: selectedViz.chart_type !== "TABLE" ? extractChartDataset(data.data, selectedViz) : {},
      table: data.data,
      meta: {
        unique_id: data.id,
        title: data.title,
        desc: data.description,
      },
    };
  }, [selectedViz, query]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={selectedViz.chart_type !== "TABLE" ? selectedViz.title : dataset.meta.title}
        description={dataset.meta.desc.replace(/^(.*?)]/, "")}
        keywords={""}
      />
      <CatalogueProvider
        dataset={dataset}
        urls={{
          csv: data.link_csv,
          parquet: data.link_parquet,
        }}
      >
        <CatalogueShow
          key={router.asPath}
          params={params}
          query={query}
          data={data}
          selectedViz={selectedViz}
          setSelectedViz={setSelectedViz}
        />
      </CatalogueProvider>
    </AnalyticsProvider>
  );
};

export interface CatalogueShowProps {
  params: {
    id: string;
  };
  data: DCVariable;
  selectedViz: DCDataViz;
  setSelectedViz: Dispatch<SetStateAction<DCDataViz>>;
  query: any;
}

const CatalogueShow: FunctionComponent<CatalogueShowProps> = ({
  params,
  data,
  selectedViz,
  setSelectedViz,
  query,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const { config, ...viz } = selectedViz;
  const embedRef = useRef<EmbedInterface>(null);
  const scrollRef = useRef<Record<string, HTMLElement | null>>({});
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
    { id: params.id },
    true
  );
  const { downloads, dataset } = useContext(CatalogueContext);
  const _downloads = Object.values(downloads).flatMap(option => option);
  const { result, track } = useAnalytics(dataset);

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
              range: config?.range || "DAILY",
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
                SHORT_PERIOD_FORMAT[config.range as keyof typeof SHORT_PERIOD_FORMAT],
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
    <div>
      <Container className="minh-screen max-w-full">
        <Sidebar
          categories={Object.entries(
            getSideBarCollection({
              publications: Boolean(data.publication),
              related_datasets: Boolean(data.related_datasets.length),
            })[i18n.language]
          ).map(([category, subcategory]) => [category, Object.keys(subcategory)])}
          onSelect={selected => {
            scrollRef.current[selected]?.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "end",
            });
          }}
          mobileClassName="top-4"
          initialSelected={i18n.language === "en-GB" ? "Table & Charts" : "Jadual & Carta"}
          sidebarTitle={i18n.language === "en-GB" ? "On this page" : "Kandungan"}
        >
          <div className="mx-auto flex-1 p-2 py-6 pt-16 md:max-w-screen-md lg:max-w-screen-lg lg:p-8 lg:pb-6">
            {/* Chart & Table */}
            <Section
              ref={ref =>
                (scrollRef.current[
                  i18n.language === "en-GB" ? "Table & Charts" : "Jadual & Carta"
                ] = ref)
              }
              title={<h4 data-testid="catalogue-title">{dataset.meta.title}</h4>}
              description={
                <p
                  className="text-dim whitespace-pre-line text-base"
                  data-testid="catalogue-description"
                >
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
                  {`${numFormat(result?.view_count ?? 0, "compact")} ${t("common:common.views", {
                    count: result?.view_count ?? 0,
                  })}`}
                </span>
                <span>&middot;</span>
                <span>
                  {`${numFormat(
                    sum([
                      result?.download_csv,
                      result?.download_parquet,
                      result?.download_png,
                      result?.download_svg,
                    ]) ?? 0,
                    "compact"
                  )} ${t("common:common.downloads", {
                    count:
                      sum([
                        result?.download_csv,
                        result?.download_parquet,
                        result?.download_png,
                        result?.download_svg,
                      ]) ?? 0,
                  })}`}
                </span>
              </p>

              {data.dataviz_set && data.dataviz_set.length > 1 && (
                <Section>
                  <div className="relative flex h-full w-full items-stretch gap-[0.5rem] overflow-x-scroll">
                    <div className="sticky left-0 top-0 flex h-full w-[200px] max-w-[200px] flex-1 flex-col justify-start gap-2 lg:sticky lg:w-[calc(100%_/_5.5)] lg:flex-initial">
                      <Card
                        className={clx(
                          "border-outline hover:border-outlineHover hover:bg-background dark:border-washed-dark hover:dark:border-outlineHover-dark dark:hover:bg-washed-dark/50 h-[110px] min-h-[110px] w-full max-w-[200px] p-2 transition-colors lg:min-w-[calc(100%_/_5.5)]",
                          selectedViz.chart_type === "TABLE" &&
                            "border-primary dark:border-primary-dark"
                        )}
                        onClick={() => {
                          setSelectedViz(
                            data.dataviz_set.find(item => item.chart_type === "TABLE") ??
                              data.dataviz_set[0]
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
                    <div className="hide-scrollbar flex flex-1 gap-[0.5rem] overflow-x-auto pb-4">
                      {data.dataviz_set
                        .filter(viz => viz.chart_type !== "TABLE")
                        .map(viz => {
                          return (
                            <CataloguePreview
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

            {/* Methodology */}
            <DCMethodology
              explanation={{
                methodology: data.methodology,
                caveat: data.caveat,
                publication: data.publication,
                related_datasets: data.related_datasets,
              }}
              isGUI={false}
              scrollRef={scrollRef}
            />

            {/* Metadata */}
            <DCMetadata
              isGUI={false}
              scrollRef={scrollRef}
              metadata={{
                description: data.description,
                fields: data.fields,
                last_updated: data.last_updated,
                next_update: data.next_update,
                data_source: data.data_source,
                link_csv: data.link_csv,
                link_parquet: data.link_parquet,
              }}
            />
            {/* Download */}
            <Section
              title={t("download")}
              ref={ref =>
                (scrollRef.current[i18n.language === "en-GB" ? "Download" : "Muat Turun"] = ref)
              }
              className="dark:border-b-outlineHover-dark mx-auto border-b py-12 "
            >
              <div className="space-y-5">
                {downloads?.chart.length > 0 && (
                  <>
                    <h5>{t("chart")}</h5>
                    <div className="gap-4.5 grid grid-cols-1 md:grid-cols-2">
                      {downloads?.chart.map(props => (
                        <DownloadCard
                          key={`${dataset.meta.unique_id}_${props.id}`}
                          views={
                            result ? result[`download_${props.id as "png" | "svg"}`] : undefined
                          }
                          {...props}
                        />
                      ))}
                    </div>
                  </>
                )}
                {downloads?.data.length > 0 && (
                  <>
                    <h5>Data</h5>
                    <div className="gap-4.5 grid grid-cols-1 md:grid-cols-2">
                      {downloads?.data.map(props => (
                        <DownloadCard
                          key={`${dataset.meta.unique_id}_${props.id}`}
                          views={
                            result ? result[`download_${props.id as "csv" | "parquet"}`] : undefined
                          }
                          {...props}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </Section>

            {/* Dataset Source Code */}
            <Section
              title={t("code")}
              ref={ref =>
                (scrollRef.current[
                  i18n.language === "en-GB"
                    ? "Programmatic Access: Full dataset"
                    : "Akses Programatif: Dataset penuh"
                ] = ref)
              }
              description={t("code_desc")}
              className="mx-auto w-full py-12"
            >
              <CatalogueCode
                type={dataset.type}
                url={urls.parquet || urls[Object.keys(urls)[0] as "csv" | "parquet"]}
              />
            </Section>

            {/* API Request Code */}
            {data.exclude_openapi ? (
              <Section
                title={t("sample_query.section_title")}
                ref={ref =>
                  (scrollRef.current[
                    i18n.language === "en-GB"
                      ? "Programmatic Access: Open API"
                      : "Akses Programatif: Open API"
                  ] = ref)
                }
                description={t("sample_query.unavailable")}
              />
            ) : (
              <Section
                title={t("sample_query.section_title")}
                ref={ref =>
                  (scrollRef.current[
                    i18n.language === "en-GB"
                      ? "Programmatic Access: Open API"
                      : "Akses Programatif: Open API"
                  ] = ref)
                }
                description={
                  <>
                    {t("sample_query.desc1")}
                    <At
                      className="link-dim text-base underline"
                      href={`https://developer.data.gov.my${
                        i18n.language === "en-GB" ? "" : "/ms"
                      }/static-api/data-catalogue`}
                      external
                    >
                      {t("sample_query.link1")}
                    </At>
                    .
                  </>
                }
                className="mx-auto w-full py-12"
              >
                <SampleCode
                  catalogueId={data.id}
                  url={urls.parquet || urls[Object.keys(urls)[0] as "csv" | "parquet"]}
                  route="data-catalogue"
                />
              </Section>
            )}
          </div>
        </Sidebar>
      </Container>
    </div>
  );
};

const getSideBarCollection: (
  item: Record<"publications" | "related_datasets", Boolean>
) => Record<string, Record<string, any>> = item => {
  return {
    "en-GB": {
      "Table & Charts": {},
      "Metadata": {
        "Methodology": [],
        "Caveats": [],
        ...(item.publications ? { Publications: [] } : {}),
        ...(item.related_datasets ? { "Related Datasets": [] } : {}),
        "Variables": [],
        "Next update": [],
        "License": [],
      },
      "Download": {},
      "Programmatic Access": {
        "Full dataset": [],
        "Open API": [],
      },
    },
    "ms-MY": {
      "Jadual & Carta": {},
      "Metadata": {
        "Metodologi": [],
        "Kaveat": [],
        ...(item.publications ? { Penerbitan: [] } : {}),
        ...(item.related_datasets ? { "Dataset Berkaitan": [] } : {}),
        "Pembolehubah": [],
        "Kemaskini seterusnya": [],
        "Lesen": [],
      },
      "Muat Turun": {},
      "Akses Programatif": {
        "Dataset penuh": [],
        "Open API": [],
      },
    },
  };
};

export default CatalogueShowWrapper;
