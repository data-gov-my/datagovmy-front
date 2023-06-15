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
import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { JIMIcon } from "@components/Icon/agency";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { getTopIndices, numFormat, toDate } from "@lib/helpers";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { ArrowRightIcon } from "@heroicons/react/20/solid";
import { get } from "@lib/api";
import { useTheme } from "next-themes";
import { GlobeAltIcon } from "@heroicons/react/24/outline";

/**
 * Immigration Dashboard
 * @overview Status: In-development
 */

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface ImmigrationProps {
  choropleth: any;
  countries: any;
  last_updated: any;
  timeseries: any;
  timeseries_callout: any;
  timeseries_country: any;
  timeseries_country_callout: any;
}

const Immigration: FunctionComponent<ImmigrationProps> = ({
  choropleth,
  countries,
  last_updated,
  timeseries,
  timeseries_callout,
  timeseries_country,
  timeseries_country_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-immigration", "common", "countries"]);
  const { theme } = useTheme();
  const COUNTRY_OPTIONS: Array<OptionType> = countries.map((key: string) => ({
    label: t(`countries:${key}`),
    value: key,
  }));
  const FILTER_OPTIONS: Array<OptionType> = [
    "absolute",
    "absolute_adult",
    "absolute_children",
    "per_capita",
    "per_capita_adult",
    "per_capita_children",
  ].map((key: string) => ({
    label: t(`${key}`),
    value: key,
  }));
  const { data, setData } = useData({
    tab_index: 0,
    tab_index_country: 0,
    timeseries: timeseries,
    timeseries_callout: timeseries_callout,
    timeseries_country: timeseries_country,
    timeseries_country_callout: timeseries_country_callout,
    minmax: [0, timeseries.data.data.day.x.length],
    country_minmax: [0, timeseries_country.data.day.x.length],
    query: "",
    country: COUNTRY_OPTIONS.find(e => e.value === "overall"),
    filter: FILTER_OPTIONS[0].value,
    loading: false,
  });
  const period: { [key: number]: "day" | "month" | "year" } = {
    0: "day",
    1: "month",
    2: "year",
  };
  const { coordinate } = useSlice(data.timeseries.data.data[period[data.tab_index]], data.minmax);
  const { coordinate: coordinate_country } = useSlice(
    data.timeseries_country.data[period[data.tab_index_country]],
    data.country_minmax
  );
  const PASSES = ["expatriate", "visit", "entry"];
  const topStateIndices = getTopIndices(choropleth.data[data.filter].y.value, 3, true);

  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.demography"), "text-[#7C3AED]"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:imigresen.full")}
            link="https://www.jpn.gov.my/en/"
            icon={<JIMIcon />}
          />
        }
        last_updated={last_updated}
      />

      <Container className="min-h-screen">
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-full w-full flex-col space-y-6 p-6 lg:p-8">
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
                  <div className="space-y-3 border-t pt-6">
                    <p className="font-bold">{t("choro_ranking")}</p>
                    {topStateIndices.map((pos, i) => {
                      return (
                        <div className="flex space-x-3" key={pos}>
                          <div className="text-dim font-medium">#{i + 1}</div>
                          <div className="grow">
                            {CountryAndStates[choropleth.data[data.filter].x[pos]]}
                          </div>
                          <div className="text-purple font-bold">
                            {numFormat(choropleth.data[data.filter].y.value[pos], "standard")}
                          </div>
                          <ArrowRightIcon className="text-dim h-4 w-4 self-center stroke-[1.5px]" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[500px] lg:w-full"
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
                  country: data.country.label,
                  context: data.country.value === "overall" && "overall",
                })}
              </h4>
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="mx-auto w-full md:w-96">
                  <ComboBox
                    enableFlag
                    imageSource="https://flagcdn.com/h20/"
                    fallback={<GlobeAltIcon className="w-4.5 h-4.5 mx-auto text-black" />}
                    placeholder={t("search_country")}
                    options={COUNTRY_OPTIONS}
                    selected={data.query ? COUNTRY_OPTIONS.find(e => e.value === data.query) : null}
                    onChange={selected => {
                      if (selected !== undefined) {
                        setData("loading", true);
                        get("/dashboard", {
                          dashboard: "immigration_country",
                          country: selected.value,
                        })
                          .then(({ data }) => {
                            if (data.timeseries_country && data.timeseries_country_callout) {
                              setData("timeseries_country", data.timeseries_country);
                              setData(
                                "timeseries_country_callout",
                                data.timeseries_country_callout
                              );
                            }
                            setData("country", selected);
                            setData("query", selected.value);
                            setData("loading", false);
                          })
                          .catch(e => {
                            console.error(e);
                          });
                      } else {
                        setData("query", undefined);
                      }
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
                        options={[t("day"), t("month"), t("year")]}
                        current={data.tab_index_country}
                        onChange={index => {
                          setData("tab_index_country", index);
                        }}
                      />
                    }
                    className="h-[400px] w-full"
                    isLoading={data.loading}
                    enableAnimation={!play}
                    mode="grouped"
                    interval={period[data.tab_index_country]}
                    round={period[data.tab_index_country]}
                    data={{
                      labels: coordinate_country.x,
                      datasets: [
                        {
                          type: "line",
                          data: coordinate_country.immigration,
                          label: t("entrances"),
                          backgroundColor: AKSARA_COLOR.PURPLE_H,
                          borderColor: AKSARA_COLOR.PURPLE,
                          borderWidth: 1.5,
                          fill: true,
                        },
                        {
                          type: "line",
                          data: coordinate_country.emigration,
                          label: t("departures"),
                          backgroundColor: AKSARA_COLOR.DIM_H,
                          borderColor: AKSARA_COLOR.DIM,
                          borderWidth: 1.5,
                          fill: true,
                        },
                        {
                          type: "line",
                          data: coordinate_country.net_migration,
                          label: t("net_migration"),
                          backgroundColor:
                            theme === "light" ? AKSARA_COLOR.BLACK_H : AKSARA_COLOR.WHITE,
                          borderColor: theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                          borderDash: [2, 2],
                          borderWidth: 1.5,
                          fill: true,
                        },
                      ],
                    }}
                    stats={[
                      {
                        title: t("entrances"),
                        value: `+${numFormat(
                          data.timeseries_country_callout.data["entrances"].value,
                          "standard"
                        )}`,
                      },
                      {
                        title: t("departures"),
                        value: `-${numFormat(
                          data.timeseries_country_callout.data["departures"].value,
                          "standard"
                        )}`,
                      },
                      {
                        title: t("net_migration"),
                        value: `${numFormat(
                          data.timeseries_country_callout.data["net_migration"].value,
                          "standard"
                        )}`,
                      },
                    ]}
                  />
                  <Slider
                    type="range"
                    period={period[data.tab_index_country]}
                    value={data.country_minmax}
                    data={data.timeseries_country.data[period[data.tab_index_country]].x}
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
          date={timeseries_country.data_as_of}
          description={t("timeseries_desc")}
          menu={
            <Tabs.List
              options={[t("day"), t("month"), t("year")]}
              current={data.tab_index}
              onChange={index => {
                setData("tab_index", index);
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
                  interval={period[data.tab_index]}
                  round={period[data.tab_index]}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.passport,
                        label: t(period[data.tab_index]),
                        backgroundColor: AKSARA_COLOR.PURPLE_H,
                        borderColor: AKSARA_COLOR.PURPLE,
                        borderWidth: 1.5,
                        fill: true,
                      },
                    ],
                  }}
                  stats={[
                    {
                      title: t("daily"),
                      value: `+${numFormat(
                        timeseries_callout.data.data["passport"].daily.value,
                        "standard"
                      )}`,
                    },
                    {
                      title: t("this_year"),
                      value: `${numFormat(
                        timeseries_callout.data.data["passport"].year.value,
                        "standard"
                      )}`,
                    },
                    {
                      title: t("active_passports"),
                      value: `${numFormat(
                        timeseries_callout.data.data["passport"].active.value,
                        "standard"
                      )}`,
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period={period[data.tab_index]}
                  value={data.minmax}
                  data={timeseries.data.data[period[data.tab_index]].x}
                  onChange={e => setData("minmax", e)}
                />
                <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-3">
                  {PASSES.map((key: string, index: number) => (
                    <Timeseries
                      key={key}
                      title={t(`${key}`)}
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      interval={period[data.tab_index]}
                      round={period[data.tab_index]}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[key],
                            label: t(period[data.tab_index]),
                            backgroundColor: AKSARA_COLOR.PURPLE_H,
                            borderColor: AKSARA_COLOR.PURPLE,
                            borderWidth: 1.5,
                            fill: true,
                          },
                        ],
                      }}
                      stats={[
                        {
                          title: t("daily"),
                          value: `+${numFormat(
                            timeseries_callout.data.data[key].daily.value,
                            "standard"
                          )}`,
                        },
                        {
                          title: t("this_year"),
                          value: `${numFormat(
                            timeseries_callout.data.data[key].year.value,
                            "standard"
                          )}`,
                        },
                        {
                          title: index === 2 ? t("active_permits") : t("active_passes"),
                          value: `${numFormat(
                            timeseries_callout.data.data[key].active.value,
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
      </Container>
    </>
  );
};

export default Immigration;
