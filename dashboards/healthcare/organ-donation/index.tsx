import { FunctionComponent, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
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
import { useWindowWidth } from "@hooks/useWindowWidth";
import { AKSARA_COLOR, BREAKPOINTS, CountryAndStates } from "@lib/constants";
import { routes } from "@lib/routes";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

/**
 * OrganDonation Dashboard
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });

interface OrganDonationProps {
  last_updated: number;
  timeseries: any;
  choropleth: any;
  barchart_age: any;
  barchart_time: any;
}

const OrganDonation: FunctionComponent<OrganDonationProps> = ({
  last_updated,
  timeseries,
  choropleth,
  barchart_age,
  barchart_time,
}) => {
  const { t, i18n } = useTranslation(["common", "dashboard-organ-donation"]);

  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    minmax: [timeseries.data.x.length - 366, timeseries.data.x.length - 1],
  });

  const { coordinate } = useSlice(timeseries.data, data.minmax);
  const { theme } = useTheme();
  const sortedChoro = choropleth.data.sort(
    (a: typeof choropleth.data, b: typeof choropleth.data) => b.data.perc - a.data.perc
  );
  const displayPercent = (percent: number) => `${percent.toFixed(2)}%`;
  return (
    <>
      <Hero
        background="green"
        category={[t("nav.megamenu.categories.healthcare"), "text-[#16A34A]"]}
        header={[t("dashboard-organ-donation:header")]}
        description={
          <>
            <p className={"text-dim"}>{t("dashboard-organ-donation:description")}</p>
            <div className="pt-3">
              <StateDropdown url={routes.ORGAN_DONATION} currentState={currentState} />
            </div>
          </>
        }
        agencyBadge={
          <AgencyBadge
            agency={"National Transplant Resource Centre (NTRC)"}
            link="https://www.dermaorgan.gov.my/ntrc"
            icon={<NTRCIcon />}
          />
        }
        last_updated={last_updated}
      />

      <Container className="min-h-screen">
        {/* What are the latest organ pledger trends in Malaysia? */}
        <Section
          title={t("dashboard-organ-donation:timeseries_header", {
            state: CountryAndStates[currentState],
          })}
          description={t("dashboard-organ-donation:timeseries_description")}
          date={timeseries.data_as_of}
        >
          <Timeseries
            className="h-[350px] w-full"
            title={t("dashboard-organ-donation:timeseries_title", {
              state: CountryAndStates[currentState],
            })}
            interval="auto"
            data={{
              labels: coordinate.x,
              datasets: [
                {
                  type: "line",
                  data: coordinate.line,
                  label: t("dashboard-organ-donation:tooltip1"),
                  borderColor: "#16A34A",
                  borderWidth: 1.5,
                  backgroundColor: "#16A34A1A",
                  fill: true,
                },
                {
                  label: t("dashboard-organ-donation:tooltip2"),
                  data: coordinate.daily,
                  borderColor: "#00000000",
                  backgroundColor: "#00000000",
                },
              ],
            }}
          />
          <div className="pt-5">
            <Slider
              type="range"
              value={data.minmax}
              data={timeseries.data.x}
              onChange={e => setData("minmax", e)}
            />
          </div>
        </Section>

        {/* How do organ pledger rates differ across the country? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-full w-full flex-col space-y-6 p-8">
                <div className="flex flex-col gap-2">
                  <h4>{t("dashboard-organ-donation:choro_header")}</h4>
                  <span className="text-sm text-dim">
                    {t("common.data_of", { date: choropleth.data_as_of })}
                  </span>
                </div>
                <div className="flex grow flex-col justify-between space-y-6">
                  <p className="text-dim">{t("dashboard-organ-donation:choro_description")}</p>
                  <div className="space-y-3 border-t pt-6">
                    <p className="font-bold">{t("dashboard-organ-donation:choro_ranking")}</p>
                    <div className="flex space-x-3">
                      <div className="font-medium text-dim">#1</div>
                      <div className="grow">{CountryAndStates[sortedChoro[0].state]}</div>
                      <div className="font-bold text-[#16A34A]">
                        {displayPercent(sortedChoro[0].data.perc)}
                      </div>
                      <ArrowRightIcon className="h-4 w-4 self-center stroke-[1.5px] text-dim" />
                    </div>
                    <div className="flex space-x-3">
                      <div className="font-medium text-dim">#2</div>
                      <div className="grow">{CountryAndStates[sortedChoro[1].state]}</div>
                      <div className="font-bold text-[#16A34A]">
                        {displayPercent(sortedChoro[1].data.perc)}
                      </div>
                      <ArrowRightIcon className="h-4 w-4 self-center stroke-[1.5px] text-dim" />
                    </div>
                    <div className="flex space-x-3">
                      <div className="font-medium text-dim">#3</div>
                      <div className="grow">{CountryAndStates[sortedChoro[2].state]}</div>
                      <div className="font-bold text-[#16A34A]">
                        {displayPercent(sortedChoro[2].data.perc)}
                      </div>
                      <ArrowRightIcon className="h-4 w-4 self-center stroke-[1.5px] text-dim" />
                    </div>
                  </div>
                </div>
              </div>
            }
            right={
              <Choropleth
                className={(isMobile ? "h-[400px] w-auto" : "h-[500px] w-full").concat(
                  " rounded-b"
                )}
                color="greens"
                data={{
                  labels: choropleth.data.map(
                    ({ state }: { state: string }) => CountryAndStates[state]
                  ),
                  values: choropleth.data.map(
                    ({ data: { perc } }: { data: { perc: number | null } }) => perc
                  ),
                }}
                unit="%"
                type="state"
              />
            }
          />
        </Section>

        {/* How strong is new pledger recruitment in Malaysia? */}
        <Section
          title={t("dashboard-organ-donation:bar_header", {
            state: CountryAndStates[currentState],
          })}
          description={t("dashboard-organ-donation:bar_description")}
          date={barchart_time.date_as_of}
        >
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs title={t("dashboard-organ-donation:bar1_title")}>
                <Panel name={t("dashboard-organ-donation:annual")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.annual.x,
                      datasets: [
                        {
                          label: `${t("dashboard-organ-donation:bar_tooltip")}`,
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
                <Panel name={t("dashboard-organ-donation:monthly")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_time.data.monthly.x,
                      datasets: [
                        {
                          label: `${t("dashboard-organ-donation:bar_tooltip")}`,
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
              <Tabs title={t("dashboard-organ-donation:bar2_title")}>
                <Panel name={t("dashboard-organ-donation:year")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_year.x,
                      datasets: [
                        {
                          label: `${t("dashboard-organ-donation:bar_tooltip")}`,
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
                <Panel name={t("dashboard-organ-donation:month")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: barchart_age.data.past_month.x,
                      datasets: [
                        {
                          label: `${t("dashboard-organ-donation:bar_tooltip")}`,
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
