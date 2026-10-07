import { routes } from "@lib/routes";
import { ComboBox, Section, Slider, Tabs } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useMemo } from "react";
import Flag from "./flag";
import { growth, Series, toYearly } from "./types";

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

export interface CountryArrivalsProps {
  countries: string[];
  data_as_of: string;
  /** Monthly axis in epoch ms, shared by every country's series */
  x: number[];
  /** Every country's monthly series, keyed by ISO2 plus "ALL" */
  timeseries: Record<string, Record<"total" | "male" | "female", number[]>>;
}

const PERIODS = [
  { key: "monthly", interval: "month" },
  { key: "yearly", interval: "year" },
] as const;

const CountryArrivals: FunctionComponent<CountryArrivalsProps> = ({
  countries,
  data_as_of,
  x,
  timeseries: allSeries,
}) => {
  const { t, i18n } = useTranslation(["dashboard-immigration", "countries", "common"]);
  const { query, push } = useRouter();
  const { theme } = useTheme();

  // The page is static, so the country lives in the query string and is resolved here
  const requested = typeof query.country === "string" ? query.country.toUpperCase() : "ALL";
  const country = allSeries[requested] ? requested : "ALL";

  const timeseries = useMemo<Record<"monthly" | "yearly", Series>>(() => {
    const monthly: Series = { x, ...allSeries[country] };
    return { monthly, yearly: toYearly(monthly) };
  }, [allSeries, country, x]);

  const COUNTRY_OPTIONS = useMemo<OptionType[]>(
    () => countries.map(key => ({ label: t(`countries:${key}`), value: key })),
    [countries, i18n.language]
  );

  const { data, setData } = useData({
    tab: 0,
    minmax: [0, timeseries.monthly.x.length - 1],
  });

  // A new country brings a new series; reset the range to show all of it
  useEffect(() => {
    const series = timeseries[PERIODS[data.tab].key];
    setData("minmax", [0, series.x.length - 1]);
  }, [timeseries, data.tab]);

  const period = PERIODS[data.tab];
  const series = timeseries[period.key];
  const { coordinate } = useSlice(series, data.minmax);

  const monthly = timeseries.monthly;
  const latest = monthly.total.at(-1) ?? 0;
  const yoy = growth(monthly.total, 12);
  const last12 = monthly.total.slice(-12).reduce((a, b) => a + b, 0);

  // Shallow: every series is already on the page, so there is nothing to refetch
  const navigateToCountry = (selected: string) =>
    push(
      selected === "ALL" ? routes.IMMIGRATION : `${routes.IMMIGRATION}?country=${selected}`,
      undefined,
      { shallow: true, scroll: false }
    );

  return (
    <Section>
      <div className="space-y-6 pb-8">
        <h4 className="text-center">
          {t("section_2.title", {
            country: t(`countries:${country}`),
            context: country === "ALL" ? "ALL" : undefined,
          })}
        </h4>
        <div className="mx-auto w-full md:w-96">
          <ComboBox
            image={value => <Flag country={value} />}
            size="sm"
            placeholder={t("section_2.search_placeholder")}
            options={COUNTRY_OPTIONS}
            selected={COUNTRY_OPTIONS.find(e => e.value === country) ?? null}
            onChange={selected => {
              if (selected && selected.value !== country) navigateToCountry(selected.value);
            }}
            config={{
              keys: ["label", "value"],
              baseSort: (a, b) => {
                if (a.item.value === "ALL") return -1;
                else if (b.item.value === "ALL") return 1;
                return a.item.label.localeCompare(b.item.label);
              },
            }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <SliderProvider>
          {play => (
            <>
              <Timeseries
                className="h-[350px]"
                title={t("section_2.timeseries_title", { country: t(`countries:${country}`) })}
                menu={
                  <Tabs.List
                    options={[t("common:time.monthly"), t("common:time.yearly")]}
                    current={data.tab}
                    onChange={index => setData("tab", index)}
                  />
                }
                enableAnimation={!play}
                enableLegend
                legendAlign="center"
                interval={period.interval}
                precision={[1, 0]}
                data={{
                  labels: coordinate.x,
                  datasets: [
                    {
                      type: "bar",
                      data: coordinate.male,
                      label: t("keys.male"),
                      borderColor: AKSARA_COLOR.PRIMARY,
                      backgroundColor: AKSARA_COLOR.PRIMARY_H,
                      borderWidth: 1,
                      stack: "sex",
                    },
                    {
                      type: "bar",
                      data: coordinate.female,
                      label: t("keys.female"),
                      borderColor: AKSARA_COLOR.PINK,
                      backgroundColor: AKSARA_COLOR.PINK_H,
                      borderWidth: 1,
                      stack: "sex",
                    },
                    {
                      // Drawn over the bars, so arrivals with no recorded sex (from 2026-03)
                      // show as the gap between the bars and this line
                      type: "line",
                      data: coordinate.total,
                      label: t("keys.overall"),
                      borderColor: theme === "dark" ? AKSARA_COLOR.WHITE : AKSARA_COLOR.BLACK,
                      borderWidth: 1.5,
                      pointRadius: 0,
                      stack: "total",
                      order: -1,
                    },
                  ],
                }}
                stats={[
                  {
                    title: t("section_2.stat_latest", {
                      month: toDate(data_as_of, "MMM yyyy", i18n.language),
                    }),
                    value: numFormat(latest, "standard"),
                  },
                  {
                    title: t("section_2.stat_yoy"),
                    value:
                      yoy === null
                        ? "-"
                        : `${yoy > 0 ? "+" : ""}${numFormat(yoy, "standard", [1, 1])}%`,
                  },
                  {
                    title: t("section_2.stat_12m"),
                    value: numFormat(last12, "standard"),
                  },
                ]}
              />
              <Slider
                type="range"
                period={period.interval}
                value={data.minmax}
                data={series.x}
                onChange={e => setData("minmax", e)}
              />
            </>
          )}
        </SliderProvider>
      </div>
    </Section>
  );
};

export default CountryArrivals;
