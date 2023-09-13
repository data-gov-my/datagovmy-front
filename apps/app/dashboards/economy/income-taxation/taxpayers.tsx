import { Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Income Taxation - Taxpayers
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

type TaxpayerType = "joint" | "solo" | "total" | "zero";

export interface TaxpayersProps {
  timeseries: WithData<Record<"x" | TaxpayerType, number[]>>;
  timeseries_callout: WithData<Record<TaxpayerType, Record<"latest", number>>>;
}

const Taxpayers: FunctionComponent<TaxpayersProps> = ({ timeseries, timeseries_callout }) => {
  const { t, i18n } = useTranslation(["dashboard-income-taxation", "common"]);

  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.length - 1],
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);
  const LATEST_TIMESTAMP = toDate(
    timeseries.data.x[timeseries.data.x.length - 1],
    "yyyy",
    i18n.language
  );
  const TAXPAYER_TYPE: TaxpayerType[] = ["solo", "joint", "zero"];

  return (
    <Section title={t("section2.title")} date={timeseries.data_as_of}>
      <SliderProvider>
        {play => (
          <>
            <Timeseries
              title={t("section2.total")}
              className="h-[300px]"
              enableAnimation={!play}
              interval="year"
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.total,
                    label: t("section2.total"),
                    fill: true,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    borderColor: AKSARA_COLOR.PRIMARY,
                    borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                  },
                ],
              }}
              stats={[
                {
                  title: t("common:common.latest", {
                    date: LATEST_TIMESTAMP,
                  }),
                  value: `${numFormat(timeseries_callout.data.total.latest, "standard")}`,
                },
              ]}
            />
            <Slider
              type="range"
              period="year"
              value={data.minmax}
              onChange={e => setData("minmax", e)}
              data={timeseries.data.x}
            />
            <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-3">
              {TAXPAYER_TYPE.map(key => (
                <Timeseries
                  key={key}
                  title={t(`section2.${key}`)}
                  className="h-[300px]"
                  enableAnimation={!play}
                  interval="year"
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate[key],
                        label: t(`section2.${key}`),
                        backgroundColor: AKSARA_COLOR.PRIMARY_H,
                        borderColor: AKSARA_COLOR.PRIMARY,
                        borderWidth: 1.5,
                        fill: true,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:common.latest", {
                        date: LATEST_TIMESTAMP,
                      }),
                      value: `${numFormat(timeseries_callout.data[key].latest, "standard")}`,
                    },
                  ]}
                />
              ))}
            </div>
          </>
        )}
      </SliderProvider>
    </Section>
  );
};

export default Taxpayers;
