import { Section, Tabs, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat } from "datagovmy-ui/helpers";
import { useTranslation, useSlice, useData } from "datagovmy-ui/hooks";
import { TimeseriesOption } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * COVID Vaccination Trends
 * @overview Status: In-development
 */

interface COVIDVaccinationTrendsProps {
  currentState: string;
  timeseries: Record<string, any>;
  statistics: Record<string, any>;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
const COVIDVaccinationTrends: FunctionComponent<COVIDVaccinationTrendsProps> = ({
  currentState,
  timeseries,
  statistics,
}) => {
  const { t } = useTranslation(["dashboard-covid-vaccination", "common"]);

  const { data, setData } = useData({
    minmax: [timeseries.data.daily.x.length - 366, timeseries.data.daily.x.length - 1],
    period: "auto",
    periodly: "daily_7d",
    tab_index: 0,
  });

  const config: { [key: string]: TimeseriesOption } = {
    0: {
      period: "auto",
      periodly: "daily_7d",
    },
    1: {
      period: "auto",
      periodly: "daily",
    },
    2: {
      period: "month",
      periodly: "monthly",
    },
    3: {
      period: "year",
      periodly: "yearly",
    },
  };

  const { coordinate } = useSlice(timeseries.data[data.periodly], data.minmax);

  return (
    <SliderProvider>
      {play => (
        <>
          <Section title={t("combine_header")} date={timeseries.data_as_of}>
            <Timeseries
              title={t("combine_title", {
                state: CountryAndStates[currentState],
                context: data.periodly,
              })}
              className="h-[300px]"
              menu={
                <Tabs.List
                  options={[
                    t("common:time.daily_7d"),
                    t("common:time.daily"),
                    t("common:time.monthly"),
                    t("common:time.yearly"),
                  ]}
                  current={data.tab_index}
                  onChange={index => {
                    setData("tab_index", index);
                    setData("minmax", [0, timeseries.data[config[index].periodly].x.length - 1]);
                    setData("period", config[index].period);
                    setData("periodly", config[index].periodly);
                  }}
                />
              }
              interval={data.period}
              enableAnimation={!play}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.y,
                    label: t(`common:time.${data.periodly}`),
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
              period={data.period}
              value={data.minmax}
              data={timeseries.data[data.periodly].x}
              onChange={e => setData("minmax", e)}
            />
          </Section>

          {/*  How are COVID-19 key indicators trending */}
          <Section
            title={t("area_chart_header", {
              state: CountryAndStates[currentState],
              context: data.periodly,
            })}
            date={timeseries.data_as_of}
          >
            <div className="grid grid-cols-1 gap-12 pb-6 lg:grid-cols-2 xl:grid-cols-3">
              {["primary", "booster", "booster2", "adult", "adol", "child"].map(
                (item: string, idx: number) => {
                  const title: string = `area_chart_title${idx + 1}`;
                  const statistic_key: string = `daily_${item}`;
                  return (
                    <Timeseries
                      key={title}
                      className="h-[300px]"
                      title={t(title)}
                      interval={data.period}
                      enableAnimation={!play}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[item],
                            label: t(data.periodly),
                            borderColor: AKSARA_COLOR.GREEN,
                            borderWidth: 1.5,
                            backgroundColor: AKSARA_COLOR.GREEN_H,
                            fill: true,
                          },
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:time.daily"),
                          value: `+${numFormat(statistics.data[statistic_key].latest, "standard")}`,
                        },
                        {
                          title: t("total"),
                          value: `${numFormat(statistics.data[statistic_key].total, "standard")}`,
                        },
                      ]}
                    />
                  );
                }
              )}
            </div>
          </Section>
        </>
      )}
    </SliderProvider>
  );
};

export default COVIDVaccinationTrends;
