import { Container, Dropdown, Hero, Section } from "@components/index";
import { FunctionComponent, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { numFormat, smartNumFormat, toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { useSlice } from "@hooks/useSlice";
import { useData } from "@hooks/useData";
import type { OptionType } from "@components/types";
import { AKSARA_COLOR, MYR_COLOR } from "@lib/constants";
import type { ChartDatasetProperties, ChartTypeRegistry } from "chart.js";
import Slider from "@components/Chart/Slider";
import { track } from "@lib/mixpanel";
import { routes } from "@lib/routes";
import { useWatch } from "@hooks/useWatch";

/**
 * Currency in Circulation Dashboard
 * @overview Status: Live
 */

export interface DenoData {
  x: string;
  y: number;
}

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });

interface CurrencyInCirculationDashboardProps {
  last_updated: number;
  bar: any;
  timeseries: any;
  timeseries_callouts: any;
}

const CurrencyInCirculationDashboard: FunctionComponent<CurrencyInCirculationDashboardProps> = ({
  last_updated,
  bar,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation();
  const INDEX_OPTIONS: Array<OptionType> = Object.keys(timeseries.data).map((key: string) => ({
    label: t(`currencyincirculation.keys.${key}`),
    value: key,
  }));
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("currencyincirculation.keys.no_shade"), value: "no_shade" },
    { label: t("currencyincirculation.keys.recession"), value: "recession" },
    { label: t("currencyincirculation.keys.eid"), value: "eid" },
    { label: t("currencyincirculation.keys.cny"), value: "cny" },
  ];

  const { data, setData } = useData({
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
  });
  const LATEST_TIMESTAMP =
    timeseries.data[data.index_type.value].x[timeseries.data[data.index_type.value].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.index_type.value], data.minmax);

  const shader = useCallback<
    (key: string) => ChartDatasetProperties<keyof ChartTypeRegistry, any[]>
  >(
    (key: string) => {
      if (key === "no_shade")
        return {
          data: [],
        };

      return {
        type: "line",
        data: coordinate[key],
        backgroundColor: AKSARA_COLOR.BLACK_H,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data]
  );

  const configs = useCallback<
    (key: string) => { prefix: string; unit: string; callout: string; fill: boolean }
  >(
    (key: string) => {
      const prefix =
        data.index_type.value.includes("value") && !data.index_type.value.includes("growth")
          ? "RM"
          : "";
      const unit = data.index_type.value.includes("growth") ? "%" : "";
      const callout = data.index_type.value.includes("growth")
        ? [
            numFormat(timeseries_callouts.data[data.index_type.value][key].callout, "standard", 2),
            unit,
          ].join("")
        : [
            prefix,
            smartNumFormat({
              value: timeseries_callouts.data[data.index_type.value][key].callout,
              locale: i18n.language,
              precision: [1, 1],
            }),
          ].join("");
      return {
        prefix,
        unit,
        callout,
        fill: data.shade_type.value === "no_shade",
      };
    },
    [data.index_type, data.shade_type, i18n]
  );

  /**
   * Sort barchart data according to name:
   * - Notes: RM 1, RM 5, RM 10, RM 20, RM 50, RM 100, Others
   * - Coins: 1 sen, 5 sen, 10 sen, 20 sen, 50 sen, Others
   *
   * @param data barchart data
   * @returns barchart data sorted according to deno name
   */
  const sortByDenoName = (data: DenoData[]) => {
    return data.sort((first, second) => {
      if (first.x === "others" || second.x === "others") {
        return 1;
      }

      if (first.x.length > second.x.length) {
        return 1;
      } else if (first.x.length < second.x.length) {
        return -1;
      } else {
        return 0;
      }
    });
  };

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "currencyincirculation.header",
      name_en: "Currency in Circulation",
      name_bm: "Mata Wang Dalam Edaran",
      route: routes.CURRENCY_IN_CIRCULATION,
    });
  }, []);

  useWatch(() => {
    setData("minmax", [0, timeseries.data[data.index_type.value].x.length - 1]);
  }, [data.index_type]);

  return (
    <>
      <Hero background="currency-in-circulation-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            {t("nav.megamenu.categories.financial_sector")}
          </span>
          <h3>{t("currencyincirculation.header")}</h3>
          <p className="text-dim">{t("currencyincirculation.description")}</p>

          <p className="text-sm text-dim">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* A snapshot of currency currently in circulation */}
        <Section title={t("currencyincirculation.section_1.title")} date={bar.data_as_of}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
            <BarMeter
              title={t("currencyincirculation.section_1.bar1_header")}
              data={sortByDenoName(bar.data.note_proportion)}
              layout="horizontal"
              unit="%"
              formatY={y => numFormat(y, "compact", [1, 1], "short", i18n.language)}
              formatX={x => t(`currencyincirculation.keys.${x}`)}
            />
            <BarMeter
              title={t("currencyincirculation.section_1.bar2_header")}
              data={sortByDenoName(bar.data.note_number)}
              layout="horizontal"
              className="flex-col"
              max={bar.data.note_number.reduce(
                (total: number, denoData: DenoData) => total + denoData.y,
                0
              )}
              formatY={y => numFormat(y, "compact", [1, 1], "long", i18n.language)}
              formatX={x => t(`currencyincirculation.keys.${x}`)}
            />
            <BarMeter
              title={t("currencyincirculation.section_1.bar3_header")}
              layout="horizontal"
              unit="%"
              data={sortByDenoName(bar.data.coin_proportion)}
              formatY={y => numFormat(y, "compact", [1, 1], "short", i18n.language)}
              formatX={x => t(`currencyincirculation.keys.${x}`)}
            />
            <BarMeter
              title={t("currencyincirculation.section_1.bar4_header")}
              layout="horizontal"
              data={sortByDenoName(bar.data.coin_number)}
              max={bar.data.coin_number.reduce(
                (total: number, denoData: DenoData) => total + denoData.y,
                0
              )}
              formatY={y => numFormat(y, "compact", [1, 1], "long", i18n.language)}
              formatX={x => t(`currencyincirculation.keys.${x}`)}
            />
          </div>
        </Section>

        {/* How is currency in circulation trending? */}
        <Section title={t("currencyincirculation.section_2.title")} date={timeseries.data_as_of}>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
              <Dropdown
                anchor="left"
                selected={data.index_type}
                options={INDEX_OPTIONS}
                onChange={e => setData("index_type", e)}
              />
              <Dropdown
                anchor="left"
                options={SHADE_OPTIONS}
                selected={data.shade_type}
                onChange={e => setData("shade_type", e)}
              />
            </div>

            <Slider
              type="range"
              value={data.minmax}
              data={timeseries.data[data.index_type.value].x}
              period="month"
              onChange={e => setData("minmax", e)}
            />
            <Timeseries
              title={t("currencyincirculation.keys.overall")}
              className="h-[350px] w-full"
              interval="month"
              displayNumFormat={(value, type, precision) =>
                smartNumFormat({ value, type, precision, locale: i18n.language })
              }
              unitY={configs("total").unit}
              prefixY={configs("total").prefix}
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
                    data: coordinate.total,
                    label: t("currencyincirculation.keys.overall"),
                    borderColor: AKSARA_COLOR.PRIMARY,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    borderWidth: 1.5,
                    fill: configs("total").fill,
                  },
                  shader(data.shade_type.value),
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: configs("total").callout,
                },
              ]}
            />

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <Timeseries
                title={t("currencyincirculation.keys.rm1_notes")}
                className="h-[350px] w-full"
                interval="month"
                displayNumFormat={(value, type, precision) =>
                  smartNumFormat({ value, type, precision, locale: i18n.language })
                }
                unitY={configs("note_1").unit}
                prefixY={configs("note_1").prefix}
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
                      label: t("currencyincirculation.keys.note_1"),
                      data: coordinate.note_1,
                      borderColor: MYR_COLOR.RM1,
                      backgroundColor: MYR_COLOR.RM1_H,
                      fill: configs("note_1").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("note_1").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("currencyincirculation.keys.rm5_notes")}
                className="h-[350px] w-full"
                interval="month"
                displayNumFormat={(value, type, precision) =>
                  smartNumFormat({ value, type, precision, locale: i18n.language })
                }
                unitY={configs("note_5").unit}
                prefixY={configs("note_5").prefix}
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
                      label: t("currencyincirculation.keys.note_5"),
                      data: coordinate.note_5,
                      borderColor: MYR_COLOR.RM5,
                      backgroundColor: MYR_COLOR.RM5_H,
                      fill: configs("note_5").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("note_5").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("currencyincirculation.keys.rm10_notes")}
                className="h-[350px] w-full"
                interval="month"
                displayNumFormat={(value, type, precision) =>
                  smartNumFormat({ value, type, precision, locale: i18n.language })
                }
                unitY={configs("note_10").unit}
                prefixY={configs("note_10").prefix}
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
                      label: t("currencyincirculation.keys.note_10"),
                      data: coordinate.note_10,
                      borderColor: MYR_COLOR.RM10,
                      backgroundColor: MYR_COLOR.RM10_H,
                      fill: configs("note_10").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("note_10").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("currencyincirculation.keys.rm20_notes")}
                className="h-[350px] w-full"
                interval="month"
                displayNumFormat={(value, type, precision) =>
                  smartNumFormat({ value, type, precision, locale: i18n.language })
                }
                unitY={configs("note_20").unit}
                prefixY={configs("note_20").prefix}
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
                      label: t("currencyincirculation.keys.note_20"),
                      data: coordinate.note_20,
                      borderColor: MYR_COLOR.RM20,
                      backgroundColor: MYR_COLOR.RM20_H,
                      fill: configs("note_20").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("note_20").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("currencyincirculation.keys.rm50_notes")}
                className="h-[350px] w-full"
                interval="month"
                displayNumFormat={(value, type, precision) =>
                  smartNumFormat({ value, type, precision, locale: i18n.language })
                }
                unitY={configs("note_50").unit}
                prefixY={configs("note_50").prefix}
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
                      label: t("currencyincirculation.keys.note_50"),
                      data: coordinate.note_50,
                      borderColor: MYR_COLOR.RM50,
                      backgroundColor: MYR_COLOR.RM50_H,
                      fill: configs("note_50").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("note_50").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("currencyincirculation.keys.rm100_notes")}
                className="h-[350px] w-full"
                interval="month"
                displayNumFormat={(value, type, precision) =>
                  smartNumFormat({ value, type, precision, locale: i18n.language })
                }
                unitY={configs("note_100").unit}
                prefixY={configs("note_100").prefix}
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
                      label: t("currencyincirculation.keys.note_100"),
                      data: coordinate.note_100,
                      borderColor: MYR_COLOR.RM100,
                      backgroundColor: MYR_COLOR.RM100_H,
                      fill: configs("note_100").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("note_100").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("currencyincirculation.keys.10_sen_coins")}
                className="h-[350px] w-full"
                interval="month"
                displayNumFormat={(value, type, precision) =>
                  smartNumFormat({ value, type, precision, locale: i18n.language })
                }
                unitY={configs("coin_10").unit}
                prefixY={configs("coin_10").prefix}
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
                      label: t("currencyincirculation.keys.coin_10"),
                      data: coordinate.coin_10,
                      borderColor: MYR_COLOR.SEN10,
                      backgroundColor: MYR_COLOR.SEN10_H,
                      fill: configs("coin_10").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("coin_10").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("currencyincirculation.keys.20_sen_coins")}
                className="h-[350px] w-full"
                interval="month"
                displayNumFormat={(value, type, precision) =>
                  smartNumFormat({ value, type, precision, locale: i18n.language })
                }
                unitY={configs("coin_20").unit}
                prefixY={configs("coin_20").prefix}
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
                      label: t("currencyincirculation.keys.coin_20"),
                      data: coordinate.coin_20,
                      borderColor: MYR_COLOR.SEN20,
                      backgroundColor: MYR_COLOR.SEN20_H,
                      fill: configs("coin_20").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("coin_20").callout,
                  },
                ]}
              />
              <Timeseries
                title={t("currencyincirculation.keys.50_sen_coins")}
                className="h-[350px] w-full"
                interval="month"
                displayNumFormat={(value, type, precision) =>
                  smartNumFormat({ value, type, precision, locale: i18n.language })
                }
                unitY={configs("coin_50").unit}
                prefixY={configs("coin_50").prefix}
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
                      label: t("currencyincirculation.keys.coin_50"),
                      data: coordinate.coin_50,
                      borderColor: MYR_COLOR.SEN50,
                      backgroundColor: MYR_COLOR.SEN50_H,
                      fill: configs("coin_50").fill,
                      borderWidth: 1.5,
                    },
                    shader(data.shade_type.value),
                  ],
                }}
                stats={[
                  {
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: configs("coin_50").callout,
                  },
                ]}
              />
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CurrencyInCirculationDashboard;
