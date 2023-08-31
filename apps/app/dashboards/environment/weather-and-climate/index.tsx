import { routes } from "@lib/routes";
import { MarkerData } from "datagovmy-ui/charts/map-plot";
import { Periods } from "datagovmy-ui/charts/timeseries";
import {
  AgencyBadge,
  ComboBox,
  Container,
  Hero,
  Section,
  Slider,
  Tabs,
} from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { DashboardPeriod, OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useMemo } from "react";

/**
 * WeatherandClimate Dashboard
 * @overview Status: Live
 */

const MapPlot = dynamic(() => import("datagovmy-ui/charts/map-plot"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

export type Station = {
  lat: number;
  lon: number;
  slug: string;
  station: string;
};

type Weather = "rainfall" | "temperature";

interface WeatherandClimateProps {
  dropdown: Station[];
  last_updated: string;
  params: Station;
  timeseries: WithData<Record<DashboardPeriod, Record<"x" | Weather, number[]>>>;
  timeseries_callout: WithData<Record<Weather, number>>;
}

const WeatherandClimate: FunctionComponent<WeatherandClimateProps> = ({
  dropdown,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-weather-and-climate", "common"]);
  const { push } = useRouter();
  const STATION_OPTIONS: Array<OptionType> = dropdown.map(e => ({
    label: e.station,
    value: e.slug,
  }));
  const { data, setData } = useData({
    station: params.slug,
    minmax: [timeseries.data.daily_7d.x.length - 366, timeseries.data.daily_7d.x.length - 1],
    tab: 0,
  });

  const PERIODS: Array<DashboardPeriod> = ["daily_7d", "daily", "monthly", "yearly"];
  const config = useMemo<{
    key: DashboardPeriod;
    period: Exclude<Periods, false | "millisecond" | "second" | "minute" | "week">;
  }>(() => {
    switch (PERIODS[data.tab]) {
      case "daily":
      case "daily_7d":
        return { key: PERIODS[data.tab], period: "day" };
      case "monthly":
        return { key: PERIODS[data.tab], period: "month" };
      case "yearly":
        return { key: PERIODS[data.tab], period: "year" };
    }
  }, [data.tab]);

  const markers = useMemo<MarkerData>(() => {
    const _markers: MarkerData = dropdown.map(s => {
      const marker = {
        position: [s.lat, s.lon] as [number, number],
        tooltip: { Station: s.station },
        onMarkerClick: () => navigateToStation(s.slug),
      };

      if (s.slug === data.station) Object.assign(marker, { icon: "red" });
      return marker;
    });

    return _markers;
  }, [data.station]);

  const { coordinate } = useSlice(timeseries.data[config.key], data.minmax);
  const LATEST_TIMESTAMP = timeseries.data[config.key].x[timeseries.data[config.key].x.length - 1];

  const navigateToStation = (station?: string) => {
    setData("loading", true);
    setData("station", station);
    const route = `${routes.WEATHER_CLIMATE}/${station}`;
    push(route, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  return (
    <>
      <Hero
        background="green"
        category={[t("common:categories.environment"), "text-green-600"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="met" />}
      />

      <Container>
        {/* Zoom into a weather station near you! */}
        <Section>
          <div className="space-y-12 xl:grid xl:grid-cols-12">
            <div className="flex flex-col gap-6 lg:flex-row xl:col-span-10 xl:col-start-2">
              <div className="flex flex-col justify-center space-y-6 lg:w-1/3">
                <h4 className="text-center [text-wrap:balance]">{t("title")}</h4>
                <div className="mx-auto w-full max-w-[400px]">
                  <ComboBox
                    placeholder={t("search_station")}
                    options={STATION_OPTIONS}
                    selected={
                      data.station ? STATION_OPTIONS.find(e => e.value === data.station) : null
                    }
                    onChange={selected => {
                      if (selected) navigateToStation(selected.value);
                      else setData("station", null);
                    }}
                    config={{
                      baseSort: (a, b) => (a.index < b.index ? -1 : 1), // no sort
                      keys: ["label"],
                    }}
                  />
                </div>
              </div>
              <div className="lg:w-2/3">
                <MapPlot
                  className="shadow-button h-[400px] rounded-xl lg:w-full"
                  tileTheme="terrain"
                  position={[params.lat, params.lon]}
                  zoom={13}
                  markers={markers}
                />
                <p className="text-dim pt-3 text-center text-sm">{t("map_desc")}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* {{ station }}: Temperature and Rainfall */}
        <Section
          title={t("station_temp_rain", {
            station: params?.station,
          })}
          description={t("disclaimer")}
          date={timeseries.data_as_of}
          menu={
            <Tabs.List
              options={[
                t("common:time.daily_7d"),
                t("common:time.daily"),
                t("common:time.monthly"),
                t("common:time.yearly"),
              ]}
              current={data.tab}
              onChange={index => setData("tab", index)}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  <Timeseries
                    id="timeseries-temperature"
                    className="h-[300px]"
                    title={t("mean_temp")}
                    enableAnimation={!play}
                    interval={config.period}
                    unitY="°C"
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.temperature,
                          label: t("temperature"),
                          borderColor: AKSARA_COLOR.GREEN,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.GREEN_H,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                        }),
                        value: `${numFormat(timeseries_callout.data.temperature, "standard", 1)}°C`,
                      },
                    ]}
                  />
                  <Timeseries
                    id="timeseries-rainfall"
                    className="h-[300px]"
                    title={t("total_rain")}
                    enableAnimation={!play}
                    interval={config.period}
                    unitY="mm"
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate.rainfall,
                          label: t("rainfall"),
                          borderColor: AKSARA_COLOR.GREEN,
                          borderWidth: 1.5,
                          backgroundColor: AKSARA_COLOR.GREEN_H,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("days_with_rain"),
                        value: `${numFormat(timeseries_callout.data.rainfall, "standard", 1)}%`,
                      },
                    ]}
                  />
                </div>

                <Slider
                  type="range"
                  period={config.period}
                  value={data.minmax}
                  data={timeseries.data[config.key].x}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default WeatherandClimate;
