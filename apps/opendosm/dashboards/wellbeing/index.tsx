import { FunctionComponent } from "react";
import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  Markdown,
  Section,
  Slider,
  Tooltip,
} from "datagovmy-ui/components";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { SocietyIcon } from "@icons/division";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

/**
 * Wellbeing Dashboard
 * @overview Status: Live
 */

export interface TimeseriesChartData {
  title: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
  prefix: string;
}

export const TIMESERIESDATA = [
  "x",
  "overall",
  "economy",
  "economy_transport",
  "economy_comms",
  "economy_educ",
  "economy_income",
  "economy_work",
  "social",
  "social_housing",
  "social_entertainment",
  "social_safety",
  "social_participation",
  "social_governance",
  "social_culture",
  "social_health",
  "social_environment",
  "social_family",
] as const;

export const TIMESERIESTYPE = ["growth_yoy", "index"] as const;

export type TimeseriesData = (typeof TIMESERIESDATA)[number];
export type TimeseriesType = (typeof TIMESERIESTYPE)[number];

export type TimeseriesOptions = Record<TimeseriesData, number[]>;

interface WellbeingProps {
  last_updated: string;
  timeseries: WithData<Record<TimeseriesType, TimeseriesOptions>>;
  timeseries_callout: WithData<Record<TimeseriesData, Record<TimeseriesType, number>>>;
}

const Wellbeing: FunctionComponent<WellbeingProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-wellbeing"]);

  const OPTIONS: Array<OptionType> = TIMESERIESTYPE.map(type => ({
    label: t(`keys.${type}`),
    value: type,
  }));

  const { data, setData } = useData({
    minmax: [0, timeseries.data.index.x.length - 1],
    options: OPTIONS[0].value,
  });

  const options = data.options as TimeseriesType;
  const { coordinate } = useSlice(timeseries.data[options], data.minmax);

  const LATEST_TIMESTAMP = timeseries.data[options].x[timeseries.data[options].x.length - 1];

  const plotTimeseries = (
    charts: Exclude<TimeseriesData, "x" | "overall" | "economy" | "social">[],
    play: boolean
  ) => {
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
        data: coordinate[name],
        fill: true,
        stats: [
          {
            title: t("common:common.latest", {
              date: toDate(LATEST_TIMESTAMP, `yyyy`, i18n.language),
            }),
            value: `${timeseries_callout.data[name].index}`,
          },
          {
            title: t(`keys.growth_yoy`),
            value: `${numFormat(
              Math.abs(timeseries_callout.data[name].growth_yoy),
              "compact",
              1,
              "long",
              i18n.language,
              false
            )}%`,
          },
        ],
      };
      return (
        <Timeseries
          key={title}
          title={
            <div className="flex items-center gap-2">
              <h5>{title}</h5>
              <Tooltip
                tip={
                  <Markdown className="markdown" data-testid="catalogue-methodology">
                    {t(`tooltip.${name}`)}
                  </Markdown>
                }
              />
            </div>
          }
          className="h-[350px] w-full"
          interval="year"
          beginZero={false}
          unitY={options === "index" ? "" : "%"}
          enableAnimation={!play}
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
                label: label,
                data: datum,
                backgroundColor: AKSARA_COLOR.PRIMARY_H,
                borderColor: AKSARA_COLOR.PRIMARY,
                fill: fill,
                borderWidth: 1.5,
              },
            ],
          }}
          stats={stats}
        />
      );
    });
  };
  const plotMainTimeseries = (
    chart: Extract<TimeseriesData, "overall" | "economy" | "social">,
    play: boolean
  ) => {
    const {
      title,
      prefix,
      label,
      data: datum,
      fill,
      stats,
    }: TimeseriesChartData = {
      title: t(`keys.${chart}`),
      prefix: "",
      label: t(`keys.${chart}`),
      data: coordinate[chart],
      fill: true,
      stats: [
        {
          title: t("common:common.latest", {
            date: toDate(LATEST_TIMESTAMP, `yyyy`, i18n.language),
          }),
          value: `${timeseries_callout.data[chart].index}`,
        },
        {
          title: t(`keys.growth_yoy`),
          value: `${numFormat(
            Math.abs(timeseries_callout.data[chart].growth_yoy),
            "compact",
            1,
            "long",
            i18n.language,
            false
          )}%`,
        },
      ],
    };
    return (
      <Timeseries
        title={
          <div className="flex items-center gap-2">
            <h5>{title}</h5>
            <Tooltip
              tip={
                <Markdown className="markdown" data-testid="catalogue-methodology">
                  {t(`tooltip.${chart}`)}
                </Markdown>
              }
            />
          </div>
        }
        className="h-[350px] w-full"
        interval="year"
        unitY={options === "index" ? "" : "%"}
        enableAnimation={!play}
        beginZero={false}
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
              label: label,
              data: datum,
              backgroundColor: AKSARA_COLOR.PRIMARY_H,
              borderColor: AKSARA_COLOR.PRIMARY,
              fill: fill,
              borderWidth: 1.5,
            },
          ],
        }}
        stats={stats}
      />
    );
  };

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.demography"), "text-primary"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bptms.full")} icon={<SocietyIcon />} isDivision />
        }
      />
      <Container className="min-h-screen">
        <Section
          title={t("section_timeseries.title")}
          description={
            <div className="flex flex-col gap-4">
              <div className="mt-2 grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                <Dropdown
                  width="min-w-[150px]"
                  anchor="left"
                  options={OPTIONS}
                  selected={OPTIONS.find(option => data.options === option.value)}
                  onChange={e => setData("options", e.value)}
                />
              </div>
            </div>
          }
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                {plotMainTimeseries("overall", play)}

                <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
                  {plotMainTimeseries("economy", play)}
                  {plotMainTimeseries("social", play)}
                </div>

                <Slider
                  type="range"
                  period="year"
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[options].x}
                />

                <Section title={t("section_economy.title")} date={timeseries.data_as_of}>
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {plotTimeseries(
                      [
                        "economy_transport",
                        "economy_comms",
                        "economy_educ",
                        "economy_income",
                        "economy_work",
                      ],
                      play
                    )}
                  </div>
                </Section>

                <Section title={t("section_social.title")} date={timeseries.data_as_of}>
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {plotTimeseries(
                      [
                        "social_housing",
                        "social_entertainment",
                        "social_safety",
                        "social_participation",
                        "social_governance",
                        "social_culture",
                        "social_health",
                        "social_environment",
                        "social_family",
                      ],
                      play
                    )}
                  </div>
                </Section>
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default Wellbeing;
