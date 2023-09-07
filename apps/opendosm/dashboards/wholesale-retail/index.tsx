import { CustomerServiceIcon } from "@icons/division";
import { ChartDataset, ChartTypeRegistry } from "chart.js";
import { Container, Dropdown, Section, Slider, Hero, AgencyBadge } from "datagovmy-ui/components";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { numFormat, toDate } from "datagovmy-ui/helpers";
import { useSlice, useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useCallback, useMemo } from "react";
import { useTheme } from "next-themes";

/**
 * Wholesale & Retail Trade Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), {
  ssr: false,
});

interface WholesaleRetailDashboardProps {
  last_updated: number;
  timeseries: any;
  timeseries_callouts: any;
}

const WholesaleRetailDashboard: FunctionComponent<WholesaleRetailDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-wholesale-retail", "common"]);
  const { theme } = useTheme();

  const INDICES = [
    "growth_index_yoy",
    "growth_sales_yoy",
    "growth_momsa",
    "index_sa",
    "index",
    "sales",
  ];
  const INDEX_OPTIONS: Array<OptionType> = INDICES.map((key: string) => ({
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
    (key: string) => { unit: string; prefix: string; callout: string; fill: boolean }
  >(
    (key: string) => {
      const prefix =
        data.index_type.value.includes("sale") && !data.index_type.value.includes("growth");

      const unit = data.index_type.value.includes("growth") ? "%" : "";
      return {
        unit: unit,
        prefix: prefix ? "RM" : "",
        callout: [
          prefix ? "RM" : "",
          numFormat(
            timeseries_callouts.data[data.index_type.value][key].callout,
            "compact",
            prefix ? [1, 1] : 1,
            "long",
            i18n.language,
            false
          ),
          unit,
        ].join(""),
        fill: data.shade_type.value === "no_shade",
      };
    },
    [data.index_type, data.shade_type]
  );

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.economy"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge name={t("division:bpp.full")} icon={<CustomerServiceIcon />} isDivision />
        }
      />

      <Container className="min-h-screen">
        {/* How are the Malaysian Economic Indicators trending? */}
        <SliderProvider>
          {play => (
            <Section title={t("section_1.title")} date={timeseries.data_as_of}>
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
                  <Dropdown
                    anchor="left"
                    selected={data.index_type}
                    options={INDEX_OPTIONS}
                    onChange={(e: any) => setData("index_type", e)}
                  />
                  <Dropdown
                    anchor="left"
                    options={SHADE_OPTIONS}
                    selected={data.shade_type}
                    onChange={(e: any) => setData("shade_type", e)}
                  />
                </div>

                <Timeseries
                  className="h-[300px] w-full"
                  title={t("keys.total")}
                  interval="month"
                  unitY={configs("total").unit}
                  enableAnimation={!play}
                  prefixY={configs("total").prefix}
                  displayNumFormat={(value, _, precision) =>
                    numFormat(value, "compact", precision, "long", i18n.language, true)
                  }
                  axisY={AXIS_Y}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.total,
                        label: t("keys.total"),
                        borderColor: AKSARA_COLOR.DANGER,
                        borderWidth: 1.5,
                        backgroundColor: AKSARA_COLOR.DANGER_H,
                        fill: configs("total").fill,
                      },
                      shader(data.shade_type.value),
                    ],
                  }}
                  stats={[
                    {
                      title: t("common:common.latest", {
                        date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                      }),
                      value: configs("total").callout,
                    },
                  ]}
                />

                <Slider
                  className=""
                  type="range"
                  value={data.minmax}
                  data={timeseries.data[data.index_type.value].x}
                  period="month"
                  onChange={e => setData("minmax", e)}
                />

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  <Timeseries
                    title={t("keys.wholesale")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    unitY={configs("wholesale").unit}
                    prefixY={configs("wholesale").prefix}
                    axisY={AXIS_Y}
                    displayNumFormat={(value, _, precision) =>
                      numFormat(value, "compact", precision, "long", i18n.language, true)
                    }
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          label: t("keys.wholesale"),
                          data: coordinate.wholesale,
                          borderColor: AKSARA_COLOR.DANGER,
                          backgroundColor: AKSARA_COLOR.DANGER_H,
                          fill: configs("wholesale").fill,
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
                        value: configs("wholesale").callout,
                      },
                    ]}
                  />
                  <Timeseries
                    title={t("keys.retail")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    unitY={configs("retail").unit}
                    prefixY={configs("retail").prefix}
                    axisY={AXIS_Y}
                    displayNumFormat={(value, _, precision) =>
                      numFormat(value, "compact", precision, "long", i18n.language, true)
                    }
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          label: t("keys.retail"),
                          data: coordinate.retail,
                          borderColor: AKSARA_COLOR.DANGER,
                          backgroundColor: AKSARA_COLOR.DANGER_H,
                          fill: configs("retail").fill,
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
                        value: configs("retail").callout,
                      },
                    ]}
                  />
                  <Timeseries
                    title={t("keys.motor")}
                    className="h-[300px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    unitY={configs("motor").unit}
                    prefixY={configs("motor").prefix}
                    axisY={AXIS_Y}
                    displayNumFormat={(value, _, precision) =>
                      numFormat(value, "compact", precision, "long", i18n.language, true)
                    }
                    data={{
                      labels: coordinate.x,
                      datasets: [
                        {
                          type: "line",
                          label: t("keys.motor"),
                          data: coordinate.motor,
                          borderColor: AKSARA_COLOR.DANGER,
                          backgroundColor: AKSARA_COLOR.DANGER_H,
                          fill: configs("motor").fill,
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
                        value: configs("motor").callout,
                      },
                    ]}
                  />
                </div>
              </div>
            </Section>
          )}
        </SliderProvider>
      </Container>
    </>
  );
};

export default WholesaleRetailDashboard;
