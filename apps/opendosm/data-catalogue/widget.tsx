import { EyeIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";
import { SHORT_LANG } from "@lib/constants";
import { CATALOGUE_TABLE_SCHEMA, UNIVERSAL_TABLE_SCHEMA } from "@lib/schema/data-catalogue";
import { OptionType } from "@components/types";
import { track } from "@lib/mixpanel";
import dynamic from "next/dynamic";
import Dropdown from "@components/Dropdown";
import Search from "@components/Search";
import Section from "@components/Section";
import { useRouter } from "next/router";

/**
 * Widget for external sites / publications. To embed data catalogue charts.
 * @overview Status: On-hold
 */

const Table = dynamic(() => import("@components/Chart/Table"), { ssr: false });
const CatalogueTimeseries = dynamic(() => import("@data-catalogue/partials/timeseries"), {
  ssr: false,
});
const CatalogueChoropleth = dynamic(() => import("@data-catalogue/partials/choropleth"), {
  ssr: true,
});

interface CatalogueWidgetProps {
  params: {
    id: string;
  };
  config: any;
  dataset: any;
  explanation: any;
  metadata: any;
  urls: {
    csv: string;
    parquet: string;
  };
}

const CatalogueWidget: FunctionComponent<CatalogueWidgetProps> = ({
  config,
  dataset,
  metadata,
  urls,
}) => {
  const { t, i18n } = useTranslation();
  const showChart =
    dataset.type === "TABLE"
      ? [{ label: t("catalogue.table"), value: "table" }]
      : [
          { label: t("catalogue.chart"), value: "chart" },
          { label: t("catalogue.table"), value: "table" },
        ];

  const [show, setShow] = useState<OptionType>(showChart[0]);

  const query = useRouter().query;
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];

  const renderChart = (): ReactNode | undefined => {
    switch (dataset.type) {
      case "TIMESERIES":
        return (
          <CatalogueTimeseries
            className="h-[50vh] w-full"
            dataset={dataset}
            lang={lang}
            urls={urls}
            filter={undefined}
            config={config}
          />
        );

      case "CHOROPLETH":
        return (
          <CatalogueChoropleth
            dataset={dataset}
            lang={lang}
            urls={urls}
            config={{
              precision: config.color,
              color: config.color,
              geojson: config.file_json,
            }}
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
  }, []);

  return (
    <div id="catalogue-widget" className="h-[100vh] w-full">
      {/* Chart & Table */}
      <Section
        title={dataset.meta[lang].title}
        className=""
        description={dataset.meta[lang].desc.replace(/^(.*?)]/, "")}
        date={metadata.data_as_of}
        menu={
          <>
            <Dropdown
              sublabel={<EyeIcon className="h-4 w-4" />}
              selected={show}
              options={showChart}
              onChange={e => setShow(e)}
            />
          </>
        }
      >
        {/* Dataset Filters & Chart / Table */}
        <div
          className={[show.value === "chart" ? "block h-full" : "hidden", "space-y-2"].join(" ")}
        >
          {renderChart()}
        </div>
        <div
          className={[
            "mx-auto",
            ...[show.value === "table" ? "block overflow-auto" : "hidden"],
          ].join(" ")}
        >
          <Table
            className="table-stripe table-default"
            data={[...dataset.table.data].reverse()}
            enableSticky
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
                ? UNIVERSAL_TABLE_SCHEMA(dataset.table.columns, lang as "en" | "bm", config.freeze)
                : CATALOGUE_TABLE_SCHEMA(
                    dataset.table.columns,
                    lang,
                    query.range ?? config.filter_state.range,
                    Object.keys(dataset.chart),
                    [config.precision, config.precision]
                  )
            }
            enablePagination={8}
          />
        </div>
      </Section>
    </div>
  );
};

export default CatalogueWidget;
