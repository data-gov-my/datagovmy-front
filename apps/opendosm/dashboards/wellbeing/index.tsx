import { SocietyIcon } from "@icons/division";
import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  Markdown,
  Section,
  Slider,
  StateDropdown,
  Tooltip,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, BREAKPOINTS, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { WindowContext } from "datagovmy-ui/contexts/window";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useContext } from "react";
import WellbeingHeatmap, { WellbeingHeatmapProps } from "./heatmap";
import WellbeingChoropleth, { WellbeingChoroplethProps } from "./choropleth";
import { routes } from "@lib/routes";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

/**
 * Wellbeing Dashboard
 * @overview Status: Live
 */

export const TIMESERIES_KEYS = [
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

export const TIMESERIES_TYPE = ["growth_yoy", "index"] as const;

export type TimeseriesKeys = (typeof TIMESERIES_KEYS)[number];
export type TimeseriesType = (typeof TIMESERIES_TYPE)[number];

interface WellbeingProps extends WellbeingChoroplethProps, WellbeingHeatmapProps {
  last_updated: string;
  next_update: string;
  state: string;
  timeseries: WithData<Record<TimeseriesType, Record<TimeseriesKeys, number[]>>>;
  timeseries_callout: WithData<Record<TimeseriesKeys, Record<TimeseriesType, number>>>;
}

const Wellbeing: FunctionComponent<WellbeingProps> = ({
  last_updated,
  next_update,
  choropleth,
  heatmap,
  state,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation("dashboard-wellbeing");
  const { size } = useContext(WindowContext);

  const OPTIONS: Array<OptionType> = TIMESERIES_TYPE.map(type => ({
    label: t(`keys.${type}`),
    value: type,
  }));

  const { data, setData } = useData({
    minmax: [0, timeseries.data.index.x.length - 1],
    breakdown_minmax: [0, timeseries.data.index.x.length - 1],
    options: OPTIONS[0].value,
  });

  const options = data.options as TimeseriesType;
  const { coordinate } = useSlice(timeseries.data[options], data.minmax);
  const { coordinate: breakdown_coords } = useSlice(
    timeseries.data[options],
    data.breakdown_minmax
  );

  const LATEST_TIMESTAMP = timeseries.data[options].x[timeseries.data[options].x.length - 1];

  const plotTimeseries = (charts: Exclude<TimeseriesKeys, "x">[], play: boolean) => {
    const isMain = (key: string) => ["overall", "economy", "social"].includes(key);

    return charts.map(key => {
      const label = t(`keys.${key}`);

      return (
        <Timeseries
          key={key}
          title={
            <div className="flex items-center gap-2">
              <Tooltip
                anchor="bottom"
                className="lg:max-h-96 sm:max-w-72"
                disableArrowTip={true}
                tip={<Markdown className="tooltip-list">{t(`tooltip.${key}`)}</Markdown>}
              >
                {open => (
                  <h5
                    onClick={size.width < BREAKPOINTS.LG ? open : null}
                    className="underline decoration-dashed decoration-from-font [text-underline-position:from-font]"
                  >
                    {label}
                  </h5>
                )}
              </Tooltip>
            </div>
          }
          className="h-[300px] w-full"
          interval="year"
          beginZero={false}
          unitY={options === "index" ? "" : "%"}
          enableAnimation={!play}
          data={{
            labels: isMain(key) ? coordinate.x : breakdown_coords.x,
            datasets: [
              {
                type: "line",
                label,
                data: isMain(key) ? coordinate[key] : breakdown_coords[key],
                backgroundColor: AKSARA_COLOR.PRIMARY_H,
                borderColor: AKSARA_COLOR.PRIMARY,
                fill: true,
                borderWidth: 1.5,
              },
            ],
          }}
          stats={[
            {
              title: t("common:common.latest", {
                date: toDate(LATEST_TIMESTAMP, "yyyy", i18n.language),
              }),
              value: numFormat(timeseries_callout.data[key].index, "compact", 1),
            },
            {
              title: t("keys.growth_yoy"),
              value: numFormat(timeseries_callout.data[key].growth_yoy, "compact", 1) + "%",
            },
          ]}
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
        next_update={next_update}
        action={<StateDropdown url={routes.WELLBEING} currentState={state} />}
        agencyBadge={
          <AgencyBadge name={t("division:bptms.full")} icon={<SocietyIcon />} isDivision />
        }
      />
      <Container className="min-h-screen">
        <Section
          title={t("section_timeseries.title", { state: CountryAndStates[state] })}
          description={
            <Dropdown
              width="min-w-[150px]"
              anchor="left"
              options={OPTIONS}
              selected={OPTIONS.find(option => data.options === option.value)}
              onChange={e => setData("options", e.value)}
            />
          }
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                {plotTimeseries(["overall"], play)}

                <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
                  {plotTimeseries(["economy", "social"], play)}
                </div>

                <Slider
                  type="range"
                  period="year"
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[options].x}
                />
              </>
            )}
          </SliderProvider>
        </Section>

        <WellbeingHeatmap heatmap={heatmap} />

        <WellbeingChoropleth choropleth={choropleth} />

        <SliderProvider>
          {play => (
            <Section
              title={t("section_economy.title")}
              className="pt-8 lg:pt-12"
              date={timeseries.data_as_of}
            >
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

              <Slider
                type="range"
                period="year"
                value={data.breakdown_minmax}
                onChange={e => setData("breakdown_minmax", e)}
                data={timeseries.data[options].x}
              />

              <div className="flex flex-col gap-6 lg:gap-8 py-8 lg:py-12">
                <div className="flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <h4>{t("section_social.title")}</h4>
                  <span className="text-dim text-right text-sm">
                    {t("common:common.data_of", { date: timeseries.data_as_of })}
                  </span>
                </div>

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
              </div>
            </Section>
          )}
        </SliderProvider>
      </Container>
    </>
  );
};

export default Wellbeing;
