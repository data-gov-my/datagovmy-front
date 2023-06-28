import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import { AKSARA_COLOR } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { SliderProvider } from "@components/Chart/Slider/context";
import { Container, Section } from "@components/index";
import { List } from "@components/Tabs";
import dynamic from "next/dynamic";
import Slider from "@components/Chart/Slider";

/**
 * Labour Losses Dashboard
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface LabourLossesProps {
  timeseries: any;
  timeseries_callout: any;
}

const LabourLosses: FunctionComponent<LabourLossesProps> = ({ timeseries, timeseries_callout }) => {
  const { t } = useTranslation(["dashboard-high-frequency-labour-data", "common"]);
  const period: { [key: number]: "auto" | "month" | "year" } = {
    0: "auto",
    1: "month",
    2: "year",
  };
  const periodly: { [key: number]: "daily" | "monthly" | "yearly" } = {
    0: "daily",
    1: "monthly",
    2: "yearly",
  };
  const { data, setData } = useData({
    minmax: [0, timeseries.data.daily.x.length],
    index: 0,
    period: "auto",
    periodly: "daily",
  });
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
            current={data.index}
            onChange={index => {
              setData("index", index);
              setData("period", period[index]);
              setData("periodly", periodly[index]);
            }}
            options={[t("daily"), t("monthly"), t("yearly")]}
          />
        }
      >
        <SliderProvider>
          {play => (
            <>
              <Timeseries
                className="h-[300px] w-full"
                enableAnimation={!play}
                interval={data.period === "day" ? "auto" : data.period}
                beginZero
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: coordinate.x.length === 1 ? "bar" : "line",
                      data: coordinate.losses,
                      label: t(data.periodly),
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
                    title: t("daily"),
                    value: `+${numFormat(LABOUR_LOSSES.daily.value, "standard")}`,
                  },
                  {
                    title: t("trend_weekly"),
                    value: `${LABOUR_LOSSES.growth_wow.value > 0 ? "+" : ""}${numFormat(
                      LABOUR_LOSSES.growth_wow.value,
                      "standard",
                      [1, 1]
                    )}%`,
                  },
                  {
                    title: t("trend_monthly"),
                    value: `${LABOUR_LOSSES.growth_mom.value > 0 ? "+" : ""}${numFormat(
                      LABOUR_LOSSES.growth_mom.value,
                      "standard",
                      [1, 1]
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
