// import { Icon } from "@components/Icon/agency";
import {
  AgencyBadge,
  ComboBox,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  Section,
  StateDropdown,
  Tooltip,
} from "@components/index";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { getTopIndices, numFormat, toDate } from "@lib/helpers";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Orang Asli Dashboard
 * @overview Status: In-development
 */

const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const MapPlot = dynamic(() => import("@components/Chart/MapPlot"), { ssr: false });
const Pyramid = dynamic(() => import("@components/Chart/Pyramid"), { ssr: false });

interface OrangAsliProps {
  barmeter: any;
  choropleth: any;
  last_updated: any;
  pyramid: any;
}

const OrangAsli: FunctionComponent<OrangAsliProps> = ({
  barmeter,
  choropleth,
  last_updated,
  pyramid,
}) => {
  const { t, i18n } = useTranslation(["dashboard-orang-asli", "common"]);
  const FILTER_OPTIONS: Array<OptionType> = ["absolute"].map((key: string) => ({
    label: t(key),
    value: key,
  }));
  const { data, setData } = useData({
    filter: FILTER_OPTIONS[0].value,
    loading: false,
  });

  const barmeter_data = Object.entries(barmeter.data.bar);
  // [barmeter_data[0], barmeter_data[1]] = [barmeter_data[1], barmeter_data[0]];
  const topStateIndices = getTopIndices(
    choropleth.data[data.filter].y.value,
    choropleth.data[data.filter].y.length,
    true
  );
  const KAMPUNG_OPTIONS: Array<OptionType> = [].map((key: string) => ({
    label: key,
    value: key,
  }));
  return (
    <>
      <Hero
        background="green"
        category={[t("common:categories.demography"), "text-green-600"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={t("common:agency.JAKOA")}
            link="https://www.jakoa.gov.my/"
            // icon={<Icon />}
          />
        }
        last_updated={last_updated}
      />

      <Container className="min-h-screen">
        {/* How are the indigenous peoples distributed across Malaysia? */}
        <Section>
          {/* How is the refugee population distributed across states? */}
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col space-y-3 overflow-hidden p-6 lg:p-8">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("choro_header")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                      })}
                    </span>
                  </div>
                  <p className="text-dim">{t("choro_description")}</p>
                  <div className="flex space-x-3">
                    <StateDropdown width="w-full md:w-fit lg:w-full" anchor="left" />
                    <Dropdown
                      anchor="left"
                      width="w-full md:w-fit lg:w-full"
                      placeholder={t("common:common.select")}
                      options={FILTER_OPTIONS}
                      selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                      onChange={e => setData("filter", e.value)}
                    />
                  </div>
                  <p className="border-outline dark:border-dim border-t pt-6 font-bold">
                    {t("choro_ranking", { count: choropleth.data[data.filter].x.length })}
                  </p>
                </div>
                <div className="space-y-3 overflow-auto">
                  {topStateIndices.map((pos: number, i: number) => {
                    return (
                      <div className="pr-4.5 flex space-x-3" key={pos}>
                        <div className="text-dim font-medium">#{i + 1}</div>
                        <div className="grow">
                          {CountryAndStates[choropleth.data[data.filter].x[pos]]}
                        </div>
                        <div className="font-bold text-green-600">
                          {data.filter === "absolute"
                            ? numFormat(choropleth.data[data.filter].y.value[pos], "standard")
                            : numFormat(
                                choropleth.data[data.filter].y.value[pos],
                                "standard",
                                [1, 1]
                              )}
                          {data.filter === "perc" ? "%" : ""}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px]"
                data={{
                  labels: choropleth.data[data.filter].x.map(
                    (state: string) => CountryAndStates[state]
                  ),
                  values: choropleth.data[data.filter].y.value,
                }}
                type="state"
                // unit={data.filter === "perc" ? "%" : ""}
                color="greens"
              />
            }
          />
        </Section>

        <Section>
          <div className="space-y-12 lg:grid lg:grid-cols-12">
            <div className="flex flex-col gap-6 lg:col-span-10 lg:col-start-2 lg:flex-row">
              <div className="flex flex-col justify-center space-y-6 lg:basis-1/3">
                <h4 className="text-center lg:text-start">{t("title")}</h4>
                <div className="mx-auto w-full md:w-96">
                  <ComboBox
                    placeholder={t("search_kampung")}
                    options={KAMPUNG_OPTIONS}
                    selected={data.query ? KAMPUNG_OPTIONS.find(e => e.value === data.query) : null}
                    onChange={selected => {
                      if (selected !== undefined) {
                        setData("loading", true);
                        get("/dashboard", {
                          dashboard: "orang_asli",
                        })
                          .then(({ data }) => {
                            setData("loading", false);
                          })
                          .catch(e => {
                            console.error(e);
                          });
                      } else {
                        setData("query", undefined);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="lg:basis-2/3">
                <MapPlot
                  className="h-[400px] rounded-xl shadow lg:w-full"
                  // position={[info.lat, info.lon]}
                  zoom={10}
                  // markers={[
                  //   {
                  //     position: [info.lat, info.lon],
                  //     school: info.school,
                  //   },
                  // ]}
                />
                <p className="text-dim pt-3 text-center text-sm">{t("map_description")}</p>
              </div>
            </div>
          </div>
          <h4 className="pb-8 pt-12">{t("pyramid_title")}</h4>
          <div className="flex flex-col items-stretch gap-6 lg:flex-row">
            <div className="h-[650px] basis-1/3">
              <Pyramid title={t("header")} />
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

export default OrangAsli;
