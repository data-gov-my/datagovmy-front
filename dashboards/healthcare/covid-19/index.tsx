import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  AgencyBadge,
  Container,
  Hero,
  Panel,
  Section,
  StateDropdown,
  Tabs,
  Tooltip,
} from "@components/index";
import { MOHIcon } from "@components/Icon/agency";
import DonutMeter from "@components/Chart/DonutMeter";
import Slider from "@components/Chart/Slider";
import Stages from "@components/Chart/Stages";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { routes } from "@lib/routes";
import { CountryAndStates } from "@lib/constants";

/**
 * COVID19 Dashboard
 * @overview Status: In-development
 */

const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface COVID19Props {
  last_updated: number;
  snapshot_bar: any;
  snapshot_graphic: any;
  timeseries_admitted: any;
  timeseries_cases: any;
  timeseries_deaths: any;
  timeseries_icu: any;
  timeseries_tests: any;
  timeseries_vents: any;
  util_chart: any;
  statistics: any;
}

const COVID19: FunctionComponent<COVID19Props> = ({
  last_updated,
  snapshot_bar,
  snapshot_graphic,
  timeseries_admitted,
  timeseries_cases,
  timeseries_deaths,
  timeseries_icu,
  timeseries_tests,
  timeseries_vents,
  util_chart,
  statistics,
}) => {
  const router = useRouter();
  const currentState = (router.query.state as string) ?? "mys";
  const { t, i18n } = useTranslation(["common", "dashboard-covid-19"]);

  const filterCaseDeath = [
    { label: "Cases", value: "cases" },
    { label: "Deaths", value: "deaths" },
  ];

  const { data, setData } = useData({
    show_indicator: {
      label: t(`dashboard-covid-19:opt_${filterCaseDeath[0].value}`),
      value: filterCaseDeath[0].value,
    },
    filter_death: 0,
    filter_state: 0,
    filter_cases: 0,
    minmax: [timeseries_deaths.data.x.length - 365, timeseries_deaths.data.x.length - 1],
  });

  const { coordinate: admitted_coordinate } = useSlice(timeseries_admitted.data, data.minmax);
  const { coordinate: cases_coordinate } = useSlice(timeseries_cases.data, data.minmax);
  const { coordinate: deaths_coordinate } = useSlice(timeseries_deaths.data, data.minmax);
  const { coordinate: icu_coordinate } = useSlice(timeseries_icu.data, data.minmax);
  const { coordinate: tests_coordinate } = useSlice(timeseries_tests.data, data.minmax);
  const { coordinate: vents_coordinate } = useSlice(timeseries_vents.data, data.minmax);

  const BarTabsMenu = [
    {
      name: t("dashboard-covid-19:tab_table2"),
      title: t("dashboard-covid-19:tab_table2") + " per 100K",
      data: snapshot_bar.data.deaths,
    },
    {
      name: "Vent.",
      title: t("dashboard-covid-19:utilisation_of", { param: "Vent." }).concat(" (%)"),
      data: snapshot_bar.data.util_vent,
      unit: "%",
    },
    {
      name: "ICU",
      title: t("dashboard-covid-19:utilisation_of", { param: "ICU" }).concat(" (%)"),
      data: snapshot_bar.data.util_icu,
      unit: "%",
    },
    {
      name: "Hosp.",
      title: t("dashboard-covid-19:utilisation_of", { param: "Hosp." }).concat(" (%)"),
      data: snapshot_bar.data.util_hosp,
      unit: "%",
    },
    {
      name: t("dashboard-covid-19:tab_table4"),
      title: t("dashboard-covid-19:tab_table4") + " per 100K",
      data: snapshot_bar.data.cases,
    },
  ];

  return (
    <>
      <Hero
        background="red"
        category={[t("nav.megamenu.categories.healthcare"), "text-danger"]}
        header={[t("dashboard-covid-19:header")]}
        description={
          <>
            <p className={"text-dim"}>{t("dashboard-covid-19:description")}</p>
            <div className="pt-3">
              <StateDropdown url={routes.COVID_19} currentState={currentState} />
            </div>
          </>
        }
        agencyBadge={
          <AgencyBadge
            agency={"Ministry of Health (MoH)"}
            link="https://www.moh.gov.my"
            icon={<MOHIcon />}
          />
        }
        last_updated={last_updated}
      />

      <Container className="min-h-screen">
        {/* Utilisations */}
        <Section title={t("dashboard-covid-19:donut_header")} date={util_chart.data_as_of}>
          <div className="grid grid-cols-2 gap-12 pt-6 lg:grid-cols-4">
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.data.util_vent} />
              <div>
                <p className="text-dim">{t("dashboard-covid-19:donut1")}</p>
                <Tooltip tip={t("dashboard-covid-19:donut1_tooltips")}>
                  {open => (
                    <span
                      className="text-2xl font-medium underline decoration-dashed underline-offset-4"
                      onClick={() => open()}
                    >
                      {+util_chart.data.util_vent.toFixed(1)}%
                    </span>
                  )}
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.data.util_icu} />
              <div>
                <p className="text-dim">{t("dashboard-covid-19:donut2")}</p>
                <Tooltip tip={t("dashboard-covid-19:donut2_tooltips")}>
                  {open => (
                    <span
                      className="text-2xl font-medium underline decoration-dashed underline-offset-4"
                      onClick={() => open()}
                    >
                      {+util_chart.data.util_icu.toFixed(1)}%
                    </span>
                  )}
                </Tooltip>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DonutMeter value={util_chart.data.util_hosp} />
              <div>
                <p className="text-dim">{t("dashboard-covid-19:donut3")}</p>
                <Tooltip tip={t("dashboard-covid-19:donut3_tooltips")}>
                  {open => (
                    <span
                      className="text-2xl font-medium underline decoration-dashed underline-offset-4"
                      onClick={() => open()}
                    >
                      {+util_chart.data.util_hosp.toFixed(1)}%
                    </span>
                  )}
                </Tooltip>
              </div>
            </div>
            {util_chart.data.util_pkrc ? (
              <div className="flex items-center gap-3">
                <DonutMeter value={util_chart.data.util_pkrc} />
                <div>
                  <p className="text-dim">{t("dashboard-covid-19:donut4")}</p>
                  <Tooltip tip={t("dashboard-covid-19:donut4_tooltips")}>
                    {open => (
                      <span
                        className="text-2xl font-medium underline decoration-dashed underline-offset-4"
                        onClick={() => open()}
                      >
                        {util_chart.data.util_pkrc && +util_chart.data.util_pkrc}%
                      </span>
                    )}
                  </Tooltip>
                </div>
              </div>
            ) : undefined}
          </div>
        </Section>

        {/* What does the latest data show? */}
        <Section
          title={t("dashboard-covid-19:diagram_header", { state: CountryAndStates[currentState] })}
          date={snapshot_graphic.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <div className="col-span-2">
              <Stages
                title={t("dashboard-covid-19:diagram_subheader", {
                  state: CountryAndStates[currentState],
                })}
                className="h-full pt-4"
                data={{
                  header: {
                    name: `${t("dashboard-covid-19:diagram_title")}`,
                    value: snapshot_graphic.data.cases_active,
                    delta: snapshot_graphic.data.cases_active_annot,
                    inverse: true,
                  },
                  col_1: [
                    {
                      name: `${t("dashboard-covid-19:col1_title1")}`,
                      value: snapshot_graphic.data.cases_local,
                      delta: snapshot_graphic.data.cases_local_annot,
                      inverse: true,
                      icon: (
                        <Image
                          src="/static/images/stages/virus.svg"
                          height={32}
                          width={32}
                          alt="Local Cases"
                        />
                      ),
                    },
                    {
                      name: `${t("dashboard-covid-19:col1_title2")}`,
                      value: snapshot_graphic.data.cases_import,
                      delta: snapshot_graphic.data.cases_import_annot,
                      inverse: true,
                    },
                  ],
                  col_2: [
                    {
                      name: `${t("dashboard-covid-19:col2_title1")}`,
                      value: snapshot_graphic.data.home,
                      delta: snapshot_graphic.data.home_annot.toFixed(1),
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/home-quarantine.svg"
                          height={32}
                          width={32}
                          alt="Home Quarantine"
                        />
                      ),
                    },
                    {
                      name: `${t("dashboard-covid-19:col2_title2")}`,
                      value: snapshot_graphic.data.pkrc,
                      delta: snapshot_graphic.data.pkrc_annot,
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/pkrc.svg"
                          height={32}
                          width={32}
                          alt="PKRC"
                        />
                      ),
                    },
                    {
                      name: `${t("dashboard-covid-19:col2_title3")}`,
                      value: snapshot_graphic.data.hosp,
                      delta: snapshot_graphic.data.hosp_annot.toFixed(1),
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/hospitalised.svg"
                          height={32}
                          width={32}
                          alt="Hospitalised"
                        />
                      ),
                    },
                    {
                      name: `${t("dashboard-covid-19:col2_title4")}`,
                      value: snapshot_graphic.data.icu,
                      delta: snapshot_graphic.data.icu_annot.toFixed(1),
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/icu-unventilated.svg"
                          height={32}
                          width={32}
                          alt="ICU (Unventilated)"
                        />
                      ),
                    },
                    {
                      name: `${t("dashboard-covid-19:col2_title5")}`,
                      value: snapshot_graphic.data.vent,
                      delta: snapshot_graphic.data.vent_annot.toFixed(1),
                      unit: "%",
                      icon: (
                        <Image
                          src="/static/images/stages/icu-ventilated.svg"
                          height={32}
                          width={32}
                          alt="ICU (Ventilated)"
                        />
                      ),
                    },
                  ],
                  col_3: [
                    {
                      name: `${t("dashboard-covid-19:col3_title1")}`,
                      value: snapshot_graphic.data.cases_recovered,
                      delta: snapshot_graphic.data.cases_recovered_annot.toFixed(0),
                      icon: (
                        <Image
                          src="/static/images/stages/recovered.svg"
                          height={32}
                          width={32}
                          alt="Recovered"
                        />
                      ),
                    },
                    {
                      name: `${t("dashboard-covid-19:col3_title2")}`,
                      value: snapshot_graphic.data.deaths,
                      delta: snapshot_graphic.data.deaths_annot,
                      inverse: true,
                      icon: (
                        <Image
                          src="/static/images/stages/death.svg"
                          height={32}
                          width={32}
                          alt="Deaths (Including BID)"
                        />
                      ),
                    },
                    {
                      name: `${t("dashboard-covid-19:col3_title3")}`,
                      value: snapshot_graphic.data.deaths_bid,
                      delta: snapshot_graphic.data.deaths_bid_annot,
                      inverse: true,
                    },
                  ],
                }}
              />
            </div>
            <div className="col-span-2 xl:col-span-1">
              <Tabs
                title={BarTabsMenu[data.filter_state].title}
                className="w-full"
                onChange={value => setData("filter_state", value)}
              >
                {BarTabsMenu.map(({ name, data, unit }, index) => {
                  return (
                    <Panel key={index} name={name}>
                      <BarMeter
                        className="block w-full space-y-2 pt-4"
                        data={data}
                        layout="state-horizontal"
                        relative
                        sort="desc"
                        unit={unit}
                      />
                    </Panel>
                  );
                })}
              </Tabs>
            </div>
          </div>
        </Section>

        {/* How are COVID-19 key indicators trending */}
        <Section
          title={t("dashboard-covid-19:area_chart_header", {
            state: CountryAndStates[currentState],
          })}
          date={timeseries_deaths.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
            <Timeseries
              className="h-[250px] w-full"
              title={t("dashboard-covid-19:area_chart_title1")}
              stats={[
                {
                  title: t("dashboard-covid-19:deaths.annot1"),
                  value: statistics.data.deaths.annot1.toLocaleString(),
                },
                {
                  title: t("dashboard-covid-19:deaths.annot2"),
                  value: statistics.data.deaths.annot2.toLocaleString(),
                },
              ]}
              data={{
                labels: deaths_coordinate.x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("dashboard-covid-19:area_chart_tooltip1")}`,
                    pointRadius: 0,
                    data: deaths_coordinate.line,
                    borderColor: "#2563EB",
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("dashboard-covid-19:area_chart_tooltip2")}`,
                    data: deaths_coordinate.deaths_inpatient,
                    backgroundColor: "#6BABFA",
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: `${t("dashboard-covid-19:area_chart_tooltip3")}`,
                    data: deaths_coordinate.deaths_brought_in,
                    backgroundColor: "#2563EB4D",
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("dashboard-covid-19:area_chart_title2")}
              stats={[
                {
                  title: t("dashboard-covid-19:vent.annot1"),
                  value: statistics.data.vent.annot1.toLocaleString(),
                },
                {
                  title: t("dashboard-covid-19:vent.annot2"),
                  value: Number(statistics.data.vent.annot2)
                    .toFixed(1)
                    .toLocaleString()
                    .concat("%"),
                },
              ]}
              data={{
                labels: vents_coordinate.x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("dashboard-covid-19:area_chart2_tooltip1")}`,
                    pointRadius: 0,
                    data: vents_coordinate.line,
                    borderColor: "#2563EB",
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("dashboard-covid-19:area_chart2_tooltip2")}`,
                    data: vents_coordinate.vent,
                    backgroundColor: "#2563EB4D",
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("dashboard-covid-19:area_chart_title3")}
              stats={[
                {
                  title: t("dashboard-covid-19:icu.annot1"),
                  value: statistics.data.icu.annot1.toLocaleString(),
                },
                {
                  title: t("dashboard-covid-19:icu.annot2"),
                  value: Number(statistics.data.icu.annot2).toFixed(1).toLocaleString().concat("%"),
                },
              ]}
              data={{
                labels: icu_coordinate.x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("dashboard-covid-19:area_chart3_tooltip1")}`,
                    pointRadius: 0,
                    data: icu_coordinate.line,
                    borderColor: "#2563EB",
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("dashboard-covid-19:area_chart3_tooltip2")}`,
                    data: icu_coordinate.icu,
                    backgroundColor: "#2563EB4D",
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("dashboard-covid-19:area_chart_title4")}
              stats={[
                {
                  title: t("dashboard-covid-19:admitted.annot1"),
                  value: statistics.data.admitted.annot1.toLocaleString(),
                },
                {
                  title: t("dashboard-covid-19:admitted.annot2"),
                  value: Number(statistics.data.admitted.annot2)
                    .toFixed(1)
                    .toLocaleString()
                    .concat("%"),
                },
              ]}
              data={{
                labels: admitted_coordinate.x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("dashboard-covid-19:area_chart4_tooltip1")}`,
                    pointRadius: 0,
                    data: admitted_coordinate.line,
                    borderColor: "#2563EB",
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("dashboard-covid-19:area_chart4_tooltip2")}`,
                    data: admitted_coordinate.admitted,
                    backgroundColor: "#2563EB4D",
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("dashboard-covid-19:area_chart_title5")}
              stats={[
                {
                  title: t("dashboard-covid-19:cases.annot1"),
                  value: statistics.data.cases.annot1.toLocaleString(),
                },
                {
                  title: t("dashboard-covid-19:cases.annot2"),
                  value: statistics.data.cases.annot2.toLocaleString(),
                },
              ]}
              data={{
                labels: cases_coordinate.x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("dashboard-covid-19:area_chart5_tooltip1")}`,
                    pointRadius: 0,
                    data: cases_coordinate.line,
                    borderColor: "#2563EB",
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: `${t("dashboard-covid-19:area_chart5_tooltip2")}`,
                    data: cases_coordinate.cases,
                    backgroundColor: "#2563EB4D",
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
            <Timeseries
              className="h-[250px] w-full"
              title={t("dashboard-covid-19:area_chart_title6")}
              stats={[
                {
                  title: t("dashboard-covid-19:tests.annot1"),
                  value: statistics.data.tests.annot1.toLocaleString(),
                },
                {
                  title: t("dashboard-covid-19:tests.annot2"),
                  value: Number(statistics.data.tests.annot2)
                    .toFixed(1)
                    .toLocaleString()
                    .concat("%"),
                },
              ]}
              enableRightScale
              data={{
                labels: tests_coordinate.x,
                datasets: [
                  {
                    type: "line",
                    label: `${t("dashboard-covid-19:area_chart6_tooltip1")}`,
                    pointRadius: 0,
                    borderColor: "#2563EB",
                    data: tests_coordinate.tooltip,
                    borderWidth: 1.5,
                    yAxisID: "y1",
                    spanGaps: true,
                  },
                  {
                    type: "bar",
                    label: `${t("dashboard-covid-19:area_chart6_tooltip2")}`,
                    data: tests_coordinate.tests_rtk,
                    backgroundColor: "#6BABFA",
                    stack: "same",
                  },
                  {
                    type: "bar",
                    label: `${t("dashboard-covid-19:area_chart6_tooltip3")}`,
                    data: tests_coordinate.tests_pcr,
                    backgroundColor: "#2563EB4D",
                    stack: "same",
                  },
                ],
              }}
              enableGridX={false}
            />
          </div>
          <div>
            <Slider
              className="pt-7"
              type="range"
              data={timeseries_deaths.data.x}
              value={data.minmax}
              onChange={e => setData("minmax", e)}
            />
            <span className="text-sm text-dim">{t("common.slider")}</span>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default COVID19;
