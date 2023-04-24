import { Container, Dropdown, Hero, Section } from "@components/index";
import { FunctionComponent, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { numFormat, toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { useSlice } from "@hooks/useSlice";
import { useData } from "@hooks/useData";
import type { OptionType } from "@components/types";
import { AKSARA_COLOR } from "@lib/constants";
import type { ChartDataset, ChartTypeRegistry } from "chart.js";
import Slider from "@components/Chart/Slider";
import { track } from "@lib/mixpanel";
import { routes } from "@lib/routes";
import AgencyBadge from "@components/AgencyBadge";
import { BNMIcon } from "@components/Icon/agency";
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

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface InterestRatesDashboardProps {
  last_updated: number;
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
  const { t, i18n } = useTranslation(["common", "dasboard-interest-rates"]);

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
        backgroundColor: AKSARA_COLOR.BLACK_H,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data]
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
        backgroundColor: AKSARA_COLOR.BLACK_H,
        borderWidth: 0,
        fill: true,
        yAxisID: "y2",
        stepped: true,
      };
    },
    [data]
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

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "interest_rates.header",
      name_en: "Interest Rates",
      name_bm: "Kadar Faedah",
      route: routes.INTEREST_RATES,
    });
  }, []);

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:nav.megamenu.categories.financial_sector")]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge
            agency={t("common:agency.bnm")}
            link="https://www.bnm.gov.my/publications/mhs"
            icon={<BNMIcon />}
          />
        }
      />

      <Container className="min-h-screen">
        {/* How is interest rates trending? */}
        <Section
          title={t("section_1.title")}
          description={t("section_1.description")}
          date={timeseries_opr.data_as_of}
        >
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-4 lg:flex lg:flex-row">
              <Dropdown
                anchor="left"
                options={SHADE_OPTIONS}
                selected={data.shade_type}
                onChange={e => setData("shade_type", e)}
              />
            </div>

            <Slider
              type="range"
              value={data.opr_minmax}
              data={timeseries_opr.data.x}
              period="month"
              onChange={e => {
                setData("opr_minmax", e);
                setData("non_opr_minmax", e);
              }}
            />
            <Timeseries
              title={t("keys.opr")}
              className="h-[350px] w-full"
              interval="month"
              unitY={oprConfigs("opr").unit}
              displayNumFormat={value => numFormat(value, "standard", [2, 2])}
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

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {section1ChartData.map(chartData => (
                <Timeseries
                  key={chartData.title}
                  title={chartData.title}
                  className="h-[350px] w-full"
                  interval="month"
                  unitY={chartData.unitY}
                  displayNumFormat={value => numFormat(value, "standard", [2, 1])}
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
          </div>
        </Section>
      </Container>
    </>
  );
};

export default InterestRatesDashboard;
