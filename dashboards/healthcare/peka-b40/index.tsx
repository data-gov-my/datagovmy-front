import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { AgencyBadge, Container, Hero, Section, StateDropdown } from "@components/index";
import { PHCorpIcon } from "@components/Icon/agency";
import LeftRightCard from "@components/LeftRightCard";
import Slider from "@components/Chart/Slider";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { AKSARA_COLOR, BREAKPOINTS, CountryAndStates } from "@lib/constants";
import { routes } from "@lib/routes";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

/**
 * PekaB40 Dashboard
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });

interface PekaB40Props {
  last_updated: number;
  timeseries: any;
  choropleth: any;
}

const PekaB40: FunctionComponent<PekaB40Props> = ({ last_updated, timeseries, choropleth }) => {
  const { t } = useTranslation(["common", "dashboard-peka-b40"]);

  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    minmax: [timeseries.data.x.length - 366, timeseries.data.x.length - 1],
  });

  const { coordinate } = useSlice(timeseries.data, data.minmax);
  const sortedChoro = choropleth.data.sort(
    (a: typeof choropleth.data, b: typeof choropleth.data) => b.data.perc - a.data.perc
  );
  const displayPercent = (percent: number) => `${percent.toFixed(2)}%`;
  return (
    <>
      <Hero
        background="purple"
        category={[t("nav.megamenu.categories.healthcare"), "text-purple"]}
        header={[t("dashboard-peka-b40:header")]}
        description={
          <>
            <p className={"text-dim"}>{t("dashboard-peka-b40:description")}</p>
            <div className="pt-3">
              <StateDropdown url={routes.PEKA_B40} currentState={currentState} />
            </div>
          </>
        }
        agencyBadge={
          <AgencyBadge
            agency={"ProtectHealth Corporation"}
            link="https://protecthealth.com.my"
            icon={<PHCorpIcon />}
          />
        }
        last_updated={last_updated}
      />

      <Container className="min-h-screen">
        {/* What are the latest screening trends in Malaysia? */}
        <Section
          title={t("dashboard-peka-b40:screening_header", {
            state: CountryAndStates[currentState],
          })}
          description={t("dashboard-peka-b40:screening_description")}
          date={timeseries.data_as_of}
        >
          <Timeseries
            className="h-[350px] w-full"
            title={t("dashboard-peka-b40:timeseries_title", {
              state: CountryAndStates[currentState],
            })}
            interval="auto"
            data={{
              labels: coordinate.x,
              datasets: [
                {
                  type: "line",
                  data: coordinate.line,
                  label: t("dashboard-peka-b40:tooltip1"),
                  borderColor: AKSARA_COLOR.PURPLE,
                  borderWidth: 1.5,
                  backgroundColor: AKSARA_COLOR.PURPLE_H,
                  fill: true,
                },
                {
                  label: t("dashboard-peka-b40:tooltip2"),
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
        </Section>

        {/* How do screening rates differ across the country? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-full w-full flex-col space-y-6 p-8">
                <div className="flex flex-col gap-2">
                  <h4>{t("dashboard-peka-b40:choro_header")}</h4>
                  <span className="text-sm text-dim">
                    {t("common.data_of", { date: choropleth.data_as_of })}
                  </span>
                </div>
                <div className="flex grow flex-col justify-between space-y-6">
                  <p className="text-dim">{t("dashboard-peka-b40:choro_description")}</p>
                  <div className="space-y-3 border-t pt-6">
                    <p className="font-bold">{t("dashboard-peka-b40:choro_ranking")}</p>
                    <div className="flex space-x-3">
                      <div className="font-medium text-dim">#1</div>
                      <div className="grow">{CountryAndStates[sortedChoro[0].state]}</div>
                      <div className="font-bold text-[#7C3AED]">
                        {displayPercent(sortedChoro[0].data.perc)}
                      </div>
                      <ArrowRightIcon className="h-4 w-4 self-center stroke-[1.5px] text-dim" />
                    </div>
                    <div className="flex space-x-3">
                      <div className="font-medium text-dim">#2</div>
                      <div className="grow">{CountryAndStates[sortedChoro[1].state]}</div>
                      <div className="font-bold text-[#7C3AED]">
                        {displayPercent(sortedChoro[1].data.perc)}
                      </div>
                      <ArrowRightIcon className="h-4 w-4 self-center stroke-[1.5px] text-dim" />
                    </div>
                    <div className="flex space-x-3">
                      <div className="font-medium text-dim">#3</div>
                      <div className="grow">{CountryAndStates[sortedChoro[2].state]}</div>
                      <div className="font-bold text-[#7C3AED]">
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
                color="purples"
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
      </Container>
    </>
  );
};

export default PekaB40;
