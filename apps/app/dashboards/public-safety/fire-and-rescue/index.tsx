import { routes } from "@lib/routes";
import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  RankList,
  Section,
  Slider,
  StateDropdown,
  Tabs,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, TimeseriesOption } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Fire and Rescue Dashboard
 * @overview Status: Live
 */

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface FireandRescueProps {
  choropleth: any;
  last_updated: string;
  params: { state: string };
  timeseries: any;
  timeseries_callout: any;
}

const FireandRescue: FunctionComponent<FireandRescueProps> = ({
  choropleth,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-fire-and-rescue", "common"]);
  const currentState = params.state;
  const FILTER_OPTIONS: Array<OptionType> = ["fire", "others", "overall", "rescue"].map(
    (key: string) => ({
      label: t(key),
      value: key,
    })
  );
  const { data, setData } = useData({
    minmax: [timeseries.data.daily.x.length - 366, timeseries.data.daily.x.length - 1],
    filter: FILTER_OPTIONS[0].value,
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
    <>
      <Hero
        background="red"
        category={[t("common:categories.public_safety"), "text-danger"]}
        header={[t("header")]}
        description={[t("description"), "whitespace-pre-line"]}
        action={<StateDropdown url={routes.FIRE_RESCUE} currentState={currentState} />}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="bomba" />}
      />

      <Container className="min-h-screen">
        {/* How are fire and rescue operations trending? */}
        <Section title={t("operation_header")} date={timeseries.data_as_of}>
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[300px]"
                  title={t("timeseries_title", {
                    state: CountryAndStates[currentState],
                    context: data.periodly,
                  })}
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
                        setData("minmax", [
                          0,
                          timeseries.data[config[index].periodly].x.length - 1,
                        ]);
                        setData("period", config[index].period);
                        setData("periodly", config[index].periodly);
                      }}
                    />
                  }
                  enableAnimation={!play}
                  interval={data.period}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.overall,
                        label: t(`common:time.${data.periodly}`),
                        borderColor: AKSARA_COLOR.DANGER,
                        borderWidth: 1.5,
                        backgroundColor: AKSARA_COLOR.DANGER_H,
                        fill: true,
                      },
                    ],
                  }}
                  // stats={[
                  //   {
                  //     title: t("common:time.daily"),
                  //     value: `+${numFormat(
                  //       timeseries_callout.data.data[currentState].overall.daily.value,
                  //       "standard"
                  //     )}`,
                  //   },
                  //   {
                  //     title: t("total"),
                  //     value: numFormat(
                  //       timeseries_callout.data.data[currentState].overall.cumul.value,
                  //       "standard"
                  //     ),
                  //   },
                  // ]}
                />
                <Slider
                  type="range"
                  period={data.period}
                  value={data.minmax}
                  data={timeseries.data[data.periodly].x}
                  onChange={e => setData("minmax", e)}
                />
                <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-3">
                  {["fire", "rescue", "others"].map((key: string) => (
                    <Timeseries
                      key={key}
                      title={t(key)}
                      className="h-[300px]"
                      enableAnimation={!play}
                      interval={data.period}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[key],
                            label: t(`common:time.${data.periodly}`),
                            borderColor: AKSARA_COLOR.DANGER,
                            borderWidth: 1.5,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            fill: true,
                          },
                        ],
                      }}
                      // stats={[
                      //   {
                      //     title: t("common:time.daily"),
                      //     value: `+${numFormat(
                      //       timeseries_callout.data.data[currentState][key].daily.value,
                      //       "standard"
                      //     )}`,
                      //   },
                      //   {
                      //     title: t("total"),
                      //     value: numFormat(
                      //       timeseries_callout.data.data[currentState][key].cumul.value,
                      //       "standard"
                      //     ),
                      //   },
                      // ]}
                    />
                  ))}
                </div>
              </>
            )}
          </SliderProvider>
        </Section>

        {/* How does the rate of fire and rescue incidents differ across states? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6 pb-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("choro_header")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <Dropdown
                    anchor="left"
                    width="w-full lg:w-fit"
                    placeholder={t("common:common.select")}
                    options={FILTER_OPTIONS}
                    selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                    onChange={e => setData("filter", e.value)}
                  />
                  <p className="text-dim whitespace-pre-line">{t("choro_desc")}</p>
                </div>
                <RankList
                  id="active-passport-by-state"
                  title={t("common:common.ranking", {
                    count: choropleth.data[data.filter].x.length,
                  })}
                  data={choropleth.data[data.filter].y.value}
                  color="text-danger"
                  threshold={choropleth.data[data.filter].x.length}
                  format={(position: number) => {
                    return {
                      label: CountryAndStates[choropleth.data[data.filter].x[position]],
                      value: numFormat(choropleth.data[data.filter].y.value[position], "standard"),
                    };
                  }}
                />
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px] lg:w-full"
                color="reds"
                data={{
                  labels: choropleth.data[data.filter].x.map(
                    (state: string) => CountryAndStates[state]
                  ),
                  values: choropleth.data[data.filter].y.value,
                }}
                type="state"
              />
            }
          ></LeftRightCard>
        </Section>
      </Container>
    </>
  );
};

export default FireandRescue;
