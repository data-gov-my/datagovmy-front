import { GetStaticProps } from "next";
import type { InferGetStaticPropsType } from "next";
import { get } from "@lib/api";
import type { Page } from "@lib/types";
import Metadata from "@components/Metadata";
import { useTranslation } from "@hooks/useTranslation";
import ReserveMoneyDashboard from "@dashboards/financial-sector/reserve-money";
import { withi18n } from "@lib/decorators";

const ReserveMoney: Page = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-reserve-money", "common"]);

  return (
    <>
      <Metadata
        title={t("common:nav.megamenu.dashboards.reserve_money")}
        description={t("description")}
        keywords={""}
      />
      <ReserveMoneyDashboard
        last_updated={last_updated}
        timeseries={timeseries}
        timeseries_callouts={timeseries_callouts}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-reserve-money", async () => {
  const { data } = await get("/dashboard", { dashboard: "reserves" });

  return {
    notFound: false,
    props: {
      last_updated: new Date().valueOf(),
      timeseries: data.timeseries,
      timeseries_callouts: data.statistics,
    },
    revalidate: 60 * 60 * 24, // 1 day (in seconds)
  };
});

export default ReserveMoney;
