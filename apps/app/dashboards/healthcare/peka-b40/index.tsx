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
import { getTopIndices } from "@lib/helpers";

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
  const { t } = useTranslation(["dashboard-peka-b40", "common"]);

  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    minmax: [timeseries.data.x.length - 366, timeseries.data.x.length - 1],
  });

  const { coordinate } = useSlice(timeseries.data, data.minmax);
  const topStateIndices = getTopIndices(choropleth.data.y.perc, 3, true);
  const displayPercent = (percent: number) => `${percent.toFixed(2)}%`;
  return (
    <>
      <Hero
        background="purple"
        category={[t("common:nav.megamenu.categories.healthcare"), "text-purple"]}
        header={[t("header")]}
        description={
          <>
            <p className={"text-dim xl:w-2/3"}>{t("description")}</p>
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
          title={t("screening_header", {
            state: CountryAndStates[currentState],
          })}
          description={t("screening_description")}
          date={timeseries.data_as_of}
        >
          <Timeseries
            className="h-[350px] w-full"
            title={t("timeseries_title", {
              state: CountryAndStates[currentState],
            })}
            interval="auto"
            data={{
              labels: coordinate.x,
              datasets: [
                {
                  type: "line",
                  data: coordinate.line,
                  label: t("tooltip1"),
                  borderColor: AKSARA_COLOR.PURPLE,
                  borderWidth: 1.5,
                  backgroundColor: AKSARA_COLOR.PURPLE_H,
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
        </Section>

        {/* How do screening rates differ across the country? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-full w-full flex-col space-y-6 p-8">
                <div className="flex flex-col gap-2">
                  <h4>{t("choro_header")}</h4>
                  <span className="text-dim text-sm">
                    {t("common:common.data_of", { date: choropleth.data_as_of })}
                  </span>
                </div>
                <div className="flex grow flex-col justify-between space-y-6">
                  <p className="text-dim">{t("choro_description")}</p>
                  <div className="space-y-3 border-t pt-6">
                    <p className="font-bold">{t("choro_ranking")}</p>

                    {topStateIndices.map((pos, i) => {
                      return (
                        <div className="flex space-x-3">
                          <div className="text-dim font-medium">#{i + 1}</div>
                          <div className="grow">{CountryAndStates[choropleth.data.x[pos]]}</div>
                          <div className="font-bold text-[#7C3AED]">
                            {displayPercent(choropleth.data.y.perc[pos])}
                          </div>
                          <ArrowRightIcon className="text-dim h-4 w-4 self-center stroke-[1.5px]" />
                        </div>
                      );
                    })}
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
                  labels: choropleth.data.x.map((state: string) => CountryAndStates[state]),
                  values: choropleth.data.y.perc,
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
