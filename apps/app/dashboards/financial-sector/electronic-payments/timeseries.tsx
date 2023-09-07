import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { Container, Dropdown, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";
import { useTheme } from "next-themes";

/**
 * Electronic Payments Timeseries
 * @overview Status: Live
 */

export interface TimeseriesChartData {
  title: string;
  label: string;
  data: number[];
  fill: boolean;
  stats: Array<{ title: string; value: string }>;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

const INSTRUMENTS = [
  "x",
  "charge_f2f",
  "charge_online",
  "cheque",
  "credit_f2f",
  "credit_online",
  "debit_f2f",
  "debit_online",
  "emoney",
  "recession",
] as const;

const SYSTEMS = ["x", "dd", "fpx", "ibg", "jompay", "rentas", "rpp", "recession"] as const;

const CHANNELS = [
  "x",
  "atm_cwd",
  "atm_fin",
  "internet_corp",
  "internet_indiv",
  "mobile",
  "recession",
] as const;

type InstrumentsType = (typeof INSTRUMENTS)[number];
type SystemsType = (typeof SYSTEMS)[number];
type ChannelsType = (typeof CHANNELS)[number];

type EpaymentsOptions = "value" | "volume";

type InstrumentsProps = {
  series: "instruments";
  timeseries: WithData<Record<EpaymentsOptions, Record<InstrumentsType, number[]>>>;
  timeseries_callout: WithData<
    Record<
      EpaymentsOptions,
      Record<Exclude<InstrumentsType, "x" | "recession">, { latest: number }>
    >
  >;
};
type ChannelsProps = {
  series: "channels";
  timeseries: WithData<Record<EpaymentsOptions, Record<ChannelsType, number[]>>>;
  timeseries_callout: WithData<
    Record<EpaymentsOptions, Record<Exclude<ChannelsType, "x" | "recession">, { latest: number }>>
  >;
};
type SystemsProps = {
  series: "systems";
  timeseries: WithData<Record<EpaymentsOptions, Record<SystemsType, number[]>>>;
  timeseries_callout: WithData<
    Record<EpaymentsOptions, Record<Exclude<SystemsType, "x" | "recession">, { latest: number }>>
  >;
};

type ElectronicPaymentsProps =
  | InstrumentsProps
  | ChannelsProps
  | SystemsProps
  | {
      series: any;
      timeseries: any;
      timeseries_callout: any;
    };

const ElectronicPaymentsTimeseries: FunctionComponent<ElectronicPaymentsProps> = ({
  timeseries,
  timeseries_callout,
  series,
}) => {
  const { t, i18n } = useTranslation(["dashboard-electronic-payments"]);
  const { theme } = useTheme();

  const INDEX_OPTIONS: Array<OptionType> = [
    { label: t("keys.volume"), value: "volume" },
    { label: t("keys.value"), value: "value" },
  ];
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];
  const { data, setData } = useData({
    minmax: [0, timeseries.data.volume.x.length - 1],
    index: INDEX_OPTIONS[0].value,
    shade: SHADE_OPTIONS[0].value,
  });

  const index = data.index as EpaymentsOptions;

  const LATEST_TIMESTAMP = timeseries.data[index].x[timeseries.data[index].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[index], data.minmax);

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

  const getCharts = (series: "systems" | "instruments" | "channels") => {
    switch (series) {
      case "instruments":
        return [
          "credit_f2f",
          "credit_online",
          "debit_f2f",
          "debit_online",
          "charge_f2f",
          "charge_online",
          "emoney",
          "cheque",
        ];

      case "systems":
        return ["rentas", "ibg", "fpx", "dd", "jompay", "rpp"];

      case "channels":
        return ["atm_cwd", "atm_fin", "mobile", "internet_indiv", "internet_corp"];
    }
  };

  const plotTimeseries = (charts: any, play: boolean) => {
    return charts.map((name: string) => {
      const {
        title,
        label,
        data: datum,
        fill,
        stats,
      }: TimeseriesChartData = {
        title: t(`keys.${name}`),
        label: t(`keys.${name}`),
        data: coordinate[name],
        fill: true,
        stats: [
          {
            title: t("common:common.latest", {
              date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
            }),
            value: [
              numFormat(
                Math.abs(timeseries_callout.data[index][name].latest),
                timeseries_callout.data[index][name].latest < 1e6 ? "standard" : "compact",
                timeseries_callout.data[index][name].latest < 1e6 ? 0 : 1,
                "long",
                i18n.language,
                false
              ),
            ].join(""),
          },
        ],
      };
      return (
        <Timeseries
          key={title}
          title={title}
          className="h-[350px] w-full"
          interval="month"
          enableAnimation={!play}
          displayNumFormat={(value, _, precision) => {
            return [
              numFormat(Math.abs(value), "compact", precision, "long", i18n.language, true),
            ].join("");
          }}
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
                backgroundColor: AKSARA_COLOR.PURPLE_H,
                borderColor: AKSARA_COLOR.PURPLE,
                fill: fill,
                borderWidth: 1.5,
              },
              shader(data.shade),
            ],
          }}
          stats={stats}
        />
      );
    });
  };

  return (
    <>
      <Container className="min-h-screen">
        <Section
          title={t("section_timeseries.title", {
            series: t(`keys.${series}`).toLowerCase(),
          })}
          description={
            <div className="flex flex-col gap-4">
              <p className={"whitespace-pre-line text-base"}>
                {t("section_timeseries.description")}
              </p>
              <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                <Dropdown
                  anchor="left"
                  options={INDEX_OPTIONS}
                  selected={INDEX_OPTIONS.find(option => data.index === option.value)}
                  onChange={e => setData("index", e.value)}
                />
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
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {plotTimeseries(getCharts(series), play)}
                </div>
                <Slider
                  type="range"
                  period={"month"}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[index].x}
                />
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default ElectronicPaymentsTimeseries;
