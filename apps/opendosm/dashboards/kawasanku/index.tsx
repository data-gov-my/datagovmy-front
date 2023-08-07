import { BarMeterData } from "datagovmy-ui/charts/bar-meter";
import { JitterData } from "datagovmy-ui/charts/jitterplot";
import { OptionType } from "datagovmy-ui/types";
import { Color } from "datagovmy-ui/hooks";
import { GeoJsonObject } from "geojson";
import { FunctionComponent, useEffect, useMemo } from "react";
import {
  Hero,
  Button,
  Chips,
  Container,
  Dropdown,
  Panel,
  Section,
  Spinner,
  Tabs,
  Tooltip,
} from "datagovmy-ui/components";
import JitterplotOverlay from "datagovmy-ui/charts/jitterplot-overlay";
import { XMarkIcon } from "@heroicons/react/24/outline";
import dynamic from "next/dynamic";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { AKSARA_COLOR } from "datagovmy-ui/constants";
import { numFormat } from "datagovmy-ui/helpers";
import { track } from "datagovmy-ui/mixpanel";
import { routes } from "@lib/routes";
import {
  DISTRICTS,
  DUNS,
  PARLIMENS,
  STATES,
  jitterTooltipFormats,
} from "datagovmy-ui/schema/kawasanku";
import { useRouter } from "next/router";

/**
 * Kawasanku Dashboard
 * @overview Status: Live (Partially on-hold)
 */

const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Jitterplot = dynamic(() => import("datagovmy-ui/charts/jitterplot"), { ssr: false });

const Pyramid = dynamic(() => import("datagovmy-ui/charts/pyramid"), {
  ssr: false,
});
const OSMapWrapper = dynamic(() => import("datagovmy-ui/charts/map-plot"), { ssr: false });
const BarMeter = dynamic(() => import("datagovmy-ui/charts/bar-meter"), {
  ssr: false,
});

interface KawasankuDashboardProps {
  area_type?: AreaType | undefined;
  pyramid?: any;
  bar: any;
  jitterplot: any;
  jitterplot_options: Array<OptionType>;
  choropleth: any;
  population_callout: {
    total?: number;
    male?: number;
    female?: number;
  };
  geojson?: GeoJsonObject;
}

type AreaType = "district" | "dun" | "parlimen";

const KawasankuDashboard: FunctionComponent<KawasankuDashboardProps> = ({
  area_type,
  pyramid,
  bar,
  jitterplot,
  jitterplot_options,
  population_callout,
  geojson,
  choropleth,
}) => {
  const { t } = useTranslation(["dashboard-kawasanku", "common"]);
  const router = useRouter();
  const state = (router.query.state as string) ?? "malaysia";

  // const AREA_TYPES = [
  //   {
  //     label: t("area_types.district"),
  //     value: "district",
  //   },
  //   {
  //     label: t("area_types.parlimen"),
  //     value: "parlimen",
  //   },
  //   {
  //     label: t("area_types.dun"),
  //     value: "dun",
  //   },
  // ];
  // const INDICATOR_OPTIONS = Object.keys(choropleth.data.parlimen).map((item: string) => ({
  //   label: t(`keys.${item}`),
  //   value: item,
  // }));

  // const AREA_OPTIONS: Record<string, Record<string, OptionType[]>> = {
  //   district: DISTRICTS,
  //   parlimen: PARLIMENS,
  //   dun: DUNS,
  // };
  // const active = useMemo(() => {
  //   const uid = router.query.id ? router.query.id : router.query.state;
  //   return uid !== "malaysia" ? jitterplot_options.find(option => option.value === uid) : undefined;
  // }, [router.query, jitterplot_options]);

  // const { data, setData } = useData({
  //   loading: false,
  //   state: STATES.find(item => item.value === state),
  //   area_type: area_type ? AREA_TYPES.find(item => item.value === area_type) : undefined,
  //   area: area_type
  //     ? AREA_OPTIONS[area_type as AreaType][state].find(item => item.value === active?.value)
  //     : undefined,
  //   comparator: [],
  //   indicator_type: INDICATOR_OPTIONS[0],
  //   indicator_index: 0,
  // });

  // const availableAreaTypes = useMemo(() => {
  //   if (["w.p._kuala_lumpur", "w.p._putrajaya", "w.p._labuan"].includes(data.state.value)) {
  //     return AREA_TYPES.filter(area => area.value !== "dun");
  //   }

  //   return AREA_TYPES;
  // }, [data.state]);

  // const handleComparator = (e: OptionType) => {
  //   if (data.comparator.length >= 3) return;
  //   if (data.comparator.includes(e.label)) return;

  //   setData("comparator", data.comparator.concat(e.label));
  // };

  // const isMalaysia = useMemo(() => data.state.value === "malaysia", [data.state]);

  // useEffect(() => {
  //   track("page_view", {
  //     type: "dashboard",
  //     id: "nav.megamenu.dashboards.kawasanku",
  //     name_en: "Kawasanku",
  //     name_bm: "Kawasanku",
  //     route: router.asPath,
  //   });
  // }, []);

  // useEffect(() => {
  //   router.events.on("routeChangeComplete", () => setData("loading", false));
  //   return () => {
  //     router.events.off("routeChangeComplete", () => null);
  //   };
  // }, [router.events]);

  // const indicator_colors = useMemo<Color>(() => {
  //   if (data.indicator_type.value === "treecover") return "greens";
  //   if (data.indicator_type.value === "water") return "blues";
  //   if (["max_elevation", "gini", "poverty"].includes(data.indicator_type.value)) return "reds";
  //   if (["nightlights", "electricity"].includes(data.indicator_type.value)) return "ylGnBu";

  //   return "rdPu";
  // }, [data.indicator_type]);

  // const indicator_unit = useMemo<string>(() => {
  //   if (["treecover", "water", "poverty", "electricity"].includes(data.indicator_type.value))
  //     return "%";
  //   if (data.indicator_type.value === "max_elevation") return "m";
  //   if (data.indicator_type.value === "population_density") return "/km^2";
  //   return "";
  // }, [data.indicator_type]);

  // const indicator_prefix = useMemo<string>(() => {
  //   if (["income_mean", "expenditure_mean"].includes(data.indicator_type.value)) return "RM ";
  //   return "";
  // }, [data.indicator_type]);

  return (
    <>
      <div className="kawasanku-banner relative">
        <div className="mx-auto max-w-screen-2xl px-3 py-12 lg:px-6">
          <div className=" w-2/3 space-y-4">
            <span className="text-sm font-bold uppercase tracking-widest text-dim">Kawasanku</span>
            <h3 className="text-black"> {t("header")}</h3>
            <p className="whitespace-pre-line text-dim">{t("description")}</p>

            <div className="flex w-full flex-col flex-wrap items-start justify-start gap-2 lg:flex-row lg:items-center">
              <div className="flex items-center gap-2">
                <p className="font-bold text-dim">{t("action")}:</p>
                {/* <Spinner loading={data.loading} className="block place-self-center lg:hidden" /> */}
              </div>

              {/* <Dropdown
              options={STATES}
              selected={data.state}
              width="w-full lg:w-fit"
              sublabel={!isMalaysia ? t("common.state") + ":" : ""}
              onChange={(e: OptionType) => {
                setData("state", e);
                setData("loading", true);
                router.push(routes.concat("/", e.value !== "malaysia" ? e.value : ""));
              }}
              anchor="left"
            />
            <Dropdown
              anchor="left"
              options={availableAreaTypes}
              selected={data.area_type}
              onChange={(e: OptionType) => {
                setData("area_type", e);
                setData("area", undefined);
              }}
              disabled={data.state.value === "malaysia"}
              sublabel={`${t("geofilter")}:`}
              placeholder={t("common.select")}
              width="w-full lg:w-fit"
            />
            <Dropdown
              anchor="left"
              options={
                data.area_type && data.state.value !== "malaysia"
                  ? AREA_OPTIONS[data.area_type.value][data.state.value]
                  : []
              }
              disabled={!data.area_type || data.state.value === "malaysia"}
              selected={data.area}
              onChange={(e: { value: string }) => {
                setData("area", e);
                setData("loading", true);
                router.push(
                  routes.concat(
                    "/",
                    data.state.value,
                    "/",
                    data.area_type.value,
                    "/",
                    e.value
                  )
                );
              }}
              placeholder={t("common.select")}
              width="w-full lg:w-fit"
            />
            <div className="flex items-center">
              <Spinner loading={data.loading} className="hidden place-self-center lg:block" />
              {(data.area_type || data.area) && (
                <Button
                  icon={<XMarkIcon className="h-4 w-4" />}
                  onClick={() => router.push(routes.KAWASANKU)}
                >
                  {t("common.clear_all")}
                </Button>
              )}
            </div> */}
            </div>
          </div>
        </div>

        {/* <OSMapWrapper
          geojson={geojson}
          className="absolute -right-0 top-0 -z-10 h-full overflow-hidden lg:h-full lg:w-[40vw]"
          enableZoom={false}
        /> */}
      </div>

      <Container className="min-h-screen">
        {/* What does the population of {{ area }} look like? */}
        {/* <Section
          title={t("section_1.title", {
            area: data.area?.label ?? data.state.label,
            size: numFormat(population_callout.total!, "standard"),
          })}
          date={"MyCensus 2020"}
        >
          <div
            className={[
              "grid gap-12",
              !Boolean(area_type) ? "grid-cols-1 xl:grid-cols-5" : "",
            ].join(" ")}
          >
            {!Boolean(area_type) && (
              <div className="col-span-1 w-full lg:col-span-2">
                <Pyramid
                  data={{
                    labels: pyramid.data.x,
                    datasets: [
                      {
                        label: t("keys.male"),
                        data: pyramid.data.male,
                        backgroundColor: "#0C204E",
                        borderWidth: 0,
                      },
                      {
                        label: t("keys.female"),
                        data: pyramid.data.female,
                        backgroundColor: "#B54768",
                        borderWidth: 0,
                      },
                    ],
                  }}
                  title={t("gender_distribution")}
                  className="h-[500px] w-full"
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-3 lg:grid-cols-3 lg:gap-12">
              {Object.entries(bar.data).map(([key, data]) => (
                <BarMeter
                  key={key}
                  title={t(`${key}`)}
                  data={data as BarMeterData[]}
                  layout="horizontal"
                  sort="desc"
                  unit="%"
                  formatX={key => t(`keys.${key}`)}
                  formatY={
                    key === "sex"
                      ? (value, key) => (
                          <>
                            <Tooltip
                              tip={t("section_1.number_people", {
                                size: numFormat(
                                  population_callout[key as keyof typeof population_callout]!,
                                  "standard"
                                ),
                              })}
                            />
                            <span className="pl-1">{numFormat(value, "compact", [1, 1])}</span>
                          </>
                        )
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </Section> */}

        {/* A comparison of key variables across {{ type }} */}
        {/* <Section
          title={t("section_2.title", {
            type: t(`area_types.${data.area_type?.value ?? "state"}s`),
          })}
          date={"MyCensus 2020"}
        >
          <div className="flex w-full flex-wrap gap-2 pb-12 lg:flex-row">
            <Dropdown
              anchor="left"
              width="w-fit"
              sublabel="Spotlight:"
              disabled={data.comparator.length >= 3}
              placeholder="Select "
              options={jitterplot_options}
              onChange={handleComparator}
            />

            {active?.label && (
              <p className="flex items-center gap-2 px-2 py-1 text-sm font-medium leading-6">
                {active.label}
                <span className="block h-2 w-2 rounded-full bg-black" />
              </p>
            )}

            <Chips
              data={data.comparator.map((item: string) => ({ label: item, value: item }))}
              colors={[AKSARA_COLOR.DANGER, AKSARA_COLOR.PRIMARY, AKSARA_COLOR.WARNING]}
              onRemove={item =>
                setData(
                  "comparator",
                  data.comparator.filter((place: string) => place !== item)
                )
              }
              onClearAll={() => setData("comparator", [])}
            />
          </div>
          <div className="relative space-y-10">
            <JitterplotOverlay areaType={area_type as AreaType | "state"} />
            {Object.entries(jitterplot.data).map(([key, dataset]) => (
              <Jitterplot
                key={key}
                title={t(`${key}`)}
                data={dataset as JitterData[]}
                active={active?.label as string}
                actives={data.comparator}
                formatTitle={key => (
                  <>
                    {t(`keys.${key}`)} <Tooltip tip={t(`tips.${key}`)} />
                  </>
                )}
                formatTooltip={(key, value) => {
                  return jitterTooltipFormats[key](value) ?? value;
                }}
              />
            ))}
          </div>
          <small className="inline-block pt-4 text-gray-500">
            <i>{t("section_2.note")}</i>
          </small>
        </Section> */}

        {/* A geographic visualisation of selected indicators */}
        {/* <Section
          title={"A geographic visualisation of selected indicators"}
          date={choropleth.data_as_of}
        >
          <Tabs
            title={
              <Dropdown
                anchor="left"
                selected={data.indicator_type}
                sublabel={t("common.indicator") + ":"}
                options={INDICATOR_OPTIONS}
                onChange={(e: any) => setData("indicator_type", e)}
              />
            }
            onChange={index => setData("indicator_index", index)}
          >
            {AREA_TYPES.filter(type => type.value !== "district").map(type => (
              <Panel name={type.label}>
                <Choropleth
                  prefix={indicator_prefix}
                  unit={indicator_unit}
                  // hideValue={data.indicator_type.value === "nightlights"}
                  data={choropleth.data[type.value][data.indicator_type.value]}
                  color={indicator_colors}
                  type={type.value as "parlimen" | "dun"}
                />
              </Panel>
            ))}
          </Tabs>
        </Section> */}
      </Container>
    </>
  );
};

export default KawasankuDashboard;
