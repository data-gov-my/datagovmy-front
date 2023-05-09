import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import InternationalReservesDashboard from "@dashboards/financial-sector/international-reserves";
import { withi18n } from "@lib/decorators";

const InternationalReserves: Page = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-international-reserves", "common"]);

  return (
    <>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <InternationalReservesDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n(
  "dashboard-international-reserves",
  async () => {
    const { data } = await get("/dashboard", { dashboard: "international_reserves" });

    return {
      notFound: false,
      props: {
        meta: {
          id: "dashboard-international-reserves",
          type: "dashboard",
          category: "financial-sector",
          agency: "BNM",
        },
        last_updated: new Date().valueOf(),
        timeseries: data.timeseries,
        timeseries_callouts: data.statistics,
      },
    };
  }
);

export default InternationalReserves;
