import AgencyBadge from "@components/AgencyBadge";
import { Dropdown, Hero, Panel, Section, StateDropdown, Tabs, Tooltip } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent, ReactNode } from "react";
import Container from "@components/Container";
import { MOHIcon } from "@components/Icon/agency";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import Slider from "@components/Chart/Slider";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { OptionType } from "@components/types";
import { numFormat } from "@lib/helpers";

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
  const { t } = useTranslation(["common", "dashboard-covid-vaccination"]);
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";

  const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
  const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });
  const Waffle = dynamic(() => import("@components/Chart/Waffle"), { ssr: false });

  const AGE_OPTIONS: Array<OptionType> = ["total", "child", "adolescent", "adult", "elderly"].map(
    (key: string) => ({
      label: t(`dashboard-covid-vaccination:${key}`),
      value: key,
    })
  );
  const DOSE_OPTIONS: Array<OptionType> = ["dose1", "dose2", "booster1", "booster2"].map(
    (key: string) => ({
      label: t(`dashboard-covid-vaccination:${key}`),
      value: key,
    })
  );

  const { data, setData } = useData({
    vax_tab: 0,
    filter_age: AGE_OPTIONS[0],
    filter_dose: DOSE_OPTIONS[0],
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
                {numFormat(waffle.data[data.filter_age.value].dose1.perc, "standard", 1)}%
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
                {numFormat(waffle.data[data.filter_age.value].dose2.perc, "standard", 1)}%
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
        <span className="pl-1">
          {numFormat(waffle.data[data.filter_age.value].booster1.perc, "standard", 1)}%
        </span>
      ),
    },
    {
      doseType: "booster2",
      color: "#135523",
      dosePerc: (
        <span className="pl-1">
          {numFormat(waffle.data[data.filter_age.value].booster2.perc, "standard", 1)}%
        </span>
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
          date={waffle.data_as_of}
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            {data.vax_tab === 0 ? (
              <Dropdown
                anchor="left"
                width="w-fit"
                options={AGE_OPTIONS}
                selected={AGE_OPTIONS.find(age => age.value === data.filter_age.value)}
                onChange={e => setData("filter_age", e)}
              />
            ) : (
              <Dropdown
                anchor="left"
                width="w-fit"
                options={DOSE_OPTIONS}
                selected={DOSE_OPTIONS.find(dose => dose.value === data.filter_dose.value)}
                onChange={e => setData("filter_dose", e)}
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
                layout="vertical"
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
                      value: `+${numFormat(statistics.data[statistic_key].latest, "standard")}`,
                    },
                    {
                      title: t("dashboard-covid-vaccination:total"),
                      value: `${numFormat(statistics.data[statistic_key].total, "standard")}`,
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
