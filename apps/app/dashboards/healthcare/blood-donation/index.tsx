import AgencyBadge from "@components/Badge/agency";
import BarMeter from "@components/Chart/BarMeter";
import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { PDNIcon } from "@components/Icon/agency";
import { Container, Panel, Section, StateDropdown, Tabs, Hero } from "@components/index";
import LeftRightCard from "@components/LeftRightCard";
import RankList from "@components/LeftRightCard/partials/RankList";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { numFormat, toDate } from "@lib/helpers";
import { routes } from "@lib/routes";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });

interface BloodDonationDashboardProps {
  last_updated: string;
  params: { state: string };
  timeseries_all: any;
  barchart_age: any;
  barchart_time: any;
  barchart_variables: any;
  choropleth: any;
}

const BloodDonationDashboard: FunctionComponent<BloodDonationDashboardProps> = ({
  last_updated,
  params,
  timeseries_all,
  barchart_age,
  barchart_time,
  barchart_variables,
  choropleth,
}) => {
  const { t, i18n } = useTranslation(["dashboard-blood-donation", "common"]);
  const { data, setData } = useData({
    absolute_donation_type: false,
    absolute_blood_group: false,
    absolute_donor_type: false,
    absolute_location: false,
    zoom_state: params.state === "mys" ? undefined : params.state,
    zoom_facility: undefined,
    minmax: [timeseries_all.data.x.length - 182, timeseries_all.data.x.length - 1],
    tabs_section_3: 0,
  });

  const { coordinate } = useSlice(timeseries_all.data, data.minmax);
  const { theme } = useTheme();

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
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:pdn.full")}
            link="https://pdn.gov.my/v2/"
            icon={<PDNIcon />}
          />
        }
      />
      <Container className="min-h-screen">
        {/* What are the latest blood donation trends in Malaysia? */}
        <Section
          title={t("combine_header", {
            state: CountryAndStates[params.state],
          })}
          description={t("combine_description")}
          date={timeseries_all.date_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  id="timeseries-daily-donation"
                  className="h-[350px] w-full"
                  title={t("combine_title", {
                    state: CountryAndStates[params.state],
                  })}
                  enableAnimation={!play}
                  interval="day"
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.line_daily,
                        label: t("combine_tooltip1"),
                        borderColor: AKSARA_COLOR.DANGER,
                        borderWidth: 1.5,
                        backgroundColor: AKSARA_COLOR.DANGER_H,
                        fill: true,
                      },
                    ],
                  }}
                />
                <Slider
                  type="range"
                  value={data.minmax}
                  data={timeseries_all.data.x}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>

        <Section>
          <LeftRightCard
            left={
              <div className="flex h-full w-full flex-col space-y-6 p-8">
                <div className="flex flex-col gap-2">
                  <h4>{t("choro_header")}</h4>
                  <span className="text-dim text-sm">
                    {t("common:common.data_of", {
                      date: toDate(choropleth.data_as_of, "dd MMM yyyy HH:mm", i18n.language),
                    })}
                  </span>
                </div>
                <div className="flex grow flex-col justify-between space-y-6">
                  <p className="text-dim">{t("choro_description")}</p>
                  <RankList
                    id="blood-donation-by-state"
                    title={t("choro_ranking")}
                    data={choropleth.data.y.perc}
                    color="text-danger"
                    threshold={3}
                    format={(position: number) => {
                      return {
                        label: CountryAndStates[choropleth.data.x[position]],
                        value: `${numFormat(choropleth.data.y.perc[position], "compact", [1, 1])}%`,
                      };
                    }}
                  />
                </div>
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
              current={data.tabs_section_3}
              onChange={index => setData("tabs_section_3", index)}
            />
          }
          date={t(barchart_variables.date_as_of)}
        >
          <Tabs hidden current={data.tabs_section_3}>
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
                <Panel name={t("monthly")}>
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
                          label: `${t("bar2_tooltip1")}`,
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
                          label: `${t("bar2_tooltip1")}`,
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
