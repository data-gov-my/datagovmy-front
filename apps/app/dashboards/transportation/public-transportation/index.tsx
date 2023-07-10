import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { MOTIcon } from "@components/Icon/agency";
import { List } from "@components/Tabs";
import { AgencyBadge, Container, Hero, Section } from "@components/index";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { AKSARA_COLOR } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import { TimeseriesOption } from "@lib/types";
import { Trans } from "next-i18next";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * PublicTransportation Dashboard
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface PublicTransportationProps {
  last_updated: string;
  timeseries: any;
  timeseries_callout: any;
}

const PublicTransportation: FunctionComponent<PublicTransportationProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
}) => {
  const { t } = useTranslation(["dashboard-public-transportation", "common"]);
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

  const { data, setData } = useData({
    minmax: [0, timeseries.data.daily.x.length - 1],
    index: 0,
    period: "auto",
    periodly: "daily_7d",
  });
  const { coordinate } = useSlice(timeseries.data[data.periodly], data.minmax);

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.transportation"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={
          <Trans>
            <p className={"text-dim whitespace-pre-line xl:w-2/3"}>{t("description")}</p>
          </Trans>
        }
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:mot.full")}
            link="https://www.mot.gov.my/en/"
            icon={<MOTIcon />}
          />
        }
      />

      <Container className="min-h-screen">
        {/* How is ridership of public transportation services trending? */}
        <Section
          title={t("title")}
          description={t("timeseries_desc")}
          date={timeseries.data_as_of}
          menu={
            <List
              current={data.index}
              onChange={index => {
                setData("index", index);
                setData("minmax", [0, timeseries.data[config[index].periodly].x.length - 1]);
                setData("period", config[index].period);
                setData("periodly", config[index].periodly);
              }}
              options={[t("daily_7d"), t("daily"), t("monthly"), t("yearly")]}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[300px] w-full"
                  title={t("ridership_overall")}
                  enableAnimation={!play}
                  interval={data.period}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: coordinate.x.length === 1 ? "bar" : "line",
                        data: coordinate.overall,
                        label: t(data.periodly),
                        fill: true,
                        backgroundColor: AKSARA_COLOR.PRIMARY_H,
                        borderColor: AKSARA_COLOR.PRIMARY,
                        borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                        barThickness: 12,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("daily"),
                      value: `+${numFormat(
                        timeseries_callout.data.overall.daily.value,
                        "standard"
                      )}`,
                    },
                    {
                      title: t("trend_weekly"),
                      value:
                        (timeseries_callout.data.overall.growth_wow.value > 0 ? "+" : "") +
                        `${numFormat(
                          timeseries_callout.data.overall.growth_wow.value,
                          "standard",
                          [1, 1]
                        )}%`,
                    },
                    {
                      title: t("trend_monthly"),
                      value:
                        (timeseries_callout.data.overall.growth_mom.value > 0 ? "+" : "") +
                        `${numFormat(
                          timeseries_callout.data.overall.growth_mom.value,
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
                <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-2 xl:grid-cols-3">
                  {["rapid_rail", "rapid_bus", "tebrau", "ets", "intercity", "komuter"].map(
                    (key: string) => (
                      <Timeseries
                        className="h-[300px] w-full"
                        title={t(`ridership_${key}`)}
                        enableAnimation={!play}
                        interval={data.period}
                        data={{
                          labels: coordinate.x,
                          datasets: [
                            {
                              type: coordinate.x.length === 1 ? "bar" : "line",
                              data: coordinate[key],
                              label: t(data.periodly),
                              fill: true,
                              backgroundColor: AKSARA_COLOR.PRIMARY_H,
                              borderColor: AKSARA_COLOR.PRIMARY,
                              borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                              barThickness: 12,
                            },
                          ],
                        }}
                        stats={[
                          {
                            title: t("daily"),
                            value: `+${numFormat(
                              timeseries_callout.data[key].daily.value,
                              "standard"
                            )}`,
                          },
                          {
                            title: t("trend_weekly"),
                            value:
                              (timeseries_callout.data[key].growth_wow.value > 0 ? "+" : "") +
                              `${numFormat(
                                timeseries_callout.data[key].growth_wow.value,
                                "standard",
                                [1, 1]
                              )}%`,
                          },
                          {
                            title: t("trend_monthly"),
                            value:
                              (timeseries_callout.data[key].growth_mom.value > 0 ? "+" : "") +
                              `${numFormat(
                                timeseries_callout.data[key].growth_mom.value,
                                "standard",
                                [1, 1]
                              )}%`,
                          },
                        ]}
                      />
                    )
                  )}
                </div>
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default PublicTransportation;
