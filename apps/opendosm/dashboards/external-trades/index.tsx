import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { DOSMShippingIcon } from "datagovmy-ui/icons/departments/dosm";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * External Trade Statistics Dashboard
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

type TimeseriesData = "x" | "balance" | "exports" | "imports" | "total" | "recession";

type IndicesTimeseriesData =
  | "x"
  | "overall"
  | "food"
  | "beverage_tobacco"
  | "crude"
  | "fuels"
  | "oils"
  | "chemicals"
  | "mfg"
  | "machinery"
  | "misc_mfg"
  | "misc_trnsc"
  | "recession";

type TradeIndices = "export_value" | "export_volume" | "import_value" | "import_volume" | "tot";

interface TimeseriesOptions {
  value: Record<TimeseriesData, number[]>;
  growth_yoy: Record<TimeseriesData, number[]>;
}

interface TimeseriesOptionsCallout {
  value: Record<Exclude<TimeseriesData, "x" | "recession">, { latest: number }>;
  growth_yoy: Record<Exclude<TimeseriesData, "x" | "recession">, { latest: number }>;
}

interface IndicesTimeseriesOptions {
  index: Record<IndicesTimeseriesData, number[]>;
  growth_yoy: Record<IndicesTimeseriesData, number[]>;
}

interface IndicesTimeseriesOptionsCallout {
  growth_yoy: number;
  index: number;
}

interface ExternalTradeDashboardProp {
  last_updated: string;
  timeseries: WithData<TimeseriesOptions>;
  timeseries_callout: WithData<TimeseriesOptionsCallout>;
  indices_timeseries: WithData<Record<TradeIndices, IndicesTimeseriesOptions>>;
  indices_timeseries_callout: WithData<
    Record<
      TradeIndices,
      Record<Exclude<IndicesTimeseriesData, "x" | "recession">, IndicesTimeseriesOptionsCallout>
    >
  >;
}

const ExternalTradeDashboard: FunctionComponent<ExternalTradeDashboardProp> = ({
  last_updated,
  timeseries,
  timeseries_callout,
  indices_timeseries,
  indices_timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-external-trade", "division", "common"]);

  const INDEX_OPTIONS: Array<OptionType> = [
    { label: t("keys.value"), value: "value" },
    { label: t("keys.growth_yoy"), value: "growth_yoy" },
  ];

  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  const INDICES_OPTIONS: Array<OptionType> = [
    { label: t("keys.tot"), value: "tot" },
    { label: t("keys.export_value"), value: "export_value" },
    { label: t("keys.export_volume"), value: "export_volume" },
    { label: t("keys.import_value"), value: "import_value" },
    { label: t("keys.import_volume"), value: "import_volume" },
  ];

  const INDICES_INDEX_OPTIONS: Array<OptionType> = [
    { label: t("keys.index"), value: "index" },
    { label: t("keys.growth_yoy"), value: "growth_yoy" },
  ];

  const INDICES_SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  const { data, setData } = useData({
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
    index: INDEX_OPTIONS[0].value,
    shade: SHADE_OPTIONS[0].value,
    indices_minmax: [
      0,
      indices_timeseries.data[INDICES_OPTIONS[0].value][INDICES_INDEX_OPTIONS[0].value].x.length -
        1,
    ],
    indices_index: INDICES_INDEX_OPTIONS[0].value,
    indices_shade: INDICES_SHADE_OPTIONS[0].value,
    indices_options: INDICES_OPTIONS[0].value,
  });

  const LATEST_TIMESTAMP = timeseries.data[data.index].x[timeseries.data[data.index].x.length - 1];
  const INDICES_LATEST_TIMESTAMP =
    indices_timeseries.data[data.indices_options][data.indices_index].x[
      indices_timeseries.data[data.indices_options][data.indices_index].x.length - 1
    ];

  const { coordinate } = useSlice(timeseries.data[data.index], data.minmax);
  const { coordinate: indices_coordinate } = useSlice(
    indices_timeseries.data[data.indices_options][data.indices_index],
    data.indices_minmax
  );

  const plotTimeseries = (
    charts: Exclude<TimeseriesData, "x" | "balance" | "recession">[],
    play: boolean
  ) => {
    return charts.map(name => {
      const {
        title,
        prefix,
        label,
        data: datum,
        fill,
        stats,
      }: TimeseriesChartData = {
        title: t(`keys.${name}`),
        prefix: "",
        label: t(`keys.${name}`),
        data: coordinate[name],
        fill: data.shade === "no_shade",
        stats: [
          {
            title: t("common:common.latest", {
              date: toDate(LATEST_TIMESTAMP, "MMMM yyyy", i18n.language),
            }),
            value: [
              ["growth_yoy"].includes(data.index)
                ? timeseries_callout.data[data.index][name].latest > 0
                  ? ""
                  : "-"
                : "RM",
              numFormat(
                Math.abs(timeseries_callout.data[data.index][name].latest),
                "compact",
                2,
                "long",
                i18n.language,
                true
              ),
              ["growth_yoy"].includes(data.index) ? "%" : "",
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
          displayNumFormat={value => {
            const isPercentage = ["growth_yoy"].includes(data.index);
            return [
              value < 0 ? "-" : "",
              numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
              isPercentage ? "%" : "",
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
                backgroundColor: AKSARA_COLOR.PRIMARY_H,

                borderColor: AKSARA_COLOR.PRIMARY,

                fill: fill,
                borderWidth: 1.5,
              },
            ],
          }}
          stats={stats}
        />
      );
    });
  };
  const plotTimeseriesIndices = (
    charts: Exclude<IndicesTimeseriesData, "x" | "overall" | "recession">[],
    play: boolean
  ) => {
    return charts.map(name => {
      const {
        title,
        prefix,
        label,
        data: datum,
        fill,
        stats,
      }: TimeseriesChartData = {
        title: t(`keys.${name}`),
        prefix: "",
        label: t(`keys.${name}`),
        data: indices_coordinate[name],
        fill: data.shade === "no_shade",
        stats: [
          {
            title: t("common:common.latest", {
              date: toDate(INDICES_LATEST_TIMESTAMP, "MMMM yyyy", i18n.language),
            }),
            value: [
              numFormat(
                Math.abs(indices_timeseries_callout.data[data.indices_options][name].index),
                "compact",
                1,
                "long",
                i18n.language,
                true
              ),
            ].join(""),
          },
          {
            title: t("keys.growth_yoy"),
            value: [
              indices_timeseries_callout.data[data.indices_options][name].growth_yoy > 0 ? "" : "-",
              numFormat(
                Math.abs(indices_timeseries_callout.data[data.indices_options][name].growth_yoy),
                "compact",
                1,
                "long",
                i18n.language,
                true
              ),
              "%",
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
          displayNumFormat={value => {
            const isPercentage = ["growth_yoy"].includes(data.index);
            return [
              value < 0 ? "-" : "",
              numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
              isPercentage ? "%" : "",
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
            labels: indices_coordinate.x,
            datasets: [
              {
                type: "line",
                label: label,
                data: datum,
                backgroundColor: AKSARA_COLOR.DANGER_H,

                borderColor: AKSARA_COLOR.DANGER,

                fill: fill,
                borderWidth: 1.5,
              },
            ],
          }}
          stats={stats}
        />
      );
    });
  };

  const shader = useCallback<(key: string) => ChartDataset<keyof ChartTypeRegistry, any[]>>(
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

  const prefixRM = (value: number) => (value > 0 ? "+RM " : "-RM ");
  const prefixPercentage = (value: number) => (value > 0 ? "+" : "-");

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.trade"), "text-primary"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge name={t("division:bppa.full")} icon={<DOSMShippingIcon />} />}
      />
      <Container className="min-h-screen">
        <Section
          title={t("section_timeseries.title")}
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
                <Timeseries
                  enableAnimation={!play}
                  className="h-[350px] w-full"
                  interval="month"
                  displayNumFormat={value => {
                    const isPercentage = ["growth_yoy"].includes(data.index);
                    return [
                      value < 0 ? "-" : "",
                      numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
                      isPercentage ? "%" : "",
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
                        data: coordinate.balance,
                        label: t("keys.balance"),
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
                        date: toDate(LATEST_TIMESTAMP, "MMMM yyyy", i18n.language),
                      }),
                      value: [
                        ["growth_yoy"].includes(data.index)
                          ? prefixPercentage(timeseries_callout.data[data.index].balance.latest)
                          : prefixRM(timeseries_callout.data[data.index].balance.latest),
                        numFormat(
                          Math.abs(timeseries_callout.data[data.index].balance.latest),
                          "compact",
                          2,
                          "long",
                          i18n.language,
                          true
                        ),
                        ["growth_yoy"].includes(data.index) ? "%" : "",
                      ].join(""),
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period={"month"}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[data.index].x}
                />
                <Section>
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {plotTimeseries(["exports", "imports", "total"], play)}
                  </div>
                </Section>
              </>
            )}
          </SliderProvider>
        </Section>
        <Section
          title={t("section_indices.title")}
          description={
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                <Dropdown
                  anchor="left"
                  options={INDICES_OPTIONS}
                  selected={INDICES_OPTIONS.find(option => data.indices_options === option.value)}
                  onChange={e => setData("indices_options", e.value)}
                />
                <Dropdown
                  anchor="left"
                  options={INDICES_INDEX_OPTIONS}
                  selected={INDICES_INDEX_OPTIONS.find(
                    option => data.indices_index === option.value
                  )}
                  onChange={e => setData("indices_index", e.value)}
                />
                <Dropdown
                  anchor="left"
                  options={INDICES_SHADE_OPTIONS}
                  selected={INDICES_SHADE_OPTIONS.find(
                    option => data.indices_shade === option.value
                  )}
                  onChange={e => setData("indices_shade", e.value)}
                />
              </div>
            </div>
          }
          date={indices_timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  enableAnimation={!play}
                  className="h-[350px] w-full"
                  interval="month"
                  displayNumFormat={value => {
                    const isPercentage = ["growth_yoy"].includes(data.indices_index);
                    return [
                      value < 0 ? "-" : "",
                      numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
                      isPercentage ? "%" : "",
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
                    labels: indices_coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: indices_coordinate.overall,
                        label: t("keys.overall"),
                        fill: data.shade === "no_shade",
                        backgroundColor: AKSARA_COLOR.DIM_H,
                        borderColor: AKSARA_COLOR.DIM,
                        borderWidth: indices_coordinate.x.length > 200 ? 1.0 : 1.5,
                      },
                      shader(data.indices_shade),
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:common.latest", {
                        date: toDate(INDICES_LATEST_TIMESTAMP, "MMMM yyyy", i18n.language),
                      }),
                      value: [
                        numFormat(
                          Math.abs(
                            indices_timeseries_callout.data[data.indices_options].overall.index
                          ),
                          "compact",
                          1,
                          "long",
                          i18n.language,
                          true
                        ),
                      ].join(""),
                    },
                    {
                      title: t("keys.growth_yoy"),
                      value: [
                        indices_timeseries_callout.data[data.indices_options].overall.growth_yoy > 0
                          ? ""
                          : "-",
                        numFormat(
                          Math.abs(
                            indices_timeseries_callout.data[data.indices_options].overall.growth_yoy
                          ),
                          "compact",
                          1,
                          "long",
                          i18n.language,
                          true
                        ),
                        "%",
                      ].join(""),
                    },
                  ]}
                />
                <Slider
                  type="range"
                  period={"month"}
                  value={data.indices_minmax}
                  onChange={e => setData("indices_minmax", e)}
                  data={indices_timeseries.data[data.indices_options][data.indices_index].x}
                />
                <Section>
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                    {plotTimeseriesIndices(
                      [
                        "food",
                        "beverage_tobacco",
                        "crude",
                        "fuels",
                        "oils",
                        "chemicals",
                        "mfg",
                        "machinery",
                        "misc_mfg",
                        "misc_trnsc",
                      ],
                      play
                    )}
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

export default ExternalTradeDashboard;
