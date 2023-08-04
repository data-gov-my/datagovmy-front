import { routes } from "@lib/routes";
import BarMeter from "datagovmy-ui/charts/bar-meter";
import {
  AgencyBadge,
  ComboBox,
  Container,
  Hero,
  LeftRightCard,
  Section,
  Slider,
  Tooltip,
} from "datagovmy-ui/components";
import { AKSARA_COLOR, CountryAndStates } from "datagovmy-ui/constants";
import { SliderProvider } from "datagovmy-ui/contexts/slider";
import { getTopIndices, numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useSlice, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

/**
 * Civil Service Dashboard
 * @overview Status: In-development
 */

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Pyramid = dynamic(() => import("datagovmy-ui/charts/pyramid"), { ssr: false });
const Timeseries = dynamic(() => import("datagovmy-ui/charts/timeseries"), { ssr: false });

interface CivilServiceProps {
  agencies: any;
  barmeter: any;
  choropleth: any;
  last_updated: any;
  pyramid: any;
  timeseries: any;
  timeseries_callout: any;
}

const CivilService: FunctionComponent<CivilServiceProps> = ({
  agencies,
  barmeter,
  choropleth,
  last_updated,
  pyramid,
  timeseries,
  timeseries_callout,
}) => {
  const { t, i18n } = useTranslation(["dashboard-civil-service", "common"]);
  const { push } = useRouter();
  const { data, setData } = useData({
    agency: "Ministry of Health",
    minmax: [0, 1],
  });
  // const { coordinate } = useSlice(timeseries ?? [], data.minmax);
  const barmeter_data = Object.entries(barmeter.data.bar);
  // const sortedIndices = getTopIndices(choropleth.data.y.value, choropleth.data.y.length, true);

  const AGENCY_OPTIONS: Array<OptionType> = ["Ministry of Health", "agencies"].map(
    (key: string) => ({
      label: t(`agency.${key}`),
      value: key,
    })
  );

  const navigateToAgency = (agency?: string) => {
    if (!agency) {
      setData("query", undefined);
      return;
    }
    setData("loading", true);

    const route = `${routes.CIVIL_SERVICE}/${agency}`;
    push(route, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  return (
    <>
      <Hero
        background="blue"
        category={[t("common:categories.public_finances"), "text-primary dark:text-primary-dark"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={<AgencyBadge agency="jpa" />}
      />

      <Container className="min-h-screen">
        <Section
        // date={}
        >
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("choro_header")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        // date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <p className="text-dim">{t("choro_desc")}</p>
                  <div className="border-t pt-6">
                    <p className="font-bold">{t("choro_rank")}</p>
                  </div>
                </div>
                <div className="flex flex-col space-y-3 overflow-auto pt-3">
                  {/* {sortedIndices.map((pos, i) => {
                    return (
                      <div className="mr-4.5 flex space-x-3" key={pos}>
                        <div className="text-dim font-medium">#{i + 1}</div>
                        <div className="grow">{CountryAndStates[choropleth.data.x[pos]]}</div>
                        <div className="text-purple font-bold">
                          {numFormat(choropleth.data.y.value[pos], "standard")%}
                        </div>
                      </div>
                    );
                  })} */}
                </div>
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px]"
                // data={{
                //   labels: choropleth.data[data.filter].x.map(
                //     (state: string) => CountryAndStates[state]),
                //     values:  choropleth.data[data.filter].y.value,
                //   }}
                unit="%"
                color="blues"
              />
            }
          />
        </Section>

        <div className="space-y-6 pt-12">
          <h4 className="lg:text-center">{t("zoom")}</h4>
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="mx-auto w-full md:w-96">
              <ComboBox
                placeholder={t("search_agency")}
                options={AGENCY_OPTIONS}
                selected={data.query ? AGENCY_OPTIONS.find(e => e.value === data.query) : null}
                onChange={selected => navigateToAgency(selected?.value)}
              />
            </div>
          </div>
        </div>

        {/* Number of civil servants employed in the {{ agency }} */}
        <Section
          title={t("timeseries_header", {
            agency: data.agency,
          })}
          // date={}
        >
          <SliderProvider>
            {play => (
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
                  //       label: t("entrances"),
                  //       backgroundColor: AKSARA_COLOR.PRIMARY_H,
                  //       borderColor: AKSARA_COLOR.PRIMARY,
                  //       borderWidth: 1.5,
                  //       fill: true,
                  //     },
                  //   ],
                  // }}
                  // stats={[
                  //   {
                  //     title: t("this_month"),
                  //     value: `+${numFormat(
                  //       data.timeseries_callout.data["entrances"].value,
                  //       "standard"
                  //     )}`,
                  //   },
                  //   {
                  //     title: t("YoY_change"),
                  //     value: `${numFormat(
                  //       data.timeseries_callout.data["departures"].value,
                  //       "standard"
                  //     )}%`,
                  //   }
                  // ]}
                />
                <Slider
                  type="range"
                  value={data.minmax}
                  data={[]} //{timeseries.data.x}
                  onChange={e => setData("minmax", e)}
                />
              </>
            )}
          </SliderProvider>
        </Section>
        <Section>
          <h4 className="pb-8 pt-12">{t("breakdown", { count: 543212, agency: data.agency })}</h4>
          <div className="flex flex-col items-stretch gap-6 lg:flex-row">
            <div className="h-[650px] basis-1/3">
              <Pyramid title={t("pyramid_title", { agency: data.agency })} />
            </div>
            <div className="grid basis-2/3 grid-cols-1 gap-12 lg:grid-cols-2 xl:grid-cols-3">
              {[...barmeter_data, ...barmeter_data].map(([k, v]: [string, any]) => {
                return (
                  <div className="flex flex-col space-y-6" key={k}>
                    <BarMeter
                      key={k}
                      title={t(k)}
                      layout="horizontal"
                      unit="%"
                      data={v}
                      sort={"desc"}
                      formatX={key => t(key)}
                      formatY={(value, key) => (
                        <>
                          <Tooltip
                            tip={`${t("tooltip", {
                              count: barmeter.data.tooltip[k].find(
                                (object: { x: string; y: number }) => object.x === key
                              ).y,
                            })}`}
                          />
                          <span className="pl-1">{numFormat(value, "compact", [1, 1])}</span>
                        </>
                      )}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
};

export default CivilService;
