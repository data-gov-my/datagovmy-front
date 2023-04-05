import { FunctionComponent, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { AgencyBadge, Container, Hero, Section, StateDropdown } from "@components/index";
import { PHCorpIcon } from "@components/Icon/agency";
import LeftRightCard from "@components/LeftRightCard";
import Slider, { SliderRef } from "@components/Chart/Slider";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { BREAKPOINTS, CountryAndStates } from "@lib/constants";
import { routes } from "@lib/routes";

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
  const { t, i18n } = useTranslation(["common", "dashboard-peka-b40"]);

  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    minmax: [0, timeseries.data.x.length - 1],
  });

  const { coordinate } = useSlice(timeseries.data, data.minmax);
  const sliderRef = useRef<SliderRef>(null);

  return (
    <>
      <Hero
        background="purple"
        category={[t("nav.megamenu.categories.healthcare"), "text-[#7C3AED]"]}
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
            interval="day"
            data={{
              labels: coordinate.x,
              datasets: [
                {
                  type: "line",
                  data: coordinate.daily,
                  label: t("dashboard-peka-b40:screening"),
                  borderColor: "#7C3AED",
                  borderWidth: 1.5,
                  backgroundColor: "#7C3AED1A",
                  fill: true,
                },
              ],
            }}
          />
          <div className="pt-5">
            <Slider
              ref={sliderRef}
              type="range"
              value={data.minmax}
              data={timeseries.data.x}
              onChange={e => setData("minmax", e)}
            />
          </div>
        </Section>

        {/* How do screening rates differ across the country? */}
        <Section>
          <LeftRightCard
            left={
              <Section
                title={t("dashboard-peka-b40:choro_header")}
                date={choropleth.data_as_of}
                className="gap-6 p-8"
              >
                <p className="text-dim">{t("dashboard-peka-b40:choro_description")}</p>
              </Section>
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
