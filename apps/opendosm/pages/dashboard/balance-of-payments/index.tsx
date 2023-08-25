import { GetStaticProps, InferGetStaticPropsType } from "next";
import { get } from "datagovmy-ui/api";
import { OptionType, Page } from "datagovmy-ui/types";
import { AgencyBadge, Hero, Metadata } from "datagovmy-ui/components";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { withi18n } from "datagovmy-ui/decorators";
import { AnalyticsProvider } from "datagovmy-ui/contexts/analytics";
import BalanceOfPaymentsTimeseries from "@dashboards/bop/timeseries";
import { clx } from "datagovmy-ui/helpers";
import BalanceOfPaymentsSnapshot from "@dashboards/bop/snapshot";

const BalanceOfPayments: Page = ({
  last_updated,
  meta,
  timeseries,
  timeseries_callout,
  bop_snapshot,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { t } = useTranslation(["dashboard-bop", "common"]);
  const TAB_OPTIONS: Array<OptionType> = [
    {
      label: t("keys.snapshot"),
      value: "snapshot",
    },
    {
      label: t("keys.timeseries"),
      value: "timeseries",
    },
  ];

  const { data, setData } = useData({
    tab_index: TAB_OPTIONS[0],
  });
  return (
    <AnalyticsProvider meta={meta}>
      <Metadata title={t("header")} description={t("description")} keywords={""} />
      <Hero
        background="blue"
        category={[t("common:categories.national_accounts"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency={meta.agency} />}
      />

      <nav className="sticky top-14 z-20 flex overflow-hidden border-b border-b-outline bg-white dark:border-b-washed-dark dark:bg-black min-[350px]:justify-center lg:static">
        <div
          className={
            "hide-scrollbar max-[420px]:justify-center, flex snap-x snap-mandatory scroll-px-9 flex-nowrap overflow-x-auto max-sm:justify-start"
          }
        >
          {TAB_OPTIONS.map(tab => (
            <div key={tab.value} className="snap-start">
              <div
                className="flex h-full min-w-[56px] cursor-pointer items-center justify-center px-3 outline-none"
                onClick={() => setData("tab_index", tab)}
              >
                <div className="relative flex h-full flex-col items-center justify-center px-2 py-4">
                  <div
                    className={clx(
                      "flex items-center gap-2",
                      data.tab_index.value === tab.value ? "text-black dark:text-white" : "text-dim"
                    )}
                  >
                    <span className="whitespace-nowrap text-base font-medium">{tab.label}</span>
                  </div>
                  {data.tab_index.value === tab.value && (
                    <div className="absolute bottom-0 inline-flex h-[2px] w-full min-w-[56px] rounded-full bg-primary dark:bg-primary-dark" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {data.tab_index.value === "snapshot" && (
        <BalanceOfPaymentsSnapshot
          last_updated={last_updated}
          bop_snapshot={bop_snapshot}
          meta={meta}
        />
      )}
      {data.tab_index.value === "timeseries" && (
        <BalanceOfPaymentsTimeseries
          last_updated={last_updated}
          timeseries={timeseries}
          timeseries_callout={timeseries_callout}
          meta={meta}
        />
      )}
    </AnalyticsProvider>
  );
};

export const getStaticProps: GetStaticProps = withi18n("dashboard-bop", async () => {
  const { data } = await get("/dashboard", { dashboard: "bop" });

  return {
    notFound: false,
    props: {
      meta: {
        id: "dashboard-bop",
        type: "dashboard",
        category: "national-accounts",
        agency: "dosm",
      },
      last_updated: data.data_last_updated,
      timeseries: data.timeseries,
      timeseries_callout: data.timeseries_callout,
      bop_snapshot: data.bop_snapshot,
    },
  };
});

export default BalanceOfPayments;
