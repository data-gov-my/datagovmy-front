import { Metadata, Progress } from "datagovmy-ui/components";
import Dashboard from "@dashboards/index";
import { useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { Page } from "datagovmy-ui/types";
import { GetStaticProps, InferGetStaticPropsType } from "next";

import { routes } from "@lib/routes";

const DashboardIndex: Page = ({ dashboards }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboards", "common"]);

  return (
    <>
      <Metadata title={t("common:nav.dashboards")} description={""} keywords={""} />
      <Progress />
      <Dashboard dashboards={dashboards} />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboards", async () => {
  const data = {
    data_as_of: "2023-06-19 23:59",
    data: [
      {
        name: "blood-donation",
        agency: "pdn",
        route: routes.BLOOD_DONATION,
      },
      {
        name: "covid-19",
        agency: "moh",
        route: routes.COVID_19,
      },
      {
        name: "covid-vaccination",
        agency: "moh",
        route: routes.COVID_VACCINATION,
      },
      {
        name: "hospital-bed-utilisation",
        agency: "moh",
        route: routes.HOSPITAL_BED_UTILISATION,
      },
      {
        name: "organ-donation",
        agency: "ntrc",
        route: routes.ORGAN_DONATION,
      },
      {
        name: "peka-b40",
        agency: "phcorp",
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
      dashboards: data,
    },
  };
});

export default DashboardIndex;
