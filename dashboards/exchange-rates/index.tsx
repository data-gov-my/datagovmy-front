import { FunctionComponent, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { sortMulti, toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { useData } from "@hooks/useData";
import { AKSARA_COLOR, SHORT_LANG } from "@lib/constants";
import { default as Tabs, Panel } from "@components/Tabs";
import Container from "@components/Container";
import Hero from "@components/Hero";
import Section from "@components/Section";
import { track } from "@lib/mixpanel";
import { routes } from "@lib/routes";
import { closestIndex, getColor } from "@lib/schema/exchange-rates";

/**
 * Exchange Rates Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });

interface ExchangeRatesDashboardProps {
  last_updated: number;
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
  const { t, i18n } = useTranslation();
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

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "exchangerate.header",
      name_en: "Exchange Rates",
      name_bm: "Kadar Pertukaran",
      route: routes.EXCHANGE_RATE,
    });
  }, []);

  return (
    <>
      <Hero background="exchange-rates-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-green-300">
            {t("nav.megamenu.categories.economy")}
          </span>
          <h3 className="text-white">{t("exchangerate.header")}</h3>
          <p className="whitespace-pre-line text-white">{t("exchangerate.description")}</p>

          <p className="text-sm text-dim">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="start-h-screen">
        {/* A snapshot of the Ringgit's performance against major trade partners */}
        <Section
          title={t("exchangerate.section_1.title")}
          description={t("exchangerate.section_1.description")}
          date={bar.data_as_of}
        >
          <Tabs
            title={t("exchangerate.section_1.bar_header", {
              period: t(`exchangerate.keys.${SNAPSHOT_TAB[data.active_snapshot]}`),
            })}
            onChange={(index: number) => setData("active_snapshot", index)}
          >
            {SNAPSHOT_TAB.map((key: string) => {
              const sorted_data = sortMulti(bar.data[key], "y", (a: number, b: number) => b - a);
              const zero_index = closestIndex(sorted_data.y, 0);
              return (
                <Panel name={t(`exchangerate.keys.${key}`)} key={key}>
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
                          label: t("exchangerate.section_1.bar_header", {
                            period: t(`exchangerate.keys.${SNAPSHOT_TAB[data.active_snapshot]}`),
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
                          label: t("exchangerate.section_1.bar_header", {
                            period: t(`exchangerate.keys.${SNAPSHOT_TAB[data.active_snapshot]}`),
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
          title={t("exchangerate.section_2.title")}
          description={t("exchangerate.section_2.description")}
          date={timeseries.data_as_of}
        >
          <Tabs onChange={e => setData("active_trend", e)}>
            {/* title={t("exchangerate.keys.currency0")} */}
            {TREND_TAB.map(key => (
              <Panel name={t(`exchangerate.keys.${key}`)} key={key}>
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
                          label: t("exchangerate.keys.currency0"),
                          borderColor: AKSARA_COLOR.PRIMARY,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.PRIMARY_H,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("exchangerate.latest"),
                        value: timeseries_callouts.data.currency0.callout,
                      },
                    ]}
                  /> */}

                  <div className="grid grid-cols-1 gap-12 pt-8 lg:grid-cols-3">
                    {CURRENCY.map(index => (
                      <Timeseries
                        title={timeseries_callouts.data[index][`country_${lang}`]}
                        className="h-[300px] w-full"
                        interval={data.active_trend < 2 ? "day" : "auto"}
                        prefixY={timeseries_callouts.data[index].tooltip_unit}
                        precision={3}
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
                            title: t("exchangerate.latest"),
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
