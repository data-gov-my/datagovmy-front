import { BarMeterData } from "datagovmy-ui/charts/bar-meter";
import { JitterData } from "datagovmy-ui/charts/jitterplot";
import { OptionType, WithData } from "datagovmy-ui/types";
import { Color } from "datagovmy-ui/hooks";
import { GeoJsonObject } from "geojson";
import { FunctionComponent, useEffect, useMemo } from "react";
import {
  Button,
  Chips,
  Container,
  Dropdown,
  Hero,
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
import { clx, numFormat } from "datagovmy-ui/helpers";
import { routes } from "@lib/routes";
import { DISTRICTS, DUNS, PARLIMENS, STATES, jitterTooltipFormats } from "@lib/schema/kawasanku";
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
const MapPlot = dynamic(() => import("datagovmy-ui/charts/map-plot"), { ssr: false });
const BarMeter = dynamic(() => import("datagovmy-ui/charts/bar-meter"), {
  ssr: false,
});

interface KawasankuDashboardProps {
  last_updated: string;
  params: {
    state: string;
    geofilter?: AreaType; // Required for "dun" | "parlimen" | "district"
    id?: string;
  };
  pyramid?: any;
  bar: any;
  jitterplot: any;
  jitterplot_options: Array<OptionType>;
  choropleth?: WithData<{
    dun: {
      x: string[];
      y: {
        income_mean: number[];
        expenditure_mean: number[];
        gini: number[];
        poverty: number[];
        max_elevation: number[];
        treecover: number;
        nightlights: number;
        population_density: number[];
        electricity: number[];
        water: number[];
      };
    };
    parlimen: {
      x: string[];
      y: {
        income_mean: number[];
        expenditure_mean: number[];
        gini: number[];
        poverty: number[];
        max_elevation: number[];
        treecover: number;
        nightlights: number;
        population_density: number[];
        electricity: number[];
        water: number[];
      };
    };
  }>;
  population_callout: {
    total?: number;
    male?: number;
    female?: number;
  };
  geojson?: GeoJsonObject;
}

type AreaType = "district" | "dun" | "parlimen" | "state";

const KawasankuDashboard: FunctionComponent<KawasankuDashboardProps> = ({
  last_updated,
  params,
  bar,
  pyramid,
  jitterplot,
  jitterplot_options,
  population_callout,
  geojson,
  choropleth,
}) => {
  const { t } = useTranslation(["dashboard-kawasanku", "common"]);
  const router = useRouter();

  const AREA_TYPES = [
    {
      label: t("area_types.district"),
      value: "district",
    },
    {
      label: t("area_types.parlimen"),
      value: "parlimen",
    },
    {
      label: t("area_types.dun"),
      value: "dun",
    },
  ];
  const INDICATOR_OPTIONS = Object.keys(choropleth.data.parlimen.y).map((item: string) => ({
    label: t(`keys.${item}`),
    value: item,
  }));

  const AREA_OPTIONS: Record<string, Record<string, OptionType[]>> = {
    district: DISTRICTS,
    parlimen: PARLIMENS,
    dun: DUNS,
  };
  const { data, setData } = useData({
    loading: false,
    geofilter: params.geofilter,
    area:
      params.geofilter && params.id
        ? AREA_OPTIONS[params.geofilter][params.state].find(item => item.value === params.id).value
        : undefined,
    comparator: [],
    indicator_type: INDICATOR_OPTIONS[0].value,
    indicator_index: 0,
  });

  const availableAreaTypes = useMemo(() => {
    if (["W.P. Kuala Lumpur", "W.P. Putrajaya", "W.P. Labuan"].includes(params.state)) {
      return AREA_TYPES.filter(area => area.value !== "dun");
    }

    return AREA_TYPES;
  }, [params.state]);

  const handleComparator = (e: OptionType) => {
    if (data.comparator.length >= 3) return;
    if (data.comparator.includes(e.label)) return;

    setData("comparator", data.comparator.concat(e.label));
  };

  const isMalaysia = useMemo(() => params.state === "Malaysia", [params.state]);
  useEffect(() => {
    router.events.on("routeChangeComplete", () => setData("loading", false));
    return () => {
      router.events.off("routeChangeComplete", () => null);
    };
  }, [router.events]);

  const indicator_colors = useMemo<Color>(() => {
    if (data.indicator_type === "treecover") return "greens";
    if (data.indicator_type === "water") return "blues";
    if (["max_elevation", "gini", "poverty"].includes(data.indicator_type)) return "reds";
    if (["nightlights", "electricity"].includes(data.indicator_type)) return "ylGnBu";

    return "rdPu";
  }, [data.indicator_type]);

  const indicator_unit = useMemo<string>(() => {
    if (["treecover", "water", "poverty", "electricity"].includes(data.indicator_type)) return "%";
    if (data.indicator_type === "max_elevation") return "m";
    if (data.indicator_type === "population_density") return "/km^2";
    return "";
  }, [data.indicator_type]);

  const indicator_prefix = useMemo<string>(() => {
    if (["income_mean", "expenditure_mean"].includes(data.indicator_type)) return "RM ";
    return "";
  }, [data.indicator_type]);

  return (
    <>
      <Hero
        background=" bg-gradient-to-r from-[#C9ECC9] from-0% via-[#EDF8ED] via-60% to-transparent to-100% dark:from-black dark:via-background-dark dark:to-transparent"
        category={["Kawasanku", "text-dim text-sm font-bold uppercase tracking-widest"]}
        header={[t("header")]}
        description={[t("description"), "whitespace-pre-line"]}
        last_updated={last_updated}
        action={
          <div className="flex w-full flex-col flex-wrap items-start justify-start gap-2 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <p className="font-bold text-dim">{t("action")}:</p>
              <Spinner loading={data.loading} className="block place-self-center md:hidden" />
            </div>

            <Dropdown
              options={STATES}
              selected={{ label: params.state, value: params.state }}
              width="w-full md:w-fit"
              sublabel={!isMalaysia ? t("common:common.state") + ":" : ""}
              onChange={(e: OptionType) => {
                setData("loading", true);
                router.push(routes.KAWASANKU.concat("/", e.value !== "Malaysia" ? e.value : ""));
              }}
              anchor="left"
            />
            <Dropdown
              anchor="left"
              options={availableAreaTypes}
              selected={availableAreaTypes.find(type => type.value === data.geofilter)}
              onChange={(e: OptionType) => {
                setData("geofilter", e.value);
                setData("area", undefined);
              }}
              disabled={isMalaysia}
              sublabel={`${t("geofilter")}:`}
              placeholder={t("common:common.select")}
              width="w-full md:w-fit"
            />
            <Dropdown
              anchor="left"
              options={
                data?.geofilter !== "state" && !isMalaysia
                  ? AREA_OPTIONS[data.geofilter][params.state]
                  : []
              }
              disabled={!data.geofilter || data.geofilter === "state" || isMalaysia}
              enableSearch
              selected={
                data?.geofilter !== "state"
                  ? AREA_OPTIONS[data.geofilter][params.state].find(
                      area => area.value === data.area
                    )
                  : undefined
              }
              onChange={(e: { value: string }) => {
                setData("area", e.value);
                setData("loading", true);
                router.push(
                  routes.KAWASANKU.concat("/", params.state, "/", data.geofilter, "/", e.value)
                );
              }}
              placeholder={t("common:common.select")}
              width="w-full md:w-fit"
            />
            <div className="flex items-center">
              <Spinner loading={data.loading} className="hidden place-self-center md:block" />
              {(data.geofilter !== "state" || data.area) && (
                <Button
                  variant="ghost"
                  className="hover:bg-transparent hover:shadow-button"
                  icon={<XMarkIcon className="h-4 w-4" />}
                  onClick={() => router.push(routes.KAWASANKU)}
                >
                  {t("common:common.clear_all")}
                </Button>
              )}
            </div>
            <MapPlot
              geojson={geojson}
              tileTheme="terrain"
              className="absolute -right-0 top-0 -z-10 h-full overflow-hidden md:h-full md:w-[40vw]"
              enableZoom={false}
            />
          </div>
        }
      />

      <Container className="min-h-screen">
        {/* What does the population of {{ area }} look like? */}
        <Section
          title={t("section_1.title", {
            area: data.area?.label ?? params.state,
            size: numFormat(population_callout.total, "standard"),
          })}
          date={"MyCensus 2020"}
        >
          <div
            className={clx(
              "grid gap-12",
              params.geofilter === "state" ? "grid-cols-1 xl:grid-cols-5" : ""
            )}
          >
            {params.geofilter === "state" && pyramid && (
              <div className="col-span-1 w-full lg:col-span-2">
                <Pyramid
                  data={{
                    labels: pyramid.data.x.map((x: string) =>
                      x.replace("_above", "+").replace("_", "-")
                    ),
                    datasets: [
                      {
                        label: t("keys.male"),
                        data: pyramid.data.male,
                        backgroundColor: "#0C204E",
                        borderWidth: 0,
                        borderRadius: 32,
                      },
                      {
                        label: t("keys.female"),
                        data: pyramid.data.female,
                        backgroundColor: "#B54768",
                        borderWidth: 0,
                        borderRadius: 10,
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
        </Section>

        {/* A comparison of key variables across {{ type }} */}
        <Section
          title={t("section_2.title", {
            type: t(`area_types.${data.geofilter?.value ?? "state"}s`),
          })}
          date={"MyCensus 2020"}
        >
          <div className="flex w-full flex-wrap gap-2 pb-12 lg:flex-row lg:pb-8">
            <Dropdown
              anchor="left"
              width="min-w-[200px]"
              enableSearch
              sublabel={t("spotlight") + ":"}
              disabled={data.comparator.length >= 3}
              placeholder={t("common:common.select")}
              options={jitterplot_options}
              onChange={handleComparator}
            />

            {!isMalaysia && (
              <p className="flex items-center gap-2 px-2 py-1 text-sm font-medium leading-6">
                {params.geofilter === "state" ? params.state : params?.id}
                <span className="block h-2 w-2 rounded-full bg-black dark:bg-green-500" />
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
            <JitterplotOverlay
              labels={[
                t("below_median"),
                t("median", { type: t(`area_types.${params.geofilter}s`) }),
                t("above_median"),
              ]}
            />
            {Object.entries(jitterplot.data).map(([key, dataset]) => (
              <Jitterplot
                key={key}
                title={t(`${key}`)}
                data={dataset as JitterData[]}
                active={params.geofilter === "state" ? params.state : params?.id}
                actives={data.comparator}
                formatTitle={key => (
                  <div className="flex items-center gap-1.5 ">
                    <span className="inline">{t(`keys.${key}`)}</span>
                    <Tooltip tip={t(`tips.${key}`)} />
                  </div>
                )}
                formatTooltip={(key, value) => jitterTooltipFormats[key](value) ?? value}
              />
            ))}
          </div>
          <small className="inline-block pt-4 text-gray-500">
            <i>{t("section_2.note")}</i>
          </small>
        </Section>

        {/* A geographic visualisation of selected indicators */}
        <Section title={t("section_3.title")} date={choropleth.data_as_of}>
          <Tabs
            title={
              <Dropdown
                anchor="left"
                selected={INDICATOR_OPTIONS.find(item => item.value === data.indicator_type)}
                sublabel={t("common:common.indicator") + ":"}
                options={INDICATOR_OPTIONS}
                onChange={(e: OptionType) => setData("indicator_type", e.value)}
              />
            }
            onChange={index => setData("indicator_index", index)}
          >
            {AREA_TYPES.filter(type => type.value !== "district").map(type => (
              <Panel name={type.label} key={type.value}>
                <Choropleth
                  prefix={indicator_prefix}
                  unit={indicator_unit}
                  data={{
                    labels: choropleth.data[type.value].x,
                    values: choropleth.data[type.value].y[data.indicator_type],
                  }}
                  color={indicator_colors}
                  type={type.value as "parlimen" | "dun"}
                />
              </Panel>
            ))}
          </Tabs>
        </Section>
      </Container>
    </>
  );
};

export default KawasankuDashboard;
