import { routes } from "@lib/routes";
import {
  AgencyBadge,
  ComboBox,
  Container,
  Dropdown,
  Hero,
  LeftRightCard,
  Section,
} from "datagovmy-ui/components";
import { CountryAndStates } from "datagovmy-ui/constants";
import { getTopIndices, numFormat, toDate } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

/**
 * Orang Asli Dashboard
 * @overview Status: Live
 */

const BarMeter = dynamic(() => import("datagovmy-ui/charts/bar-meter"), { ssr: false });
const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const MapPlot = dynamic(() => import("datagovmy-ui/charts/map-plot"), { ssr: false });
const Pyramid = dynamic(() => import("datagovmy-ui/charts/pyramid"), { ssr: false });

interface OrangAsliProps {
  dropdown: any;
  params: any;
  village: any;
}

type Kampung = {
  village: string;
  district: string;
  state: string;
};

const OrangAsli: FunctionComponent<OrangAsliProps> = ({ dropdown, params, village }) => {
  const { t, i18n } = useTranslation(["dashboard-orang-asli", "common"]);
  const { push } = useRouter();
  const { theme } = useTheme();
  const { data, setData } = useData({
    area: "state",
    filter: "population",
    index: 0,
    loading: false,
    kampung: params.kampung,
  });
  const village_info = village.village_data.data[0];
  const choropleth = village[`choropleth_${data.area}`].data;
  const pyramid = village.pyramid_data.data;
  const barmeter = village.village_barmeter.data;
  const _barmeter = {
    ...barmeter,
    age: [barmeter.age[2], barmeter.age[0], barmeter.age[1], barmeter.age[3]],
    marital_status: [
      barmeter.marital_status[2],
      barmeter.marital_status[1],
      barmeter.marital_status[0],
      barmeter.marital_status[3],
    ],
  };
  const topIndices = getTopIndices(choropleth.y[data.filter], choropleth.y.length, true);

  const AREA_OPTIONS: Array<OptionType> = ["state", "district"].map((key: string) => ({
    label: t(key),
    value: key,
  }));

  const FILTER_OPTIONS: Array<OptionType> = ["population", "population_prop"].map(
    (key: string) => ({
      label: t(key),
      value: key,
    })
  );

  const KAMPUNG_OPTIONS: Array<OptionType & Kampung> = dropdown.map(
    (k: Kampung & { slug: string }) => ({
      village: k.village,
      district: k.district,
      state: k.state,
      label: `${k.village}, ${k.district}, ${k.state}`,
      value: k.slug,
    })
  );

  const navigateToKampung = (kampung?: string) => {
    if (!kampung) {
      setData("kampung", null);
      return;
    }
    setData("loading", true);
    setData("kampung", kampung);
    const route = `${routes.ORANG_ASLI}/${kampung}`;

    push(route, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  return (
    <>
      <Hero
        background="green"
        category={[t("common:categories.demography"), "text-green-600"]}
        header={[t("header")]}
        description={[t("description")]}
        last_updated={village.data_last_updated}
        agencyBadge={<AgencyBadge agency="jakoa" />}
      />

      <Container className="min-h-screen">
        {/* How are the indigenous peoples distributed across Malaysia? */}
        <Section>
          <LeftRightCard
            left={
              <div className="flex h-[600px] w-full flex-col overflow-hidden p-6 lg:p-8">
                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <h4>{t("choro_header")}</h4>
                    <span className="text-dim text-sm">
                      {t("common:common.data_of", {
                        date: toDate(
                          village[`choropleth_${data.area}`].data_as_of,
                          "dd MMM yyyy, HH:mm",
                          i18n.language
                        ),
                      })}
                    </span>
                  </div>
                  <p className="text-dim">{t("choro_description")}</p>
                  <div className="flex space-x-3">
                    <Dropdown
                      width="w-full"
                      anchor="left"
                      placeholder={t("common:common.select")}
                      options={AREA_OPTIONS}
                      selected={AREA_OPTIONS.find(e => e.value === data.area)}
                      onChange={e => {
                        setData("area", e.value);
                        setData("index", e === "state" ? 0 : 1);
                      }}
                    />
                    <Dropdown
                      width="w-full"
                      anchor="left"
                      placeholder={t("common:common.select")}
                      options={FILTER_OPTIONS}
                      selected={FILTER_OPTIONS.find(e => e.value === data.filter)}
                      onChange={e => setData("filter", e.value)}
                    />
                  </div>
                  <p className="border-outline dark:border-washed-dark border-t pb-3 pt-6 font-bold">
                    {t("choro_ranking", { count: choropleth.x.length })}
                  </p>
                </div>
                <div className="space-y-3 overflow-auto">
                  {topIndices.map((pos: number, i: number) => {
                    return (
                      <div className="pr-4.5 flex space-x-3" key={pos}>
                        <span className="text-dim font-medium">#{i + 1}</span>
                        <span className="grow">
                          {data.area === "state"
                            ? CountryAndStates[choropleth.x[pos]]
                            : choropleth.x[pos]}
                        </span>
                        <span className="font-bold text-green-600">
                          {data.filter === "population"
                            ? numFormat(choropleth.y[data.filter][pos], "standard")
                            : numFormat(choropleth.y[data.filter][pos], "standard", 1)}
                          {data.filter === "population_prop" ? "%" : ""}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            }
            right={
              <Choropleth
                className="h-[400px] w-auto lg:h-[600px]"
                data={{
                  labels: choropleth.x.map((area: string) =>
                    data.area === "state" ? CountryAndStates[area] : area
                  ),
                  values: choropleth.y[data.filter],
                }}
                type={data.area === "state" ? "state" : "district"}
                unit={data.filter === "population_prop" ? "%" : ""}
                color="greens"
              />
            }
          />
        </Section>

        <Section>
          <div className="space-y-12">
            {/* xl:grid xl:grid-cols-12"> */}
            <div className="flex flex-col gap-6">
              {/* lg:flex-row xl:col-span-10 xl:col-start-2"> */}
              <div className="flex flex-col justify-center space-y-6">
                {/* lg:w-1/3"> */}
                <h4 className="text-center [text-wrap:balance]">{t("title")}</h4>
                <div className="mx-auto w-full max-w-[400px]">
                  <ComboBox<Kampung>
                    placeholder={t("search_kampung")}
                    options={KAMPUNG_OPTIONS}
                    selected={
                      data.kampung ? KAMPUNG_OPTIONS.find(e => e.value === data.kampung) : null
                    }
                    onChange={selected => navigateToKampung(selected?.value)}
                    config={{
                      keys: [item => item.village.substring(8), "district", "state", "label"],
                    }}
                  />
                </div>
              </div>
              {/* <div className="lg:w-2/3">
                <MapPlot
                  className="shadow-button h-[400px] rounded-xl lg:w-full"
                  tileTheme="terrain"
                  position={[village_info.lat, village_info.lon]}
                  zoom={13}
                  markers={[
                    {
                      position: [village_info.lat, village_info.lon],
                      tooltip: { Village: village_info.village },
                    },
                  ]}
                />
                <p className="text-dim pt-3 text-center text-sm">{t("map_description")}</p>
              </div> */}
            </div>
          </div>
          <h4 className="pb-8 pt-12">
            {t("pyramid_title", {
              selected: village_info.village,
              count: village_info.population,
            })}
          </h4>
          <div className="flex flex-col items-stretch gap-6 lg:flex-row">
            <div className="lg:w-1/2 xl:w-1/3">
              <Pyramid
                title={t("header")}
                className="h-[550px] pb-6 lg:h-[600px]"
                data={{
                  labels: pyramid.x,
                  datasets: [
                    {
                      label: t("female"),
                      data: pyramid.female,
                      backgroundColor: theme === "light" ? "#18181B" : "#FFFFFF",
                      barThickness: 12,
                      borderRadius: 12,
                    },
                    {
                      label: t("male"),
                      data: pyramid.male,
                      backgroundColor: "#16A34A",
                      barThickness: 12,
                      borderRadius: 12,
                    },
                  ],
                }}
              />
            </div>
            <div className="grid grid-cols-1 gap-12 lg:w-1/2 lg:grid-cols-2 xl:w-2/3 xl:grid-cols-3">
              {["marital_status", "age", "sex", "ethnicity", "religion"].map((k: string) => {
                return (
                  <div className="flex flex-col space-y-6" key={k}>
                    <BarMeter
                      key={k}
                      title={t(k)}
                      layout="horizontal"
                      unit="%"
                      data={_barmeter[k]}
                      sort={["marital_status", "age"].includes(k) ? undefined : "desc"}
                      formatX={key => t(key)}
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
