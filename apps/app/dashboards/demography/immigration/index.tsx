import {
  AgencyBadge,
  ComboBox,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  Section,
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
  const { t, i18n } = useTranslation(["dashboard-immigration", "common"]);
  const COUNTRY_OPTIONS: Array<OptionType> = countries.map((key: string) => ({
    label: t(key),
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
    timeseries_country: timeseries_country,
    timeseries_country_callout: timeseries_country_callout,
    minmax: [0, timeseries.data.data.x.length],
    country_minmax: [0, timeseries_country.data.x.length],
    country: COUNTRY_OPTIONS[0],
    country_label: "AFG",
    filter: FILTER_OPTIONS[0],
  });
  const { coordinate } = useSlice(timeseries.data.data, data.minmax);
  const { coordinate: coordinate_country } = useSlice(
    data.timeseries_country.data,
    data.country_minmax
  );
  const PASS = ["expatriate", "visit", "entry"];
  const topStateIndices = getTopIndices(choropleth.data[data.filter.value].y.value, 3, true);

  return (
    <>
      <Hero
        background="purple"
        category={[t("common:categories.demography"), "text-[#7C3AED]"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={t("common:agency.Imigresen")}
            link="https://www.jpn.gov.my/en/"
            icon={<JIMIcon />}
          />
        }
        last_updated={last_updated}
      />

      <Container className="min-h-screen">
        <div className="grid w-full grid-cols-12 pt-12 lg:grid-cols-10">
          <div className="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-4">
            <ComboBox
              placeholder={t("search_country")}
              options={COUNTRY_OPTIONS}
              selected={
                data.country ? COUNTRY_OPTIONS.find(e => e.value === data.country.value) : undefined
              }
              onChange={country => {
                setData("country", country);
                if (country) {
                  get("/dashboard", { dashboard: "immigration", country: country.value })
                    .then(({ data }) => {
                      console.log(data);
                      setData("timeseries_country", data.timeseries_country);
                      setData("timeseries_country_callout", data.timeseries_country_callout);
                    })
                    .catch(e => {
                      console.error(e);
                    });
                  setData("country_label", country.label);
                }
              }}
            />
          </div>
        </div>
        {/* How many people from {{ country }} are entering and leaving the country? */}
        <Section
          title={t("country_header", { country: data.country_label })}
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[600px] w-full"
                  title={t("country_title")}
                  enableAnimation={!play}
                  interval="day"
                  data={{
                    labels: coordinate_country.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate_country.daily,
                        label: t("entrances"),
                        backgroundColor: AKSARA_COLOR.PURPLE_H,
                        borderColor: AKSARA_COLOR.PURPLE,
                        borderWidth: 1.5,
                        fill: true,
                      },
                      {
                        type: "line",
                        data: coordinate_country.daily.map((n: number) => (n > 0 ? -n : n)),
                        label: t("departures"),
                        backgroundColor: AKSARA_COLOR.PURPLE_H,
                        borderColor: AKSARA_COLOR.PURPLE,
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
                  value={data.country_minmax}
                  data={timeseries_country.data.x}
                  onChange={e => setData("country_minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-full w-full flex-col space-y-6 p-8">
                <div className="flex flex-col gap-2">
                  <h4>{t("choro_header")}</h4>
                  <span className="font-dim text-sm">
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
                  selected={FILTER_OPTIONS.find(e => e.value === data.filter.value)}
                  onChange={e => setData("filter", e)}
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
                            {CountryAndStates[choropleth.data[data.filter.value].x[pos]]}
                          </div>
                          <div className="text-purple font-bold">
                            {numFormat(choropleth.data[data.filter.value].y.value[pos], "standard")}
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
              <>
                <Choropleth
                  className="h-[400px] w-auto rounded-b lg:h-[500px] lg:w-full"
                  data={{
                    labels: choropleth.data[data.filter.value].x.map(
                      (state: string) => CountryAndStates[state]
                    ),
                    values: choropleth.data[data.filter.value].y.value,
                  }}
                  type="state"
                  color="purples"
                />
              </>
            }
          />
        </Section>
        {/* How are the Immigration Department’s counter operations trending? */}
        <Section title={t("timeseries_header")}>
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[300px] w-full"
                  title={t("passport")}
                  enableAnimation={!play}
                  interval="day"
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.passport,
                        label: t("entrances"),
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
                      value: `+${numFormat(
                        timeseries_callout.data.data["passport"].year.value,
                        "standard"
                      )}`,
                    },
                    {
                      title: t("active_passports"),
                      value: `+${numFormat(
                        timeseries_callout.data.data["passport"].pass.value,
                        "standard"
                      )}`,
                    },
                  ]}
                />
                <Slider
                  type="range"
                  value={data.minmax}
                  data={timeseries.data.data.x}
                  onChange={e => setData("minmax", e)}
                />
                <div className="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-3">
                  {PASS.map((key: string, index: number) => (
                    <Timeseries
                      key={key}
                      title={t(`${key}`)}
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      interval="day"
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            data: coordinate[key],
                            label: t("daily"),
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
                            timeseries_callout.data.data[key].pass.value,
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
