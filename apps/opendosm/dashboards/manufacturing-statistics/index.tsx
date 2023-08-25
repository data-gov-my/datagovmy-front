import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation, useWatch } from "datagovmy-ui/hooks";
import { MetaPage, OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";

/**
 * Manufacturing Statistics Dashboard
 * @overview Status: Live
 */

interface TimeseriesChartData {
  title: string;
  unitY: string;
  label: string;
  data: number[];
  fill: boolean;
  callout: {
    latest: string;
  };
  prefix: string;
  chartName: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface ManufacturingStatisticsProps {
  last_updated: string;
  timeseries: any;
  timeseries_callout: any;
  meta: MetaPage;
}

const ManufacturingStatistics: FunctionComponent<ManufacturingStatisticsProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
  meta,
}) => {
  const { t, i18n } = useTranslation(["dashboard-manufacturing-statistics", "common"]);

  const INDEX_OPTIONS: Array<OptionType> = [
    { label: t("keys.actual"), value: "actual" },
    { label: t("keys.actual_sa"), value: "actual_sa" },
    { label: t("keys.growth_momsa"), value: "growth_momsa" },
    { label: t("keys.growth_yoy"), value: "growth_yoy" },
  ];
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  const { data, setData } = useData({
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
  });
  const LATEST_TIMESTAMP =
    timeseries.data[data.index_type.value].x[timeseries.data[data.index_type.value].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.index_type.value], data.minmax);

  const formatToBillions = (number: number, dp: number = 1) => {
    if (number >= 1e12) {
      return `${numFormat(number / 1e9, "standard", dp, "long", i18n.language)} bil`;
    }
    return numFormat(number, "compact", dp, "long", i18n.language, true);
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

  const getChartData = (sectionHeaders: string[]): TimeseriesChartData[] =>
    sectionHeaders.map(chartName => {
      const isPercentage: boolean = ["growth_momsa", "growth_yoy"].includes(data.index_type.value);
      return {
        title: t(`keys.${chartName}`),
        prefix: chartName === "employees" ? "" : isPercentage ? "" : "RM",
        unitY: isPercentage ? "%" : "",
        label: t(`keys.${chartName}`),
        data: coordinate[chartName],
        fill: data.shade_type.value === "no_shade",
        callout: {
          latest: isPercentage
            ? `${formatToBillions(
                timeseries_callout.data[data.index_type.value][chartName].latest
              )}%`
            : chartName === "employees"
            ? `${formatToBillions(
                timeseries_callout.data[data.index_type.value][chartName].latest
              )} people`
            : timeseries_callout.data[data.index_type.value][chartName].latest > 0
            ? `RM ${formatToBillions(
                timeseries_callout.data[data.index_type.value][chartName].latest
              )}`
            : `-RM ${
                formatToBillions(
                  timeseries_callout.data[data.index_type.value][chartName].latest
                ).split("-")[1]
              }`,
        },
        chartName,
      };
    });

  const detailsChartData = getChartData(["sales", "employees", "wages"]);

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.services"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency={meta.agency} noRedirect={true} />}
      />

      <Container className="min-h-screen">
        <Section
          title={t("section_1.title")}
          description={
            <div className="flex flex-col gap-4">
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
            </div>
          }
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {detailsChartData.map(chartData => (
                    <Timeseries
                      key={chartData.title}
                      title={chartData.title}
                      className="h-[350px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      displayNumFormat={value => formatToBillions(value, 0)}
                      prefixY={chartData.prefix}
                      unitY={chartData.unitY}
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
                            label: chartData.label,
                            data: chartData.data,
                            backgroundColor: AKSARA_COLOR.DANGER_H,
                            borderColor: AKSARA_COLOR.DANGER,
                            fill: chartData.fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMMM yyyy", i18n.language),
                          }),
                          value: chartData.callout.latest,
                        },
                      ]}
                    />
                  ))}
                </div>
                <Slider
                  type="range"
                  period={"month"}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[data.index_type.value].x}
                />
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default ManufacturingStatistics;
