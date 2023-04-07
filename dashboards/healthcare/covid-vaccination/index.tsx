import AgencyBadge from "@components/AgencyBadge";
import { Dropdown, Hero, Panel, Section, StateDropdown, Tabs, Tooltip } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, ReactNode, useRef } from "react";
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
import { useSlice } from "@hooks/useSlice";

/**
 * COVID Vaccination Dashboard
 * @overview Status: In-development
 */

interface COVIDVaccinationProps {
  lastUpdated: number;
  timeseries: Record<string, any>;
  statistics: Record<string, any>;
  barmeter: Record<string, any>;
  waffle: Record<string, any>;
}

const COVIDVaccination: FunctionComponent<COVIDVaccinationProps> = ({
  lastUpdated,
  timeseries,
  statistics,
  barmeter,
  waffle,
}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-covid-vaccination"]);
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const sliderRef = useRef<SliderRef>(null);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;

  const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
  const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });
  const Waffle = dynamic(() => import("@components/Chart/Waffle"), { ssr: false });

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
    minmax: [0, timeseries.data.x.length - 1],
  });

  const { coordinate } = useSlice(timeseries.data, data.minmax);

  const WAFFLE_LIST: { doseType: string; color: string; dosePerc: ReactNode }[] = [
    {
      doseType: "dose1",
      color: "#9FE8B1",
      dosePerc: (
        <Tooltip tip={<span>{t("dashboard-covid-vaccination:tooltips_dose1")}</span>}>
          {open => (
            <>
              <p
                className="pl-1 underline decoration-dashed underline-offset-4"
                onClick={() => open()}
              >
                {`${(waffle.data[data.filter_age.value].dose1.perc as number).toFixed(1)}%`}
              </p>
            </>
          )}
        </Tooltip>
      ),
    },
    {
      doseType: "dose2",
      color: "#31C752",
      dosePerc: (
        <Tooltip tip={<span>{t("dashboard-covid-vaccination:tooltips_dose2")}</span>}>
          {open => (
            <>
              <p
                className="pl-1 underline decoration-dashed underline-offset-4"
                onClick={() => open()}
              >
                {`${(waffle.data[data.filter_age.value].dose2.perc as number).toFixed(1)}%`}
              </p>
            </>
          )}
        </Tooltip>
      ),
    },
    {
      doseType: "booster1",
      color: "#228F3A",
      dosePerc: (
        <span className="pl-1">{`${(
          waffle.data[data.filter_age.value].booster1.perc as number
        ).toFixed(1)}%`}</span>
      ),
    },
    {
      doseType: "booster2",
      color: "#135523",
      dosePerc: (
        <span className="pl-1">{`${(
          waffle.data[data.filter_age.value].booster2.perc as number
        ).toFixed(1)}%`}</span>
      ),
    },
  ];

  const TIMESERIES_LIST: string[] = ["primary", "booster", "booster2", "adult", "adol", "child"];

  return (
    <>
      <Hero
        background="green"
        category={[t("nav.megamenu.categories.healthcare"), "text-green-600"]}
        header={[t("dashboard-covid-vaccination:header")]}
        description={
          <>
            <p className={"text-dim xl:w-2/3"}>{t("dashboard-covid-vaccination:description")}</p>
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
            icon={<MOHIcon fillColor="#16A34A" />} // green-600
          />
        }
      />
      <Container className="min-h-screen">
        {/* How vaccinated against COVID-19 are we? */}
        <Section
          title={t("dashboard-covid-vaccination:waffle_header", {
            state: CountryAndStates[currentState],
          })}
          date={lastUpdated}
        >
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
              options={[
                t("dashboard-covid-vaccination:filter_age"),
                t("dashboard-covid-vaccination:filter_dose"),
              ]}
              current={data.vax_tab}
              onChange={i => setData("vax_tab", i)}
            />
          </div>

          <Tabs hidden current={data.vax_tab} onChange={i => setData("vax_tab", i)}>
            <Panel
              name={t("dashboard-covid-vaccination:filter_age")}
              key={t("dashboard-covid-vaccination:filter_age")}
            >
              <div className="grid grid-cols-2 gap-x-2 gap-y-10 py-5 lg:grid-cols-4 lg:gap-6">
                {WAFFLE_LIST.map(({ doseType, dosePerc, color }) => (
                  <Waffle
                    className="aspect-square w-full lg:h-[250px] lg:w-auto"
                    title={
                      <div className="flex self-center text-base font-bold">
                        {t(`dashboard-covid-vaccination:${doseType}`).concat(` - `)}
                        {dosePerc}
                      </div>
                    }
                    color={color}
                    data={waffle.data[data.filter_age.value][doseType].data}
                  >
                    <div className="text-dim">
                      <p>
                        {`${t("dashboard-covid-vaccination:total")} - `}
                        <span className="font-medium">
                          {(
                            waffle.data[data.filter_age.value][doseType].total as number
                          ).toLocaleString()}
                        </span>
                      </p>
                      <p>
                        {`${t("dashboard-covid-vaccination:daily")} - `}
                        <span className="font-medium">
                          {waffle.data[data.filter_age.value][doseType].daily}
                        </span>
                      </p>
                    </div>
                  </Waffle>
                ))}
              </div>
            </Panel>
            <Panel
              name={t("dashboard-covid-vaccination:filter_dose")}
              key={t("dashboard-covid-vaccination:filter_dose")}
            >
              <BarMeter
                className="col-span-2"
                data={barmeter.data[data.filter_dose.value]}
                unit="%"
                layout={isMobile ? "horizontal" : "vertical"}
              />
            </Panel>
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
              labels: coordinate.x,
              datasets: [
                {
                  type: "line",
                  data: coordinate.line_stacked,
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
            value={data.minmax}
            data={timeseries.data.x}
            onChange={e => setData("minmax", e)}
          />
        </Section>

        {/*  How are COVID-19 key indicators trending */}
        <Section
          title={t("dashboard-covid-vaccination:area_chart_header", {
            state: CountryAndStates[currentState],
          })}
          date={timeseries.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            {TIMESERIES_LIST.map((item: string, i: number) => {
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
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate[y_key],
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
