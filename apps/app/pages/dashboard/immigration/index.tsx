import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ImmigrationDashboard from "@dashboards/demography/immigration";
import { withi18n } from "@lib/decorators";

const Immigration: Page = ({
  choropleth,
  countries,
  last_updated,
  timeseries,
  timeseries_callout,
  timeseries_country,
  timeseries_country_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-immigration", "common", "countries"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <ImmigrationDashboard
        choropleth={choropleth}
        countries={countries}
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
        timeseries_country={timeseries_country}
        timeseries_country_callout={timeseries_country_callout}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  ["dashboard-immigration", "countries"],
  async () => {
    const { data: dropdown } = await get("/dropdown", { dashboard: "immigration_country" });
    const { data } = await get("/dashboard", {
      dashboard: "immigration",
    });
    const { data: country } = await get("/dashboard", {
      dashboard: "immigration_country",
      country: "overall",
    });
    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-immigration",
          type: "dashboard",
          category: "demography",
          agency: "Imigresen",
        },
        choropleth: data.choropleth,
        countries: dropdown.data,
        last_updated: new Date().valueOf(),
        timeseries: data.timeseries,
        timeseries_callout: data.timeseries_callout,
        timeseries_country: country.timeseries_country,
        timeseries_country_callout: country.timeseries_country_callout,
      },
    };
  }
);

export default Immigration;
