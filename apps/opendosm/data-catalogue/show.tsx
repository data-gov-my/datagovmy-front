import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import {
  DCChartKeys,
  DCConfig,
  DownloadOption,
  DownloadOptions,
  FilterDefault,
} from "datagovmy-ui/types";
import {
  At,
  Card,
  Slider,
  Container,
  Dropdown,
  Search,
  Section,
  Tooltip,
} from "datagovmy-ui/components";
import CatalogueCode from "datagovmy-ui/dc-charts/code";
import { EmbedInterface } from "datagovmy-ui/charts/partials/embed";
import { SHORT_PERIOD, SHORT_PERIOD_FORMAT } from "datagovmy-ui/constants";
import { clx, download, interpolate, numFormat, toDate } from "datagovmy-ui/helpers";
import { useTranslation, useFilter, useAnalytics } from "datagovmy-ui/hooks";
import { METADATA_TABLE_SCHEMA, UNIVERSAL_TABLE_SCHEMA } from "datagovmy-ui/schema/data-catalogue";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FunctionComponent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

/**
 * Catalogue Show
 * @overview Status: Live
 */

const Table = dynamic(() => import("datagovmy-ui/charts/table"), { ssr: false });
const CatalogueTimeseries = dynamic(() => import("datagovmy-ui/dc-charts/timeseries"), {
  ssr: false,
});
const CatalogueChoropleth = dynamic(() => import("datagovmy-ui/dc-charts/choropleth"), {
  ssr: true,
});
const CatalogueGeoChoropleth = dynamic(() => import("datagovmy-ui/dc-charts/geochoropleth"), {
  ssr: true,
});
const CatalogueScatter = dynamic(() => import("datagovmy-ui/dc-charts/scatter"), {
  ssr: true,
});
const CatalogueMapPlot = dynamic(() => import("datagovmy-ui/dc-charts/mapplot"), {
  ssr: false,
});
const CatalogueGeojson = dynamic(() => import("datagovmy-ui/dc-charts/geojson"), {
  ssr: true,
});
const CatalogueBar = dynamic(() => import("datagovmy-ui/dc-charts/bar"), {
  ssr: true,
});
const CataloguePyramid = dynamic(() => import("datagovmy-ui/dc-charts/pyramid"), {
  ssr: true,
});
const CatalogueHeatmap = dynamic(() => import("datagovmy-ui/dc-charts/heatmap"), {
  ssr: true,
});
const CatalogueLine = dynamic(() => import("datagovmy-ui/dc-charts/line"), {
  ssr: true,
});

interface CatalogueShowProps {
  options: OptionType[];
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
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const [show, setShow] = useState<OptionType>(options[0]);
  const [downloads, setDownloads] = useState<DownloadOptions>({ chart: [], data: [] });
  const embedRef = useRef<EmbedInterface>(null);
  const { filter, setFilter } = useFilter(config.context, { id: params.id });
  const { result, track } = useAnalytics(dataset);
  const availableDownloads = useMemo<DownloadOption[]>(
    () => Object.values(downloads).flatMap(option => option),
    [downloads]
  );

  const renderChart = (): ReactNode | undefined => {
    switch (dataset.type) {
      case "TIMESERIES":
      case "STACKED_AREA":
        return (
          <CatalogueTimeseries
            config={config}
            dataset={dataset}
            filter={filter}
            urls={urls}
            translations={translations}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "CHOROPLETH":
        return (
          <CatalogueChoropleth
            dataset={dataset}
            urls={urls}
            config={config}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "GEOCHOROPLETH":
        return (
          <CatalogueGeoChoropleth
            dataset={dataset}
            urls={urls}
            config={config}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "GEOPOINT":
        return (
          <CatalogueMapPlot dataset={dataset} urls={urls} onDownload={prop => setDownloads(prop)} />
        );
      case "GEOJSON":
        return (
          <CatalogueGeojson
            config={config}
            dataset={dataset}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "BAR":
      case "HBAR":
      case "STACKED_BAR":
        return (
          <CatalogueBar
            config={config}
            dataset={dataset}
            urls={urls}
            translations={translations}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "PYRAMID":
        return (
          <CataloguePyramid
            config={config}
            dataset={dataset}
            urls={urls}
            translations={translations}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "HEATTABLE":
        return (
          <CatalogueHeatmap
            config={config}
            dataset={dataset}
            urls={urls}
            translations={translations}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "SCATTER":
        return (
          <CatalogueScatter
            className="mx-auto aspect-square w-full lg:h-[512px] lg:w-1/2"
            dataset={dataset}
            urls={urls}
            translations={translations}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "LINE":
        return (
          <CatalogueLine
            config={config}
            dataset={dataset}
            urls={urls}
            translations={translations}
            onDownload={prop => setDownloads(prop)}
          />
        );
      default:
        break;
    }
    return;
  };

  useEffect(() => {
    if (dataset.type === "TABLE") {
      setDownloads({
        chart: [],
        data: [
          {
            id: "csv",
            image: "/static/images/icons/csv.png",
            title: t("csv.title"),
            description: t("csv.desc"),
            icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
            href() {
              download(urls.csv, dataset.meta.unique_id.concat(".csv"));
              track("csv");
            },
          },
          {
            id: "parquet",
            image: "/static/images/icons/parquet.png",
            title: t("parquet.title"),
            description: t("parquet.desc"),
            icon: <DocumentArrowDownIcon className="h-6 min-w-[24px] text-dim" />,
            href() {
              download(urls.parquet, dataset.meta.unique_id.concat(".parquet"));
              track("parquet");
            },
          },
        ],
      });
    }
  }, []);

  const generateTableSchema = () => {
    const columns = Object.keys(dataset.table[0]);
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
          else if (typeof item[key] === "string") return item[key];
          else if (typeof item[key] === "number") return numFormat(item[key], "standard");
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
      <Container className="mx-auto w-full md:max-w-screen-md lg:max-w-screen-lg">
        {/* Chart & Table */}
        <Section
          title={dataset.meta.title}
          className="py-6"
          description={
            <p className="whitespace-pre-line text-base text-dim">
              {interpolate(dataset.meta.desc.substring(dataset.meta.desc.indexOf("]") + 1))}
            </p>
          }
          date={metadata.data_as_of}
          menu={
            <>
              <Dropdown
                className="flex-row items-center"
                sublabel={<EyeIcon className="h-4 w-4" />}
                selected={show}
                options={options}
                onChange={e => setShow(e)}
              />
              <Dropdown
                className="flex-row items-center"
                anchor="right"
                sublabel={<DocumentArrowDownIcon className="text h-4 w-4" />}
                placeholder={t("download")}
                options={
                  downloads
                    ? downloads.chart.concat(downloads.data).map(item => ({
                        label: item.title as string,
                        value: item.id,
                      }))
                    : []
                }
                onChange={e => {
                  // embed
                  if (e.value === "embed") {
                    embedRef.current?.open();
                    return;
                  }
                  // downloads
                  const action = availableDownloads.find(({ id }) => e.value === id);
                  if (!action) return;
                  return action.href();
                }}
              />
            </>
          }
        >
          {/* Dataset Filters & Chart / Table */}
          {config.options !== null && config.options.length > 0 && (
            <div className="flex gap-3 pb-2">
              {config.options.map((item: FilterDefault, index: number) => (
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
          )}
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
              />
            </div>
          )}

          {/* Date Slider (optional) */}
          {config.dates !== null && (
            <Slider
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
        </Section>

        <div className="space-y-8 border-b py-12 dark:border-b-outlineHover-dark">
          {/* How is this data produced? */}
          <Section
            title={t("header_1")}
            className=""
            description={
              <p className="whitespace-pre-line leading-relaxed text-dim ">
                {interpolate(explanation.methodology)}
              </p>
            }
          />

          {/* Are there any pitfalls I should bear in mind when using this data? */}
          <Section
            title={t("header_2")}
            className=""
            description={
              <p className="whitespace-pre-line leading-relaxed text-dim">
                {interpolate(explanation.caveat)}
              </p>
            }
          />

          {/* Publication using this Data */}
          {Boolean(explanation.publication) && (
            <Section
              title={t("header_3")}
              className=""
              description={
                <p className="whitespace-pre-line leading-relaxed text-dim">
                  {interpolate(explanation.publication ?? "")}
                </p>
              }
            />
          )}
        </div>

        {/* Metadata */}
        <Section
          title={"Metadata"}
          className="mx-auto border-b py-12 dark:border-b-outlineHover-dark"
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
                          <span>
                            {Boolean(item.unique_id) ? (
                              <At href={`/data-catalogue/${item.unique_id}`}>{item.title}</At>
                            ) : (
                              item.title
                            )}{" "}
                            <Tooltip tip={interpolate(item.desc)} />
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="hidden md:block">
                      <Table
                        className="table-slate table-default-slate"
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
                <p className="whitespace-pre-line text-dim">
                  {toDate(metadata.last_updated, "dd MMM yyyy, HH:mm", i18n.language)}
                </p>
              </div>
              {/* Next update */}
              <div className="space-y-3">
                <h5>{t("common:common.next_update", { date: "" })}</h5>
                <p className="text-dim">
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
                    className="lowercase text-primary hover:underline dark:text-primary-dark"
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
            {downloads!.chart?.length > 0 && (
              <>
                <h5>{t("chart")}</h5>
                <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
                  {downloads?.chart.map(props => (
                    <DownloadCard
                      key={dataset.meta.unique_id}
                      meta={{
                        uid: dataset.meta.unique_id.concat("_", props.id),
                        id: dataset.meta.unique_id,
                        name: dataset.meta.title,
                        ext: props.id,
                        type: ["csv", "parquet"].includes(props.id) ? "file" : "image",
                      }}
                      {...props}
                    />
                  ))}
                </div>
              </>
            )}
            {downloads!.data?.length > 0 && (
              <>
                <h5>Data</h5>
                <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
                  {downloads?.data.map(props => (
                    <DownloadCard
                      key={dataset.meta.unique_id}
                      meta={{
                        uid: dataset.meta.unique_id.concat("_", props.id),
                        id: dataset.meta.unique_id,
                        name: dataset.meta.title,
                        ext: props.id,
                        type: ["csv", "parquet"].includes(props.id) ? "file" : "image",
                      }}
                      {...props}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </Section>

        {/* Code */}
        <Section title={t("code")} description={t("code_desc")} className="mx-auto w-full py-12">
          <CatalogueCode type={dataset.type} url={urls?.parquet || urls[Object.keys(urls)[0]]} />
        </Section>
      </Container>
    </div>
  );
};
interface DownloadCard extends DownloadOption {
  meta: {
    uid: string;
    id: string;
    name: string;
    ext: string;
    type: string;
  };
}

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
