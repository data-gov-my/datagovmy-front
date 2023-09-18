import { ToolsIcon } from "@icons/division";
import type { ChartDataset } from "chart.js";
import { AgencyBadge, Container, Dropdown, Hero, Section, Slider } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback } from "react";
import { useTheme } from "next-themes";

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
  stats: Array<{ title: string; value: string }>;
  prefix: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface ManufacturingStatisticsProps {
  last_updated: string;
  timeseries: any;
  timeseries_callout: any;
}

const ManufacturingStatistics: FunctionComponent<ManufacturingStatisticsProps> = ({
  last_updated,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-manufacturing-statistics", "agencies", "common"]);
  const { theme } = useTheme();

  const INDEX_OPTIONS: Array<OptionType> = [
    { label: t("keys.growth_yoy"), value: "growth_yoy" },
    { label: t("keys.growth_momsa"), value: "growth_momsa" },
    { label: t("keys.actual"), value: "actual" },
    { label: t("keys.actual_sa"), value: "actual_sa" },
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

  const shader = useCallback<(key: string) => ChartDataset<"line", any[]>>(
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
    [data.shade, theme]
  );

  const getChartData = (charts: string[]): TimeseriesChartData[] => {
    return charts.map(name => {
      const isPerc = ["growth_momsa", "growth_yoy"].includes(data.index);
      const prefix: string = name === "employees" ? "" : isPerc ? "" : "RM ";
      const unitY: string = isPerc ? "%" : "";
      return {
        title: t(`keys.${name}`),
        prefix: prefix,
        unitY: unitY,
        label: t(`keys.${name}`),
        data: coordinate[name],
        fill: data.shade === "no_shade",
        stats: [
          {
            title: t("common:common.latest", {
              date: toDate(LATEST_TIMESTAMP, "MMMM yyyy", i18n.language),
            }),
            value: [
              prefix,
              numFormat(
                timeseries_callout.data[data.index][name].latest,
                "compact",
                1,
                "long",
                i18n.language,
                false
              ),
              unitY,
            ].join(""),
          },
        ],
      };
    });
  };

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.services"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bppib.full")} icon={<ToolsIcon />} isDivision />
        }
      />

      <Container>
        <Section
          title={t("section_1.title")}
          description={
            <div className="flex flex-col gap-4">
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
                  {getChartData(["sales", "employees", "wages"]).map(
                    ({ title, prefix, unitY, label, data: datum, fill, stats }) => (
                      <Timeseries
                        key={title}
                        title={title}
                        className="h-[350px] w-full"
                        interval="month"
                        enableAnimation={!play}
                        displayNumFormat={value =>
                          [
                            value > 0 ? "" : "-",
                            numFormat(Math.abs(value), "compact", 0, "long", i18n.language, true),
                          ].join("")
                        }
                        tooltipCallback={item =>
                          [
                            item.dataset.label,
                            prefix +
                              numFormat(item.parsed.y, "compact", 1, "long", i18n.language, false) +
                              unitY,
                          ].join(": ")
                        }
                        prefixY={prefix}
                        unitY={unitY}
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
                              backgroundColor: AKSARA_COLOR.DANGER_H,
                              borderColor: AKSARA_COLOR.DANGER,
                              fill: fill,
                              borderWidth: 1.5,
                            },
                            shader(data.shade),
                          ],
                        }}
                        stats={stats}
                      />
                    )
                  )}
                </div>
                <Slider
                  type="range"
                  period={"month"}
                  value={data.minmax}
                  onChange={e => setData("minmax", e)}
                  data={timeseries.data[data.index].x}
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
