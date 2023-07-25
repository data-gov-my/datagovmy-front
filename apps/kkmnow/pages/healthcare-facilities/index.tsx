/**
 * Healthcare Facilities Page
 */
import { Metadata } from "@components/index";
import HealthcareFacilitiesDashboard from "@dashboards/healthcare-facilities";
import { get } from "@lib/api";
import { Page } from "@lib/types";
import { InferGetStaticPropsType, GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const HealthcareFacilitiesIndex: Page = ({
  last_updated,
  facility_table,
  state_district_mapping,
  facility_types,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation();
  return (
    <>
      <Metadata
        title={t("nav.megamenu.dashboards.healthcare_facilities")}
        description={t("healthcare.title_description")}
        keywords={""}
      />
      <HealthcareFacilitiesDashboard
        last_updated={last_updated}
        facility_table={facility_table}
        state_district_mapping={state_district_mapping}
        facility_types={facility_types}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const i18n = await serverSideTranslations(locale!, ["common"]);
  const {
    data: { helpers },
  } = await get("/kkmnow", { dashboard: "facilities" });
  const {
    data: { facilities_table },
  } = await get("/kkmnow", { dashboard: "facilities_table" });

  return {
    props: {
      ...i18n,
      last_updated: new Date().valueOf(),
      facility_table: facilities_table,
      state_district_mapping: helpers.data.state_district_mapping,
      facility_types: helpers.data.facility_types,
    },
    revalidate: 300,
  };
};

export default HealthcareFacilitiesIndex;
