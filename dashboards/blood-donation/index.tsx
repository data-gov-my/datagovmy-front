import { FunctionComponent, useCallback, useEffect, useRef } from "react";
import { useTranslation } from "@hooks/useTranslation";
import {
  Container,
  Dropdown,
  Hero,
  Panel,
  Section,
  Tabs,
  StateDropdown,
  Button,
} from "@components/index";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import Slider, { SliderRef } from "@components/Chart/Slider";
import { useRouter } from "next/router";
import { useWatch } from "@hooks/useWatch";
import BarMeter from "@components/Chart/BarMeter";
import { AKSARA_COLOR, BREAKPOINTS, CountryAndStates } from "@lib/constants";
import { routes } from "@lib/routes";
import LeftRightCard from "@components/LeftRightCard";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { ArrowPathIcon, MapPinIcon } from "@heroicons/react/24/solid";

const Empty = dynamic(() => import("@components/Chart/Empty"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const OSMapWrapper = dynamic(() => import("@components/OSMapWrapper"), { ssr: false });

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
  const { t } = useTranslation(["common", "dashboard-blood-donation"]);

  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
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
    tabs_section_3: 0,
  });

  const filterTimeline = () => {
    return {
      x: timeseries_all.data.x.slice(data.minmax[0], data.minmax[1] + 1),
      daily: timeseries_all.data.daily.slice(data.minmax[0], data.minmax[1] + 1),
      line_daily: timeseries_all.data.line_daily.slice(data.minmax[0], data.minmax[1] + 1),
    };
  };
  const filtered_timeline = useCallback(filterTimeline, [data.minmax, timeseries_all]);

  const handleClearSelection = () => {
    setData("zoom_state", undefined);
    setData("zoom_facility", undefined);
  };

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

  const description = (
    <>
      <p className={"text-dim"}>{t("dashboard-blood-donation:title_description")}</p>
      <div className="pt-6">
        <StateDropdown
          url={routes.BLOOD_DONATION}
          currentState={currentState}
          exclude={["pjy", "pls", "lbn", "kvy"]}
        />
      </div>
    </>
  );

  const section2left = (
    <Section
      title={t("dashboard-blood-donation:choro_header")}
      date={last_updated}
      className="gap-6 p-8"
    >
      <p className="text-dim">{t("dashboard-blood-donation:choro_description")}</p>
    </Section>
  );

  const section2right = (
    <div>
      <Choropleth
        className={(isMobile ? "h-[400px] w-auto" : "h-[500px] w-full").concat(" rounded-b")}
        enableScale={false}
        // colorScale="CHOROPLETH_BLUE_SCALE"
        colorScale="reds"
        borderColor="#000"
        borderWidth={0.5}
        data={choropleth_malaysia_blood_donation.data.map((item: any) => ({
          id: CountryAndStates[item.state],
          state: CountryAndStates[item.state],
          value: item.data.perc === null ? -1 : item.data.perc,
        }))}
        unitY="%"
        graphChoice="state"
      />
    </div>
  );

  const section5left = (
    <div className="grid gap-12 p-8">
      <div className="w-full space-y-3">
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-row items-center gap-4">
            <MapPinIcon className="h-5 w-auto text-dim" />
            <h4>{t("common.zoom")}</h4>
          </div>
          <Button
            onClick={handleClearSelection}
            disabled={!data.zoom_state}
            icon={<ArrowPathIcon className="h-4 w-4" />}
          >
            {t("common.clear_selection")}
          </Button>
        </div>
        <StateDropdown
          currentState={data.zoom_state}
          onChange={selected => {
            setData("zoom_facility", undefined);
            setData("zoom_state", selected.value);
          }}
          exclude={["kvy", "lbn", "pls", "pjy", "mys"]}
          width="w-full"
        />
        <Dropdown
          placeholder={t("placeholder.facility")}
          onChange={item => setData("zoom_facility", item)}
          selected={data.zoom_facility}
          disabled={!data.zoom_state}
          options={
            data.zoom_state !== undefined
              ? Object.keys(map_facility.data[data.zoom_state]).map((facility, index) => {
                  return {
                    label: facility,
                    value: index,
                  };
                })
              : []
          }
          width="w-full"
        />
        {timeseries_facility.data?.[data.zoom_state]?.[data.zoom_facility?.label] ? (
          <div className="w-full pt-4">
            <Timeseries
              className="h-[300px] w-full pt-4"
              title={t("dashboard-blood-donation:bar3_title")}
              state={
                <p className="pt-4 text-sm text-dim">
                  {t("common.data_for", {
                    state: `${data.zoom_facility?.label}, ${CountryAndStates[data.zoom_state]}`,
                  })}
                </p>
              }
              //menu={<MenuDropdown />}
              data={{
                labels: timeseries_facility.data[data.zoom_state!][data.zoom_facility.label].x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("dashboard-blood-donation:bar3_tooltips1")}`,
                    data: timeseries_facility.data[data.zoom_state!][data.zoom_facility.label].line,
                    borderWidth: 1.5,
                    fill: true,
                    backgroundColor: AKSARA_COLOR.DANGER_H,
                    borderColor: AKSARA_COLOR.DANGER,
                  },
                ],
              }}
              enableGridX={false}
            />
          </div>
        ) : (
          <Empty
            title={t("dashboard-blood-donation:bar3_title")}
            type="timeseries"
            className="h-[300px] w-full pt-7"
            placeholder={t("placeholder.facility")}
          />
        )}
      </div>
    </div>
  );

  const section5right = (
    <>
      {data.zoom_facility && data.zoom_state ? (
        <OSMapWrapper
          className="h-full w-full rounded-r"
          zoom={data.zoom_facility ? 8 : 5}
          position={
            data.zoom_facility && data.zoom_state
              ? [
                  map_facility.data[data.zoom_state][data.zoom_facility.label].lat,
                  map_facility.data[data.zoom_state][data.zoom_facility.label].lon,
                ]
              : undefined
          }
          markers={
            data.zoom_facility && data.zoom_state
              ? [
                  {
                    name: `${data.zoom_facility.label}, ${CountryAndStates[data.zoom_state]}`,
                    position: [
                      map_facility.data[data.zoom_state][data.zoom_facility.label].lat,
                      map_facility.data[data.zoom_state][data.zoom_facility.label].lon,
                    ],
                  },
                ]
              : []
          }
        />
      ) : isMobile ? (
        <img
          src="/static/images/osm_placeholder_mobile.png"
          className="w-full rounded-r-xl object-cover"
          loading="lazy"
          alt="Map view of the selected area"
        />
      ) : (
        <img
          src="/static/images/osm_placeholder_long.png"
          className="w-full rounded-r-xl object-cover"
          loading="lazy"
          alt="Map view of the selected area"
        />
      )}
    </>
  );

  return (
    <>
      <Hero
        background="bg-gradient-radial from-white to-primary/10 dark:from-outlineHover-dark dark:to-black"
        category={[t("nav.megamenu.categories.healthcare"), "text-danger"]}
        header={[t("dashboard-blood-donation:title_header")]}
        description={description}
        last_updated={last_updated}
      />

      <Container className="min-h-screen">
        {/* What are the latest blood donation trends in Malaysia? */}
        <Section
          title={t("dashboard-blood-donation:combine_header", {
            state: CountryAndStates[currentState],
          })}
          description={t("dashboard-blood-donation:combine_description")}
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
                  borderColor: AKSARA_COLOR.DANGER,
                  borderWidth: 1.5,
                  backgroundColor: AKSARA_COLOR.DANGER_H,
                  fill: true,
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

        <Section>
          <LeftRightCard left={section2left} right={section2right}></LeftRightCard>
        </Section>

        {/* A breakdown of donations by key variables */}
        <Section
          title={t("dashboard-blood-donation:barmeter_header")}
          description={t("dashboard-blood-donation:barmeter_description", {
            state: CountryAndStates[currentState],
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
          <Tabs
            hidden
            current={data.tabs_section_3}
            onChange={index => setData("tabs_section_2", index)}
          >
            {KEY_VARIABLES_SCHEMA.map(({ name, data }) => {
              return (
                <Panel key={name} name={name}>
                  <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-3">
                    <div className="lg:self-stretch">
                      <BarMeter
                        title={t("dashboard-blood-donation:barmeter1_title")}
                        className="col-span-2"
                        state={currentState}
                        data={data.blood_group}
                        layout="horizontal"
                        unit="%"
                        sort="desc"
                      />
                    </div>
                    <div className="grid gap-12 lg:col-span-2 lg:grid-cols-2">
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
                  </div>
                </Panel>
              );
            })}
          </Tabs>
        </Section>

        {/* How strong is new donor recruitment in Malaysia? */}
        <Section
          title={t("dashboard-blood-donation:bar1_header", {
            state: CountryAndStates[currentState],
          })}
          description={t("dashboard-blood-donation:bar1_description")}
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
          title={t("dashboard-blood-donation:map_header")}
          description={t("dashboard-blood-donation:map_description")}
          className="py-12"
        >
          <LeftRightCard left={section5left} right={section5right} />
        </Section>
      </Container>
    </>
  );
};

export default BloodDonationDashboard;
