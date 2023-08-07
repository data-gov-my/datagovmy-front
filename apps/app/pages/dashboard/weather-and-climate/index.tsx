import { GetStaticProps } from "next";
import { InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { Page } from "datagovmy-ui/types";
import { Metadata } from "datagovmy-ui/components";
import { useTranslation } from "datagovmy-ui/hooks";
import WeatherandClimateDashboard from "@dashboards/environment/weather-and-climate";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const WeatherandClimate: Page = ({ meta }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-weather-and-climate", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <WeatherandClimateDashboard />
    </AnalyticsProvider>
  );
};
// Disabled
export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-weather-and-climate",
  async () => {
    //   const { data } = await get("/dashboard", { dashboard: "currency" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-weathr-and-climate",
          type: "dashboard",
          category: "environment",
          agency: "Met",
        },
      },
    };
  }
);

export default WeatherandClimate;
