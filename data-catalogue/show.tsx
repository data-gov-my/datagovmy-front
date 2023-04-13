import type {
  DownloadOptions,
  DownloadOption,
  DCConfig,
  DCChartKeys,
  FilterDefault,
} from "@lib/types";
import type { TableConfig } from "@components/Chart/Table";
import { DocumentArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { SHORT_PERIOD } from "@lib/constants";
import { clx, download, interpolate, numFormat, toDate } from "@lib/helpers";
import { UNIVERSAL_TABLE_SCHEMA } from "@lib/schema/data-catalogue";
import { OptionType } from "@components/types";
// import { track } from "@lib/mixpanel";
import dynamic from "next/dynamic";
import Image from "next/image";
import Card from "@components/Card";
import At from "@components/At";
import Container from "@components/Container";
import Dropdown from "@components/Dropdown";
import Search from "@components/Search";
import Section from "@components/Section";
import Tooltip from "@components/Tooltip";
import { useFilter } from "@hooks/useFilter";
import CatalogueCode from "./partials/code";
import Slider from "@components/Chart/Slider";

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
const CatalogueGeoChoropleth = dynamic(() => import("@data-catalogue/partials/geochoropleth"), {
  ssr: true,
});
const CatalogueScatter = dynamic(() => import("@data-catalogue/partials/scatter"), {
  ssr: true,
});
const CatalogueMapPlot = dynamic(() => import("@data-catalogue/partials/mapplot"), {
  ssr: false,
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

interface CatalogueShowProps {
  options: OptionType[];
  params: {
    id: string;
  };
  config: DCConfig;
  dataset: {
    type: DCChartKeys;
    chart: any;
    table: {
      data: Array<Record<string, any>>;
      columns: Record<string, string>;
    };
    meta: { title: string; desc: string; unique_id: string };
  };
  explanation: { caveat: string; methodology: string; publication?: string };
  metadata: {
    data_as_of: string;
    url: {
      csv?: string;
      parquet?: string;
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
  const [downloads, setDownloads] = useState<DownloadOptions>({ chart: [], data: [] });
  const { filter, setFilter } = useFilter(config.context, { id: params.id });

  const renderChart = (): ReactNode | undefined => {
    switch (dataset.type) {
      case "TIMESERIES":
        return (
          <CatalogueTimeseries
            config={config}
            dataset={dataset}
            filter={filter}
            urls={urls}
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
        return (
          <CatalogueBar
            config={config}
            dataset={dataset}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "PYRAMID":
        return (
          <CataloguePyramid
            config={config}
            dataset={dataset}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "HEATTABLE":
        return (
          <CatalogueHeatmap
            config={config}
            dataset={dataset}
            urls={urls}
            onDownload={prop => setDownloads(prop)}
          />
        );
      case "SCATTER":
        return (
          <CatalogueScatter
            config={config}
            dataset={dataset}
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
    // track("page_view", {
    //   type: "catalogue",
    //   id: dataset.meta.unique_id,
    //   name_en: dataset.meta.en.title,
    //   name_bm: dataset.meta.bm.title,
    // });
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
              <At href={`/data-catalogue/${item.uid}`} className="hover:underline dark:text-white">
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

  const generateTableSchema = () => {
    switch (dataset.type) {
      case "TIMESERIES":
        return UNIVERSAL_TABLE_SCHEMA(dataset.table.columns, config.freeze, (item, key) => {
          if (key === "x") return toDate(item[key], config.context.range, i18n.language);
          else if (typeof item[key] === "string") return item[key];
          else if (typeof item[key] === "number") return numFormat(item[key], "standard");
        });
      case "GEOJSON":
        return UNIVERSAL_TABLE_SCHEMA(
          dataset.table.columns,
          config.freeze,
          (item, key) => item[key]
        );
      default:
        return UNIVERSAL_TABLE_SCHEMA(dataset.table.columns, config.freeze);
    }
  };

  return (
    <div>
      <Container className="mx-auto w-full pt-6 md:max-w-screen-md lg:max-w-screen-lg">
        {/* Chart & Table */}
        <Section
          title={dataset.meta.title}
          className=""
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
                placeholder={t("catalogue.download")}
                options={
                  downloads
                    ? downloads.chart.concat(downloads.data).map(item => ({
                        label: item.title as string,
                        value: item.key,
                      }))
                    : []
                }
                onChange={async e => {
                  const action = downloads.chart
                    .concat(downloads.data)
                    .find(({ key }) => e.value === key);

                  if (!action) return;

                  if (typeof action?.href === "string") {
                    download(action.href, dataset.meta.unique_id);
                    // track("file_download", {
                    //   uid: dataset.meta.unique_id.concat("_", action.key),
                    //   type: ["csv", "parquet"].includes(e.value) ? "file" : "image",
                    //   id: dataset.meta.unique_id,
                    //   name_en: dataset.meta.en.title,
                    //   name_bm: dataset.meta.bm.title,
                    //   ext: action.key,
                    // });
                    return;
                  }

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
                  options={item.options}
                  selected={filter[item.key]}
                  onChange={e => setFilter(item.key, e)}
                />
              ))}
            </div>
          )}
          <div className={clx(show.value === "chart" ? "block" : "hidden", "space-y-2")}>
            {renderChart()}
          </div>

          <div className={clx("mx-auto", show.value === "table" ? "block" : "hidden")}>
            <Table
              className={clx("table-stripe", dataset.type !== "TABLE" && "table-sticky-header")}
              responsive={true}
              data={dataset.table.data}
              freeze={config.freeze}
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
              config={generateTableSchema()}
              enablePagination={["TABLE", "GEOPOINT"].includes(dataset.type) ? 20 : false}
            />
          </div>

          {config.dates !== null && (
            <Slider
              className="pt-8"
              type="single"
              value={config.dates?.options.indexOf(
                filter[config.dates.key].value ?? config.dates.default
              )}
              data={config.dates.options}
              period={SHORT_PERIOD[config.dates.interval]}
              onChange={e =>
                config.dates !== null && setFilter(config.dates.key, config.dates.options[e])
              }
            ></Slider>
          )}
        </Section>

        <div className="space-y-8 border-b py-12 dark:border-b-outlineHover-dark">
          {/* How is this data produced? */}
          <Section
            title={t("catalogue.header_1")}
            className=""
            description={
              <p className="whitespace-pre-line leading-relaxed text-dim ">
                {interpolate(explanation.methodology)}
              </p>
            }
          />

          {/* Are there any pitfalls I should bear in mind when using this data? */}
          <Section
            title={t("catalogue.header_2")}
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
              title={t("catalogue.header_3")}
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
          <Card type="gray">
            <div className="space-y-6">
              {/* Dataset description */}
              <div className="space-y-3">
                <h5>{t("catalogue.meta_desc")}</h5>
                <p className="leading-relaxed text-dim">{interpolate(metadata.description)}</p>
              </div>
              <div className="space-y-3">
                {/* Variable definitions */}
                <h5>{t("catalogue.meta_def")}</h5>
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
                        className="table-slate table-default-slate table"
                        data={metadata.definitions
                          .filter(item => item.id === 0)
                          .map((item: any) => {
                            const raw = item.desc;
                            const [type, definition] = [
                              raw.substring(1, raw.indexOf("]")),
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
                  {metadata.source?.map(source => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </div>
              {/* URLs to dataset */}
              <div className="space-y-3">
                <h5>{t("catalogue.meta_url")}</h5>
                <ul className="ml-6 list-outside list-disc text-dim">
                  {Object.entries(metadata.url).map(([_, url]: [string, unknown]) =>
                    url ? (
                      <li key={url as string}>
                        <a
                          href={url as string}
                          className="break-all text-primary hover:underline dark:text-primary-dark"
                          onClick={
                            () => {}
                            //   track("file_download", {
                            //     uid: dataset.meta.unique_id.concat("_", key),
                            //     id: dataset.meta.unique_id,
                            //     name_en: dataset.meta.en.title,
                            //     name_bm: dataset.meta.bm.title,
                            //     type: "file",
                            //     ext: key,
                            //   })
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
                <h5>{t("catalogue.meta_license")}</h5>
                <p className="text-dim">
                  {t("catalogue.license_text")}{" "}
                  <a
                    className="lowercase text-primary hover:underline dark:text-primary-dark"
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
        <Section
          title={t("catalogue.download")}
          className="mx-auto border-b py-12 dark:border-b-outlineHover-dark "
        >
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
                        name: dataset.meta.title,
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
                        name: dataset.meta.title,
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
          className="mx-auto w-full py-12"
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
    name: string;
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
    // //track("file_download", meta)}>
    <a href={href} download onClick={() => {}}>
      <Card type="gray">
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
    <Card type="gray" onClick={href}>
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
