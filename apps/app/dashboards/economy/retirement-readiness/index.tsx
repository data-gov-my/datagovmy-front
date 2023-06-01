import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
import { EPFIcon } from "@components/Icon/agency";
import { AgencyBadge, Container, Hero, Section, Spinner } from "@components/index";
import { useData } from "@hooks/useData";
import { useSlice } from "@hooks/useSlice";
import { useTranslation } from "@hooks/useTranslation";
import { AKSARA_COLOR } from "@lib/constants";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * RetirementReadiness Dashboard
 * @overview Status: In-development
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });

interface RetirementReadinessProps {}

const RetirementReadiness: FunctionComponent<RetirementReadinessProps> = ({}) => {
  const { t } = useTranslation(["dashboard-retirement-readiness", "common"]);
  const { data, setData } = useData({
    minmax: [0, 1],
    loading: false,
  });
  // const { coordinate } = useSlice(data, data.minmax);

  return (
    <>
      <Hero
        background="orange"
        category={[t("common:categories.economy"), "text-[#FF820E]"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={t("common:agency.EPF")}
            link="https://www.kwsp.gov.my/"
            icon={<EPFIcon />}
          />
        }
        // last_updated={}
      />

      <Container className="min-h-fit">
        {/* Balances in Active EPF Accounts */}
        <Section
          title={t("title")}
          // date={}
        >
          <SliderProvider>
            {play => (
              <>
                {data.loading ? (
                  <div className="flex h-[352px] items-center justify-center">
                    <Spinner loading={data.loading} />
                  </div>
                ) : (
                  <>
                    <Timeseries
                      className="h-[300px] w-full"
                      enableAnimation={!play}
                      // data={{
                      //   labels: coordinate.x,
                      //   datasets: [
                      //     {
                      //       type: "line",
                      //       data: coordinate.y,
                      //       label: t(""),
                      //       backgroundColor: AKSARA_COLOR.ORANGE_H,
                      //       borderColor: AKSARA_COLOR.ORANGE,
                      //       borderWidth: 1.5,
                      //       fill: true,
                      //     },
                      //   ],
                      // }}
                    />
                    <Slider
                      type="range"
                      value={data.minmax}
                      // data={}
                      onChange={e => setData("minmax", e)}
                    />
                  </>
                )}
              </>
            )}
          </SliderProvider>
        </Section>
      </Container>
    </>
  );
};

export default RetirementReadiness;
