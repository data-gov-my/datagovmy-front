import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { routes } from "@lib/routes";
import type { Periods } from "datagovmy-ui/charts/timeseries";
import { ComboBox, ImageWithFallback, Section, Slider, Tabs } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { DashboardPeriod, OptionType, WithData } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useMemo } from "react";

type EntryAndDepartureKeys = "x" | "in" | "out" | "net";

export interface EntranceAndDepartureProps {
  last_updated: string;
  countries: {
    info: {
      total: number;
    };
    data: string[];
  };
  params?: {
    country: string;
  };
  timeseries: WithData<Record<DashboardPeriod, Record<EntryAndDepartureKeys, number[]>>>;
  timeseries_callout: WithData<{
    in: number;
    out: number;
    net: number;
  }>;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const EntranceAndDeparture: FunctionComponent<EntranceAndDepartureProps> = ({
  timeseries,
  timeseries_callout,
  countries,
  params,
}) => {
  const { t, i18n } = useTranslation(["dashboard-immigration", "countries", "common"]);
  const COUNTRY_OPTIONS: Array<OptionType> = countries.data.map((key: string) => ({
    label: t(`countries:${key}`),
    value: key,
  }));
  const PERIODS: Array<DashboardPeriod> = [
    "monthly",
    "yearly",
    // TODO: remove elements above and add comment elements
    // "daily_7d", "daily", "monthly", "yearly"
  ];

  const { data, setData } = useData({
    tab: 0,
    country: params?.country,
    minmax: [0, timeseries.data.monthly.x.length - 1],
    loading: false,
  });

  const { push } = useRouter();
  const { theme } = useTheme();

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
  const { coordinate } = useSlice(timeseries.data[config.key], data.minmax);

  const navigateToCountry = (country: string) => {
    setData("loading", true);
    setData("country", country);
    push(`${routes.IMMIGRATION}/${country}`, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  return (
    <Section>
      <div className="space-y-6 pb-12">
        <h4 className="lg:text-center">
          {t("section_1.title", {
            country: t(`countries:${params?.country ?? "ALL"}`),
            context: params?.country ?? "ALL",
          })}
        </h4>
        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="mx-auto w-full md:w-96">
            <ComboBox
              image={value => (
                <div className="flex h-auto max-h-8 w-8 justify-center self-center">
                  <ImageWithFallback
                    className="border-outline dark:border-outlineHover-dark rounded border"
                    src={`https://flagcdn.com/h40/${value.toLowerCase()}.png`}
                    fallback={<GlobeAltIcon className="w-4.5 h-4.5 mx-auto text-black" />}
                    width={28}
                    height={18}
                    alt={value}
                    style={{
                      width: "auto",
                      maxWidth: "28px",
                      height: "auto",
                      maxHeight: "28px",
                    }}
                  />
                </div>
              )}
              placeholder={t("section_1.search_placeholder")}
              options={COUNTRY_OPTIONS}
              selected={data.country ? COUNTRY_OPTIONS.find(e => e.value === data.country) : null}
              onChange={selected => {
                if (selected) navigateToCountry(selected.value);
                else setData("country", null);
              }}
              config={{
                keys: ["label"],
                baseSort: (a, b) => {
                  if (a.item.value === "ALL") return -1;
                  else if (b.item.value === "ALL") return 1;
                  return a.item.label.localeCompare(b.item.label);
                },
              }}
            />
          </div>
          <p className="text-dim text-sm lg:text-center">{t("section_1.description")}</p>
        </div>
      </div>

      <SliderProvider>
        {play => (
          <>
            <Timeseries
              title={t("section_1.timeseries_title")}
              menu={
                <Tabs.List
                  options={[
                    // TODO: TO be readded
                    // t("common:time.daily_7d"),
                    // t("common:time.daily"),
                    t("common:time.monthly"),
                    t("common:time.yearly"),
                  ]}
                  current={data.tab}
                  onChange={index => setData("tab", index)}
                />
              }
              className="h-[300px]"
              isLoading={data.loading}
              enableAnimation={!play}
              mode="grouped"
              enableMajorTick
              displayType="standard"
              precision={[0, 0]}
              interval={config.period}
              data={{
                labels: coordinate.x,
                datasets: [
                  {
                    type: "line",
                    data: coordinate.in,
                    label: t("keys.entrances"),
                    fill: true,
                    backgroundColor: AKSARA_COLOR.PURPLE_H,
                    borderColor: AKSARA_COLOR.PURPLE,
                    borderWidth: coordinate.x.length > 720 ? 1 : 1.5,
                  },
                  {
                    type: "line",
                    data: coordinate.out,
                    label: t("keys.departures"),
                    fill: true,
                    backgroundColor: AKSARA_COLOR.DIM_H,
                    borderColor: AKSARA_COLOR.DIM,
                    borderWidth: coordinate.x.length > 720 ? 1 : 1.5,
                  },
                  {
                    type: "line",
                    data: coordinate.net,
                    label: t("keys.net_migration"),
                    fill: true,
                    backgroundColor:
                      theme === "light" ? AKSARA_COLOR.BLACK_H : AKSARA_COLOR.WHITE_H,
                    borderColor: theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                    borderDash: [2, 2],
                    borderWidth: coordinate.x.length > 720 ? 1 : 1.5,
                  },
                ],
              }}
              stats={[
                {
                  title: `${t("keys.entrances")} (${new Date(
                    timeseries.data[config.key].x.at(-1)!
                  ).getFullYear()})`,
                  value: `+${numFormat(timeseries_callout.data.in, "standard")}`,
                },
                // TODO: TO be readded
                // {
                //   title: `${t("keys.departures")} (${new Date(
                //     timeseries.data[config.key].x.at(-1)!
                //   ).getFullYear()})`,
                //   value: `-${numFormat(timeseries_callout.data.out, "standard")}`,
                // },
                // {
                //   title: `${t("keys.net_migration")} (${new Date(
                //     timeseries.data[config.key].x.at(-1)!
                //   ).getFullYear()})`,
                //   value: numFormat(timeseries_callout.data.net, "standard"),
                // },
              ]}
            />
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
  );
};

export default EntranceAndDeparture;
