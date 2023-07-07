import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import {
  AgencyBadge,
  Container,
  Hero,
  Panel,
  Section,
  StateDropdown,
  Tabs,
} from "@components/index";
import { NTRCIcon } from "@components/Icon/agency";
import LeftRightCard from "@components/LeftRightCard";
import Slider from "@components/Chart/Slider";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTheme } from "next-themes";
import { useTranslation } from "@hooks/useTranslation";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { routes } from "@lib/routes";
import { getTopIndices, numFormat, toDate } from "@lib/helpers";
import { SliderProvider } from "@components/Chart/Slider/context";

/**
 * OrganDonation Dashboard
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });

interface OrganDonationProps {
  last_updated: string;
  params: { state: string };
  timeseries: any;
  choropleth: any;
  barchart_age: any;
  barchart_time: any;
}

const OrganDonation: FunctionComponent<OrganDonationProps> = ({
  last_updated,
  params,
  timeseries,
  choropleth,
  barchart_age,
  barchart_time,
}) => {
  const { t, i18n } = useTranslation(["dashboard-organ-donation", "common"]);

  const currentState = params.state;
  const { data, setData } = useData({
    minmax: [timeseries.data.x.length - 366, timeseries.data.x.length - 1],
  });

  const { coordinate } = useSlice(timeseries.data, data.minmax);
  const { theme } = useTheme();
  const topStateIndices = getTopIndices(choropleth.data.y.perc, choropleth.data.y.length, true);

  return (
    <>
      <Hero
        background="green"
        category={[t("common:categories.healthcare"), "text-[#16A34A]"]}
        header={[t("header")]}
        description={[t("description")]}
        action={<StateDropdown url={routes.ORGAN_DONATION} currentState={currentState} />}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge
            agency={t("agencies:ntrc.full")}
            link="https://www.dermaorgan.gov.my/ntrc"
            icon={<NTRCIcon />}
          />
        }
      />

      <Container className="min-h-screen">
        {/* What are the latest organ pledger trends in Malaysia? */}
        <Section
          title={t("timeseries_header", {
            state: CountryAndStates[currentState],
          })}
          description={t("timeseries_description")}
          date={timeseries.data_as_of}
        >
          <SliderProvider>
            {play => (
              <>
                <Timeseries
                  className="h-[300px] w-full"
                  title={t("timeseries_title", {
                    state: CountryAndStates[currentState],
                  })}
                  interval="auto"
                  enableAnimation={!play}
                  data={{
                    labels: coordinate.x,
                    datasets: [
                      {
                        type: "line",
                        data: coordinate.line,
                        label: t("tooltip1"),
                        borderColor: "#16A34A",
                        borderWidth: 1.5,
                        backgroundColor: "#16A34A1A",
                        fill: true,
                      },
                      {
                        label: t("tooltip2"),
                        data: coordinate.daily,
                        borderColor: "#00000000",
                        backgroundColor: "#00000000",
                      },
                    ],
                  }}
                />
                <Slider
                  type="range"
                  value={data.minmax}
                  data={timeseries.data.x}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>

        {/* How do organ pledger rates differ across the country? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("choro_header")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <p className="text-dim whitespace-pre-line">{t("choro_description")}</p>
                  <p className="border-outline dark:border-washed-dark border-t pb-3 pt-6 font-bold">
                    {t("choro_ranking")}
                  </p>
                </div>
                <div className="space-y-3 overflow-auto">
                  {topStateIndices.map((pos, i) => {
                    return (
                      <div className="mr-4.5 flex space-x-3" key={pos}>
                        <div className="text-dim font-medium">#{i + 1}</div>
                        <div className="grow">{CountryAndStates[choropleth.data.x[pos]]}</div>
                        <div className="font-bold text-green-600">
                          {`${numFormat(choropleth.data.y.perc[pos], "standard", [2, 2])}%`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px] lg:w-full"
                color="greens"
                data={{
                  labels: choropleth.data.x.map((state: string) => CountryAndStates[state]),
                  values: choropleth.data.y.perc,
                }}
                unit="%"
                type="state"
              />
            }
          />
        </Section>

        {/* How strong is new pledger recruitment in Malaysia? */}
        <Section
          title={t("bar_header", {
            state: CountryAndStates[currentState],
          })}
          description={t("bar_description")}
          date={barchart_time.data_as_of}
        >
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs title={t("bar1_title")}>
                <Panel name={t("annual")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.annual.x,
                      datasets: [
                        {
                          label: `${t("bar_tooltip")}`,
                          data: barchart_time.data.annual.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor:
                            theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />{" "}
                </Panel>
                <Panel name={t("monthly")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.monthly.x,
                      datasets: [
                        {
                          label: `${t("bar_tooltip")}`,
                          data: barchart_time.data.monthly.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor:
                            theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs title={t("bar2_title")}>
                <Panel name={t("year")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_year.x,
                      datasets: [
                        {
                          label: `${t("bar_tooltip")}`,
                          data: barchart_age.data.past_year.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor:
                            theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("month")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_month.x,
                      datasets: [
                        {
                          label: `${t("bar_tooltip")}`,
                          data: barchart_age.data.past_month.y,
                          borderRadius: 12,
                          barThickness: 12,
                          backgroundColor:
                            theme === "light" ? AKSARA_COLOR.BLACK : AKSARA_COLOR.WHITE,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default OrganDonation;
