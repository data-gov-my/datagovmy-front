import { Container, List, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { TimeseriesOption } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Labour Losses Dashboard
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface LabourLossesProps {
  timeseries: any;
  timeseries_callout: any;
}

const LabourLosses: FunctionComponent<LabourLossesProps> = ({ timeseries, timeseries_callout }) => {
  const { t } = useTranslation(["dashboard-high-frequency-labour-data", "common"]);
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
  const LABOUR_LOSSES = timeseries_callout.data.losses;
  return (
    <Container className="min-h-fit">
      <Section
        title={t("losses_title")}
        description={t("losses_desc")}
        date={timeseries.data_as_of}
        menu={
          <List
            current={data.tab_index}
            onChange={index => {
              setData("tab_index", index);
              setData("minmax", [0, timeseries.data[config[index].periodly].x.length - 1]);
              setData("period", config[index].period);
              setData("periodly", config[index].periodly);
            }}
            options={[
              t("common:time.daily_7d"),
              t("common:time.daily"),
              t("common:time.monthly"),
              t("common:time.yearly"),
            ]}
          />
        }
      >
        <SliderProvider>
          {play => (
            <>
              <Timeseries
                className="h-[300px]"
                enableAnimation={!play}
                interval={data.period === "day" ? "auto" : data.period}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: coordinate.x.length === 1 ? "bar" : "line",
                      data: coordinate.losses,
                      label: t(`common:time.${data.periodly}`),
                      fill: true,
                      backgroundColor: AKSARA_COLOR.DIM_H,
                      borderColor: AKSARA_COLOR.DIM,
                      borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                      barThickness: 12,
                    },
                  ],
                }}
                stats={[
                  {
                    title: t("common:time.daily"),
                    value: `+${numFormat(LABOUR_LOSSES.daily.value, "standard")}`,
                  },
                  {
                    title: t("trend_weekly"),
                    value: `${LABOUR_LOSSES.growth_wow.value > 0 ? "+" : ""}${numFormat(
                      LABOUR_LOSSES.growth_wow.value,
                      "standard",
                      1
                    )}%`,
                  },
                  {
                    title: t("trend_monthly"),
                    value: `${LABOUR_LOSSES.growth_mom.value > 0 ? "+" : ""}${numFormat(
                      LABOUR_LOSSES.growth_mom.value,
                      "standard",
                      1
                    )}%`,
                  },
                ]}
              />
              <Slider
                type="range"
                period={data.period}
                value={data.minmax}
                onChange={e => setData("minmax", e)}
                data={timeseries.data[data.periodly].x}
              />
            </>
          )}
        </SliderProvider>
      </Section>
    </Container>
  );
};

export default LabourLosses;
