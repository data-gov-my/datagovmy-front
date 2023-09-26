import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { OptionType, WithData } from "datagovmy-ui/types";
import { TimeseriesData, TimeseriesOptions, TimeseriesType, TIMESERIESTYPE } from ".";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { Dropdown, Section, Slider } from "datagovmy-ui/components";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { AKSARA_COLOR } from "datagovmy-ui/constants";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

export interface TimeseriesChartData {
  title: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
  prefix: string;
}

interface TimeseriesProp {
  timeseries: WithData<Record<TimeseriesType, TimeseriesOptions>>;
  timeseries_callout: WithData<Record<TimeseriesData, Record<TimeseriesType, number>>>;
}

const LifeExpectancyTimeseries: FunctionComponent<TimeseriesProp> = ({
  timeseries,
  timeseries_callout,
}) => {
  const { t } = useTranslation(["dashboard-life-expectancy"]);

  const OPTIONS: Array<OptionType> = TIMESERIESTYPE.map(type => ({
    label: t(`keys.${type}`),
    value: type,
  }));

  const { data, setData } = useData({
    minmax: [timeseries.data.overall.x.length - 32, timeseries.data.overall.x.length - 1],
    options: OPTIONS[0].value,
  });

  const options = data.options as TimeseriesType;

  const { coordinate } = useSlice(timeseries.data[options], data.minmax);

  const plotTimeseries = (charts: Exclude<TimeseriesData, "x" | "overall">[], play: boolean) => {
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
            title: t(`keys.overall`),
            value: `${timeseries_callout.data[name].overall} ${t(`keys.years`)}`,
          },
          {
            title: t(`keys.male`),
            value: `${timeseries_callout.data[name].male} ${t(`keys.years`)}`,
          },
          {
            title: t(`keys.female`),
            value: `${timeseries_callout.data[name].female} ${t(`keys.years`)}`,
          },
        ],
      };
      return (
        <Timeseries
          key={title}
          title={title}
          className="h-[350px] w-full"
          interval="year"
          enableAnimation={!play}
          beginZero={false}
          suggestedMinY={50}
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

  return (
    <Section
      title={t("section_timeseries.title")}
      description={
        <div className="flex flex-col gap-4">
          <p className={"whitespace-pre-line text-base"}>{t("section_timeseries.description")}</p>
          <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
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
            <Timeseries
              title={t(`keys.overall_title`)}
              className="h-[350px] w-full"
              interval="year"
              enableAnimation={!play}
              beginZero={false}
              suggestedMinY={50}
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
                    label: t(`keys.overall_title`),
                    data: coordinate.overall,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    fill: true,
                    borderWidth: 1.5,
                  },
                ],
              }}
              stats={[
                {
                  title: t(`keys.overall`),
                  value: `${timeseries_callout.data.overall.overall} ${t(`keys.years`)}`,
                },
                {
                  title: t(`keys.male`),
                  value: `${timeseries_callout.data.overall.male} ${t(`keys.years`)}`,
                },
                {
                  title: t(`keys.female`),
                  value: `${timeseries_callout.data.overall.female} ${t(`keys.years`)}`,
                },
              ]}
            />
            <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-3">
              {plotTimeseries(
                ["bumi", "bumi_malay", "bumi_other", "chinese", "indian", "noncitizen"],
                play
              )}
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
  );
};

export default LifeExpectancyTimeseries;
