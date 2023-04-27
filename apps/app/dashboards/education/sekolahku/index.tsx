import AgencyBadge from "@components/AgencyBadge";
import { Hero, Panel, Section, Tabs } from "@components/index";
import { useTranslation } from "@hooks/useTranslation";
import { FunctionComponent } from "react";
import Container from "@components/Container";
import { MOEIcon } from "@components/Icon/agency";
import ComboBox from "@components/Combobox";
import BarMeter from "@components/Chart/BarMeter";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import dynamic from "next/dynamic";
import { CountryAndStates } from "@lib/constants";
import { useData } from "@hooks/useData";
import { OptionType } from "@components/types";
import { useRouter } from "next/router";
/**
 * Sekolahku Dashboard
 * @overview Status: In-development
 */

interface SekolahkuProps {
  dropdown_data: Record<string, string>[];
  sekolahku_info: any;
  bellcurve_school: any;
  bellcurve_callout: any;
  bellcurve_linechart: any;
}

const Sekolahku: FunctionComponent<SekolahkuProps> = ({
  dropdown_data,
  sekolahku_info,
  bellcurve_school,
  bellcurve_callout,
  bellcurve_linechart,
}) => {
  const Line = dynamic(() => import("@components/Chart/Line"), { ssr: false });
  const MapPlot = dynamic(() => import("@components/Chart/MapPlot"), { ssr: false });
  const { t, i18n } = useTranslation(["dashboard-sekolahku", "common"]);
  const router = useRouter();

  const { data, setData } = useData({
    tabs_section3: 0,
    selected_school: {
      label: "",
      value: "",
    },
  });

  const formatCallout = (type: string, value: number): string => {
    switch (type) {
      case "gpa":
        return value.toFixed(2);
      case "st_ratio":
        return value.toFixed(1);
      case "students":
        return value.toLocaleString();
      case "max_ethnic":
        return value.toFixed(1) + "%";
      case "household_income":
        return (
          "RM" +
          value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        );
      case "closest_school_dist":
        return value.toFixed(1) + "km";
      default:
        return value.toLocaleString();
    }
  };
  const KEY_VARIABLES_SCHEMA = [
    {
      name: t("section_3.national"),
      data: bellcurve_linechart["mys"],
    },
    {
      name: t("section_3.state"),
      data: bellcurve_linechart[sekolahku_info.state],
    },
  ];

  const SCHOOL_OPTIONS: Array<OptionType> = dropdown_data.map(
    ({ code, school, postcode, state }) => {
      return {
        label: `${code} | ${school} | ${postcode} | ${state}`,
        value: code,
      };
    }
  );

  return (
    <>
      <Hero
        background="blue"
        category={[
          t("common:nav.megamenu.categories.education"),
          "text-primary dark:text-primary-dark",
        ]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Ministry of Education (MoE)"}
            link="https://www.moe.gov.my/"
            icon={<MOEIcon />}
          />
        }
      />
      {/* Rest of page goes here */}
      <Container className="min-h-screen">
        <Section>
          <div className="flex flex-col items-center space-y-12">
            <div className="w-full space-y-6">
              <h4 className="text-center">{t("section_1.title")}</h4>
              <div className="flex flex-col items-center justify-center space-y-3">
                <ComboBox
                  placeholder={t("section_1.search_school")}
                  options={SCHOOL_OPTIONS}
                  selected={SCHOOL_OPTIONS.find(e => e.value == data.selected_school.value)}
                  onChange={e => {
                    setData("selected_school", e);
                    router.push(`/dashboard/sekolahku/${e?.value}`);
                  }}
                />
                <span className="text-dim font-body text-center text-sm">
                  {t("section_1.disclaimer")}
                </span>
              </div>
            </div>

            <div className="flex h-[400px] max-w-[800px] flex-col items-stretch rounded-xl border border-slate-200 dark:border-zinc-800 lg:flex-row">
              <div className="flex basis-1/2 items-center border-slate-200 dark:border-zinc-800 dark:bg-zinc-800/50 lg:border-r">
                <div className="flex flex-col gap-6 p-8 text-center">
                  <div className="flex flex-col gap-2">
                    <BookOpenIcon className="text-primary mx-auto h-10 w-10" />
                    <span className="text-lg font-bold">{sekolahku_info.school}</span>
                    <span className="text-dim text-sm font-bold">
                      {`${sekolahku_info.city} | ${sekolahku_info.postcode} ${
                        CountryAndStates[sekolahku_info.state]
                      }`}
                    </span>
                    <a
                      className="text-primary text-sm"
                      href={`mailto:${sekolahku_info.code}@moe.gov.my`}
                      target="_blank"
                    >
                      {`${sekolahku_info.code}@moe.gov.my`}
                    </a>
                  </div>
                  <span className="text-dim">
                    {t("section_1.school_description", {
                      level: sekolahku_info.level,
                      strata: sekolahku_info.strata,
                      city: sekolahku_info.city,
                      school: sekolahku_info.school,
                      teachers: sekolahku_info.teachers,
                      students: sekolahku_info.students,
                    })}
                  </span>
                </div>
              </div>
              <div className="basis-1/2 rounded-b-xl bg-slate-50 dark:bg-zinc-900 lg:rounded-br-xl lg:rounded-tr-xl">
                <MapPlot
                  className="h-full w-full"
                  position={[sekolahku_info.lat, sekolahku_info.lon]}
                  markers={[
                    {
                      position: [sekolahku_info.lat, sekolahku_info.lon],
                      school: sekolahku_info.school,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </Section>

        <Section title={t("section_2.title", { school: sekolahku_info.school })} date={Date.now()}>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div className="flex flex-col space-y-6">
                {/* <span className="text-lg font-bold">{t("Sex")}</span> */}
                <BarMeter
                  title="Sex"
                  layout="horizontal"
                  unit="%"
                  data={[
                    { x: "Male", y: 60 },
                    { x: "Female", y: 30 },
                  ]}
                />
              </div>
            ))}
          </div>
        </Section>

        <Section
          title={t("section_3.title", {
            school: sekolahku_info.school,
            level: sekolahku_info.level,
          })}
          menu={
            <Tabs.List
              options={KEY_VARIABLES_SCHEMA.map(item => item.name)}
              current={data.tabs_section3}
              onChange={index => setData("tabs_section3", index)}
            />
          }
          date={Date.now()}
        >
          <Tabs hidden current={data.tabs_section3}>
            {KEY_VARIABLES_SCHEMA.map(({ name, data: lineData }) => {
              return (
                <Panel key={name} name={name}>
                  <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:grid-cols-3">
                    {Object.entries(lineData[sekolahku_info.level]).map(([k, v]) => {
                      const { x, y } = v as { x: number[]; y: number[] };
                      return (
                        <Line
                          className="h-[250px] w-full"
                          title={t(`section_3.${k}`)}
                          enableGridX={false}
                          data={{
                            labels: x, // x-values
                            datasets: [
                              {
                                type: "line",
                                data: y,
                                label: t("label"),
                                backgroundColor: "#94A3B81A",
                                borderColor: "#94A3B8",
                                borderWidth: 1.5,
                                lineTension: 0.5,
                                fill: true,
                              },
                            ],
                          }}
                          stats={[
                            {
                              title: t("section_3.stat_school"),
                              value: formatCallout(k, bellcurve_school[k]),
                            },
                            {
                              title: t(`section_3.stat_median${data.tabs_section3}`),
                              value: formatCallout(
                                k,

                                data.tabs_section3 === 0
                                  ? bellcurve_callout["mys"][sekolahku_info.level][k].callout
                                  : bellcurve_callout[sekolahku_info.state][sekolahku_info.level][k]
                                      .callout
                              ),
                            },
                          ]}
                        />
                      );
                    })}
                  </div>
                </Panel>
              );
            })}
          </Tabs>
        </Section>
      </Container>
    </>
  );
};

export default Sekolahku;
