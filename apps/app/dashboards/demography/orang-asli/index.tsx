import BarMeter from "@components/Chart/BarMeter";
import Slider from "@components/Chart/Slider";
import { SliderProvider } from "@components/Chart/Slider/context";
// import { Icon } from "@components/Icon/agency";
import {
  AgencyBadge,
  ComboBox,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  Section,
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

const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });

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
  const { t, i18n } = useTranslation(["dashboard-refugee-situation", "common"]);
  const FILTER_OPTIONS: Array<OptionType> = ["absolute", "state", "district"].map(
    (key: string) => ({
      label: t(key),
      value: key,
    })
  );
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
        background="blue"
        category={[t("common:categories.demography"), "text-primary dark:text-primary-dark"]}
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
              <div className="flex h-full w-full flex-col space-y-6 p-6 lg:h-[600px] lg:p-8">
                <div className="flex flex-col gap-2">
                  <h4>{t("choro_header")}</h4>
                  <span className="text-dim text-sm">
                    {t("common:common.data_of", {
                      date: toDate(choropleth.data_as_of, "dd MMM yyyy, HH:mm", i18n.language),
                    })}
                  </span>
                </div>
                <Dropdown
                  anchor="left"
                  className="w-fit"
                  placeholder={t("common:common.select")}
                  options={FILTER_OPTIONS}
                  selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                  onChange={e => setData("filter", e.value)}
                />
                <div className="flex grow flex-col justify-between space-y-6">
                  <p className="text-dim">{t("choro_description")}</p>
                  <div className="space-y-3 border-t pt-6">
                    <p className="font-bold">{t("choro_ranking")}</p>
                    <div className="h-40 space-y-3 overflow-auto">
                      {topStateIndices.map((pos: number, i: number) => {
                        return (
                          <div className="pr-4.5 flex space-x-3" key={pos}>
                            <div className="text-dim font-medium">#{i + 1}</div>
                            <div className="grow">
                              {CountryAndStates[choropleth.data[data.filter].x[pos]]}
                            </div>
                            <div className="font-bold text-[#16A34A]">
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
                </div>
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto rounded-b lg:h-[600px] lg:w-full"
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
          <div className="space-y-12">
            <div className="space-y-6">
              <h4 className="lg:text-center">{t("title")}</h4>
              <div className="flex flex-col items-center justify-center space-y-3">
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
            </div>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:grid-cols-3">
              {barmeter_data.map(([k, v]: [string, any]) => {
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
