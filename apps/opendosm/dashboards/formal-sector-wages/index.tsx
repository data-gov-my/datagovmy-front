import { WorkerIcon } from "@icons/division";
import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR, MALAYSIA, STATES } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Formal Sector Wages Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
const Bar = dynamic(() => import("datagovmy-ui/charts/bar"), { ssr: false });

interface BarChartData {
  x: Array<number>;
  y: Array<number>;
}

const TimeseriesData = ["x", "salary"];

interface FormalSectorWagesProp {
  last_updated: string;
  timeseries: WithData<Record<string, Record<(typeof TimeseriesData)[number], number[]>>>;
  timeseries_callout: WithData<Record<string, Record<(typeof TimeseriesData)[number], number>>>;
  bar_bracket: WithData<Record<string, BarChartData>>;
  bar_percentile: WithData<Record<string, BarChartData>>;
}

const FormalSectorWages: FunctionComponent<FormalSectorWagesProp> = ({
  timeseries,
  timeseries_callout,
  last_updated,
  bar_bracket,
  bar_percentile,
}) => {
  const { t, i18n } = useTranslation(["dashboard-formal-sector-wages", "agencies", "common"]);
  const { theme } = useTheme();

  const barBracketDates = Object.keys(bar_bracket.data);
  const barBracketItem = Object.values(bar_bracket.data);
  const barPercentileItem = Object.values(bar_percentile.data);

  const STATES_OPTION: Array<OptionType> = [MALAYSIA, ...STATES].map(state => ({
    label: state.name,
    value: state.key,
  }));

  const { data, setData } = useData({
    minmax: [0, timeseries.data[STATES_OPTION[0].value]?.x.length - 1],
    state: STATES_OPTION[0].value,
    barChart_index: barBracketDates.length - 1,
  });
  const LATEST_TIMESTAMP = timeseries.data[data.state].x[timeseries.data[data.state].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.state], data.minmax);

  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.labour_markets"), "text-purple"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:mbls.full")} icon={<WorkerIcon />} isDivision />
        }
      />

      <Container className="min-h-screen">
        <Section title={t("section_barchart.title")} date={bar_bracket.data_as_of}>
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <Bar
              className="h-[550px]"
              title={t("keys.bar_bracket_title")}
              layout="horizontal"
              reverse={true}
              data={{
                labels: barBracketItem[data.barChart_index].x,
                datasets: [
                  {
                    label: t("keys.bracket"),
                    data: barBracketItem[data.barChart_index].y,
                    barThickness: 25,
                    borderWidth: 0.5,
                    borderColor: theme === "light" ? AKSARA_COLOR.PURPLE : AKSARA_COLOR.BLACK,
                    backgroundColor:
                      theme === "light" ? AKSARA_COLOR.PURPLE_H : AKSARA_COLOR.PURPLE,
                    hoverBackgroundColor:
                      theme === "light" ? AKSARA_COLOR.PURPLE : AKSARA_COLOR.PURPLE_H,
                  },
                ],
              }}
              enableGridX={true}
              enableGridY={false}
            />

            <Bar
              className="h-[550px]"
              title={t("keys.bar_percentile_title")}
              layout="horizontal"
              prefixY="RM "
              data={{
                labels: barPercentileItem[data.barChart_index]?.x,
                datasets: [
                  {
                    label: t("keys.percentile"),
                    data: barPercentileItem[data.barChart_index]?.y,
                    barThickness: 25,
                    borderWidth: 0.5,
                    borderColor: theme === "light" ? AKSARA_COLOR.PURPLE : AKSARA_COLOR.BLACK,
                    backgroundColor:
                      theme === "light" ? AKSARA_COLOR.PURPLE_H : AKSARA_COLOR.PURPLE,
                    hoverBackgroundColor:
                      theme === "light" ? AKSARA_COLOR.PURPLE : AKSARA_COLOR.PURPLE_H,
                  },
                ],
              }}
              enableGridX={true}
              enableGridY={false}
            />
          </div>
          <Slider
            type="single"
            value={data.barChart_index}
            data={barBracketDates}
            period="month"
            onChange={e => setData("barChart_index", e)}
          />
        </Section>

        <Section
          title={t("section_timeseries.title", {
            state: STATES_OPTION.find(option => option.value === data.state).label,
          })}
          description={
            <div className="mt-2 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                <Dropdown
                  anchor="left"
                  selected={STATES_OPTION.find(option => option.value === data.state)}
                  options={STATES_OPTION}
                  onChange={e => setData("state", e.value)}
                />
              </div>
            </div>
          }
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  enableAnimation={!play}
                  className="h-[350px] w-full"
                  title={t(`keys.state_median_salary`, {
                    state: STATES_OPTION.find(option => option.value === data.state).label,
                  })}
                  interval="month"
                  displayNumFormat={value => {
                    return [
                      "RM",
                      numFormat(Math.abs(value), "standard", 0, "short", i18n.language, true),
                    ].join("");
                  }}
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
                        data: coordinate.salary,
                        label: t("keys.timeseries_label", {
                          state: STATES_OPTION.find(option => option.value === data.state).label,
                        }),
                        fill: true,
                        backgroundColor: AKSARA_COLOR.PURPLE_H,
                        borderColor: AKSARA_COLOR.PURPLE,
                        borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:common.latest", {
                        date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                      }),
                      value: `RM ${numFormat(
                        Math.abs(timeseries_callout.data[data.state].salary),
                        "standard",
                        0,
                        "short",
                        i18n.language,
                        false
                      )} ${t("keys.per_month")}`,
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period={"month"}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[data.state].x}
                />
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default FormalSectorWages;
