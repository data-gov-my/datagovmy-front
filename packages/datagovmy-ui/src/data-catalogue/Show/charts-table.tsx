import { FunctionComponent, MutableRefObject, useContext, useRef } from "react";
import { Dropdown, Section } from "../../components";
import { useFilter, useTranslation } from "../../hooks";
import { clx, interpolate, numFormat } from "../../lib/helpers";
import { DocumentArrowDownIcon } from "@heroicons/react/24/solid";
import { CatalogueContext } from "../../contexts/catalogue";
import { EmbedInterface } from "../../charts/partials/embed";
import { FilterDefault } from "../../../types";

type ChartTableProps = {
  scrollRef: MutableRefObject<Record<string, HTMLElement | null>>;
  title: string;
  description: string;
  data_as_of: string;
  chartFilter: Array<FilterDefault>;
  translations: Record<string, string>;
  filterContext: any; // figure this one out later
  params: { id: string }; // figure this one out later
};

const ChartsAndTable: FunctionComponent<ChartTableProps> = ({
  scrollRef,
  title,
  description,
  data_as_of,
  chartFilter,
  translations,
  filterContext,
  params,
}) => {
  const { t, i18n } = useTranslation(["catalogue", "common"]);
  const { downloads } = useContext(CatalogueContext);
  const embedRef = useRef<EmbedInterface>(null);
  const _downloads = Object.values(downloads).flatMap(option => option);

  const { filter, setFilter } = useFilter(filterContext, { id: params.id }, true);

  return (
    <>
      {/* Chart & Table */}
      <Section
        ref={ref =>
          (scrollRef.current[i18n.language === "en-GB" ? "Table & Charts" : "Jadual & Carta"] = ref)
        }
        title={
          <h4 onDoubleClick={() => console.log("yeah")} data-testid="catalogue-title">
            {title}
          </h4>
        }
        description={
          <p className="text-dim whitespace-pre-line text-base" data-testid="catalogue-description">
            {interpolate(description.substring(description.indexOf("]") + 1))}
          </p>
        }
        className=""
        date={data_as_of}
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
        <div className={clx("flex gap-3 pb-3", chartFilter ? "justify-between" : "justify-end")}>
          <div className={clx("flex gap-2")}>
            {chartFilter?.map((item, index) => (
              <Dropdown
                key={item.key}
                width="w-full md:w-fit min-w-[120px]"
                anchor={index > 0 ? "right" : "left"}
                options={item.options.map(option => ({
                  label: translations[option] ?? option,
                  value: option,
                }))}
                selected={filter[item.key]}
                onChange={e => setFilter(item.key, e)}
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
          <div className={clx("space-y-2", dataset.type === "TABLE" ? "hidden" : "block")}>
            {renderChart()}
          </div>
        </div>

        <CatalogueEmbed
          uid={dataset.meta.unique_id}
          ref={embedRef}
          options={config.options}
          defaultOption={filter}
          translations={translations}
          selectedVizKey={selectedViz?.translation_key}
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

        {dataviz && dataviz.length > 0 && (
          <div className="hide-scrollbar relative flex h-full w-full items-stretch gap-[0.5rem] overflow-x-scroll">
            <div className="sticky left-0 top-0 flex h-full w-[200px] max-w-[200px] flex-1 flex-col justify-start gap-2 lg:sticky lg:w-[calc(100%_/_5.5)] lg:flex-initial">
              <Card
                className={clx(
                  "border-outline hover:border-outlineHover hover:bg-background dark:border-washed-dark hover:dark:border-outlineHover-dark dark:hover:bg-washed-dark/50 h-[110px] min-h-[110px] w-full max-w-[200px] p-2 transition-colors lg:min-w-[calc(100%_/_5.5)]",
                  selectedViz === undefined && "border-primary dark:border-primary-dark"
                )}
                onClick={() => {
                  setSelectedViz(undefined);
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
              {[...dataviz, ...dataviz].map(viz => {
                return (
                  <CataloguePreview
                    dataviz={viz}
                    dataset={dataset}
                    urls={urls}
                    translations={translations}
                    config={config}
                    selectedViz={selectedViz}
                    setSelectedViz={setSelectedViz}
                    scrollToChart={scrollToChart}
                  />
                );
              })}
            </div>
          </div>
        )}
      </Section>
    </>
  );
};
