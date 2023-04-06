import AgencyBadge from "@components/AgencyBadge";
import { Dropdown, Hero, Section, StateDropdown, Tabs } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, useRef } from "react";
import Container from "@components/Container";
import { MOHIcon } from "@components/Icon/agency";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AKSARA_COLOR, BREAKPOINTS, CountryAndStates } from "@lib/constants";
import Slider, { SliderRef } from "@components/Chart/Slider";
import { useData } from "@hooks/useData";
import { filterAgeOptions, filterDoseOptions } from "@lib/options";
import { useWindowWidth } from "@hooks/useWindowWidth";

/**
 * COVID Vaccination Dashboard
 * @overview Status: In-development
 */

interface COVIDVaccinationProps {
  lastUpdated: number;
  timeseries: Record<string, any>;
  statistics: Record<string, any>;
  barmeter: Record<string, any>;
}

const COVIDVaccination: FunctionComponent<COVIDVaccinationProps> = ({
  lastUpdated,
  timeseries,
  statistics,
  barmeter,
}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-covid-vaccination"]);
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const sliderRef = useRef<SliderRef>(null);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;

  const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
  const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });

  const { data, setData } = useData({
    vax_tab: 0,
    filter_dose: {
      label: t(`dashboard-covid-vaccination:${filterDoseOptions[0].value}`),
      value: filterDoseOptions[0].value,
    },
    filter_age: {
      label: t(`dashboard-covid-vaccination:${filterAgeOptions[0].value}`),
      value: filterAgeOptions[0].value,
    },
  });

  const section3_timeseries: string[] = [
    "primary",
    "booster",
    "booster2",
    "adult",
    "adol",
    "child",
  ];

  console.log(data);
  return (
    <>
      <Hero
        background="red"
        category={[t("nav.megamenu.categories.healthcare"), "text-danger"]}
        header={[t("dashboard-covid-vaccination:header")]}
        description={
          <>
            <p className={"text-dim"}>{t("dashboard-covid-vaccination:description")}</p>
            <div className="pt-6">
              <StateDropdown url={routes.COVID_VACCINATION} currentState={currentState} />
            </div>
          </>
        }
        last_updated={lastUpdated}
        agencyBadge={
          <AgencyBadge
            agency={"Ministry of Health (MoH)"}
            link="https://www.moh.gov.my"
            icon={<MOHIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen">
        {/* How vaccinated against COVID-19 are we? */}
        <Section title={t("dashboard-covid-vaccination:waffle_header")} date={lastUpdated}>
          <div className="flex flex-col justify-between gap-4 md:flex-row">
            {data.vax_tab === 0 ? (
              <Dropdown
                placeholder="Select"
                onChange={item => setData("filter_age", item)}
                selected={data.filter_age}
                options={filterAgeOptions.map(option => {
                  return {
                    label: t(`dashboard-covid-vaccination:${option.value}`),
                    value: option.value,
                  };
                })}
              />
            ) : (
              <Dropdown
                placeholder="Select"
                onChange={item => setData("filter_dose", item)}
                selected={data.filter_dose}
                options={filterDoseOptions.map(option => {
                  return {
                    label: t(`dashboard-covid-vaccination:${option.value}`),
                    value: option.value,
                  };
                })}
              />
            )}
            <Tabs.List
              options={["Age group", "Dose"]}
              current={data.vax_tab}
              onChange={i => setData("vax_tab", i)}
            />
          </div>

          <Tabs hidden current={data.vax_tab} onChange={i => setData("vax_tab", i)}>
            <Tabs.Panel name={"panel1"} key={0}>
              <BarMeter
                className="col-span-2"
                data={barmeter.data[data.filter_dose.value]}
                unit="%"
                layout={isMobile ? "horizontal" : "vertical"}
              />
            </Tabs.Panel>
          </Tabs>
        </Section>

        {/* What is the current state of the COVID-19 vaccination program? */}
        <Section
          title={t("dashboard-covid-vaccination:combine_header")}
          date={timeseries.data_as_of}
        >
          <Timeseries
            title={t("dashboard-covid-vaccination:combine_title", {
              state: CountryAndStates[currentState],
            })}
            interval="auto"
            data={{
              labels: timeseries.data.x,
              datasets: [
                {
                  type: "line",
                  data: timeseries.data.line_stacked,
                  label: t("dashboard-covid-vaccination:combine_tooltip1"),
                  borderColor: AKSARA_COLOR.GREEN,
                  borderWidth: 1.5,
                  backgroundColor: AKSARA_COLOR.GREEN_H,
                  fill: true,
                },
              ],
            }}
          />
          <Slider
            className="pt-5"
            ref={sliderRef}
            type="range"
            value={timeseries.data.x}
            data={timeseries.data.x}
            period="year"
            onChange={e => {}}
          />
        </Section>

        {/*  How are COVID-19 key indicators trending */}
        <Section
          title={t("dashboard-covid-vaccination:area_chart_header")}
          date={timeseries.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            {section3_timeseries.map((item: string, i: number) => {
              const title: string = `area_chart_title${i + 1}`;
              const y_key: string = `line_${item}`;
              const statistic_key: string = `daily_${item}`;
              return (
                <Timeseries
                  className="h-[250px]"
                  title={t(`dashboard-covid-vaccination:${title}`)}
                  enableGridX={false}
                  precision={0}
                  data={{
                    labels: timeseries.data.x,
                    datasets: [
                      {
                        type: "line",
                        data: timeseries.data[y_key],
                        label: t("dashboard-covid-vaccination:combine_tooltip1"),
                        borderColor: AKSARA_COLOR.GREEN,
                        borderWidth: 1.5,
                        backgroundColor: AKSARA_COLOR.GREEN_H,
                        fill: true,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("dashboard-covid-vaccination:daily"),
                      value: `+${statistics.data[statistic_key].latest.toLocaleString()}`,
                    },
                    {
                      title: t("dashboard-covid-vaccination:total"),
                      value: `${statistics.data[statistic_key].total.toLocaleString()}`,
                    },
                  ]}
                />
              );
            })}
          </div>
        </Section>
      </Container>
    </>
  );
};

export default COVIDVaccination;
