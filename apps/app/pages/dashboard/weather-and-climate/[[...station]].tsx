import WeatherandClimateDashboard, { Station } from "@dashboards/environment/weather-and-climate";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const WeatherandClimate: Page = ({
  dropdown,
  last_updated,
  meta,
  params,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-weather-and-climate", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={params.station.concat(" - ", t("header"))}
        description={t("description")}
        keywords={""}
      />
      <WeatherandClimateDashboard
        dropdown={dropdown}
        last_updated={last_updated}
        params={params}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </AnalyticsProvider>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-weather-and-climate",
  async ({ params }) => {
    try {
      const station = params?.station ? params.station[0] : "kota-bharu";
      const [{ data: dropdown }, { data }] = await Promise.all([
        get("/dropdown/", { dashboard: "weather_and_climate" }),
        get("/dashboard/", {
          dashboard: "weather_and_climate",
          station,
        }),
      ]).catch(e => {
        console.error(e);
        throw new Error("Invalid station. Message: " + e);
      });
      const station_info: Station = dropdown.data.find((e: Station) => e.slug === station);

      return {
        notFound: false,
        props: {
          meta: {
            id: "dashboard-weather-and-climate",
            type: "dashboard",
            category: "environment",
            agency: "Met",
          },
          dropdown: dropdown.data,
          last_updated: data.data_last_updated,
          params: station_info ?? {},
          timeseries: data.timeseries,
          timeseries_callout: data.timeseries_callout,
        },
      };
    } catch (e: any) {
      console.error(e.message);
      return { notFound: true };
    }
  }
);

export default WeatherandClimate;
