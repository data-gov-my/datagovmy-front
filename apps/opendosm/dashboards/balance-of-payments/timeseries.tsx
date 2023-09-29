import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { Container, Dropdown, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { FunctionComponent, useCallback } from "react";

/**
 * Balance Of Payments Timeseries
 * @overview Status: Live
 */

interface TimeseriesChartData {
  title: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
  prefix: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const Balances = [
  "x",
  "bop",
  "ca",
  "fa",
  "ka",
  "ca_goods",
  "ca_services",
  "ca_primary",
  "ca_secondary",
  "fa_dia",
  "fa_pi",
  "fa_derivatives",
  "fa_other",
  "neo",
  "recession",
];

const BalancesExtra = ["bop_forex", "bop_imf", "bop_sdr", "ka_nfa", "ka_transfer"];

interface BalanceOfPaymentsProps {
  timeseries: WithData<{
    credit: Record<(typeof Balances)[number], number[]>;
    debit: Record<(typeof Balances)[number], number[]>;
    net: Record<(typeof Balances)[number], number[]>;
  }>;
  timeseries_callout: WithData<{
    credit: Record<(typeof Balances)[number] & (typeof BalancesExtra)[number], number[]>;
    debit: Record<(typeof Balances)[number] & (typeof BalancesExtra)[number], number[]>;
    net: Record<(typeof Balances)[number] & (typeof BalancesExtra)[number], number[]>;
  }>;
}

const BalanceOfPaymentsTimeseries: FunctionComponent<BalanceOfPaymentsProps> = ({
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-bop", "agencies", "common"]);
  const { theme } = useTheme();

  const INDEX_OPTIONS: Array<OptionType> = [
    { label: t("keys.net"), value: "net" },
    { label: t("keys.credit"), value: "credit" },
    { label: t("keys.debit"), value: "debit" },
  ];
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];
  const { data, setData } = useData({
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
    index: INDEX_OPTIONS[0].value,
    shade: SHADE_OPTIONS[0].value,
  });
  const LATEST_TIMESTAMP = timeseries.data[data.index].x[timeseries.data[data.index].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.index], data.minmax);

  const shader = useCallback<(key: string) => ChartDataset<keyof ChartTypeRegistry, any[]>>(
    (key: string) => {
      if (key === "no_shade")
        return {
          data: [],
        };

      return {
        type: "line",
        data: coordinate[key],
        backgroundColor: theme === "light" ? AKSARA_COLOR.BLACK_H : AKSARA_COLOR.WASHED_DARK,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data, theme]
  );
  const prefixRM = (value: number, usePositiveSign: boolean = true) =>
    value > 0 ? (usePositiveSign ? "+RM" : "RM") : "-RM";

  const getChartData = (charts: string[]): TimeseriesChartData[] => {
    return charts.map(name => ({
      title: t(`keys.${name}`),
      prefix: "RM ",
      label: t(`keys.${name}`),
      data: coordinate[name],
      fill: data.shade === "no_shade",
      stats: [
        {
          title: t("common:common.latest", {
            date: toDate(
              LATEST_TIMESTAMP,
              `${i18n.language === "ms-MY" ? "'ST'" : ""}q${
                i18n.language === "ms-MY" ? "" : "Q"
              } yyyy`,
              i18n.language
            ),
          }),
          value: [
            prefixRM(timeseries_callout.data[data.index][name].latest, false),
            numFormat(
              Math.abs(timeseries_callout.data[data.index][name].latest),
              "compact",
              1,
              "long",
              i18n.language,
              false
            ),
          ].join(""),
        },
        {
          title: t("keys.qoq_change"),
          value: [
            prefixRM(timeseries_callout.data[data.index][name].change),
            numFormat(
              Math.abs(timeseries_callout.data[data.index][name].change),
              "compact",
              1,
              "long",
              i18n.language,
              false
            ),
          ].join(""),
        },
      ],
    }));
  };

  return (
    <>
      <Container className="min-h-screen">
        <Section
          title={t("section_timeseries.title")}
          description={
            <div className="flex flex-col gap-4">
              <p className={"whitespace-pre-line text-base"}>
                {t("section_timeseries.description")}
              </p>
              <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                {/* <Dropdown
                  anchor="left"
                  options={INDEX_OPTIONS}
                  selected={INDEX_OPTIONS.find(option => data.index === option.value)}
                  onChange={e => setData("index", e.value)}
                /> */}
                <Dropdown
                  anchor="left"
                  options={SHADE_OPTIONS}
                  selected={SHADE_OPTIONS.find(option => data.shade === option.value)}
                  onChange={e => setData("shade", e.value)}
                />
              </div>
            </div>
          }
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  enableAnimation={false}
                  className="h-[350px] w-full"
                  interval="quarter"
                  displayNumFormat={value =>
                    [
                      prefixRM(value, false),
                      numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
                    ].join("")
                  }
                  tooltipCallback={item =>
                    [
                      item.dataset.label + ": ",
                      prefixRM(item.parsed.y, false),
                      numFormat(
                        Math.abs(item.parsed.y),
                        "compact",
                        1,
                        "long",
                        i18n.language,
                        false
                      ),
                    ].join("")
                  }
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
                        data: coordinate.bop,
                        label: t("keys.bop"),
                        fill: data.shade === "no_shade",
                        backgroundColor: AKSARA_COLOR.PRIMARY_H,
                        borderColor: AKSARA_COLOR.PRIMARY,
                        borderWidth: coordinate.x.length > 200 ? 1.0 : 1.5,
                      },
                      shader(data.shade),
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:common.latest", {
                        date: toDate(
                          LATEST_TIMESTAMP,
                          `${i18n.language === "ms-MY" ? "'ST'" : ""}q${
                            i18n.language === "ms-MY" ? "" : "Q"
                          } yyyy`,
                          i18n.language
                        ),
                      }),
                      value: [
                        prefixRM(timeseries_callout.data[data.index].bop.latest),
                        numFormat(
                          Math.abs(timeseries_callout.data[data.index].bop.latest),
                          "compact",
                          1,
                          "long",
                          i18n.language,
                          false
                        ),
                      ].join(""),
                    },
                    {
                      title: t("keys.qoq_change"),
                      value: [
                        prefixRM(timeseries_callout.data[data.index].bop.change),
                        numFormat(
                          Math.abs(timeseries_callout.data[data.index].bop.change),
                          "compact",
                          1,
                          "long",
                          i18n.language,
                          false
                        ),
                      ].join(""),
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period={"quarter"}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[data.index].x}
                />
                <Section>
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {getChartData([
                      "ca",
                      "fa",
                      "ka",
                      "ca_goods",
                      "ca_services",
                      "ca_primary",
                      "ca_secondary",
                      "fa_dia",
                      "fa_pi",
                    ]).map(({ title, prefix, label, data: datum, fill, stats }) => (
                      <Timeseries
                        key={title}
                        title={title}
                        className="h-[350px] w-full"
                        interval="quarter"
                        enableAnimation={!play}
                        displayNumFormat={value =>
                          [
                            prefixRM(value, false),
                            numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
                          ].join("")
                        }
                        tooltipCallback={item =>
                          [
                            item.dataset.label + ": ",
                            prefixRM(item.parsed.y, false),
                            numFormat(
                              Math.abs(item.parsed.y),
                              "compact",
                              1,
                              "long",
                              i18n.language,
                              false
                            ),
                          ].join("")
                        }
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
                              backgroundColor: AKSARA_COLOR.PRIMARY_H,
                              borderColor: AKSARA_COLOR.PRIMARY,
                              fill: fill,
                              borderWidth: 1.5,
                            },
                            shader(data.shade),
                          ],
                        }}
                        stats={stats}
                      />
                    ))}
                  </div>
                </Section>
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default BalanceOfPaymentsTimeseries;
