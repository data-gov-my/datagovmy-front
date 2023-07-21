import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { JIMIcon } from "@components/Icon/agency";
import {
  AgencyBadge,
  ComboBox,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  Section,
  Tabs,
} from "@components/index";
import { OptionType } from "@components/types";
import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { getTopIndices, numFormat, toDate } from "@lib/helpers";
import { routes } from "@lib/routes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { FunctionComponent } from "react";

/**
 * Immigration Dashboard
 * @overview Status: In-development
 */

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface ImmigrationProps {
  choropleth: any;
  countries: any;
  country: any;
  country_callout: any;
  last_updated: string;
  params: {
    country?: string;
  };
  timeseries: any;
  timeseries_callout: any;
}

const Immigration: FunctionComponent<ImmigrationProps> = ({
  choropleth,
  countries,
  country,
  country_callout,
  last_updated,
  params,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-immigration", "common", "countries"]);
  const { push } = useRouter();
  const { theme } = useTheme();
  const COUNTRY_OPTIONS: Array<OptionType> = countries.map((key: string) => ({
    label: t(`countries:${key}`),
    value: key,
  }));
  const FILTER_OPTIONS: Array<OptionType> = [
    "absolute",
    // "absolute_adult",
    // "absolute_children",
    // "per_capita",
    // "per_capita_adult",
    // "per_capita_children",
  ].map((key: string) => ({
    label: t(key),
    value: key,
  }));
  const { data, setData } = useData({
    tab_index: 0,
    country_tab_index: 0,
    minmax: [0, timeseries.data.data.day.x.length - 1],
    country_minmax: [0, country.data.day.x.length - 1],
    period: "day",
    country_period: "day",
    filter: "absolute",
    loading: false,
  });
  const period: { [key: number]: "day" | "month" | "year" } = {
    0: "day",
    1: "month",
    2: "year",
  };
  const { coordinate } = useSlice(timeseries.data.data[data.period], data.minmax);
  const { coordinate: country_coords } = useSlice(
    country.data[data.country_period],
    data.country_minmax
  );
  const topStateIndices = getTopIndices(
    choropleth.data[data.filter].y.value,
    choropleth.data[data.filter].y.length,
    true
  );

  const navigateToCountry = (country?: string) => {
    if (!country) {
      setData("query", undefined);
      return;
    }
    setData("loading", true);

    const route = `${routes.IMMIGRATION}/${country}`;
    push(route, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.demography"), "text-purple"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:imigresen.full")}
            link="https://www.jpn.gov.my/en/"
            icon={<JIMIcon />}
          />
        }
      />

      <Container className="min-h-screen">
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col space-y-3 overflow-hidden p-6 lg:p-8">
                <div className="space-y-6">
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
                    options={FILTER_OPTIONS}
                    selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                    onChange={e => setData("filter", e.value)}
                  />
                  <p className="text-dim">{t("choro_description")}</p>
                  <div className="border-t pt-6">
                    <p className="font-bold">{t("choro_ranking")}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 overflow-auto">
                  {topStateIndices.map((pos, i) => {
                    return (
                      <div className="mr-4.5 flex space-x-3" key={pos}>
                        <span className="text-dim font-medium">#{i + 1}</span>
                        <span className="grow">
                          {CountryAndStates[choropleth.data[data.filter].x[pos]]}
                        </span>
                        <span className="text-purple font-bold">
                          {numFormat(choropleth.data[data.filter].y.value[pos], "standard")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px]"
                data={{
                  labels: choropleth.data[data.filter].x.map(
                    (state: string) => CountryAndStates[state]
                  ),
                  values: choropleth.data[data.filter].y.value,
                }}
                type="state"
                color="purples"
              />
            }
          />
        </Section>

        {/* How many people from {{ country }} are entering and leaving the country? */}
        <Section>
          <div className="space-y-12">
            <div className="space-y-6">
              <h4 className="lg:text-center">
                {t("country_header", {
                  country: t(`countries:${params.country ?? "overall"}`),
                  context: params.country ?? "overall",
                })}
              </h4>
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="mx-auto w-full md:w-96">
                  <ComboBox
                    enableFlag
                    imageSource="https://flagcdn.com/h40/"
                    fallback={<GlobeAltIcon className="w-4.5 h-4.5 mx-auto text-black" />}
                    placeholder={t("search_country")}
                    options={COUNTRY_OPTIONS}
                    selected={
                      params?.country ? COUNTRY_OPTIONS.find(e => e.value === params.country) : null
                    }
                    onChange={selected => {
                      navigateToCountry(selected?.value);
                    }}
                  />
                </div>
                <p className="text-dim text-sm lg:text-center">{t("country_desc")}</p>
              </div>
            </div>
            <SliderProvider>
              {play => (
                <div>
                  <Timeseries
                    title={t("country_title")}
                    menu={
                      <Tabs.List
                        options={[
                          t("common:time.daily"),
                          t("common:time.monthly"),
                          t("common:time.yearly"),
                        ]}
                        current={data.country_tab_index}
                        onChange={index => {
                          setData("country_tab_index", index);
                          setData("country_period", period[index]);
                        }}
                      />
                    }
                    className="h-[400px]"
                    isLoading={data.loading}
                    enableAnimation={!play}
                    mode="grouped"
                    interval={data.country_period === "day" ? "auto" : data.period}
                    data={{
                      labels: country_coords.x,
                      datasets: [
                        {
                          type: "line",
                          data: country_coords.immigration,
                          label: t("entrances"),
                          fill: true,
                          backgroundColor: AKSARA_COLOR.PURPLE_H,
                          borderColor: AKSARA_COLOR.PURPLE,
                          borderWidth: country_coords.x.length > 720 ? 1 : 1.5,
                        },
                        {
                          type: "line",
                          data: country_coords.emigration,
                          label: t("departures"),
                          fill: true,
                          backgroundColor: AKSARA_COLOR.DIM_H,
                          borderColor: AKSARA_COLOR.DIM,
                          borderWidth: country_coords.x.length > 720 ? 1 : 1.5,
                        },
                        {
                          type: "line",
                          data: country_coords.net_migration,
                          label: t("net_migration"),
                          fill: true,
                          backgroundColor:
                            theme === "light" ? AKSARA_COLOR.BLACK_H : AKSARA_COLOR.WHITE_H,
                          borderColor: theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                          borderDash: [2, 2],
                          borderWidth: country_coords.x.length > 720 ? 1 : 1.5,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("entrances"),
                        value: `+${numFormat(country_callout.entrances.value, "standard")}`,
                      },
                      {
                        title: t("departures"),
                        value: `-${numFormat(country_callout.departures.value, "standard")}`,
                      },
                      {
                        title: t("net_migration"),
                        value: numFormat(country_callout.net_migration.value, "standard"),
                      },
                    ]}
                  />
                  <Slider
                    type="range"
                    period={data.country_period}
                    value={data.country_minmax}
                    data={country.data[data.country_period].x}
                    onChange={e => setData("country_minmax", e)}
                  />
                </div>
              )}
            </SliderProvider>
          </div>
        </Section>
        {/* How are the Immigration Department’s counter operations trending? */}
        <Section
          title={t("timeseries_header")}
          date={country.data_as_of}
          description={t("timeseries_desc")}
          menu={
            <Tabs.List
              options={[t("common:time.daily"), t("common:time.monthly"), t("common:time.yearly")]}
              current={data.tab_index}
              onChange={index => {
                setData("tab_index", index);
                setData("period", period[index]);
              }}
            />
          }
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[300px] w-full"
                  title={t("passport")}
                  enableAnimation={!play}
                  interval={data.period === "day" ? "auto" : data.period}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.passport,
                        label: t(data.period),
                        fill: true,
                        backgroundColor: AKSARA_COLOR.PURPLE_H,
                        borderColor: AKSARA_COLOR.PURPLE,
                        borderWidth: coordinate.x.length > 720 ? 1 : 1.5,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:time.daily"),
                      value: `+${numFormat(timeseries_callout.passport.daily.value, "standard")}`,
                    },
                    {
                      title: t("this_year"),
                      value: numFormat(timeseries_callout.passport.year.value, "standard"),
                    },
                    {
                      title: t("active_passports"),
                      value: numFormat(timeseries_callout.passport.active.value, "standard"),
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period={data.period}
                  value={data.minmax}
                  data={timeseries.data.data[data.period].x}
                  onChange={e => setData("minmax", e)}
                />
                <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-3">
                  {["expatriate", "visit", "entry"].map((key: string, index: number) => (
                    <Timeseries
                      key={key}
                      title={t(key)}
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      interval={data.period === "day" ? "auto" : data.period}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[key],
                            label: t(data.period),
                            fill: true,
                            backgroundColor: AKSARA_COLOR.PURPLE_H,
                            borderColor: AKSARA_COLOR.PURPLE,
                            borderWidth: coordinate.x.length > 180 ? 0.75 : 1,
                          },
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:time.daily"),
                          value: `+${numFormat(timeseries_callout[key].daily.value, "standard")}`,
                        },
                        {
                          title: t("this_year"),
                          value: numFormat(timeseries_callout[key].year.value, "standard"),
                        },
                        {
                          title: index === 2 ? t("active_permits") : t("active_passes"),
                          value: numFormat(timeseries_callout[key].active.value, "standard"),
                        },
                      ]}
                    />
                  ))}
                </div>
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default Immigration;
