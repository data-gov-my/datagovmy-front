import type { DCConfig, DCFilter, FilterDate, Page } from "@lib/types";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { withi18n } from "@lib/decorators";
import { SHORT_LANG } from "@lib/constants";
import { OptionType } from "@components/types";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import Metadata from "@components/Metadata";
import DataCatalogueWidget from "@data-catalogue/widget";
import { useMemo } from "react";
import { AnalyticsProvider } from "@hooks/useAnalytics";
import { WindowProvider } from "@hooks/useWindow";

const CatalogueEmbed: Page = ({
  meta,
  params,
  config,
  dataset,
  metadata,
  urls,
  translations,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { t } = useTranslation(["catalogue", "common"]);

  const availableOptions = useMemo<OptionType[]>(() => {
    switch (dataset.type) {
      case "TABLE":
        return [{ label: t("table"), value: "table" }];

      case "GEOJSON":
      case "HEATTABLE":
        return [{ label: t("chart"), value: "chart" }];

      default:
        return [
          { label: t("chart"), value: "chart" },
          { label: t("table"), value: "table" },
        ];
    }
  }, [dataset.type]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={dataset.meta.title}
        description={dataset.meta.desc.replace(/^(.*?)]/, "")}
        keywords={""}
      />
      <WindowProvider>
        <DataCatalogueWidget
          options={availableOptions}
          params={params}
          config={config}
          dataset={dataset}
          metadata={metadata}
          urls={urls}
          translations={translations}
        />
      </WindowProvider>
    </AnalyticsProvider>
  );
};

CatalogueEmbed.layout = page => <>{page}</>;
CatalogueEmbed.theme = "light";

export const getServerSideProps: GetServerSideProps = withi18n(
  "catalogue",
  async ({ locale, query, params }) => {
    const { theme, ...qs } = query;
    const { data } = await get("/data-variable/", {
      id: params!.id,
      lang: SHORT_LANG[locale as keyof typeof SHORT_LANG],
      ...qs,
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
    };

    const hasTranslations = data.translations && Object.keys(data.translations).length;
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
        label = data.translations[query[item.key] as string] ?? query[item.key];
        value = query[item.key] as string;
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
        params: {
          id: params?.id ?? null,
          theme: theme ?? "light",
        },
        dataset: {
          type: data.API.chart_type,
          chart: data.chart_details.chart_data ?? {},
          table: data.chart_details.table_data ?? null,
          meta: data.chart_details.intro,
        },
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
        urls: data.downloads ?? {},
        translations: data.translations ?? {},
      },
    };
  }
);

export default CatalogueEmbed;
