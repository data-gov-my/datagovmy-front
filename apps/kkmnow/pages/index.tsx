import { InferGetStaticPropsType } from "next";
import { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { Page } from "datagovmy-ui/types";
import { withi18n } from "datagovmy-ui/decorators";
import { routes } from "@lib/routes";
import { Metadata } from "datagovmy-ui/components";
import DashboardIndex from "@dashboards/index";
import { get } from "datagovmy-ui/api";

const Home: Page = ({
  dashboards,
  keystats,
  timeseries,
  timeseries_callout,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t, i18n } = useTranslation(["dashboards"]);
  return (
    <>
      <Metadata keywords={""} />
      <DashboardIndex
        dashboards={dashboards}
        keystats={keystats}
        timeseries={timeseries}
        timeseries_callout={timeseries_callout}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(null, async () => {
  const { data } = await get("/dashboard/", { dashboard: "kkmnow_homepage" });

  const dashboard_route = {
    data_as_of: "2023-11-20 23:59",
    data: [
      {
        id: "dashboard-covid-19",
        name: "covid-19",
        division: "moh",
        route: routes.COVID_19,
      },
      {
        id: "dashboard-covid-vaccination",
        name: "covid-vaccination",
        division: "moh",
        route: routes.COVID_VACCINATION,
      },
      {
        id: "dashboard-blood-donation",
        name: "blood-donation",
        division: "moh",
        route: routes.BLOOD_DONATION,
      },
      {
        id: "dashboard-hospital-bed-utilisation",
        name: "hospital-bed-utilisation",
        division: "moh",
        route: routes.HOSPITAL_BED_UTILISATION,
      },
      {
        id: "dashboard-organ-donation",
        name: "organ-donation",
        division: "moh",
        route: routes.ORGAN_DONATION,
      },
      {
        id: "dashboard-peka-b40",
        name: "peka-b40",
        division: "moh",
        route: routes.PEKA_B40,
      },
    ],
  };

  return {
    props: {
      meta: {
        id: "dashboard-index",
        type: "misc",
        category: null,
        agency: null,
      },
      dashboards: dashboard_route,
      keystats: data.keystats,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
    },
  };
});

export default Home;
