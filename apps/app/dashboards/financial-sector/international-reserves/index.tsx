import { Container, Dropdown, Hero, Section } from "@components/index";
import { FunctionComponent, useCallback } from "react";
import dynamic from "next/dynamic";
import { numFormat, toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { useSlice } from "@hooks/useSlice";
import { useData } from "@hooks/useData";
import type { OptionType } from "@components/types";
import { AKSARA_COLOR } from "@lib/constants";
import type { ChartDataset, ChartTypeRegistry } from "chart.js";
import Slider from "@components/Chart/Slider";
import AgencyBadge from "@components/Badge/agency";
import { BNMIcon } from "@components/Icon/agency";
import { SliderProvider } from "@components/Chart/Slider/context";

/**
 * International Reserves Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface InternationalReservesDashboardProps {
  last_updated: string;
  timeseries: any;
  timeseries_callouts: any;
}

const InternationalReservesDashboard: FunctionComponent<InternationalReservesDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation(["dashboard-international-reserves", "common"]);

  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("keys.no_shade"), value: "no_shade" },
    { label: t("keys.recession"), value: "recession" },
  ];

  const { data, setData } = useData({
    shade_type: SHADE_OPTIONS[0],
    minmax: [0, timeseries.data.x.length - 1],
  });
  const LATEST_TIMESTAMP = timeseries.data.x[timeseries.data.x.length - 1];
  const { coordinate } = useSlice(timeseries.data, data.minmax);

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

  return (
    <>
      <Hero
        background="gray"
        category={[t("common:categories.financial_sector")]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:bnm.full")}
            link="https://www.bnm.gov.my/publications/mhs"
            icon={<BNMIcon />}
          />
        }
      />

      <Container className="min-h-screen">
        {/* Key measures of BNM’s international reserves */}
        <Section
          title={t("section_1.title")}
          description={
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
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
          <SliderProvider>
            {play => (
              <>
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                  <Timeseries
                    title={t("keys.reserves_usd")}
                    className="h-[350px] w-full"
                    precision={[1, 1]}
                    interval="month"
                    tooltipFormat="dd MMM yyyy"
                    enableAnimation={!play}
                    prefixY="$"
                    unitY=" bil"
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
                          label: t("keys.reserves_usd"),
                          data: coordinate["reserves_usd"],
                          borderColor: AKSARA_COLOR.DARK_BLUE,
                          backgroundColor: AKSARA_COLOR.DARK_BLUE_H,
                          fill: data.shade_type.value === "no_shade",
                          borderWidth: 1.5,
                        },
                        shader(data.shade_type.value),
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "dd MMM yyyy", i18n.language),
                        }),
                        value: `USD ${numFormat(
                          timeseries_callouts.data["reserves_usd"].callout,
                          "standard",
                          [1, 1],
                          "short",
                          i18n.language
                        )} bil`,
                      },
                    ]}
                  />
                  <Timeseries
                    title={t("keys.import_months")}
                    className="h-[350px] w-full"
                    interval="month"
                    enableAnimation={!play}
                    precision={[1, 1]}
                    tooltipFormat="dd MMM yyyy"
                    unitY={t("section_1.months")}
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
                          label: t("keys.import_months"),
                          data: coordinate["import_months"],
                          borderColor: AKSARA_COLOR.DARK_BLUE,
                          backgroundColor: AKSARA_COLOR.DARK_BLUE_H,
                          fill: data.shade_type.value === "no_shade",
                          borderWidth: 1.5,
                        },
                        shader(data.shade_type.value),
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "dd MMM yyyy", i18n.language),
                        }),
                        value: `${numFormat(
                          timeseries_callouts.data["import_months"].callout,
                          "standard",
                          [1, 1]
                        )} ${t("section_1.months_of_import")}`,
                      },
                    ]}
                  />
                  <Timeseries
                    title={t("keys.ed_scale")}
                    className="h-[350px] w-full"
                    interval="month"
                    precision={[1, 1]}
                    enableAnimation={!play}
                    tooltipFormat="dd MMM yyyy"
                    unitY="x"
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
                          label: t("keys.ed_scale"),
                          data: coordinate["ed_scale"],
                          borderColor: AKSARA_COLOR.DARK_BLUE,
                          backgroundColor: AKSARA_COLOR.DARK_BLUE_H,
                          fill: data.shade_type.value === "no_shade",
                          borderWidth: 1.5,
                        },
                        shader(data.shade_type.value),
                      ],
                    }}
                    stats={[
                      {
                        title: t("common:common.latest", {
                          date: toDate(LATEST_TIMESTAMP, "dd MMM yyyy", i18n.language),
                        }),
                        value: `${numFormat(
                          timeseries_callouts.data["ed_scale"].callout,
                          "standard",
                          [1, 1]
                        )}x ${t("section_1.short_term_external_debt")}`,
                      },
                    ]}
                  />
                </div>
                <Slider
                  type="range"
                  value={data.minmax}
                  data={timeseries.data.x}
                  period="month"
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>
        {/* I want to understand more about BNM’s international reserves */}
        <Section
          className="py-12"
          title={t("section_2.title")}
          description={
            <p className="text-dim whitespace-pre-line text-base">
              {t("section_2.description_part_1")}
              {
                <a
                  className="cursor-pointer underline hover:text-black hover:underline"
                  href={t("section_2.ir_explainer_url")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("section_2.ir_explainer")}
                </a>
              }
              {t("section_2.description_part_2")}
              {
                <a
                  className="cursor-pointer underline hover:text-black hover:underline"
                  href="https://www.bnm.gov.my/international-reserves-and-foreign-currency-liquidity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("section_2.official_bnm_site")}
                </a>
              }
              .
            </p>
          }
        ></Section>
      </Container>
    </>
  );
};

export default InternationalReservesDashboard;
