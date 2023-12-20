import HospitalBedUtilisationDashboard from "@dashboards/hospital-bed-utilisation";
import { Metadata } from "datagovmy-ui/components";
import { get } from "datagovmy-ui/api";
import { withi18n } from "datagovmy-ui/decorators";
import { useTranslation } from "datagovmy-ui/hooks";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { Page } from "datagovmy-ui/types";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";

const HospitalBedUtilisation: Page = ({
  meta,
  last_updated,
  next_update,
  choropleth,
  dropdown,
  hospital,
  table_facility,
  timeseries_facility,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-hospital-bed-utilisation", "common"]);

  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <HospitalBedUtilisationDashboard
        last_updated={last_updated}
        next_update={next_update}
        choropleth={choropleth}
        dropdown={dropdown}
        hospital={hospital}
        table_facility={table_facility}
        timeseries_facility={timeseries_facility}
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
  ["dashboard-hospital-bed-utilisation", "common"],
  async ({ params }) => {
    const hospital = params?.hospital ? params.hospital[0] : "Hospital Sungai Buloh";

    const { data } = await get("/dashboard", {
      dashboard: "bed_util",
      hospital,
    }).catch(e => {
      console.error(e);
      throw new Error("Invalid hospital. Message: " + e);
    });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-hospital-bed-utilisation",
          type: "dashboard",
          category: "healthcare",
          agency: "KKM",
        },
        last_updated: data.data_last_updated,
        next_update: data.data_next_update,
        choropleth: data.choropleth_malaysia,
        dropdown: data.timeseries_dropdown.data.data,
        hospital,
        table_facility: data.table_facility,
        timeseries_facility: data.timeseries_facility.data,
      },
    };
  }
);

export default HospitalBedUtilisation;
