import { Container, Dropdown, Hero, Section } from "@components/index";
import { FunctionComponent, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { numFormat, smartNumFormat, toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { useSlice } from "@hooks/useSlice";
import { useData } from "@hooks/useData";
import type { OptionType } from "@components/types";
import { AKSARA_COLOR } from "@lib/constants";
import type { ChartDatasetProperties, ChartTypeRegistry } from "chart.js";
import Slider from "@components/Chart/Slider";
import { track } from "@lib/mixpanel";
import { routes } from "@lib/routes";
import { useWatch } from "@hooks/useWatch";
import AgencyBadge from "@components/AgencyBadge";

/**
 * Reserve Money Dashboard
 * @overview Status: Live
 */

interface TimeseriesChartData {
  title: string;
  unitY: string;
  label: string;
  data: number[];
  fill: boolean;
  callout: string;
  prefix: string;
}

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface ReserveMoneyDashboardProps {
  last_updated: number;
  timeseries: any;
  timeseries_callouts: any;
}

const ReserveMoneyDashboard: FunctionComponent<ReserveMoneyDashboardProps> = ({
  last_updated,
  timeseries,
  timeseries_callouts,
}) => {
  const { t, i18n } = useTranslation();
  const INDEX_OPTIONS: Array<OptionType> = Object.keys(timeseries.data).map((key: string) => ({
    label: t(`dashboard-reserve-money:keys.${key}`),
    value: key,
  }));
  const SHADE_OPTIONS: Array<OptionType> = [
    { label: t("dashboard-reserve-money:keys.no_shade"), value: "no_shade" },
    { label: t("dashboard-reserve-money:keys.recession"), value: "recession" },
  ];

  const { data, setData } = useData({
    index_type: INDEX_OPTIONS[0],
    shade_type: SHADE_OPTIONS[0],
    minmax: [0, timeseries.data[INDEX_OPTIONS[0].value].x.length - 1],
  });
  const LATEST_TIMESTAMP =
    timeseries.data[data.index_type.value].x[timeseries.data[data.index_type.value].x.length - 1];
  const { coordinate } = useSlice(timeseries.data[data.index_type.value], data.minmax);

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
            numFormat(
              timeseries_callouts.data[data.index_type.value][key].callout,
              "standard",
              [1, 1]
            ),
            unit,
          ].join("")
        : [
            prefix,
            smartNumFormat({
              value: timeseries_callouts.data[data.index_type.value][key].callout,
              locale: i18n.language,
              precision: [1, 1],
            }),
          ].join("");
      return {
        prefix,
        unit,
        callout,
        fill: data.shade_type.value === "no_shade",
      };
    },
    [data.index_type, data.shade_type]
  );

  const getChartData = (sectionHeaders: string[]): TimeseriesChartData[] =>
    sectionHeaders.map(chartName => ({
      title: t(`dashboard-reserve-money:keys.${chartName}`),
      unitY: configs(chartName).unit,
      label: t(`dashboard-reserve-money:keys.${chartName}`),
      data: coordinate[chartName],
      fill: configs(chartName).fill,
      callout: configs(chartName).callout,
      prefix: configs(chartName).prefix,
    }));

  const section1ChartData = getChartData(["currency", "reserves_required", "reserves_excess"]);
  const section2ChartData = getChartData([
    "net_claims_gov",
    "claims_gov",
    "deposits_gov",
    "claims_private",
    "external",
    "others",
  ]);

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "reservemoney.header",
      name_en: "Reserve Money",
      name_bm: "Wang Rizab",
      route: routes.RESERVE_MONEY,
    });
  }, []);

  useWatch(() => {
    setData("minmax", [0, timeseries.data[data.index_type.value].x.length - 1]);
  }, [data.index_type]);

  return (
    <>
      <Hero
        background="bg-gradient-radial from-white to-primary/10 dark:from-outlineHover-dark dark:to-black"
        category={[t("nav.megamenu.categories.financial_sector")]}
        header={[t("dashboard-reserve-money:header")]}
        description={[t("dashboard-reserve-money:description")]}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge
            agency="Bank Negara"
            link="https://www.bnm.gov.my/publications/mhs"
            icon={
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1_5)">
                  <path
                    d="M14.8261 0.268841C13.0696 0.407594 11.3217 0.832526 9.74784 1.50895C8.93914 1.85583 8.76523 1.95123 7.8261 2.50624C5.76523 3.73768 3.75653 5.73226 2.51305 7.80488C2.13914 8.41193 1.39131 9.90353 1.39131 10.0249C1.39131 10.051 1.33044 10.1984 1.26088 10.3458C1.06088 10.7968 0.643488 12.297 0.469575 13.2249C0.234792 14.439 0.234792 17.6477 0.469575 18.7317C0.721748 19.9111 1.0174 21.0125 1.2261 21.4634C1.26088 21.5588 1.37392 21.8276 1.46957 22.0705C1.65218 22.5561 2.17392 23.5707 2.60871 24.2818C4.00871 26.5713 6.40871 28.774 8.8261 29.9881C11.1565 31.1588 13.287 31.6531 15.9826 31.6531C18.6348 31.6444 20.6087 31.2022 22.8609 30.1095C25.4261 28.8607 27.6087 26.9355 29.1565 24.5594C29.8087 23.5707 30.7826 21.6108 30.7826 21.316C30.7826 21.2466 30.8174 21.1599 30.8609 21.1079C31.0174 20.9344 31.4348 19.148 31.6087 17.8732C31.8522 16.1908 31.7131 13.9621 31.2696 12.1843C31.087 11.4385 30.9565 10.9962 30.8783 10.7968C30.8348 10.7014 30.6696 10.3111 30.5131 9.92955C29.8783 8.37724 28.9304 6.8683 27.7739 5.54147C26.287 3.83307 24.1652 2.29811 22.1739 1.48293C21.9131 1.37887 21.6174 1.25746 21.5217 1.2141C21.3131 1.11871 19.7131 0.667757 19.087 0.529003C17.9739 0.286185 16.0783 0.164776 14.8261 0.268841ZM16.5391 4.65692C17.0957 4.87372 17.4261 5.15123 17.6783 5.62819C18.2174 6.60814 17.8 7.77887 16.7391 8.27318C16.1826 8.54201 15.8 8.55936 15.287 8.33388C14.2435 7.8916 13.7826 6.93768 14.1044 5.87968C14.2957 5.2206 15.2261 4.53551 15.9304 4.51816C16.0609 4.50949 16.3391 4.57887 16.5391 4.65692ZM20.0957 5.20326C20.0783 5.27263 20.0609 5.55014 20.0609 5.8103C20.0609 7.11979 21.3739 8.07372 22.687 7.71816C22.9913 7.64011 23.087 7.64011 23.1478 7.73551C23.2783 7.92629 22.6 8.45529 22 8.62006C21.5131 8.75881 21.4435 8.75881 20.9565 8.62006C19.9304 8.33388 19.3044 7.51871 19.3044 6.48673C19.3044 5.75827 19.6348 5.0038 19.9304 5.04716C20.0609 5.0645 20.1131 5.12521 20.0957 5.20326ZM10.7304 6.44337C11.1913 7.41464 11.2 7.55339 10.8348 7.96098C10.5652 8.25583 10.5217 8.3599 10.5217 8.75014C10.5217 9.41789 10.887 10.7274 11.6957 12.9041C11.9044 13.4764 12.2261 14.0748 12.4087 14.2396C12.887 14.6732 13.8783 14.7686 15.3565 14.5344C15.7826 14.465 16.6 14.3436 17.1739 14.2656C17.7478 14.1875 18.4696 14.0835 18.7826 14.0314C19.0957 13.9881 20.1739 13.9274 21.1739 13.9014C22.8261 13.858 23.0696 13.8753 23.7478 14.0401C24.1652 14.1442 24.5913 14.2222 24.7044 14.2222C25.1565 14.2222 25.7391 13.5545 25.7391 13.0428C25.7391 12.748 25.3565 12.1843 25.0435 12.0282C24.7913 11.8981 24.6087 11.8808 23.9739 11.9155C23.5565 11.9415 22.9131 12.0455 22.5391 12.1409C20.4783 12.6873 18.6348 12.9127 17.3565 12.7566C16.3131 12.6352 15.8957 12.4531 15.9304 12.1409C15.9652 11.8547 16.2696 11.8201 17.0783 12.0108C18.2087 12.2884 19.7391 12.1756 21.5652 11.69C23.7652 11.1003 24.5565 11.0396 25.3131 11.4211C25.6 11.5686 25.8957 11.8114 26.0609 12.0369C26.3131 12.3751 26.3478 12.4791 26.3478 12.9734C26.3478 13.6759 26.1478 14.0835 25.5826 14.5604L25.1565 14.916V15.5491C25.1478 16.3295 24.9391 16.8152 24.3391 17.4656L23.9044 17.9426L23.9913 18.5756C24.0435 18.9225 24.1217 19.6336 24.1739 20.1626C24.2783 21.3247 24.4696 23.0071 24.6609 24.4119C24.7304 24.9843 24.8 25.5913 24.8087 25.7561L24.8261 26.0596L24.3565 26.0856C23.7217 26.1203 23.6261 26.0076 23.9913 25.6347C24.2522 25.3659 24.2696 25.3138 24.1913 25.045C24.1391 24.8889 24.0783 24.5507 24.0435 24.2905C24.0174 24.0304 23.8522 23.2846 23.6783 22.6428C23.3304 21.29 23.2522 20.9778 23.1131 20.2233C23 19.651 22.8261 19.5122 22.7304 19.9198C22.6957 20.0585 22.4087 20.7957 22.0783 21.5675C21.2957 23.4146 20.6957 25.1924 20.6957 25.6347C20.6957 25.8862 20.6522 26.0163 20.5565 26.051C20.3304 26.1377 19.6696 26.1117 19.6 26.0076C19.5739 25.9556 19.6696 25.7908 19.8174 25.6347C20.087 25.3659 20.2348 24.993 20.5652 23.8049C20.6348 23.5621 20.7652 23.0938 20.8696 22.7642C21.1913 21.6455 21.7652 19.3041 21.8696 18.645C22 17.8645 21.9044 17.5176 21.487 17.3095C21.1304 17.1187 21.0783 17.1274 19.6957 17.4829C15.287 18.6016 14.8696 18.6797 13.7044 18.6276C13.1913 18.6016 12.7565 18.6103 12.7391 18.645C12.7131 18.6797 12.7565 19.0786 12.8348 19.5209C12.9652 20.3274 13.0783 21.0558 13.3478 22.9377C13.4261 23.458 13.5478 24.2385 13.6174 24.6634C13.687 25.0884 13.7391 25.548 13.7391 25.6781C13.7391 25.8081 13.7826 25.9469 13.8261 25.9729C13.9739 26.0683 13.9217 26.4412 13.7478 26.5366C13.5131 26.658 12.9304 26.6493 12.8 26.5192C12.7217 26.4412 12.7565 26.3545 12.9652 26.1377L13.2261 25.8688L13.0087 24.7935C12.7565 23.536 12.6348 23.0764 12.2522 21.897C12.1044 21.4201 11.8957 20.7089 11.7913 20.31C11.6696 19.8331 11.5739 19.6076 11.4957 19.6163C11.4261 19.6336 11.2696 19.9111 11.1391 20.2493C10.9044 20.8304 10.7913 21.0905 10.1131 22.5474C9.94784 22.903 9.73044 23.3886 9.64349 23.6314C9.54784 23.8656 9.44349 24.1431 9.40001 24.2385C9.0261 25.1144 8.78262 25.8862 8.78262 26.181C8.78262 26.4932 8.58262 26.6233 8.10436 26.6233C7.57392 26.6233 7.49566 26.4412 7.87827 26.103C8.18262 25.8428 8.43479 25.2878 8.69566 24.3252C8.73914 24.1778 8.89566 23.6748 9.04349 23.1978C9.20001 22.7209 9.37392 22.1225 9.44349 21.871C9.50436 21.6282 9.6261 21.1946 9.69566 20.9171C10.1391 19.2954 10.4348 17.7171 10.4348 16.9973C10.4348 16.3989 10.2435 15.3756 9.91305 14.1789C9.80871 13.7973 9.68697 13.3637 9.65218 13.2249C9.53044 12.7306 8.87827 10.8488 8.73914 10.5886C8.57392 10.2678 8.29566 10.181 7.78262 10.3111C7.57392 10.3631 7.32175 10.4065 7.2261 10.4065C7.00871 10.4065 6.98262 10.181 7.18262 9.96423C7.31305 9.82548 7.28697 9.79946 6.92175 9.63469C6.49566 9.45258 6.4261 9.29648 6.66957 9.05366C6.85218 8.88022 7.77392 8.45529 8.15653 8.36857C8.52175 8.29052 8.59131 8.10841 8.35653 7.85692C8.06088 7.54472 8.09566 7.33659 8.66088 6.08781C8.74784 5.91437 8.85218 5.8103 8.95653 5.8103C9.12175 5.8103 9.13044 5.87968 9.13044 6.72087C9.13044 7.51871 9.15653 7.65746 9.30436 7.80488C9.53044 8.03036 9.75653 8.02169 9.96523 7.79621C10.1044 7.64011 10.1304 7.46667 10.1391 6.77291C10.1478 5.50678 10.2522 5.44608 10.7304 6.44337Z"
                    fill="#0F5087"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1_5">
                    <rect width="32" height="32" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            }
          />
        }
      />

      <Container className="min-h-screen">
        {/* How is reserve money trending? */}
        <Section
          title={t("dashboard-reserve-money:section_1.title")}
          description={t("dashboard-reserve-money:section_1.description")}
          date={timeseries.data_as_of}
        >
          <div className="space-y-8">
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

            <Slider
              type="range"
              value={data.minmax}
              data={timeseries.data[data.index_type.value].x}
              period="month"
              onChange={e => setData("minmax", e)}
            />
            <Timeseries
              title={t("dashboard-reserve-money:keys.total")}
              className="h-[350px] w-full"
              interval="month"
              displayNumFormat={(value, type, precision) =>
                smartNumFormat({ value, type, precision, locale: i18n.language })
              }
              unitY={configs("total").unit}
              prefixY={configs("total").prefix}
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
                    label: t("dashboard-reserve-money:keys.total"),
                    borderColor: AKSARA_COLOR.PRIMARY,
                    backgroundColor: AKSARA_COLOR.PRIMARY_H,
                    borderWidth: 1.5,
                    fill: configs("total").fill,
                  },
                  shader(data.shade_type.value),
                ],
              }}
              stats={[
                {
                  title: t("common.latest", {
                    date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                  }),
                  value: configs("total").callout,
                },
              ]}
            />

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {section1ChartData.map(chartData => (
                <Timeseries
                  key={chartData.title}
                  title={chartData.title}
                  className="h-[350px] w-full"
                  interval="month"
                  displayNumFormat={(value, type, precision) =>
                    smartNumFormat({ value, type, precision, locale: i18n.language })
                  }
                  unitY={chartData.unitY}
                  prefixY={chartData.prefix}
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
                      title: t("common.latest", {
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
        {/* Factors affecting Reserve Money */}
        <Section
          title={t("dashboard-reserve-money:section_2.title")}
          description={t("dashboard-reserve-money:section_2.description")}
          date={timeseries.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {section2ChartData.map(chartData => (
              <Timeseries
                key={chartData.title}
                title={chartData.title}
                className="h-[350px] w-full"
                interval="month"
                displayNumFormat={(value, type, precision) =>
                  smartNumFormat({ value, type, precision, locale: i18n.language })
                }
                unitY={chartData.unitY}
                prefixY={chartData.prefix}
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
                    title: t("common.latest", {
                      date: toDate(LATEST_TIMESTAMP, "MMM yyyy", i18n.language),
                    }),
                    value: chartData.callout,
                  },
                ]}
              />
            ))}
          </div>
        </Section>
      </Container>
    </>
  );
};

export default ReserveMoneyDashboard;
