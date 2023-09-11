import { ChartDataset, ChartTypeRegistry } from "chart.js";
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
 * Interest Rates Dashboard
 * @overview Status: Live
 */

interface TimeseriesChartData {
  title: string;
  unitY: string;
  label: string;
  data: number[];
  fill: boolean;
  callout: string;
}

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface InterestRatesDashboardProps {
  last_updated: string;
  timeseries: any;
  timeseries_opr: any;
  timeseries_callouts: any;
}

const InterestRatesDashboard: FunctionComponent<InterestRatesDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_opr,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-interest-rates", "common"]);
  const { theme } = useTheme();

  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  const { data, setData } = useData({
    shade_type: SHADE_OPTIONS[0],
    opr_minmax: [216, timeseries_opr.data.x.length - 1], // [Jan 2015, present]
    non_opr_minmax: [216, timeseries_opr.data.x.length - 1], // [Jan 2015, present]
  });
  const OPR_LATEST_TIMESTAMP = timeseries_opr.data.x[timeseries_opr.data.x.length - 1];
  const { coordinate: opr_coordinate } = useSlice(timeseries_opr.data, data.opr_minmax);
  const { coordinate: non_opr_coordinate } = useSlice(timeseries.data, data.non_opr_minmax);

  const oprShader = useCallback<(key: string) => ChartDataset<keyof ChartTypeRegistry, any[]>>(
    (key: string) => {
      if (key === "no_shade")
        return {
          data: [],
        };

      return {
        type: "line",
        data: opr_coordinate[key],
        backgroundColor: theme === "light" ? AKSARA_COLOR.BLACK_H : AKSARA_COLOR.WASHED_DARK,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data, theme]
  );
  const oprConfigs = useCallback<(key: string) => { unit: string; callout: string; fill: boolean }>(
    (key: string) => {
      const unit = "%";
      const callout = `${numFormat(
        timeseries_callouts.data[key].callout,
        "standard",
        [2, 2]
      )}${unit}`;
      return {
        unit,
        callout,
        fill: data.shade_type.value === "no_shade",
      };
    },
    [data.shade_type]
  );

  const LATEST_TIMESTAMP = timeseries.data.x[timeseries.data.x.length - 1];

  const shader = useCallback<(key: string) => ChartDataset<keyof ChartTypeRegistry, any[]>>(
    (key: string) => {
      if (key === "no_shade")
        return {
          data: [],
        };

      return {
        type: "line",
        data: non_opr_coordinate[key],
        backgroundColor: theme === "light" ? AKSARA_COLOR.BLACK_H : AKSARA_COLOR.WASHED_DARK,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data, theme]
  );
  const configs = useCallback<(key: string) => { unit: string; callout: string; fill: boolean }>(
    (key: string) => {
      const unit = "%";
      const callout = `${numFormat(
        timeseries_callouts.data[key].callout,
        "standard",
        [2, 2]
      )}${unit}`;
      return {
        unit,
        callout,
        fill: data.shade_type.value === "no_shade",
      };
    },
    [data.shade_type]
  );
  const getChartData = (sectionHeaders: string[]): TimeseriesChartData[] =>
    sectionHeaders.map(chartName => ({
      title: t(`keys.${chartName}`),
      unitY: configs(chartName).unit,
      label: t(`keys.${chartName}`),
      data: non_opr_coordinate[chartName],
      fill: configs(chartName).fill,
      callout: configs(chartName).callout,
    }));
  const section1ChartData = getChartData(["base", "walr", "deposit_saving", "deposit_fixed_12mo"]);

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
        {/* How is interest rates trending? */}
        <Section
          title={t("section_1.title")}
          // description={t("section_1.description")}
          description={
            <Dropdown
              anchor="left"
              options={SHADE_OPTIONS}
              selected={data.shade_type}
              onChange={e => setData("shade_type", e)}
            />
          }
          date={timeseries_opr.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  title={t("keys.opr")}
                  className="h-[350px] w-full"
                  interval="month"
                  enableAnimation={!play}
                  unitY={oprConfigs("opr").unit}
                  displayNumFormat={value =>
                    numFormat(value, "compact", 0, "long", i18n.language, true)
                  }
                  tooltipCallback={item =>
                    [
                      item.dataset.label + ": ",
                      numFormat(
                        Math.abs(item.parsed.y),
                        "compact",
                        2,
                        "long",
                        i18n.language,
                        false
                      ),
                      "%",
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
                    labels: opr_coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: opr_coordinate.opr,
                        label: t("keys.opr"),
                        borderColor: AKSARA_COLOR.PRIMARY,
                        backgroundColor: AKSARA_COLOR.PRIMARY_H,
                        borderWidth: 1.5,
                        fill: oprConfigs("opr").fill,
                        stepped: true,
                      },
                      oprShader(data.shade_type.value),
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:common.latest", {
                        date: toDate(OPR_LATEST_TIMESTAMP, "d MMM yyyy", i18n.language),
                      }),
                      value: oprConfigs("opr").callout,
                    },
                  ]}
                />
                <Slider
                  className="pb-12 pt-8"
                  type="range"
                  value={data.opr_minmax}
                  data={timeseries_opr.data.x}
                  period="month"
                  onChange={e => {
                    setData("opr_minmax", e);
                    setData("non_opr_minmax", e);
                  }}
                />
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                  {section1ChartData.map(chartData => (
                    <Timeseries
                      key={chartData.title}
                      title={chartData.title}
                      className="h-[350px] w-full"
                      interval="month"
                      enableAnimation={!play}
                      unitY={chartData.unitY}
                      displayNumFormat={value =>
                        numFormat(value, "compact", 0, "long", i18n.language, true)
                      }
                      tooltipCallback={item =>
                        [
                          item.dataset.label + ": ",
                          numFormat(
                            Math.abs(item.parsed.y),
                            "compact",
                            2,
                            "long",
                            i18n.language,
                            false
                          ),
                          "%",
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
                        labels: non_opr_coordinate.x,
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
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default InterestRatesDashboard;
