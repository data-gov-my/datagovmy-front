import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/solid";
import CatalogueCode from "datagovmy-ui/charts/partials/code";
import { SampleCode } from "datagovmy-ui/charts/partials/code";
import CatalogueEmbed, { EmbedInterface } from "datagovmy-ui/charts/partials/embed";
import {
  At,
  Card,
  Container,
  Dropdown,
  Markdown,
  Search,
  Section,
  Slider,
  Tooltip,
} from "datagovmy-ui/components";
import { SHORT_PERIOD, SHORT_PERIOD_FORMAT } from "datagovmy-ui/constants";
import { CatalogueContext } from "datagovmy-ui/contexts/catalogue";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import { clx, interpolate, numFormat, toDate } from "datagovmy-ui/helpers";
import { useAnalytics, useFilter, useTranslation } from "datagovmy-ui/hooks";
import { METADATA_TABLE_SCHEMA, UNIVERSAL_TABLE_SCHEMA } from "datagovmy-ui/schema/data-catalogue";
import {
  DCChartKeys,
  DCConfig,
  DownloadOption,
  FilterDefault,
  OptionType,
} from "datagovmy-ui/types";
import sum from "lodash/sum";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FunctionComponent, ReactNode, useContext, useRef, useState } from "react";

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

interface CatalogueShowProps {
  options: string[];
  params: {
    id: string;
  };
  config: DCConfig;
  dataset: {
    type: DCChartKeys;
    chart: any;
    table: Record<string, any>[];
    meta: { title: string; desc: string; unique_id: string };
  };
  explanation: { caveat: string; methodology: string; publication?: string };
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
  catalogueId?: string;
}

const CatalogueShow: FunctionComponent<CatalogueShowProps> = ({
  options,
  params,
  config,
  dataset,
  explanation,
  metadata,
  urls,
  translations,
  catalogueId,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const availableOptions: OptionType[] = options.map(value => ({
    label: t(value),
    value: value,
  }));
  const [show, setShow] = useState<OptionType>(availableOptions[0]);
  const { downloads } = useContext(CatalogueContext);
  const _downloads = Object.values(downloads).flatMap(option => option);
  const embedRef = useRef<EmbedInterface>(null);
  const { filter, setFilter } = useFilter(config.context, { id: params.id }, true);
  const { result, track } = useAnalytics(dataset);

  const renderChart = (): ReactNode | undefined => {
    switch (dataset.type) {
      case "TIMESERIES":
      case "STACKED_AREA":
      case "INTRADAY":
        return (
          <CatalogueTimeseries
            translations={translations}
            config={{
              precision: config.precision,
              range: filter?.range?.value || "INTRADAY",
            }}
          />
        );
      case "BAR":
      case "HBAR":
      case "STACKED_BAR":
        return (
          <WindowProvider>
            <CatalogueBar config={config} translations={translations} />
          </WindowProvider>
        );
      case "CHOROPLETH":
        return <CatalogueChoropleth config={config} />;
      case "GEOCHOROPLETH":
        return <CatalogueGeoChoropleth config={config} />;
      case "GEOPOINT":
        return <CatalogueMapPlot />;
      case "GEOJSON":
        return <CatalogueGeojson config={config} />;
      case "PYRAMID":
        return <CataloguePyramid config={config} translations={translations} />;
      case "HEATTABLE":
        return <CatalogueHeatmap config={config} translations={translations} />;
      case "SCATTER":
        return (
          <CatalogueScatter
            className="mx-auto aspect-square w-full lg:h-[512px] lg:w-1/2"
            translations={translations}
          />
        );
      case "LINE":
        return <CatalogueLine config={config} translations={translations} />;
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
        return UNIVERSAL_TABLE_SCHEMA(columns, translations, config.freeze, (item, key) => {
          if (key === "x")
            return toDate(
              item[key],
              SHORT_PERIOD_FORMAT[filter.range.value as keyof typeof SHORT_PERIOD_FORMAT],
              i18n.language
            );
          else return item[key];
        });
      case "GEOPOINT":
      case "TABLE":
        return UNIVERSAL_TABLE_SCHEMA(
          columns,
          translations,
          config.freeze,
          (item, key) => item[key]
        );
      default:
        return UNIVERSAL_TABLE_SCHEMA(columns, translations, config.freeze);
    }
  };

  return (
    <div>
      <Container className="mx-auto w-full pt-6 md:max-w-screen-md lg:max-w-screen-lg">
        {/* Chart & Table */}
        <Section
          title={<h4 data-testid="catalogue-title">{dataset.meta.title}</h4>}
          description={
            <p
              className="whitespace-pre-line text-base text-dim"
              data-testid="catalogue-description"
            >
              {interpolate(dataset.meta.desc.substring(dataset.meta.desc.indexOf("]") + 1))}
            </p>
          }
          className=""
          date={metadata.data_as_of}
          menu={
            <>
              <Dropdown
                width="w-fit"
                sublabel={<EyeIcon className="h-4 w-4" />}
                selected={availableOptions.find(e => e.value === show.value)}
                options={availableOptions}
                onChange={e => setShow(e)}
              />
              <Dropdown
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
              config.options !== null ? "justify-between" : "justify-end"
            )}
          >
            <div className={clx("flex gap-2")}>
              {config?.options?.map((item: FilterDefault, index: number) => (
                <Dropdown
                  key={item.key}
                  width="w-fit"
                  anchor={index > 0 ? "right" : "left"}
                  options={item.options.map(option => ({
                    label: translations[option] ?? option,
                    value: option,
                  }))}
                  selected={filter[item.key]}
                  onChange={e => setFilter(item.key, e)}
                />
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className={clx(show.value === "chart" ? "block" : "hidden", "space-y-2")}>
            {renderChart()}
          </div>

          {/* Table */}
          {dataset.table && (
            <div
              className={clx(
                dataset.type !== "TABLE" && "mx-auto max-h-[500px] overflow-auto",
                show.value === "table" ? "block" : "hidden"
              )}
            >
              <Table
                className={clx("table-stripe table-default table-sticky-header")}
                responsive={dataset.type === "TABLE"}
                data={dataset.table}
                freeze={config.freeze}
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
          )}

          {/* Date Slider (optional) */}
          {config.dates !== null && (
            <Slider
              type="single"
              value={config.dates?.options.indexOf(
                config.context[config.dates.key]?.value || config.dates.default
              )}
              data={config.dates.options}
              period={SHORT_PERIOD[config.dates.interval]}
              onChange={e =>
                config.dates !== null && setFilter(config.dates.key, config.dates.options[e])
              }
            />
          )}

          <CatalogueEmbed
            uid={dataset.meta.unique_id}
            ref={embedRef}
            options={config.options}
            defaultOption={filter}
            translations={translations}
          />

          {/* Views / download count*/}
          <p className="flex justify-end gap-2 py-6 text-sm text-dim">
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
        </Section>

        <div className="space-y-8 border-b py-8 dark:border-b-outlineHover-dark lg:py-12">
          {/* How is this data produced? */}
          <Section
            title={t("header_1")}
            className=""
            description={
              <Markdown className="markdown" data-testid="catalogue-methodology">
                {explanation.methodology}
              </Markdown>
            }
          />

          {/* What caveats I should bear in mind when using this data? */}
          <Section
            title={t("header_2")}
            className=""
            description={
              <Markdown className="markdown" data-testid="catalogue-methodology">
                {explanation.caveat}
              </Markdown>
            }
          />

          {/* Publication(s) using this data */}
          {Boolean(explanation.publication) && (
            <Section
              title={t("header_3")}
              className=""
              description={
                <Markdown className="markdown" data-testid="catalogue-publication">
                  {explanation.publication!}
                </Markdown>
              }
            />
          )}
        </div>

        {/* Metadata */}
        <Section
          title={"Metadata"}
          className="mx-auto border-b py-8 dark:border-b-outlineHover-dark lg:py-12"
        >
          <Card className="bg-background p-6 dark:border-outlineHover-dark dark:bg-washed-dark">
            <div className="space-y-6">
              {/* Dataset description */}
              <div className="space-y-3">
                <h5>{t("meta_desc")}</h5>
                <p className="leading-relaxed text-dim">{interpolate(metadata.description)}</p>
              </div>
              <div className="space-y-3">
                {/* Variable definitions */}
                <h5>{t("meta_def")}</h5>
                {metadata.definitions?.length > 0 && (
                  <>
                    <ul className="ml-6 list-outside list-disc text-dim md:hidden">
                      {metadata.definitions?.map(item => (
                        <li key={item.title}>
                          <span className="flex gap-x-1">
                            {Boolean(item.unique_id) ? (
                              <At href={`/data-catalogue/${item.unique_id}`}>{item.title}</At>
                            ) : (
                              item.title
                            )}
                            <Tooltip tip={interpolate(item.desc)} />
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="hidden md:block">
                      <Table
                        className="table-slate table-default-slate md:w-full"
                        data={metadata.definitions.map((item: any) => {
                          const raw = item.desc;
                          const [type, definition] = [
                            raw.substring(raw.indexOf("[") + 1, raw.indexOf("]")),
                            raw.substring(raw.indexOf("]") + 1),
                          ];

                          return {
                            id: item.id,
                            uid: item.unique_id,
                            variable: item.name,
                            variable_name: item.title,
                            data_type: type,
                            definition: interpolate(definition),
                          };
                        })}
                        config={METADATA_TABLE_SCHEMA(t, dataset.type === "TABLE")}
                      />
                    </div>
                  </>
                )}
              </div>
              {/* Last updated */}
              <div className="space-y-3">
                <h5>{t("common:common.last_updated", { date: "" })}</h5>
                <p className="whitespace-pre-line text-dim" data-testid="catalogue-last-updated">
                  {toDate(metadata.last_updated, "dd MMM yyyy, HH:mm", i18n.language)}
                </p>
              </div>
              {/* Next update */}
              <div className="space-y-3">
                <h5>{t("common:common.next_update", { date: "" })}</h5>
                <p className="text-dim" data-testid="catalogue-next-update">
                  {toDate(metadata.next_update, "dd MMM yyyy, HH:mm", i18n.language)}
                </p>
              </div>
              {/* Data Source */}
              <div className="space-y-3">
                <h5>{t("meta_source")}</h5>
                <ul className="ml-6 list-outside list-disc text-dim">
                  {metadata.source?.map(source => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </div>
              {/* URLs to dataset */}
              <div className="space-y-3">
                <h5>{t("meta_url")}</h5>
                <ul className="ml-6 list-outside list-disc text-dim">
                  {Object.entries(metadata.url).map(([key, url]: [string, unknown]) =>
                    url ? (
                      <li key={url as string}>
                        <a
                          href={url as string}
                          className="break-all text-primary [text-underline-position:from-font] hover:underline dark:text-primary-dark"
                          onClick={() =>
                            track(key === "link_geojson" ? "csv" : (key as "parquet" | "csv"))
                          }
                        >
                          {url as string}
                        </a>
                      </li>
                    ) : undefined
                  )}
                </ul>
              </div>
              {/* License */}
              <div className="space-y-3">
                <h5>{t("meta_license")}</h5>
                <p className="text-dim">
                  {t("license_text")}{" "}
                  <a
                    className="lowercase text-primary [text-underline-position:from-font] hover:underline dark:text-primary-dark"
                    target="_blank"
                    rel="noopener"
                    href="https://creativecommons.org/licenses/by/4.0/"
                  >
                    {t("common:common.here")}.
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </Section>

        {/* Download */}
        <Section
          title={t("download")}
          className="mx-auto border-b py-12 dark:border-b-outlineHover-dark "
        >
          <div className="space-y-5">
            {downloads?.chart.length > 0 && (
              <>
                <h5>{t("chart")}</h5>
                <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
                  {downloads?.chart.map(props => (
                    <DownloadCard
                      key={`${dataset.meta.unique_id}_${props.id}`}
                      views={result ? result[`download_${props.id as "png" | "svg"}`] : undefined}
                      {...props}
                    />
                  ))}
                </div>
              </>
            )}
            {downloads?.data.length > 0 && (
              <>
                <h5>Data</h5>
                <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
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
        <Section title={t("code")} description={t("code_desc")} className="mx-auto w-full py-12">
          <CatalogueCode type={dataset.type} url={urls?.parquet || urls[Object.keys(urls)[0]]} />
        </Section>

        {/* API Request Code */}
        {config.exclude_openapi ? (
          <Section
            title={t("sample_query.section_title")}
            description={t("sample_query.unavailable")}
          />
        ) : (
          <Section
            title={t("sample_query.section_title")}
            description={
              <>
                {t("sample_query.desc1")}
                <At
                  className="link-dim text-base underline"
                  href={`https://developer.data.gov.my${
                    i18n.language === "en-GB" ? "" : "/ms"
                  }/static-api/opendosm`}
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
              catalogueId={catalogueId}
              url={urls?.parquet || urls[Object.keys(urls)[0]]}
              route="opendosm"
            />
          </Section>
        )}
      </Container>
    </div>
  );
};
interface DownloadCard extends DownloadOption {
  views?: number;
}

const DownloadCard: FunctionComponent<DownloadCard> = ({
  href,
  image,
  title,
  description,
  icon,
  id,
  views,
}) => {
  return (
    <Card
      onClick={href}
      className="bg-background p-4.5 dark:border-outlineHover-dark dark:bg-washed-dark"
    >
      <div className="flex items-center gap-4.5">
        {["svg", "png"].includes(id) ? (
          <Image
            src={image || ""}
            className="aspect-video h-14 rounded border bg-white object-cover lg:h-16"
            width={128}
            height={64}
            alt={title as string}
          />
        ) : (
          <Image
            height={64}
            width={64}
            src={image || ""}
            className="object-contain"
            alt={title as string}
          />
        )}
        <div className="block flex-grow">
          <p className="font-bold">{title}</p>
          {description && <p className="text-sm text-dim">{description}</p>}
        </div>

        <div className="space-y-1">
          {icon}
          <p className="text-center text-xs text-dim">{numFormat(views ?? 0, "compact")}</p>
        </div>
      </div>
    </Card>
  );
};

export default CatalogueShow;
