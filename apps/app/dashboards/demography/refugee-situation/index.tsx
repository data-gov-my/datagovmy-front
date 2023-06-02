import BarMeter from "@components/Chart/BarMeter";
import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { UNHCRIcon } from "@components/Icon/agency";
import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  Section,
  Tooltip,
} from "@components/index";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { getTopIndices, numFormat, toDate } from "@lib/helpers";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Refugee Situation Dashboard
 * @overview Status: In-development
 */

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface RefugeeSituationProps {
  barmeter: any;
  choropleth: any;
  last_updated: any;
  timeseries: any;
  timeseries_callout: any;
}

const RefugeeSituation: FunctionComponent<RefugeeSituationProps> = ({
  barmeter,
  choropleth,
  last_updated,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-refugee-situation", "common"]);
  const FILTER_OPTIONS: Array<OptionType> = ["absolute", "per_capita", "perc"].map(
    (key: string) => ({
      label: t(key),
      value: key,
    })
  );
  const { data, setData } = useData({
    tab_index: 0,
    minmax: [0, timeseries.data.x.length],
    filter: FILTER_OPTIONS[0].value,
    loading: false,
  });
  const { coordinate } = useSlice(timeseries.data, data.minmax);
  const METRICS = ["arrivals", "registrations", "resettlements"];
  const barmeter_data = Object.entries(barmeter.data.bar);
  [barmeter_data[0], barmeter_data[1]] = [barmeter_data[1], barmeter_data[0]];
  const topStateIndices = getTopIndices(
    choropleth.data[data.filter].y.value,
    choropleth.data[data.filter].y.length,
    true
  );
  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.demography"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency="UNHCR Malaysia"
            link="https://www.unhcr.org/my/"
            icon={<UNHCRIcon />}
          />
        }
        last_updated={last_updated}
      />

      <Container className="min-h-screen">
        {/* How are key refugee population metrics trending? */}
        <Section title={t("timeseries_header")} date={timeseries.data_as_of}>
          <SliderProvider>
            {play => (
              <>
                {/* Total Population of Refugees and Asylum-Seekers */}
                <Timeseries
                  className="h-[300px] w-full"
                  title={t("timeseries_title")}
                  enableAnimation={!play}
                  interval={"year"}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.overall,
                        label: t("total"),
                        backgroundColor: AKSARA_COLOR.PRIMARY_H,
                        borderColor: AKSARA_COLOR.PRIMARY,
                        borderWidth: 1.5,
                        fill: true,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("this_month", {
                        date: toDate(timeseries.data_as_of, "MMM yyyy", i18n.language),
                      }),
                      value: `${numFormat(
                        timeseries_callout.data["overall"]["this_month"].value,
                        "standard"
                      )}`,
                    },
                  ]}
                />
                <Slider
                  type="range"
                  value={data.minmax}
                  data={timeseries.data.x}
                  onChange={e => setData("minmax", e)}
                />
                <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-3">
                  {METRICS.map((key: string) => (
                    <Timeseries
                      key={key}
                      title={t(key)}
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      interval="year"
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[key],
                            label: t("total"),
                            backgroundColor: AKSARA_COLOR.PRIMARY_H,
                            borderColor: AKSARA_COLOR.PRIMARY,
                            borderWidth: 1.5,
                            fill: true,
                          },
                        ],
                      }}
                      stats={[
                        {
                          title: t("this_month", {
                            date: toDate(timeseries.data_as_of, "MMM yyyy", i18n.language),
                          }),
                          value: `+${numFormat(
                            timeseries_callout.data[key]["this_month"].value,
                            "standard"
                          )}`,
                        },
                        {
                          title: t("this_year"),
                          value: `+${numFormat(
                            timeseries_callout.data[key]["this_year"].value,
                            "standard"
                          )}`,
                        },
                      ]}
                    />
                  ))}
                </div>
              </>
            )}
          </SliderProvider>
        </Section>

        {/* What does Malaysia’s refugee population look like? */}
        <Section title={t("barmeter_header")} date={barmeter.data_as_of ?? timeseries.data_as_of}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:grid-cols-3">
            {barmeter_data.map(([k, v]: [string, any]) => {
              return (
                <div className="flex flex-col space-y-6" key={k}>
                  <BarMeter
                    key={k}
                    title={t(k)}
                    layout="horizontal"
                    unit="%"
                    data={v}
                    sort={"desc"}
                    formatX={key => t(key)}
                    formatY={(value, key) => (
                      <>
                        <Tooltip
                          tip={`${t("tooltip", {
                            count: barmeter.data.tooltip[k].find(
                              (object: { x: string; y: number }) => object.x === key
                            ).y,
                          })}`}
                        />
                        <span className="pl-1">{numFormat(value, "compact", [1, 1])}</span>
                      </>
                    )}
                  />
                </div>
              );
            })}
          </div>
        </Section>
        <Section>
          {/* How is the refugee population distributed across states? */}
          <LeftRightCard
            left={
              <div className="flex h-full w-full flex-col space-y-6 p-6 lg:h-[600px] lg:p-8">
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
                  className="w-fit"
                  placeholder={t("common:common.select")}
                  options={FILTER_OPTIONS}
                  selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                  onChange={e => setData("filter", e.value)}
                />
                <div className="flex grow flex-col justify-between space-y-6">
                  <p className="text-dim">{t("choro_description")}</p>
                  <div className="space-y-3 border-t pt-6 ">
                    <p className="font-bold">{t("choro_ranking")}</p>
                    <div className="h-40 space-y-3 overflow-auto">
                      {topStateIndices.map((pos: number, i: number) => {
                        return (
                          <div className="pr-4.5 flex space-x-3" key={pos}>
                            <div className="text-dim font-medium">#{i + 1}</div>
                            <div className="grow">
                              {CountryAndStates[choropleth.data[data.filter].x[pos]]}
                            </div>
                            <div className="text-primary dark:text-primary-dark font-bold">
                              {data.filter === "absolute"
                                ? numFormat(choropleth.data[data.filter].y.value[pos], "standard")
                                : numFormat(
                                    choropleth.data[data.filter].y.value[pos],
                                    "standard",
                                    [1, 1]
                                  )}
                              {data.filter === "perc" ? "%" : ""}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px] lg:w-full"
                data={{
                  labels: choropleth.data[data.filter].x.map(
                    (state: string) => CountryAndStates[state]
                  ),
                  values: choropleth.data[data.filter].y.value,
                }}
                type="state"
                unit={data.filter === "perc" ? "%" : ""}
                color="blues"
              />
            }
          />
        </Section>
      </Container>
    </>
  );
};

export default RefugeeSituation;