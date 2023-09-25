import { PeopleIcon } from "@icons/division";
import { routes } from "@lib/routes";
import {
  AgencyBadge,
  Container,
  Hero,
  Section,
  Slider,
  StateDropdown,
  Tabs,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, MALAYSIA, STATES } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Population of Malaysia Dashboard
 * @overview Status: Live
 */

interface TimeseriesChartData {
  title: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
  prefix: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

type PopulationTimeseriesData = "x" | "population";

type VitalStatsTimeseriesData =
  | "x"
  | "births_live"
  | "births_still"
  | "deaths"
  | "deaths_infant"
  | "deaths_maternal"
  | "deaths_neonatal"
  | "deaths_perinatal"
  | "deaths_toddler"
  | "deaths_under_five"
  | "fertility"
  | "natural_increase";

interface PopulationTimeseriesOptions {
  absolute: Record<PopulationTimeseriesData, number[]>;
  growth_yoy: Record<PopulationTimeseriesData, number[]>;
}
interface VitalStatsTimeseriesOptions {
  absolute: Record<VitalStatsTimeseriesData, number[]>;
  growth_yoy: Record<VitalStatsTimeseriesData, number[]>;
}
interface PopulationTimeseriesOptionsCallout {
  absolute: Record<"population", number>;
  growth_yoy: Record<"population", number>;
}
interface VitalStatsTimeseriesOptionsCallout {
  absolute: Record<VitalStatsTimeseriesData, { latest: number }>;
  rate: Record<VitalStatsTimeseriesData, { latest: number }>;
}

interface PopulationDashboardProp {
  last_updated: string;
  params: { state: string };
  population_timeseries: WithData<PopulationTimeseriesOptions>;
  vitalstats_timeseries: WithData<VitalStatsTimeseriesOptions>;
  vitalstats_timeseries_callout: WithData<VitalStatsTimeseriesOptionsCallout>;
  population_timeseries_callout: WithData<PopulationTimeseriesOptionsCallout>;
}

const PopulationDashboard: FunctionComponent<PopulationDashboardProp> = ({
  population_timeseries,
  vitalstats_timeseries,
  population_timeseries_callout,
  vitalstats_timeseries_callout,
  last_updated,
  params,
}) => {
  const { t, i18n } = useTranslation(["dashboard-population", "agencies", "common"]);

  const population_tabs: { [key: number]: "absolute" | "growth_yoy" } = {
    0: "absolute",
    1: "growth_yoy",
  };
  const vitalstats_tabs: { [key: number]: "absolute" | "rate" } = {
    0: "absolute",
    1: "rate",
  };

  const STATES_OPTION: Array<OptionType> = [MALAYSIA, ...STATES].map(state => ({
    label: state.name,
    value: state.key,
  }));

  const { data, setData } = useData({
    population_minmax: [0, population_timeseries.data.absolute.x.length - 1],
    population_tab_index: 0,
    population_tab: population_tabs[0],
    vitalstats_minmax: [0, vitalstats_timeseries.data.absolute.x.length - 1],
    vitalstats_tab_index: 0,
    vitalstats_tab: vitalstats_tabs[0],
  });

  const LATEST_TIMESTAMP =
    population_timeseries.data[data.population_tab].x[
      population_timeseries.data[data.population_tab].x.length - 1
    ];
  const VITALSTATS_LATEST_TIMESTAMP =
    vitalstats_timeseries.data[data.vitalstats_tab].x[
      vitalstats_timeseries.data[data.vitalstats_tab].x.length - 1
    ];

  const { coordinate } = useSlice(
    population_timeseries.data[data.population_tab],
    data.population_minmax
  );
  const { coordinate: vitalstats_coordinate } = useSlice(
    vitalstats_timeseries.data[data.vitalstats_tab],
    data.vitalstats_minmax
  );

  const getRateGrowthText = (chartName: Exclude<VitalStatsTimeseriesData, "x">) => {
    switch (chartName) {
      case "births_live":
      case "deaths":
      case "natural_increase":
      case "fertility":
        return "keys.perKPopulation";

      case "births_still":
      case "deaths_perinatal":
        return "keys.perKBirths";

      case "deaths_neonatal":
      case "deaths_infant":
      case "deaths_maternal":
        return "keys.perKLiveBirths";

      case "deaths_toddler":
        return "keys.perKPopulationToddler";

      default:
        return "";
    }
  };

  const plotTimeseries = (charts: Exclude<VitalStatsTimeseriesData, "x">[], play: boolean) => {
    return charts.map(name => {
      const {
        title,
        prefix,
        label,
        data: datum,
        fill,
        stats,
      }: TimeseriesChartData = {
        title: t(`keys.${name}`),
        prefix: "",
        label: t(`keys.${name}`),
        data: vitalstats_coordinate[name],
        fill: true,
        stats: [
          {
            title: t("common:common.latest", {
              date: toDate(VITALSTATS_LATEST_TIMESTAMP, "yyyy", i18n.language),
            }),
            value: `${numFormat(
              Math.abs(vitalstats_timeseries_callout.data.absolute[name].latest),
              "standard",
              0,
              "long",
              i18n.language,
              true
            )}`,
          },
          {
            title: `${t("keys.rate_growth")} (${t(getRateGrowthText(name))})`,
            value: `${numFormat(
              Math.abs(vitalstats_timeseries_callout.data.rate[name].latest),
              "standard",
              1,
              "long",
              i18n.language,
              false
            )}`,
          },
        ],
      };
      if (data.vitalstats_tab === "absolute" && name === "fertility") {
        return null;
      }
      return (
        <Timeseries
          key={title}
          title={title}
          className="h-[350px] w-full"
          interval="year"
          enableAnimation={!play}
          displayNumFormat={value => {
            return [numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true)].join("");
          }}
          tooltipCallback={item =>
            [
              item.dataset.label + ": ",
              data.vitalstats_tab_index === 0
                ? numFormat(item.parsed.y, "standard", 0, "short", i18n.language)
                : numFormat(item.parsed.y, "standard", 1, "short", i18n.language, false),
            ].join("")
          }
          axisY={{
            y2: {
              display: false,
              grid: {
                drawTicks: false,
                drawBorder: false,
                lineWidth: 0.5,
              },
              ticks: {
                display: false,
              },
            },
          }}
          data={{
            labels: vitalstats_coordinate.x,
            datasets: [
              {
                type: "line",
                label: label,
                data: datum,
                backgroundColor:
                  name === "fertility"
                    ? AKSARA_COLOR.DANGER_H
                    : ["births_live", "natural_increase"].includes(name)
                    ? AKSARA_COLOR.PRIMARY_H
                    : AKSARA_COLOR.DIM_H,
                borderColor:
                  name === "fertility"
                    ? AKSARA_COLOR.DANGER
                    : ["births_live", "natural_increase"].includes(name)
                    ? AKSARA_COLOR.PRIMARY
                    : AKSARA_COLOR.DIM,
                fill: fill,
                borderWidth: 1.5,
              },
            ],
          }}
          stats={name === "fertility" ? stats.filter((el, idx) => idx !== 0) : stats}
        />
      );
    });
  };

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.demography"), "text-primary"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        action={<StateDropdown url={routes.POPULATION} currentState={params.state} />}
        agencyBadge={
          <AgencyBadge name={t("division:bppd.full")} icon={<PeopleIcon />} isDivision />
        }
      />
      <Container className="min-h-screen">
        <Section
          title={t("section_population.title", {
            state: STATES_OPTION.find(option => option.value === params.state).label,
          })}
          description={t("section_population.description")}
          date={population_timeseries.data_as_of}
          menu={
            <Tabs.List
              options={[t("keys.population"), t("keys.growth")]}
              current={data.population_tab_index}
              onChange={index => {
                setData("population_tab_index", index);
                setData("population_tab", population_tabs[index]);
              }}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  enableAnimation={!play}
                  className="h-[350px] w-full"
                  interval="year"
                  displayNumFormat={value => {
                    const isPercentage = ["growth_yoy"].includes(data.population_tab);
                    return [
                      value < 0 ? "-" : "",
                      numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
                      isPercentage ? "%" : "",
                    ].join("");
                  }}
                  tooltipCallback={item =>
                    [
                      item.dataset.label + ": ",
                      item.parsed.y < 0 ? "-" : "",
                      numFormat(
                        Math.abs(item.parsed.y),
                        "compact",
                        1,
                        "long",
                        i18n.language,
                        false
                      ),
                      ["growth_yoy"].includes(data.population_tab) ? "%" : "",
                    ].join("")
                  }
                  axisY={{
                    y2: {
                      display: false,
                      grid: {
                        drawTicks: false,
                        drawBorder: false,
                        lineWidth: 0.5,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  }}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.population,
                        label: t("keys.population"),
                        fill: true,
                        backgroundColor: AKSARA_COLOR.PRIMARY_H,
                        borderColor: AKSARA_COLOR.PRIMARY,
                        borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("keys.total_population", {
                        date: toDate(LATEST_TIMESTAMP, "yyyy", i18n.language),
                      }),
                      value: `${numFormat(
                        Math.abs(population_timeseries_callout.data.absolute.population),
                        "compact",
                        1,
                        "long",
                        i18n.language,
                        false
                      )}`,
                    },
                    {
                      title: t("keys.population_growth", {
                        date: toDate(LATEST_TIMESTAMP, "yyyy", i18n.language),
                      }),
                      value: `${numFormat(
                        Math.abs(population_timeseries_callout.data.growth_yoy.population),
                        "standard",
                        1,
                        "long",
                        i18n.language,
                        false
                      )}%`,
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period={"year"}
                  value={data.population_minmax}
                  onChange={e => setData("population_minmax", e)}
                  data={population_timeseries.data[data.population_tab].x}
                />
              </>
            )}
          </SliderProvider>
          <Section
            title={t("section_vitalstats.title", {
              state: STATES_OPTION.find(option => option.value === params.state).label,
            })}
            description={t("section_vitalstats.description")}
            date={vitalstats_timeseries.data_as_of}
            menu={
              <Tabs.List
                options={[t("keys.actual_growth"), t("keys.rates")]}
                current={data.vitalstats_tab_index}
                onChange={index => {
                  setData("vitalstats_tab_index", index);
                  setData("vitalstats_tab", vitalstats_tabs[index]);
                }}
              />
            }
          >
            <SliderProvider>
              {play => (
                <>
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {plotTimeseries(
                      [
                        "births_live",
                        "deaths",
                        "natural_increase",
                        "births_still",
                        "deaths_perinatal",
                        "deaths_neonatal",
                        "deaths_infant",
                        "deaths_toddler",
                        "deaths_maternal",
                        "fertility",
                      ],
                      play
                    )}
                  </div>
                  <Slider
                    type="range"
                    period={"year"}
                    value={data.vitalstats_minmax}
                    onChange={e => setData("vitalstats_minmax", e)}
                    data={vitalstats_timeseries.data[data.vitalstats_tab].x}
                  />
                </>
              )}
            </SliderProvider>
          </Section>
        </Section>
      </Container>
    </>
  );
};

export default PopulationDashboard;
