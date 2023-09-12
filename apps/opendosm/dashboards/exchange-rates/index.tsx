import { IntegrationDataIcon } from "@icons/division";
import { AgencyBadge, Container, Hero, Panel, Section, Tabs } from "datagovmy-ui/components";
import { AKSARA_COLOR, SHORT_LANG } from "datagovmy-ui/constants";
import { sortMulti } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { closestIndex, getColor } from "datagovmy-ui/schema/exchange-rates";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * Exchange Rates Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
const Bar = dynamic(() => import("datagovmy-ui/charts/bar"), { ssr: false });

interface ExchangeRatesDashboardProps {
  last_updated: string;
  bar: any;
  timeseries: any;
  timeseries_callouts: any;
}

const ExchangeRatesDashboard: FunctionComponent<ExchangeRatesDashboardProps> = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-exchange-rates", "common"]);
  const lang = SHORT_LANG[i18n.language as keyof typeof SHORT_LANG];
  const { data, setData } = useData({
    active_snapshot: 0,
    active_trend: 0,
  });

  const SNAPSHOT_TAB = ["1w", "1m", "1y", "5y"];
  const TREND_TAB = ["1m", "1y", "5y", "alltime"];
  const CURRENCY = Object.keys(timeseries.data["1m"]).filter(
    key => !["x", "currency0"].includes(key)
  );

  const shader = useCallback<
    ([start, end]: [number, number]) => { borderColor: string; backgroundColor: string }
  >(
    ([start, end]) => {
      const result: number = (end - start) / start;
      const withinMargin = Math.abs(result) < 0.02;

      if (withinMargin)
        return {
          borderColor: AKSARA_COLOR.DIM,
          backgroundColor: AKSARA_COLOR.DIM_H,
        };
      return {
        borderColor: result > 0 ? AKSARA_COLOR.SUCCESS : AKSARA_COLOR.DANGER,
        backgroundColor: result > 0 ? AKSARA_COLOR.SUCCESS_H : AKSARA_COLOR.DANGER_H,
      };
    },
    [data.active_trend]
  );

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.financial_sector")]}
        header={[t("header"), "dark:text-white"]}
        description={[t("description"), "dark:text-white"]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bipd.full")} icon={<IntegrationDataIcon />} isDivision />
        }
      />

      <Container className="start-h-screen">
        {/* A snapshot of the Ringgit's performance against major trade partners */}
        <Section
          title={t("section_1.title")}
          description={t("section_1.description")}
          date={bar.data_as_of}
        >
          <Tabs
            title={t("section_1.bar_header", {
              period: t(`keys.${SNAPSHOT_TAB[data.active_snapshot]}`),
            })}
            onChange={(index: number) => setData("active_snapshot", index)}
          >
            {SNAPSHOT_TAB.map((key: string) => {
              const sorted_data = sortMulti<number>(
                bar.data[key],
                "y",
                (a: number, b: number) => b - a
              );
              const zero_index = closestIndex(sorted_data.y, 0);
              return (
                <Panel name={t(`keys.${key}`)} key={key}>
                  <Bar
                    className="hidden h-[350px] w-full lg:block"
                    layout="vertical"
                    unitY="%"
                    type="category"
                    reverse
                    enableStep
                    enableGridX={false}
                    data={{
                      labels: sorted_data.x,
                      datasets: [
                        {
                          label: t("section_1.bar_header", {
                            period: t(`keys.${SNAPSHOT_TAB[data.active_snapshot]}`),
                          }),
                          data: sorted_data.y,
                          backgroundColor(ctx) {
                            return getColor(ctx.dataIndex, zero_index);
                          },
                        },
                      ],
                    }}
                  />
                  <Bar
                    className="block h-[500px] w-full lg:hidden"
                    layout="horizontal"
                    unitY="%"
                    type="category"
                    enableStep
                    enableGridY={false}
                    data={{
                      labels: sorted_data.x.slice().reverse(),
                      datasets: [
                        {
                          label: t("section_1.bar_header", {
                            period: t(`keys.${SNAPSHOT_TAB[data.active_snapshot]}`),
                          }),
                          data: sorted_data.y.slice().reverse(),
                          backgroundColor(ctx) {
                            return getColor(ctx.dataIndex, zero_index);
                          },
                        },
                      ],
                    }}
                  />
                </Panel>
              );
            })}
          </Tabs>
        </Section>

        {/* How is the Ringgit trending? */}
        <Section
          title={t("section_2.title")}
          description={t("section_2.description")}
          date={timeseries.data_as_of}
        >
          <Tabs onChange={e => setData("active_trend", e)}>
            {/* title={t("keys.currency0")} */}
            {TREND_TAB.map(key => (
              <Panel name={t(`keys.${key}`)} key={key}>
                <div className="space-y-12">
                  {/* <Timeseries
                    className="h-[300px] w-full"
                    interval={data.active_trend < 2 ? "day" : "auto"}
                    unitY="%"
                    data={{
                      labels: timeseries.data[key].x,
                      datasets: [
                        {
                          type: "line",
                          data: timeseries.data[key].currency0,
                          label: t("keys.currency0"),
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("latest"),
                        value: timeseries_callouts.data.currency0.callout,
                      },
                    ]}
                  /> */}

                  <div className="grid grid-cols-1 gap-12 pt-8 lg:grid-cols-3">
                    {CURRENCY.map(index => (
                      <Timeseries
                        key={timeseries_callouts.data[index][`country_${lang}`]}
                        title={timeseries_callouts.data[index][`country_${lang}`]}
                        className="h-[300px] w-full"
                        interval={data.active_trend < 2 ? "day" : "auto"}
                        prefixY={timeseries_callouts.data[index].tooltip_unit}
                        precision={3}
                        beginZero={false}
                        data={{
                          labels: timeseries.data[key].x,
                          datasets: [
                            {
                              type: "line",
                              data: timeseries.data[key][index],
                              label: timeseries_callouts.data[index][`country_${lang}`],
                              borderColor: shader([
                                timeseries.data[key][index][0],
                                timeseries.data[key][index][timeseries.data[key][index].length - 1],
                              ]).borderColor,
                              borderWidth: 1.5,
                              backgroundColor: shader([
                                timeseries.data[key][index][0],
                                timeseries.data[key][index][timeseries.data[key][index].length - 1],
                              ]).backgroundColor,
                              fill: true,
                            },
                          ],
                        }}
                        stats={[
                          {
                            title: t("latest"),
                            value: timeseries_callouts.data[index].callout,
                          },
                        ]}
                      />
                    ))}
                  </div>
                </div>
              </Panel>
            ))}
          </Tabs>
        </Section>
      </Container>
    </>
  );
};

export default ExchangeRatesDashboard;
