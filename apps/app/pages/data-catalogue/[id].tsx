import DataCatalogueShow, { IDataViz } from "@data-catalogue/show";
import { CatalogueProvider } from "datagovmy-ui/contexts/catalogue";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { SHORT_LANG } from "datagovmy-ui/constants";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { DCConfig, DCFilter, FilterDate, Page } from "datagovmy-ui/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useMemo, useState } from "react";
import { recurDataMapping } from "datagovmy-ui/helpers";
import { useRouter } from "next/router";

const CatalogueShow: Page = ({
  meta,
  params,
  config,
  dataset,
  explanation,
  metadata,
  urls,
  translations,
  catalogueId,
  dataviz,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [selectedViz, setSelectedViz] = useState<IDataViz | undefined>();
  const router = useRouter();

  const availableOptions = useMemo<string[]>(() => {
    switch (dataset.type) {
      case "TABLE":
        return ["table"];

      case "GEOJSON":
      case "HEATTABLE":
        return ["chart"];

      default:
        return ["chart", "table"];
    }
  }, [dataset.type]);

  const extractChartDataset = (table_data: Record<string, any>[], currentViz: IDataViz) => {
    const set = Object.entries(currentViz?.chart_variables.format).map(([key, value]) =>
      recurDataMapping(key, value, table_data)
    );
    return {
      ...Object.fromEntries(set.map(array => [array[0][0], array[0][1]])),
    };
  };

  const selectedDataset = useMemo(() => {
    if (!selectedViz) {
      // TODO: ask BE to provide this range value to use for timeseries
      config.context["range"] = { label: "Weekly", value: "WEEKLY" };
      return dataset;
    }

    config.context["range"] = { label: "Weekly", value: "WEEKLY" };

    return {
      type: selectedViz.chart_type,
      chart: extractChartDataset(dataset.table, selectedViz),
      table: dataset.table,
      meta: dataset.meta,
    };
  }, [selectedViz, config.options]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={dataset.meta.title}
        description={dataset.meta.desc.replace(/^(.*?)]/, "")}
        keywords={""}
      />
      <CatalogueProvider dataset={selectedDataset} urls={urls}>
        <DataCatalogueShow
          key={router.asPath}
          options={availableOptions}
          params={params}
          config={config}
          dataset={selectedDataset}
          explanation={explanation}
          metadata={metadata}
          urls={urls}
          translations={translations}
          catalogueId={catalogueId}
          dataviz={dataviz}
          selectedViz={selectedViz}
          setSelectedViz={setSelectedViz}
        />
      </CatalogueProvider>
    </AnalyticsProvider>
  );
};

export const getServerSideProps: GetServerSideProps = withi18n(
  "catalogue",
  async ({ locale, query, params }) => {
    try {
      // OLD DC variable query
      // const { data } = await get("/data-variable/", {
      //   id: params?.id,
      //   lang: SHORT_LANG[locale as keyof typeof SHORT_LANG],
      //   ...query,
      // });
      const { data } = await get("/data-catalogue-variable/", {
        id: params?.id,
        lang: SHORT_LANG[locale as keyof typeof SHORT_LANG],
        ...query,
      });
      const config: DCConfig = {
        context: {},
        dates: null,
        options: null,
        precision: data.API.precision ?? null,
        freeze: data.API.freeze ?? null,
        color: data.API.colour ?? "blues",
        geojson: data.API.file_json ?? null,
        line_variables: data.API.line_variables ?? null,
        exclude_openapi: data.exclude_openapi ?? false,
      };

      const hasTranslations = data.translations && Object.keys(data.translations).length > 0;
      const hasQuery = query && Object.keys(query).length > 1;

      const assignContext = (item: DCFilter) => {
        let [label, value] = ["", ""];
        if (item.key === "date_slider") {
          label = (query[item.key] as string) ?? item.default;
          value = (query[item.key] as string) ?? item.default;
        } else if (!hasTranslations && !hasQuery) {
          label = item.default;
          value = item.default;
        } else if (!hasTranslations && hasQuery) {
          label = query[item.key] as string;
          value = query[item.key] as string;
        } else if (hasTranslations && !hasQuery) {
          label = (data.translations[item.default] as string) ?? item.default;
          value = item.default;
        } else {
          label = data.translations[query[item.key] as string] ?? query[item.key] ?? item.default;
          value = (query[item.key] as string) ?? item.default;
        }

        Object.assign(config.context, { [item.key]: { label, value } });
      };

      data.API.filters?.forEach((item: DCFilter) => {
        if (item.key === "date_slider") config.dates = item as FilterDate;
        assignContext(item);
      });
      config.options =
        data.API.filters?.filter((item: DCFilter) => item.key !== "date_slider") ?? null;

      return {
        props: {
          meta: {
            id: data.chart_details.intro.unique_id,
            type: "data-catalogue",
            category: null,
            agency: Array.isArray(data.metadata.data_source)
              ? data.metadata.data_source.join(",")
              : "",
          },
          config,
          params,
          dataset: {
            type: data.API.chart_type,
            chart: data.chart_details.chart_data ?? {},
            table: data.chart_details.table_data ?? null,
            meta: data.chart_details.intro,
          },
          explanation: data.explanation,
          metadata: {
            url: {
              csv: data.metadata.url.csv ?? null,
              parquet: data.metadata.url.parquet ?? null,
              link_geojson: data.metadata.url.link_geojson ?? null,
            },
            data_as_of: data.metadata.data_as_of,
            last_updated: data.metadata.last_updated,
            next_update: data.metadata.next_update,
            description: data.metadata.dataset_desc,
            source: data.metadata.data_source,
            definitions: data.metadata.out_dataset.concat(data.metadata?.in_dataset ?? []),
          },
          dataviz: data.dataviz,
          urls: data.downloads ?? {},
          translations: data.translations ?? {},
          catalogueId: data.openapi_id ?? "",
        },
      };
    } catch (error) {
      console.error(error);
      return { notFound: true };
    }
  },
  {
    cache_expiry: 21600, // 6 hrs
  }
);

export default CatalogueShow;
