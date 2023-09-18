import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { TableConfig } from "datagovmy-ui/charts/table";
import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, smartNumFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation, useWatch } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback, useMemo } from "react";

/**
 * Money Supply Dashboard
 * @overview Status: Live
 */

const Table = dynamic(() => import("datagovmy-ui/charts/table"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface TimeseriesChartData {
  title: string;
  unitY: string;
  label: string;
  data: number[];
  fill: boolean;
  callout: string;
  prefix: string;
}

interface TableSummaryData {
  data: {
    m1: number;
    m2: number;
    m3: number;
  };
  type: string;
  index: number;
}

interface TableSummary {
  data_as_of: string;
  data: TableSummaryData[];
}

interface MoneySupplyDashboardProps {
  last_updated: string;
  table_summary: TableSummary;
  timeseries: any;
  timeseries_callouts: any;
}

const MoneySupplyDashboard: FunctionComponent<MoneySupplyDashboardProps> = ({
  last_updated,
  table_summary,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-money-supply", "common"]);
  const { theme } = useTheme();

  const tableData = table_summary.data.map(row => ({
    index: row.index + 1,
    component: t(`keys.${row.type}`),
    m1: row.data.m1 ? numFormat(row.data.m1, "compact", 2) : "-",
    m2: row.data.m2 ? numFormat(row.data.m2, "compact", 2) : "-",
    m3: row.data.m3 ? numFormat(row.data.m3, "compact", 2) : "-",
  }));

  const tableConfig: TableConfig[] = [
    {
      id: "index",
      header: "#",
      accessorKey: "index",
      enableSorting: false,
    },
    {
      id: "component",
      header: t(`section_1.component_col_name`),
      accessorKey: "component",
      className: "text-left",
    },
    {
      id: "m1",
      header: t(`section_1.m1_col_name`),
      accessorKey: "m1",
    },
    {
      id: "m2",
      header: t(`section_1.m2_col_name`),
      accessorKey: "m2",
    },
    {
      id: "m3",
      header: t(`section_1.m3_col_name`),
      accessorKey: "m3",
    },
  ];

  const INDEX_OPTIONS: Array<OptionType> = Object.keys(timeseries.data)
    .reverse()
    .map((key: string) => ({
      label: t(`keys.${key}`),
      value: key,
    }));
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  const AXIS_Y = {
    y2: {
      display: false,
      grid: {
        drawTicks: false,
        drawBorder: false,
      },
      ticks: {
        display: false,
      },
    },
  };

  const { data, setData } = useData({
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
  });

  const LATEST_TIMESTAMP = useMemo(
    () =>
      timeseries.data[data.index_type.value].x[timeseries.data[data.index_type.value].x.length - 1],
    [data.index_type]
  );
  const { coordinate } = useSlice(timeseries.data[data.index_type.value], data.minmax);

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
            timeseries_callouts.data[data.index_type.value][key].callout > 0 ? "" : "-",
            prefix,
            numFormat(
              Math.abs(timeseries_callouts.data[data.index_type.value][key].callout),
              "compact",
              [1, 1],
              "long",
              i18n.language,
              false
            ),
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

  const getChartData = (sectionHeaders: string[]): TimeseriesChartData[] =>
    sectionHeaders.map(chartName => ({
      title: t(`keys.${chartName}`),
      unitY: configs(chartName).unit,
      label: t(`keys.${chartName}`),
      data: coordinate[chartName],
      fill: configs(chartName).fill,
      callout: configs(chartName).callout,
      prefix: configs(chartName).prefix,
    }));

  const section2ChartData = getChartData(["m1_total", "m2_total", "m3_total"]);
  const section3ChartData = getChartData(["m1_currency", "m1_deposit_demand"]);
  const section4ChartData = getChartData([
    "m2_deposit_saving",
    "m2_deposit_fixed",
    "m2_nid",
    "m2_repo",
    "m2_deposit_fx",
    "m2_deposit_other",
  ]);

  useWatch(() => {
    setData("minmax", [0, timeseries.data[data.index_type.value].x.length - 1]);
  }, [data.index_type]);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.financial_sector")]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={<AgencyBadge agency="bnm" />}
      />

      <Container className="min-h-screen">
        {/* What are the various ways to measure the supply of money in Malaysia? */}
        <Section
          title={t("section_1.title")}
          description={t("section_1.description")}
          date={table_summary.data_as_of}
        >
          <div className="mx-auto lg:max-w-screen-md">
            <Table className="table-stripe table" data={tableData} config={tableConfig} />
          </div>
        </Section>
        {/* How is the money supply trending? */}
        <SliderProvider>
          {play => (
            <>
              <Section
                title={t("section_2.title")}
                description={
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
                }
                date={timeseries.data_as_of}
              >
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {section2ChartData.map(chartData => (
                    <Timeseries
                      key={chartData.title}
                      title={chartData.title}
                      className="h-[350px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      precision={data.index_type.value.includes("growth") ? [2, 0] : [1, 0]}
                      displayType={
                        data.index_type.value.includes("growth") ? "standard" : "compact"
                      }
                      displayNumFormat={(value, type, precision) =>
                        numFormat(value, type, precision, "long", i18n.language, true)
                      }
                      unitY={chartData.unitY}
                      prefixY={chartData.prefix}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: chartData.label,
                            data: chartData.data,
                            borderColor: AKSARA_COLOR.PRIMARY,
                            backgroundColor: AKSARA_COLOR.PRIMARY_H,
                            fill: chartData.fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: chartData.callout,
                        },
                      ]}
                    />
                  ))}
                </div>
                <Slider
                  type="range"
                  value={data.minmax}
                  data={timeseries.data[data.index_type.value].x}
                  period="month"
                  onChange={e => setData("minmax", e)}
                />
              </Section>
              {/* A deeper look at M1 (narrow money) */}
              <Section title={t("section_3.title")} date={timeseries.data_as_of}>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {section3ChartData.map(chartData => (
                    <Timeseries
                      key={chartData.title}
                      title={chartData.title}
                      className="h-[350px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      precision={data.index_type.value.includes("growth") ? [2, 0] : [1, 0]}
                      displayType={
                        data.index_type.value.includes("growth") ? "standard" : "compact"
                      }
                      displayNumFormat={(value, type, precision) =>
                        numFormat(value, type, precision, "long", i18n.language, true)
                      }
                      unitY={chartData.unitY}
                      prefixY={chartData.prefix}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: chartData.label,
                            data: chartData.data,
                            borderColor: AKSARA_COLOR.PRIMARY,
                            backgroundColor: AKSARA_COLOR.PRIMARY_H,
                            fill: chartData.fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: chartData.callout,
                        },
                      ]}
                    />
                  ))}
                </div>
              </Section>
              {/* A deeper look at M2 (quasi money) */}
              <Section title={t("section_4.title")} date={timeseries.data_as_of}>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  {section4ChartData.map(chartData => (
                    <Timeseries
                      key={chartData.title}
                      title={chartData.title}
                      className="h-[350px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      precision={data.index_type.value.includes("growth") ? [2, 0] : [1, 0]}
                      displayType={
                        data.index_type.value.includes("growth") ? "standard" : "compact"
                      }
                      displayNumFormat={(value, type, precision) =>
                        numFormat(value, type, precision, "long", i18n.language, true)
                      }
                      unitY={chartData.unitY}
                      prefixY={chartData.prefix}
                      axisY={AXIS_Y}
                      data={{
                        labels: coordinate.x,
                        datasets: [
                          {
                            type: "line",
                            label: chartData.label,
                            data: chartData.data,
                            borderColor: AKSARA_COLOR.PRIMARY,
                            backgroundColor: AKSARA_COLOR.PRIMARY_H,
                            fill: chartData.fill,
                            borderWidth: 1.5,
                          },
                          shader(data.shade_type.value),
                        ],
                      }}
                      stats={[
                        {
                          title: t("common:common.latest", {
                            date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                          }),
                          value: chartData.callout,
                        },
                      ]}
                    />
                  ))}
                </div>
              </Section>
            </>
          )}
        </SliderProvider>
      </Container>
    </>
  );
};

export default MoneySupplyDashboard;
