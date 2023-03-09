import { FunctionComponent, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "@hooks/useTranslation";
import {
  Container,
  Dropdown,
  Hero,
  Panel,
  Section,
  Tabs,
  Tooltip,
  StateDropdown,
} from "@components/index";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import Slider, { SliderRef } from "@components/Chart/Slider";
import { useRouter } from "next/router";
import { useWatch } from "@hooks/useWatch";
import BarMeter from "@components/Chart/BarMeter";
import { CountryAndStates } from "@lib/constants";
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });

interface BloodDonationDashboardProps {
  last_updated: number;
  timeseries_all: any;
  timeseries_bloodstock: any;
  timeseries_facility: any;
  heatmap_bloodstock: any;
  heatmap_donorrate: any;
  heatmap_retention: any;
  barchart_age: any;
  barchart_time: any;
  barchart_variables: any;
  map_facility: any;
  choropleth_malaysia_blood_donation: any;
}

const BloodDonationDashboard: FunctionComponent<BloodDonationDashboardProps> = ({
  last_updated,
  timeseries_all,
  timeseries_bloodstock,
  timeseries_facility,
  heatmap_bloodstock,
  heatmap_donorrate,
  heatmap_retention,
  barchart_age,
  barchart_time,
  barchart_variables,
  map_facility,
  choropleth_malaysia_blood_donation,
}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-blood-donation"]);

  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";

  const sliderRef = useRef<SliderRef>(null);
  const { data, setData } = useData({
    absolute_donation_type: false,
    absolute_blood_group: false,
    absolute_donor_type: false,
    absolute_location: false,
    zoom_state: currentState === "mys" ? undefined : currentState,
    zoom_facility: undefined,
    minmax: [timeseries_all.data.x.length - 182, timeseries_all.data.x.length - 1],
  });

  const filterTimeline = () => {
    return {
      x: timeseries_all.data.x.slice(data.minmax[0], data.minmax[1] + 1),
      daily: timeseries_all.data.daily.slice(data.minmax[0], data.minmax[1] + 1),
      line_daily: timeseries_all.data.line_daily.slice(data.minmax[0], data.minmax[1] + 1),
    };
  };
  const filtered_timeline = useCallback(filterTimeline, [data.minmax, timeseries_all]);

  useWatch(() => {
    sliderRef.current && sliderRef.current.reset();
  }, [timeseries_all.data]);

  const KEY_VARIABLES_SCHEMA = [
    {
      name: t("dashboard-blood-donation:yesterday"),
      data: barchart_variables.data.yesterday,
    },
    {
      name: t("dashboard-blood-donation:month"),
      data: barchart_variables.data.past_month,
    },
    {
      name: t("dashboard-blood-donation:year"),
      data: barchart_variables.data.past_year,
    },
  ];

  return (
    <>
      <Hero
        background="bg-gradient-radial from-white to-primary/10 dark:from-outlineHover-dark dark:to-black"
        category={[t("nav.megamenu.categories.healthcare"), "text-red-400"]}
        header={[t("dashboard-blood-donation:header")]}
        description={[t("dashboard-blood-donation:description"), "dark:text-white"]}
        last_updated={last_updated}
      />

      <Container className="min-h-screen">
        {/* What are the latest blood donation trends in Malaysia? */}
        <Section
          title={t("dashboard-blood-donation:section_1.title")}
          description={t("dashboard-blood-donation:section_1.description")}
          date={timeseries_all.date_as_of}
        >
          <Timeseries
            className="h-[350px] w-full"
            title={t("dashboard-blood-donation:combine_title")}
            state={currentState}
            interval="month"
            stats={null}
            data={{
              labels: filtered_timeline().x,
              datasets: [
                {
                  type: "line",
                  data: filterTimeline().line_daily,
                  label: t("dashboard-blood-donation:combine_tooltip1"),
                  borderColor: "#FF0000",
                  borderWidth: 1.5,
                },
              ],
            }}
          />
          <div className="pt-5">
            <Slider
              ref={sliderRef}
              type="range"
              value={data.minmax}
              data={timeseries_all.data.x}
              period="year"
              onChange={e => setData("minmax", e)}
            />
          </div>
        </Section>

        {/* TODO: New component - Card with choropleth*/}
        <Section></Section>

        {/* A breakdown of donations by key variables */}
        <Section
          title={t("dashboard-blood-donation:section_3.title")}
          description={t("dashboard-blood-donation:barmeter_description")}
          date={t(barchart_variables.date_as_of)}
        >
          <Tabs className="pb-4">
            {KEY_VARIABLES_SCHEMA.map(({ name, data }) => {
              return (
                <Panel key={name} name={name}>
                  <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-3">
                    <BarMeter
                      title={t("dashboard-blood-donation:barmeter1_title")}
                      className="flex-col"
                      state={currentState}
                      data={data.blood_group}
                      layout="horizontal"
                      unit="%"
                      sort="desc"
                    />
                    <BarMeter
                      title={t("dashboard-blood-donation:barmeter2_title")}
                      className="flex-col"
                      state={currentState}
                      data={data.donation_type}
                      layout="horizontal"
                      unit="%"
                      sort="desc"
                    />
                    <BarMeter
                      title={t("dashboard-blood-donation:barmeter3_title")}
                      className="flex-col"
                      state={currentState}
                      data={data.location}
                      layout="horizontal"
                      unit="%"
                      sort="desc"
                    />
                    <BarMeter
                      title={t("dashboard-blood-donation:barmeter4_title")}
                      className="flex-col"
                      state={currentState}
                      data={data.donation_regularity}
                      layout="horizontal"
                      unit="%"
                      sort="desc"
                    />
                    <BarMeter
                      title={t("dashboard-blood-donation:barmeter5_title")}
                      className="flex-col"
                      state={currentState}
                      data={data.social_group}
                      layout="horizontal"
                      unit="%"
                      sort="desc"
                    />
                  </div>
                </Panel>
              );
            })}
          </Tabs>
        </Section>

        {/* How strong is new donor recruitment in Malaysia? */}
        <Section
          title={t("dashboard-blood-donation:section_4.title")}
          description={t("dashboard-blood-donation:section_4.description")}
          date={barchart_time.date_as_of}
        >
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs title={t("dashboard-blood-donation:bar1_title")} state={currentState}>
                <Panel name={t("dashboard-blood-donation:annual")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.annual.x,
                      datasets: [
                        {
                          label: `${t("dashboard-blood-donation:bar1_tooltip1")}`,
                          data: barchart_time.data.annual.y,
                          backgroundColor: "#FF0000",
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />{" "}
                </Panel>
                <Panel name={t("dashboard-blood-donation:monthly")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.monthly.x,
                      datasets: [
                        {
                          label: `${t("dashboard-blood-donation:bar1_tooltip1")}`,
                          data: barchart_time.data.monthly.y,
                          backgroundColor: "#FF0000",
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs title={t("dashboard-blood-donation:bar2_title")} state={currentState}>
                {/* //menu={<MenuDropdown />} */}
                <Panel name={t("dashboard-blood-donation:year")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_year.x,
                      datasets: [
                        {
                          label: `${t("dashboard-blood-donation:bar2_tooltip1")}`,
                          data: barchart_age.data.past_year.y,
                          backgroundColor: "#FF0000",
                          borderWidth: 0,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("dashboard-blood-donation:month")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_month.x,
                      datasets: [
                        {
                          label: `${t("dashboard-blood-donation:bar2_tooltip1")}`,
                          data: barchart_age.data.past_month.y,
                          backgroundColor: "#FF0000",
                          borderWidth: 0,
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

        {/* How is this data collected? */}
        <Section
          title={t("dashboard-blood-donation:section_5.title")}
          description={t("dashboard-blood-donation:section_5.description")}
        ></Section>
      </Container>
    </>
  );
};

export default BloodDonationDashboard;
