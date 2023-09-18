import { WorkerIcon } from "@icons/division";
import { Container, Section, Slider, Hero, AgencyBadge } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, smartNumFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Labour Market Dashboard
 * @overview Status: Live (Partially on-hold)
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

type LabourMarketKeys =
  | "unemployment_rate"
  | "labour_force_participation"
  | "under_employment_rate"
  | "employment_population_ratio"
  | "unemployed_persons"
  | "own_account_workers"
  | "outside_labour_force";
type LabourMarketCalloutKeys =
  | "ep_ratio"
  | "outside"
  | "own_account"
  | "p_rate"
  | "u_rate"
  | "under_rate"
  | "unemployed";
interface LabourMarketProps {
  last_updated: string;
  bar: any;
  timeseries: WithData<Record<LabourMarketKeys | "x", number[]>>;
  choropleth: any;
  timeseries_callouts: WithData<Record<LabourMarketCalloutKeys, { callout1: number }>>;
}

const LabourMarketDashboard: FunctionComponent<LabourMarketProps> = ({
  last_updated,
  bar,
  timeseries,
  choropleth,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-labour-market", "common"]);
  const { data, setData } = useData({
    minmax: [timeseries.data.x.length - 24, timeseries.data.x.length - 1], // [2 years ago, today]
  });
  const LATEST_TIMESTAMP = timeseries.data.x[timeseries.data.x.length - 1];
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.economy"), "text-purple"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:mbls.full")} icon={<WorkerIcon />} isDivision />
        }
      />

      <Container className="min-h-screen">
        <SliderProvider>
          {play => (
            <>
              {/* How is unemployment trending? */}
              <Section
                title={t("section_1.title")}
                description={t("section_1.description")}
                date={timeseries.data_as_of}
              >
                <div className="space-y-4">
                  <Timeseries
                    className="h-[300px] w-full"
                    title={t("keys.unemployment_rate")}
                    interval="month"
                    unitY="%"
                    enableAnimation={!play}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.unemployment_rate,
                          label: t("keys.unemployment_rate"),
                          borderColor: AKSARA_COLOR.PURPLE,
                          backgroundColor: AKSARA_COLOR.PURPLE_H,
                          borderWidth: 1.5,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: `${numFormat(
                          timeseries_callouts.data.u_rate.callout1,
                          "standard",
                          1
                        )}%`,
                      },
                    ]}
                  />
                  <Slider
                    className="pt-7"
                    type="range"
                    value={data.minmax}
                    data={timeseries.data.x}
                    period="month"
                    onChange={e => setData("minmax", e)}
                  />
                </div>
              </Section>

              {/* How are other key labour market indicators trending? */}
              <Section title={t("section_2.title")} date={timeseries.data_as_of}>
                <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
                  <Timeseries
                    title={t("keys.labour_force_participation")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    unitY="%"
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.labour_force_participation,
                          label: t("keys.labour_force_participation"),
                          borderColor: AKSARA_COLOR.PURPLE,
                          backgroundColor: AKSARA_COLOR.PURPLE_H,
                          borderWidth: 1.5,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: `${numFormat(
                          timeseries_callouts.data.p_rate.callout1,
                          "standard",
                          1
                        )}%`,
                      },
                    ]}
                  />
                  <Timeseries
                    title={t("keys.under_employment_rate")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    unitY="%"
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.under_employment_rate,
                          label: t("keys.under_employment_rate"),
                          borderColor: AKSARA_COLOR.PURPLE,
                          backgroundColor: AKSARA_COLOR.PURPLE_H,
                          borderWidth: 1.5,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: `${numFormat(
                          timeseries_callouts.data.under_rate.callout1,
                          "standard",
                          1
                        )}%`,
                      },
                    ]}
                  />
                  <Timeseries
                    title={t("keys.employment_population_ratio")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.employment_population_ratio,
                          label: t("keys.employment_population_ratio"),
                          borderColor: AKSARA_COLOR.PURPLE,
                          backgroundColor: AKSARA_COLOR.PURPLE_H,
                          borderWidth: 1.5,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: `${numFormat(
                          timeseries_callouts.data.ep_ratio.callout1,
                          "standard",
                          1
                        )}`,
                      },
                    ]}
                  />
                  <Timeseries
                    title={t("keys.unemployed_persons")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    displayNumFormat={(value, type, precision) =>
                      smartNumFormat({ value, type, precision, locale: i18n.language })
                    }
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.unemployed_persons,
                          label: t("keys.unemployed_persons"),
                          borderColor: AKSARA_COLOR.PURPLE,
                          backgroundColor: AKSARA_COLOR.PURPLE_H,
                          borderWidth: 1.5,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: numFormat(timeseries_callouts.data.unemployed.callout1, "standard"),
                      },
                    ]}
                  />
                  <Timeseries
                    title={t("keys.own_account_workers")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    displayType="compact"
                    displayNumFormat={(value, type, precision) =>
                      numFormat(value, type, precision, "long", i18n.language, true)
                    }
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.own_account_workers,
                          label: t("keys.own_account_workers"),
                          borderColor: AKSARA_COLOR.PURPLE,
                          backgroundColor: AKSARA_COLOR.PURPLE_H,
                          borderWidth: 1.5,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: numFormat(
                          timeseries_callouts.data.own_account.callout1,
                          timeseries_callouts.data.own_account.callout1 < 1e6
                            ? "standard"
                            : "compact",
                          timeseries_callouts.data.own_account.callout1 < 1e6 ? 0 : 1,
                          "long",
                          i18n.language,
                          false
                        ),
                      },
                    ]}
                  />
                  <Timeseries
                    title={t("keys.outside_labour_force")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    displayType="compact"
                    displayNumFormat={(value, type, precision) =>
                      numFormat(value, type, precision, "long", i18n.language, true)
                    }
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.outside_labour_force,
                          label: t("keys.outside_labour_force"),
                          borderColor: AKSARA_COLOR.PURPLE,
                          backgroundColor: AKSARA_COLOR.PURPLE_H,
                          borderWidth: 1.5,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: numFormat(
                          timeseries_callouts.data.outside.callout1,
                          timeseries_callouts.data.outside.callout1 < 1e6 ? "standard" : "compact",
                          timeseries_callouts.data.outside.callout1 < 1e6 ? 0 : 1,
                          "long",
                          i18n.language,
                          false
                        ),
                      },
                    ]}
                  />
                </div>
              </Section>
            </>
          )}
        </SliderProvider>
      </Container>
    </>
  );
};

export default LabourMarketDashboard;
