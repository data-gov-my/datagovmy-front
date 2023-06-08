import { Container, Dropdown, Hero, Section } from "@components/index";
import { FunctionComponent, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { numFormat, toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { useSlice } from "@hooks/useSlice";
import { useData } from "@hooks/useData";
import type { OptionType } from "@components/types";
import { AKSARA_COLOR } from "@lib/constants";
import type { ChartDatasetProperties, ChartTypeRegistry } from "chart.js";
import Slider from "@components/Chart/Slider";
import { track } from "@lib/mixpanel";
import { routes } from "@lib/routes";

/**
 * International Reserves Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface InternationalReservesDashboardProps {
  last_updated: number;
  timeseries: any;
  timeseries_callouts: any;
}

const InternationalReservesDashboard: FunctionComponent<InternationalReservesDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation();

  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("international_reserves.keys.no_shade"), value: "no_shade" },
    { label: t("international_reserves.keys.recession"), value: "recession" },
  ];

  const { data, setData } = useData({
    shade_type: SHADE_OPTIONS[0],
    minmax: [0, timeseries.data.x.length - 1],
  });
  const LATEST_TIMESTAMP = timeseries.data.x[timeseries.data.x.length - 1];
  const { coordinate } = useSlice(timeseries.data, data.minmax);

  const shader = useCallback<
    (key: string) => ChartDatasetProperties<keyof ChartTypeRegistry, any[]>
  >(
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

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "international_reserves.header",
      name_en: "International Reserves",
      name_bm: "Rizab Antarabangsa",
      route: routes.INTERNATIONAL_RESERVES,
    });
  }, []);

  return (
    <>
      <Hero background="money-supply-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            {t("nav.megamenu.categories.financial_sector")}
          </span>
          <h3>{t("international_reserves.header")}</h3>
          <p className="text-black lg:text-dim">{t("international_reserves.description")}</p>

          <p className="text-sm text-dim">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* Key measures of BNM’s international reserves */}
        <Section title={t("international_reserves.section_1.title")} date={timeseries.data_as_of}>
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4 lg:flex lg:flex-row">
              <Dropdown
                anchor="left"
                options={SHADE_OPTIONS}
                selected={data.shade_type}
                onChange={e => setData("shade_type", e)}
              />
            </div>

            <Slider
              type="range"
              value={data.minmax}
              data={timeseries.data.x}
              period="month"
              onChange={e => setData("minmax", e)}
            />

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <Timeseries
                title={t("international_reserves.keys.reserves_usd")}
                className="h-[350px] w-full"
                precision={[1, 1]}
                interval="month"
                tooltipFormat="dd MMM yyyy"
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
                      label: t("international_reserves.keys.reserves_usd"),
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
                    title: t("common.latest", {
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
                title={t("international_reserves.keys.import_months")}
                className="h-[350px] w-full"
                interval="month"
                precision={[1, 1]}
                tooltipFormat="dd MMM yyyy"
                unitY={t("international_reserves.section_1.months")}
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
                      label: t("international_reserves.keys.import_months"),
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
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "dd MMM yyyy", i18n.language),
                    }),
                    value: `${numFormat(
                      timeseries_callouts.data["import_months"].callout,
                      "standard",
                      [1, 1]
                    )} ${t("international_reserves.section_1.months_of_import")}`,
                  },
                ]}
              />
              <Timeseries
                title={t("international_reserves.keys.ed_scale")}
                className="h-[350px] w-full"
                interval="month"
                precision={[1, 1]}
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
                      label: t("international_reserves.keys.ed_scale"),
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
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "dd MMM yyyy", i18n.language),
                    }),
                    value: `${numFormat(
                      timeseries_callouts.data["ed_scale"].callout,
                      "standard",
                      [1, 1]
                    )}x ${t("international_reserves.section_1.short_term_external_debt")}`,
                  },
                ]}
              />
            </div>
          </div>
        </Section>
        {/* I want to understand more about BNM’s international reserves */}
        <Section
          className="py-12"
          title={t("international_reserves.section_2.title")}
          description={
            <p className="whitespace-pre-line text-base text-dim">
              {t("international_reserves.section_2.description_part_1")}
              {
                <a
                  className="cursor-pointer underline hover:text-black hover:underline"
                  href={t("international_reserves.section_2.ir_explainer_url")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("international_reserves.section_2.ir_explainer")}
                </a>
              }
              {t("international_reserves.section_2.description_part_2")}
              {
                <a
                  className="cursor-pointer underline hover:text-black hover:underline"
                  href="https://www.bnm.gov.my/international-reserves-and-foreign-currency-liquidity"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("international_reserves.section_2.official_bnm_site")}
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
