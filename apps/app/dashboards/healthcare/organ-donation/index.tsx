import { routes } from "@lib/routes";
import {
  AgencyBadge,
  Container,
  Hero,
  LeftRightCard,
  Panel,
  RankList,
  Section,
  Slider,
  StateDropdown,
  Tabs,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { TimeseriesOption } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * OrganDonation Dashboard
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Bar = dynamic(() => import("datagovmy-ui/charts/bar"), { ssr: false });

interface OrganDonationProps {
  last_updated: string;
  params: { state: string };
  timeseries: any;
  choropleth: any;
  barchart_age: any;
  barchart_time: any;
}

const OrganDonation: FunctionComponent<OrganDonationProps> = ({
  last_updated,
  params,
  timeseries,
  choropleth,
  barchart_age,
  barchart_time,
}) => {
  const { t, i18n } = useTranslation(["dashboard-organ-donation", "common"]);

  const currentState = params.state;
  const { data, setData } = useData({
    minmax: [timeseries.data.daily.x.length - 366, timeseries.data.daily.x.length - 1],
    period: "auto",
    periodly: "daily_7d",
    tab_index: 0,
  });

  const config: { [key: string]: TimeseriesOption } = {
    0: {
      period: "auto",
      periodly: "daily_7d",
    },
    1: {
      period: "auto",
      periodly: "daily",
    },
    2: {
      period: "month",
      periodly: "monthly",
    },
    3: {
      period: "year",
      periodly: "yearly",
    },
  };

  const { coordinate } = useSlice(timeseries.data[data.periodly], data.minmax);
  const { theme } = useTheme();

  return (
    <>
      <Hero
        background="green"
        category={[t("common:categories.healthcare"), "text-[#16A34A]"]}
        header={[t("header")]}
        description={[t("description")]}
        action={<StateDropdown url={routes.ORGAN_DONATION} currentState={currentState} />}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="ntrc" />}
      />

      <Container className="min-h-screen">
        {/* What are the latest organ pledger trends in Malaysia? */}
        <Section
          title={t("timeseries_header", {
            state: CountryAndStates[currentState],
          })}
          description={t("timeseries_desc")}
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[300px]"
                  title={t("timeseries_title", {
                    state: CountryAndStates[currentState],
                    context: data.periodly,
                  })}
                  interval={data.period}
                  enableAnimation={!play}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.y,
                        label: t(`common:time.${data.periodly}`),
                        borderColor: "#16A34A",
                        borderWidth: 1.5,
                        backgroundColor: "#16A34A1A",
                        fill: true,
                      },
                    ],
                  }}
                  menu={
                    <Tabs.List
                      options={[
                        t("common:time.daily_7d"),
                        t("common:time.daily"),
                        t("common:time.monthly"),
                        t("common:time.yearly"),
                      ]}
                      current={data.tab_index}
                      onChange={index => {
                        setData("tab_index", index);
                        setData("minmax", [
                          0,
                          timeseries.data[config[index].periodly].x.length - 1,
                        ]);
                        setData("period", config[index].period);
                        setData("periodly", config[index].periodly);
                      }}
                    />
                  }
                />
                <Slider
                  type="range"
                  period={data.period}
                  value={data.minmax}
                  data={timeseries.data[data.periodly].x}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>

        {/* How do organ pledger rates differ across the country? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6 pb-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("choro_header")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <p className="text-dim whitespace-pre-line">{t("choro_desc")}</p>
                </div>
                <RankList
                  id="organ-donation-by-state"
                  title={t("common:common.ranking", { count: choropleth.data.x.length })}
                  data={choropleth.data.y.perc}
                  color="text-green-600"
                  threshold={choropleth.data.x.length}
                  format={(position: number) => {
                    return {
                      label: CountryAndStates[choropleth.data.x[position]],
                      value: `${numFormat(choropleth.data.y.perc[position], "compact", 2)}%`,
                    };
                  }}
                />
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px] lg:w-full"
                color="greens"
                data={{
                  labels: choropleth.data.x.map((state: string) => CountryAndStates[state]),
                  values: choropleth.data.y.perc,
                }}
                unit="%"
                type="state"
              />
            }
          />
        </Section>

        {/* How strong is new pledger recruitment in Malaysia? */}
        <Section
          title={t("bar_header", {
            state: CountryAndStates[currentState],
          })}
          description={t("bar_description")}
          date={barchart_time.data_as_of}
        >
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs title={t("bar1_title")}>
                <Panel name={t("annual")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.annual.x,
                      datasets: [
                        {
                          label: `${t("bar_tooltip")}`,
                          data: barchart_time.data.annual.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor:
                            theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("common:time.monthly")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.monthly.x,
                      datasets: [
                        {
                          label: `${t("bar_tooltip")}`,
                          data: barchart_time.data.monthly.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor:
                            theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs title={t("bar2_title")}>
                <Panel name={t("year")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_year.x,
                      datasets: [
                        {
                          label: `${t("bar_tooltip")}`,
                          data: barchart_age.data.past_year.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor:
                            theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("month")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_month.x,
                      datasets: [
                        {
                          label: `${t("bar_tooltip")}`,
                          data: barchart_age.data.past_month.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor:
                            theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default OrganDonation;
