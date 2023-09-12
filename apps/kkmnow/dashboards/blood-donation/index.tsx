import { routes } from "@lib/routes";
import {
  Hero,
  Container,
  Panel,
  Section,
  StateDropdown,
  Tabs,
  Slider,
  LeftRightCard,
  RankList,
  AgencyBadge,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { TimeseriesOption } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
const Bar = dynamic(() => import("datagovmy-ui/charts/bar"), { ssr: false });
const BarMeter = dynamic(() => import("datagovmy-ui/charts/bar-meter"), { ssr: false });
const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });

interface BloodDonationDashboardProps {
  last_updated: string;
  params: { state: string };
  timeseries: any;
  barchart_age: any;
  barchart_time: any;
  barchart_variables: any;
  choropleth: any;
}

const BloodDonationDashboard: FunctionComponent<BloodDonationDashboardProps> = ({
  last_updated,
  params,
  timeseries,
  barchart_age,
  barchart_time,
  barchart_variables,
  choropleth,
}) => {
  const { t, i18n } = useTranslation(["dashboard-blood-donation", "common"]);
  const { theme = "light" } = useTheme();
  const { data, setData } = useData({
    minmax: [timeseries.data.daily.x.length - 182, timeseries.data.daily.x.length - 1],
    period: "auto",
    periodly: "daily_7d",
    tab1_index: 0,
    tab3_index: 0,
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

  const KEY_VARIABLES_SCHEMA = [
    {
      name: t("yesterday"),
      data: barchart_variables.data.yesterday,
    },
    {
      name: t("month"),
      data: barchart_variables.data.past_month,
    },
    {
      name: t("year"),
      data: barchart_variables.data.past_year,
    },
  ];

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.healthcare"), "text-danger"]}
        header={[t("header")]}
        description={[t("description"), "text-dim"]}
        action={<StateDropdown url={routes.BLOOD_DONATION} currentState={params.state} />}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="pdn" />}
      />
      <Container className="min-h-screen">
        {/* What are the latest blood donation trends in Malaysia? */}
        <Section
          title={t("timeseries_header", {
            state: CountryAndStates[params.state],
          })}
          description={t("timeseries_desc")}
          date={timeseries.date_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  id="timeseries-daily-donation"
                  className="h-[300px]"
                  title={t("timeseries_title", {
                    state: CountryAndStates[params.state],
                    context: data.periodly,
                  })}
                  enableAnimation={!play}
                  interval={data.period}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.y,
                        label: t(`common:time.${data.periodly}`),
                        borderColor: AKSARA_COLOR.DANGER,
                        borderWidth: 1.5,
                        backgroundColor: AKSARA_COLOR.DANGER_H,
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
                      current={data.tab1_index}
                      onChange={index => {
                        setData("tab1_index", index);
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
                  value={data.minmax}
                  period={data.period}
                  data={timeseries.data[data.periodly].x}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>

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
                  id="blood-donation-by-state"
                  title={t("common:common.rank_count", { count: choropleth.data.x.length })}
                  data={choropleth.data.y.perc}
                  color="text-danger"
                  threshold={choropleth.data.x.length}
                  format={(position: number) => {
                    return {
                      label: CountryAndStates[choropleth.data.x[position]],
                      value: `${numFormat(choropleth.data.y.perc[position], "compact", [1, 1])}%`,
                    };
                  }}
                />
              </div>
            }
            right={
              <Choropleth
                id="choropleth-donor-rate"
                className="h-[400px] w-auto rounded-b lg:h-[500px] lg:w-full"
                color="reds"
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

        {/* A breakdown of donations by key variables */}
        <Section
          title={t("barmeter_header", {
            state: CountryAndStates[params.state],
          })}
          menu={
            <Tabs.List
              options={KEY_VARIABLES_SCHEMA.map(item => item.name)}
              current={data.tab3_index}
              onChange={index => setData("tab3_index", index)}
            />
          }
          date={t(barchart_variables.date_as_of)}
        >
          <Tabs hidden current={data.tab3_index}>
            {KEY_VARIABLES_SCHEMA.map(({ name, data }) => {
              return (
                <Panel key={name} name={name}>
                  <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-3">
                    <div className="lg:self-stretch">
                      <BarMeter
                        title={t("barmeter1_title")}
                        className="col-span-2"
                        data={data.blood_group}
                        layout="horizontal"
                        unit="%"
                        sort="desc"
                      />
                    </div>
                    <div className="grid gap-12 lg:col-span-2 lg:grid-cols-2">
                      <BarMeter
                        title={t("barmeter2_title")}
                        className="flex-col"
                        data={data.donation_type}
                        layout="horizontal"
                        unit="%"
                        sort="desc"
                      />
                      <BarMeter
                        title={t("barmeter3_title")}
                        className="flex-col"
                        data={data.location}
                        layout="horizontal"
                        unit="%"
                        sort="desc"
                      />
                      <BarMeter
                        title={t("barmeter4_title")}
                        className="flex-col"
                        data={data.donation_regularity}
                        layout="horizontal"
                        unit="%"
                        sort="desc"
                      />
                      <BarMeter
                        title={t("barmeter5_title")}
                        className="flex-col"
                        data={data.social_group}
                        layout="horizontal"
                        unit="%"
                        sort="desc"
                      />
                    </div>
                  </div>
                </Panel>
              );
            })}
          </Tabs>
        </Section>

        {/* How strong is new donor recruitment in Malaysia? */}
        <Section
          title={t("bar1_header", {
            state: CountryAndStates[params.state],
          })}
          description={t("bar1_description")}
          date={barchart_time.date_as_of}
        >
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs title={t("bar1_title")}>
                <Panel name={t("annual")}>
                  <Bar
                    id="bar-newdonor-total-annual"
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.annual.x,
                      datasets: [
                        {
                          label: `${t("bar1_tooltip1")}`,
                          data: barchart_time.data.annual.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor: theme === "light" ? "#18181B" : "#FFFFFF",
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("common:time.monthly")}>
                  <Bar
                    id="bar-newdonor-total-monthly"
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.monthly.x,
                      datasets: [
                        {
                          label: `${t("bar1_tooltip1")}`,
                          data: barchart_time.data.monthly.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor: theme === "light" ? "#18181B" : "#FFFFFF",
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
                    id="bar-newdonor-age-annual"
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_year.x,
                      datasets: [
                        {
                          label: t("bar2_tooltip1"),
                          data: barchart_age.data.past_year.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor: theme === "light" ? "#18181B" : "#FFFFFF",
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("month")}>
                  <Bar
                    id="bar-newdonor-age-monthly"
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_month.x,
                      datasets: [
                        {
                          label: t("bar2_tooltip1"),
                          data: barchart_age.data.past_month.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor: theme === "light" ? "#18181B" : "#FFFFFF",
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

export default BloodDonationDashboard;
