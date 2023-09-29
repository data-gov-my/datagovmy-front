import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { PricesIncomeIcon } from "@icons/division";
import { OptionType, WithData } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";
import { useTheme } from "next-themes";

/**
 * Services Producer Prices Dashboard
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

type ServicesPPIData =
  | "x"
  | "total"
  | "infocomm"
  | "transport"
  | "accom"
  | "arts"
  | "professional"
  | "health"
  | "education"
  | "realestate"
  | "recession";

interface LabourProductivityOptions {
  growth_qoq: Record<ServicesPPIData, number[]>;
  growth_yoy: Record<ServicesPPIData, number[]>;
  index: Record<ServicesPPIData, number[]>;
}
interface LabourProductivityOptionsCallout {
  growth_qoq: Record<ServicesPPIData, { latest: number }>;
  growth_yoy: Record<ServicesPPIData, { latest: number }>;
  index: Record<ServicesPPIData, { latest: number }>;
}

interface ServicesPPIProp {
  last_updated: string;
  timeseries: WithData<LabourProductivityOptions>;
  timeseries_callout: WithData<LabourProductivityOptionsCallout>;
}

const ServicesProducerPrices: FunctionComponent<ServicesPPIProp> = ({
  timeseries,
  timeseries_callout,
  last_updated,
}) => {
  const { t, i18n } = useTranslation(["dashboard-services-producer-prices", "agencies", "common"]);
  const { theme } = useTheme();

  const INDEX_OPTIONS: Array<OptionType> = [
    { label: t("keys.growth_yoy"), value: "growth_yoy" },
    { label: t("keys.growth_qoq"), value: "growth_qoq" },
    { label: t("keys.index"), value: "index" },
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

  const plotTimeseries = (
    charts: Exclude<ServicesPPIData, "x" | "total" | "recession">[],
    play: boolean
  ) => {
    return charts.map(name => {
      const isPercentage: boolean = ["growth_qoq", "growth_yoy"].includes(data.index);

      const {
        title,
        prefix,
        label,
        data: datum,
        fill,
        stats,
      }: TimeseriesChartData = {
        title: t(`keys.${name}`),
        prefix: isPercentage ? "" : "RM ",
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
              numFormat(
                Math.abs(timeseries_callout.data[data.index][name]?.latest),
                "compact",
                1,
                "short",
                i18n.language,
                false
              ),
              isPercentage ? "%" : ``,
            ].join(""),
          },
        ],
      };

      return (
        <Timeseries
          key={title}
          title={title}
          className="h-[350px] w-full"
          interval="quarter"
          enableAnimation={!play}
          unitY={["growth_qoq", "growth_yoy"].includes(data.index) ? "%" : ""}
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
                backgroundColor: AKSARA_COLOR.ORANGE_H,
                borderColor: AKSARA_COLOR.ORANGE,
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
      <Hero
        background="orange"
        category={[t("common:categories.producer_price"), `text-orange-500`]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bphpp.full")} icon={<PricesIncomeIcon />} isDivision />
        }
      />

      <Container className="min-h-screen">
        <Section
          title={t("section_1.title")}
          description={
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                <Dropdown
                  anchor="left"
                  selected={INDEX_OPTIONS.find(option => option.value === data.index)}
                  options={INDEX_OPTIONS}
                  onChange={e => setData("index", e.value)}
                />
                <Dropdown
                  anchor="left"
                  selected={SHADE_OPTIONS.find(option => option.value === data.shade)}
                  options={SHADE_OPTIONS}
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
                  title={t(`keys.total`)}
                  interval="quarter"
                  unitY={["growth_qoq", "growth_yoy"].includes(data.index) ? "%" : ""}
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
                        label: t("keys.total"),
                        fill: data.shade === "no_shade",
                        backgroundColor: AKSARA_COLOR.ORANGE_H,
                        borderColor: AKSARA_COLOR.ORANGE,
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
                      value: ["growth_qoq", "growth_yoy"].includes(data.index)
                        ? `${numFormat(
                            Math.abs(timeseries_callout.data[data.index].total.latest),
                            "compact",
                            1,
                            "long",
                            i18n.language,
                            false
                          )}%`
                        : `${numFormat(
                            Math.abs(timeseries_callout.data[data.index].total.latest),
                            "compact",
                            1,
                            "short",
                            i18n.language,
                            false
                          )}`,
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
                    {plotTimeseries(
                      [
                        "infocomm",
                        "transport",
                        "accom",
                        "arts",
                        "professional",
                        "health",
                        "education",
                        "realestate",
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

export default ServicesProducerPrices;
