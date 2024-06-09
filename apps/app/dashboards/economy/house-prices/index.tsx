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
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { routes } from "@lib/routes";

/**
 * House Prices Dashboard
 * @overview Status: Live
 */

export interface TimeseriesChartData {
  title: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
  colors: {
    backgroundColor?: string;
    borderColor?: string;
  };
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });

const TIMESERIESDATA = ["x", "all", "terrace", "high_rise", "detached", "semi_detached"] as const;

const TIMESERIESTYPE = ["avg_price", "growth_qoq", "growth_yoy", "index"] as const;

type TimeseriesData = (typeof TIMESERIESDATA)[number];
type TimeseriesType = (typeof TIMESERIESTYPE)[number];

type ChoroplethOptions = {
  x: Array<string>;
  y: Record<Exclude<TimeseriesData, "x">, Array<number>>;
};

interface HousePricesProp {
  last_updated: string;
  next_update: string;
  params: { state: string };
  timeseries: WithData<Record<TimeseriesType, Record<TimeseriesData, number[]>>>;
  timeseries_callout: WithData<
    Record<TimeseriesType, Record<Exclude<TimeseriesData, "x">, { latest: number }>>
  >;
  choropleth: WithData<ChoroplethOptions>;
}

const HousePricesDashboard: FunctionComponent<HousePricesProp> = ({
  last_updated,
  next_update,
  timeseries,
  timeseries_callout,
  choropleth,
  params,
}) => {
  const { t, i18n } = useTranslation(["dashboard-house-prices"]);

  const FILTER_OPTIONS: Array<OptionType> = TIMESERIESTYPE.map((key: string) => ({
    label: t(`keys.${key}`),
    value: key,
  }));

  const CHOROPLETH_OPTIONS: Array<OptionType> = TIMESERIESDATA.filter(item => item !== "x").map(
    (key: string) => ({
      label: t(`keys.${key}`),
      value: key,
    })
  );

  const { data, setData } = useData({
    minmax: [0, timeseries.data.avg_price.x.length - 1],
    filter: FILTER_OPTIONS[0].value,
    choropleth_filter: CHOROPLETH_OPTIONS[0].value,
  });

  const filter = data.filter as TimeseriesType;
  const choropleth_filter = data.choropleth_filter as Exclude<TimeseriesData, "x">;

  const LATEST_TIMESTAMP = timeseries.data[filter].x[timeseries.data[filter].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[filter], data.minmax);

  const plotTimeseries = (charts: Exclude<TimeseriesData, "x">[], play: boolean) => {
    return charts.map(name => {
      const {
        title,
        label,
        data: datum,
        fill,
        stats,
        colors,
      }: TimeseriesChartData = {
        title: t(`keys.${name}`),
        label: t(`keys.${name}`),
        data: coordinate[name],
        fill: true,
        colors: {
          backgroundColor: AKSARA_COLOR.PRIMARY_H,
          borderColor: AKSARA_COLOR.PRIMARY,
        },
        stats: [
          {
            title: t("common:common.latest", {
              date: toDate(
                LATEST_TIMESTAMP,
                `${i18n.language === "ms-MY" ? "'ST'" : ""}q${i18n.language === "ms-MY" ? "" : "Q"} yyyy`,
                i18n.language
              ),
            }),
            value: [
              filter === "avg_price" ? "RM " : "",
              numFormat(
                Math.abs(timeseries_callout.data[filter][name].latest),
                "standard",
                filter === "avg_price" ? 0 : 1,
                "long",
                i18n.language,
                true
              ),
              filter === "growth_qoq" || filter === "growth_yoy" ? "%" : "",
            ].join(""),
          },
        ],
      };
      return (
        <Timeseries
          key={title}
          title={
            name === "high_rise" && i18n.language === "ms-MY" ? (
              <h5 className="italic">{title}</h5>
            ) : (
              title
            )
          }
          className="h-[350px] w-full"
          interval={"quarter"}
          prefixY={filter === "avg_price" ? "RM" : ""}
          unitY={filter === "growth_qoq" || filter === "growth_yoy" ? "%" : ""}
          enableAnimation={!play}
          precision={filter === "avg_price" ? 0 : 1}
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
                fill: fill,
                borderWidth: 1.5,
                ...colors,
              },
            ],
          }}
          stats={stats}
        />
      );
    });
  };

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.economy"), "text-primary"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        next_update={next_update}
        agencyBadge={<AgencyBadge agency="napic" />}
        action={<StateDropdown url={routes.HOUSE_PRICES} currentState={params.state} />}
      />
      <Container className="min-h-screen">
        <Section
          title={t("section_1.title")}
          description={
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
              <Dropdown
                anchor="left"
                options={FILTER_OPTIONS}
                selected={FILTER_OPTIONS.find(option => filter === option.value)}
                onChange={e => setData("filter", e.value)}
              />
            </div>
          }
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {plotTimeseries(
                    ["all", "detached", "high_rise", "semi_detached", "terrace"],
                    play
                  )}
                </div>
                <Slider
                  type="range"
                  period={"quarter"}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[filter].x}
                />
              </>
            )}
          </SliderProvider>
        </Section>

        {/* Choropleth Section */}
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
                    placeholder={t("common:common.select")}
                    options={CHOROPLETH_OPTIONS}
                    selected={CHOROPLETH_OPTIONS.find(e => e.value === data.choropleth_filter)}
                    onChange={e => setData("choropleth_filter", e.value)}
                  />
                  <p className="text-dim whitespace-pre-line">{t("choro_desc")}</p>
                </div>
                <RankList
                  id="house-prices-by-state"
                  title={t("common:common.ranking", {
                    count: choropleth.data.x.length,
                  })}
                  data={choropleth.data.y[choropleth_filter]}
                  color="text-blue-600 dark:text-primary-dark"
                  threshold={choropleth.data.x.length}
                  format={(position: number) => {
                    return {
                      label: CountryAndStates[choropleth.data.x[position]],
                      value: choropleth.data.y[choropleth_filter][position]
                        ? numFormat(choropleth.data.y[choropleth_filter][position], "standard", 1)
                        : "-",
                    };
                  }}
                />
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px] lg:w-full"
                color="blues"
                precision={0}
                data={{
                  labels: choropleth.data.x.map((state: string) => CountryAndStates[state]),
                  values: choropleth.data.y[choropleth_filter],
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

export default HousePricesDashboard;
