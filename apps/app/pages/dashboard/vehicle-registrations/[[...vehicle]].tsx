import VehicleRegistrationsDashboard from "@dashboards/transportation/vehicle-registrations";
import { get } from "datagovmy-ui/api";
import { Metadata } from "datagovmy-ui/components";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { Page } from "datagovmy-ui/types";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";

const VehicleRegistrations: Page = ({
  last_updated,
  next_update,
  meta,
  dropdown,
  params,
  vehicle_timeseries,
  vehicle_timeseries_callout,
  fuel_timeseries,
  fuel_timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation("dashboards");

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata
        title={t("dashboards.vehicle-registrations.name")}
        description={t("dashboards.vehicle-registrations.description")}
      />
      <VehicleRegistrationsDashboard
        last_updated={last_updated}
        next_update={next_update}
        dropdown={dropdown}
        params={params}
        vehicle_timeseries={vehicle_timeseries}
        vehicle_timeseries_callout={vehicle_timeseries_callout}
        fuel_timeseries={fuel_timeseries}
        fuel_timeseries_callout={fuel_timeseries_callout}
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
  "dashboard-vehicle-registrations",
  async ({ params }) => {
    const type = params?.vehicle ? params.vehicle[0] : "all";
    try {
      const results = await Promise.allSettled([
        get("/dropdown", { dashboard: "vehicle_registrations" }),
        get("/dashboard", { dashboard: "vehicle_registrations", type }),
      ]);

      const [dropdown, data] = results.map(e => {
        if (e.status === "rejected") return {};
        else return e.value.data;
      });

      return {
        notFound: false,
        props: {
          meta: {
            id: "dashboard-vehicle-registrations",
            type: "dashboard",
            category: "transportation",
            agency: "JPJ",
          },
          last_updated: data.data_last_updated,
          next_update: data.data_next_update,
          dropdown: dropdown.data,
          params: { vehicle_type: type },
          vehicle_timeseries: data.vehicles_timeseries_type,
          vehicle_timeseries_callout: data.vehicles_timeseries_type_callout,
          fuel_timeseries: data.vehicles_timeseries_fuel,
          fuel_timeseries_callout: data.vehicles_timeseries_fuel_callout,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        notFound: true,
      };
    }
  }
);

export default VehicleRegistrations;
