import type { DownloadOptions, DownloadOption } from "@lib/types";
import type { TableConfig } from "@components/Chart/Table";
import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, ReactNode, useEffect, useMemo, useState } from "react";
import { SHORT_LANG } from "@lib/constants";
import { download, interpolate, toDate } from "@lib/helpers";
import {
  CATALOGUE_TABLE_SCHEMA,
  UniversalColumn,
  UNIVERSAL_TABLE_SCHEMA,
} from "@lib/schema/data-catalogue";
import { OptionType } from "@components/types";
import { track } from "@lib/mixpanel";
import dynamic from "next/dynamic";
import Image from "next/image";
import Card from "@components/Card";
import At from "@components/At";
import Container from "@components/Container";
import Dropdown from "@components/Dropdown";
import Search from "@components/Search";
import Section from "@components/Section";
import Tooltip from "@components/Tooltip";
import { useRouter } from "next/router";
import { useFilter } from "@hooks/useFilter";
import CatalogueCode from "./partials/code";

/**
 * Catalogue Show
 * @overview Status: Live
 */

const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const CatalogueTimeseries = dynamic(() => import("@data-catalogue/partials/timeseries"), {
  ssr: false,
});
const CatalogueChoropleth = dynamic(() => import("@data-catalogue/partials/choropleth"), {
  ssr: true,
});
const CatalogueGeojson = dynamic(() => import("@data-catalogue/partials/geojson"), {
  ssr: true,
});
const CatalogueBar = dynamic(() => import("@data-catalogue/partials/bar"), {
  ssr: true,
});
const CataloguePyramid = dynamic(() => import("@data-catalogue/partials/pyramid"), {
  ssr: true,
});
const CatalogueHeatmap = dynamic(() => import("@data-catalogue/partials/heatmap"), {
  ssr: true,
});

export type Langs = "bm" | "en";
export type CatalogueType =
  | "TIMESERIES"
  | "CHOROPLETH"
  | "TABLE"
  | "GEOJSON"
  | "BAR"
  | "HBAR"
  | "PYRAMID"
  | "HEATMAP";
interface CatalogueShowProps {
  options: OptionType[];
  params: {
    id: string;
  };
  config: any;
  dataset: {
    type: CatalogueType;
    chart: any;
    table: {
      data: Array<Record<string, any>>;
      columns: {
        x_bm: string;
        x_en: string;
        y_bm: string;
        y_en: string;
      };
    };
    meta: Record<Langs, { title: string; desc: string }> & { unique_id: string };
  };
  explanation: Record<Langs, { caveat: string; methodology: string; publication?: string }>;
  metadata: {
    url: {
      [key: string]: string;
    };
    data_as_of: string;
    data_source: Array<string>;
    next_update: string;
    definitions: Array<{
      id: number;
      unique_id?: string;
      name: string;
      desc_bm: string;
      desc_en: string;
      title_bm: string;
      title_en: string;
    }>;
    dataset_desc: Record<Langs, string>;
    last_updated: string;
  };
  urls: {
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
}) => {
  const { t, i18n } = useTranslation();

  const [show, setShow] = useState<OptionType>(options[0]);
  const [downloads, setDownloads] = useState<DownloadOptions>({
    chart: [],
    data: [],
  });

  const query = useRouter().query;
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];
  const { filter, setFilter } = useFilter(config.filter_state, { id: params.id });

  const renderChart = (): ReactNode | undefined => {
    switch (dataset.type) {
      case "TIMESERIES":
        return (
          <CatalogueTimeseries
            config={config}
            dataset={dataset}
            filter={filter}
            lang={lang}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );

      case "CHOROPLETH":
        return (
          <CatalogueChoropleth
            dataset={dataset}
            lang={lang}
            urls={urls}
            config={{
              precision: config.precision,
              color: config.color,
              geojson: config.file_json,
            }}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "GEOJSON":
        return (
          <CatalogueGeojson
            config={{
              color: config.color,
              geojson: config.file_json,
            }}
            dataset={dataset}
            lang={lang}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "BAR":
      case "HBAR":
        return (
          <CatalogueBar
            config={config}
            dataset={dataset}
            lang={lang}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "PYRAMID":
        return (
          <CataloguePyramid
            config={config}
            dataset={dataset}
            lang={lang}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "HEATMAP":
        return (
          <CatalogueHeatmap
            config={config}
            dataset={dataset}
            lang={lang}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );
      default:
        break;
    }
    return;
  };

  useEffect(() => {
    track("page_view", {
      type: "catalogue",
      id: dataset.meta.unique_id,
      name_en: dataset.meta.en.title,
      name_bm: dataset.meta.bm.title,
    });
    if (dataset.type === "TABLE") {
      setDownloads({
        chart: [],
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
      });
    }
  }, []);

  const tableConfig: TableConfig[] = [
    {
      id: "variable",
      header: t("catalogue.meta_variable_name"),
      accessorFn({ variable, data_type }) {
        return `${variable}//${data_type ? `(${data_type})` : ""}`;
      },
      cell: (value: any) => {
        const [variable, data_type] = value.getValue().split("//");
        return (
          <p className="font-mono text-sm">
            {variable} {data_type}
          </p>
        );
      },
      className: "text-left",
      enableSorting: false,
    },
    {
      id: "variable_name",
      header: t("catalogue.meta_variable"),
      accessorFn: (item: any) => JSON.stringify({ uid: item.uid, name: item.variable_name }),
      className: "text-left min-w-[140px]",
      enableSorting: false,
      cell: (value: any) => {
        const [item, index] = [JSON.parse(value.getValue()), value.row.index];
        return (
          <>
            {Boolean(item.uid) ? (
              <At href={`/data-catalogue/${item.uid}`} className="hover:underline">
                {item.name}
              </At>
            ) : (
              <p>{item.name}</p>
            )}
            {index === 0 && dataset.type !== "TABLE" && (
              <p className="font-normal text-dim">
                <i>{t("catalogue.meta_chart_above")}</i>
              </p>
            )}
          </>
        );
      },
    },
    {
      id: "definition",
      header: t("catalogue.meta_definition"),
      accessorKey: "definition",
      className: "text-left leading-relaxed",
      cell: (value: any) => {
        const definition = value.getValue();
        return (
          <>
            <p>{definition}</p>
          </>
        );
      },
      enableSorting: false,
    },
  ];

  return (
    <div>
      <Container className="mx-auto w-full pt-6 md:max-w-screen-md lg:max-w-screen-lg">
        {/* Chart & Table */}
        <Section
          title={dataset.meta[lang].title}
          className=""
          description={
            <p className="whitespace-pre-line text-base text-dim">
              {interpolate(
                dataset.meta[lang].desc.substring(dataset.meta[lang].desc.indexOf("]") + 1)
              )}
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
                placeholder={t("catalogue.download")}
                options={
                  downloads
                    ? [...downloads.chart, ...downloads.data].map(item => ({
                        label: item.title as string,
                        value: item.key,
                      }))
                    : []
                }
                onChange={async e => {
                  const action =
                    downloads &&
                    [...downloads?.chart, ...downloads?.data].find(({ key }) => e.value === key);

                  return typeof action?.href === "string"
                    ? download(action.href, dataset.meta.unique_id, () =>
                        track("file_download", {
                          uid: dataset.meta.unique_id.concat("_", action.key),
                          type: ["csv", "parquet"].includes(e.value) ? "file" : "image",
                          id: dataset.meta.unique_id,
                          name_en: dataset.meta.en.title,
                          name_bm: dataset.meta.bm.title,
                          ext: action.key,
                        })
                      )
                    : action
                    ? action.href()
                    : null;
                }}
              />
            </>
          }
        >
          {/* Dataset Filters & Chart / Table */}
          {Boolean(config?.filter_mapping) && (
            <div className="flex gap-3 pb-2">
              {config.filter_mapping?.map((item: any, index: number) => (
                <Dropdown
                  key={index}
                  anchor={index > 0 ? "right" : "left"}
                  options={item.options}
                  selected={filter[item.key]}
                  onChange={e => setFilter(item.key, e)}
                />
              ))}
            </div>
          )}
          <div className={[show.value === "chart" ? "block" : "hidden", "space-y-2"].join(" ")}>
            {renderChart()}
          </div>
          {Boolean(dataset?.table) && (
            <div
              className={[
                "mx-auto",
                show.value === "table" ? "block" : "hidden",
                dataset.type !== "TABLE" ? "max-h-[500px] overflow-auto" : "",
              ].join(" ")}
            >
              <Table
                className={[
                  "table-stripe table-default",
                  dataset.type !== "TABLE" ? "table-sticky-header" : "",
                ].join(" ")}
                responsive={dataset.type === "TABLE"}
                data={dataset.table.data}
                enableSticky={dataset.type === "TABLE"}
                search={
                  dataset.type === "TABLE"
                    ? onSearch => (
                        <Search
                          className="w-full lg:w-auto"
                          onChange={query => onSearch(query ?? "")}
                        />
                      )
                    : undefined
                }
                config={
                  dataset.type === "TABLE"
                    ? UNIVERSAL_TABLE_SCHEMA(
                        dataset.table.columns as unknown as UniversalColumn,
                        lang as "en" | "bm",
                        config.freeze
                      )
                    : CATALOGUE_TABLE_SCHEMA(
                        dataset.table.columns,
                        lang,
                        query.range ?? config.filter_state.range?.value,
                        Object.keys(dataset.chart),
                        [config.precision, config.precision]
                      )
                }
                enablePagination={dataset.type === "TABLE" ? 10 : false}
              />
            </div>
          )}
        </Section>

        <div className="space-y-8 border-b py-12">
          {/* How is this data produced? */}
          <Section
            title={t("catalogue.header_1")}
            className=""
            description={
              <p className="whitespace-pre-line leading-relaxed text-dim ">
                {interpolate(explanation[lang].methodology)}
              </p>
            }
          />

          {/* Are there any pitfalls I should bear in mind when using this data? */}
          <Section
            title={t("catalogue.header_2")}
            className=""
            description={
              <p className="whitespace-pre-line leading-relaxed text-dim">
                {interpolate(explanation[lang].caveat)}
              </p>
            }
          />

          {/* Key Publication using this Data */}
          {Boolean(explanation[lang].publication) && (
            <Section
              title={t("catalogue.header_3")}
              className=""
              description={
                <p className="whitespace-pre-line leading-relaxed text-dim">
                  {interpolate(explanation[lang].publication ?? "")}
                </p>
              }
            />
          )}
        </div>

        {/* Metadata */}
        <Section title={"Metadata"} className="mx-auto w-full border-b py-12">
          <Card type="gray">
            <div className="space-y-6">
              {/* Dataset description */}
              <div className="space-y-3">
                <h5>{t("catalogue.meta_desc")}</h5>
                <p className="leading-relaxed text-dim">
                  {interpolate(metadata.dataset_desc[lang])}
                </p>
              </div>
              <div className="space-y-3">
                {/* Variable definitions */}
                <h5>{t("catalogue.meta_def")}</h5>
                {metadata.definitions?.length > 0 && (
                  <>
                    <ul className="ml-6 list-outside list-disc text-dim md:hidden">
                      {metadata.definitions?.map(item => (
                        <li key={item[`title_${lang}`]}>
                          <span>
                            {Boolean(item.unique_id) ? (
                              <At href={`/data-catalogue/${item.unique_id}`}>
                                {item[`title_${lang}`]}
                              </At>
                            ) : (
                              item[`title_${lang}`]
                            )}{" "}
                            <Tooltip tip={interpolate(item[`desc_${lang}`])} />
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="hidden md:block">
                      <Table
                        className="table-slate table-default-slate text-dim"
                        data={metadata.definitions.map((item: any) => {
                          const raw = item[`desc_${lang}`];
                          const [type, definition] = [
                            raw.substring(1, raw.indexOf("]")),
                            raw.substring(raw.indexOf("]") + 1),
                          ];

                          return {
                            id: item.id,
                            uid: item.unique_id,
                            variable: item.name,
                            variable_name: item[`title_${lang}`],
                            data_type: type,
                            definition: interpolate(definition),
                          };
                        })}
                        config={tableConfig}
                      />
                    </div>
                  </>
                )}
              </div>
              {/* Last updated */}
              <div className="space-y-3">
                <h5>{t("common.last_updated", { date: "" })}</h5>
                <p className="whitespace-pre-line text-dim">
                  {toDate(metadata.last_updated, "dd MMM yyyy, HH:mm", i18n.language)}
                </p>
              </div>
              {/* Next update */}
              <div className="space-y-3">
                <h5>{t("common.next_update", { date: "" })}</h5>
                <p className="text-dim">
                  {toDate(metadata.next_update, "dd MMM yyyy, HH:mm", i18n.language)}
                </p>
              </div>
              {/* Data Source */}
              <div className="space-y-3">
                <h5>{t("catalogue.meta_source")}</h5>
                <ul className="ml-6 list-outside list-disc text-dim">
                  {metadata.data_source?.map(source => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </div>
              {/* URLs to dataset */}
              <div className="space-y-3">
                <h5>{t("catalogue.meta_url")}</h5>
                <ul className="ml-6 list-outside list-disc text-dim">
                  {Object.entries(metadata.url).map(([key, url]: [string, unknown]) => (
                    <li key={url as string}>
                      <a
                        href={url as string}
                        className="break-all text-primary underline hover:no-underline"
                        onClick={() =>
                          track("file_download", {
                            uid: dataset.meta.unique_id.concat("_", key),
                            id: dataset.meta.unique_id,
                            name_en: dataset.meta.en.title,
                            name_bm: dataset.meta.bm.title,
                            type: "file",
                            ext: key,
                          })
                        }
                      >
                        {url as string}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              {/* License */}
              <div className="space-y-3">
                <h5>{t("catalogue.meta_license")}</h5>
                <p className="text-dim">
                  {t("catalogue.license_text")}{" "}
                  <a
                    className="lowercase text-primary underline"
                    target="_blank"
                    rel="noopener"
                    href="https://creativecommons.org/licenses/by/4.0/"
                  >
                    {t("common.here")}.
                  </a>
                </p>
              </div>
            </div>
          </Card>
        </Section>

        {/* Download */}
        <Section title={t("catalogue.download")} className="mx-auto w-full border-b py-12 ">
          <div className="space-y-5">
            {downloads!.chart?.length > 0 && (
              <>
                <h5>{t("catalogue.chart")}</h5>
                <div className="grid grid-cols-1 gap-4.5 md:grid-cols-2">
                  {downloads?.chart.map(props => (
                    <DownloadCard
                      meta={{
                        uid: dataset.meta.unique_id.concat("_", props.key),
                        id: dataset.meta.unique_id,
                        name_en: dataset.meta.en.title,
                        name_bm: dataset.meta.bm.title,
                        ext: props.key,
                        type: ["csv", "parquet"].includes(props.key) ? "file" : "image",
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
                      meta={{
                        uid: dataset.meta.unique_id.concat("_", props.key),
                        id: dataset.meta.unique_id,
                        name_en: dataset.meta.en.title,
                        name_bm: dataset.meta.bm.title,
                        ext: props.key,
                        type: ["csv", "parquet"].includes(props.key) ? "file" : "image",
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
        <Section
          title={t("catalogue.code")}
          description={t("catalogue.code_desc")}
          className="mx-auto w-full border-b py-12"
        >
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
    name_en: string;
    name_bm: string;
    ext: string;
    type: string;
  };
}

const DownloadCard: FunctionComponent<DownloadCard> = ({
  href,
  image,
  title,
  description,
  icon,
  meta,
}) => {
  return typeof href === "string" ? (
    // .csv & .parquet
    <a href={href} download onClick={() => track("file_download", meta)}>
      <Card className="rounded-md border border-outline bg-background px-4.5 py-5">
        <div className="flex items-center gap-4.5">
          {image && (
            <Image
              height={54}
              width={54}
              src={image}
              className="object-contain"
              alt={title as string}
            />
          )}
          <div className="block flex-grow">
            <p className="font-bold">{title}</p>
            {description && <p className="text-sm text-dim">{description}</p>}
          </div>

          {icon && icon}
        </div>
      </Card>
    </a>
  ) : (
    // .png & svg
    <Card className="rounded-md border border-outline bg-background px-4.5 py-5" onClick={href}>
      <div className="flex items-center gap-4.5">
        {image && (
          <img
            src={image}
            className="aspect-video h-14 rounded border bg-white object-cover lg:h-16"
            alt={title as string}
          />
        )}
        <div className="block flex-grow">
          <p className="font-bold">{title}</p>
          {description && <p className="text-sm text-dim">{description}</p>}
        </div>

        {icon && icon}
      </div>
    </Card>
  );
};

export default CatalogueShow;
