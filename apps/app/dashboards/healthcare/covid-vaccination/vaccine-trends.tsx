import { Section } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import Slider from "@components/Chart/Slider";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { numFormat } from "@lib/helpers";
import { SliderProvider } from "@components/Chart/Slider/context";

/**
 * COVID Vaccination Trends
 * @overview Status: In-development
 */

interface COVIDVaccinationTrendsProps {
  currentState: string;
  timeseries: Record<string, any>;
  statistics: Record<string, any>;
}

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const COVIDVaccinationTrends: FunctionComponent<COVIDVaccinationTrendsProps> = ({
  currentState,
  timeseries,
  statistics,
}) => {
  const { t } = useTranslation(["dashboard-covid-vaccination", "common"]);

  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.length - 1],
  });

  const { coordinate } = useSlice(timeseries.data, data.minmax);

  const TIMESERIES_LIST: string[] = ["primary", "booster", "booster2", "adult", "adol", "child"];

  return (
    <SliderProvider>
      {play => (
        <>
          <Section title={t("combine_header")} date={timeseries.data_as_of}>
            <Timeseries
              title={t("combine_title", {
                state: CountryAndStates[currentState],
              })}
              interval="auto"
              enableAnimation={!play}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.line_stacked,
                    label: t("combine_tooltip1"),
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
            title={t("area_chart_header", {
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
                    key={title}
                    className="h-[250px]"
                    title={t(title)}
                    enableGridX={false}
                    precision={0}
                    enableAnimation={!play}
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate[y_key],
                          label: t("combine_tooltip1"),
                          borderColor: AKSARA_COLOR.GREEN,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.GREEN_H,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("daily"),
                        value: `+${numFormat(statistics.data[statistic_key].latest, "standard")}`,
                      },
                      {
                        title: t("total"),
                        value: `${numFormat(statistics.data[statistic_key].total, "standard")}`,
                      },
                    ]}
                  />
                );
              })}
            </div>
          </Section>
        </>
      )}
    </SliderProvider>
  );
};

export default COVIDVaccinationTrends;
