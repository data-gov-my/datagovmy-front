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
/**
 * Sekolahku Dashboard
 * @overview Status: In-development
 */

interface SekolahkuProps {}

const Sekolahku: FunctionComponent<SekolahkuProps> = ({}) => {
  const { t, i18n } = useTranslation(["dashboard-sekolahku", "common"]);
  const Line = dynamic(() => import("@components/Chart/Line"), { ssr: false });
  const MapPlot = dynamic(() => import("@components/Chart/MapPlot"), { ssr: false });

  const KEY_VARIABLES_SCHEMA = [
    {
      name: t("Compare Nationally"),
      data: [],
    },
    {
      name: t("Within state"),
      data: [],
    },
  ];

  const lineDummy = {
    labels: [0, 10, 20, 30, 40, 50, 60, 70, 80], // x-values
    datasets: [
      {
        type: "line",
        data: [110, 240, 480, 525, 470, 354, 253, 100, 90],
        label: t("label"),
        backgroundColor: "#94A3B81A",
        borderColor: "#94A3B8",
        borderWidth: 1.5,
        lineTension: 0.5,
        fill: true,
      },
    ],
  };

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
            <div className="space-y-6">
              <h4 className="text-center">{t("section_1")}</h4>
              <div className="flex flex-col items-center justify-center space-y-3">
                <ComboBox
                  placeholder={t("search_school")}
                  options={[]}
                  selected={null}
                  onChange={e => {
                    null;
                  }}
                />
                <span className="text-dim font-body text-sm">{t("disclaimer")}</span>
              </div>
            </div>

            <div className="flex h-[400px] max-w-[800px] flex-col items-stretch rounded-xl border border-slate-200 dark:border-zinc-800 lg:flex-row">
              <div className="flex basis-1/2 items-center border-slate-200 dark:border-zinc-800 dark:bg-zinc-800/50 lg:border-r">
                <div className="flex flex-col gap-6 p-8 text-center">
                  <div className="flex flex-col gap-2">
                    <BookOpenIcon className="text-primary mx-auto h-10 w-10" />
                    <span className="text-lg font-bold">{t("SMK Penang Free")}</span>
                    <span className="text-dim text-sm font-bold">
                      {t("Timur Laut | 11600 Pulau Pinang")}
                    </span>
                    <a
                      className="text-primary text-sm"
                      href="mailto: PBE1094@moe.gov.my"
                      target="_blank"
                    >
                      PBE1094@moe.gov.my
                    </a>
                  </div>
                  <span className="text-dim">
                    {t(
                      "A national secondary school in urban Georgetown, SMK Penang Free has been in operation since 1816, with a current force of 85 staff teaching 915 students."
                    )}
                  </span>
                </div>
              </div>
              <div className="basis-1/2 rounded-b-xl bg-slate-50 dark:bg-zinc-900 lg:rounded-br-xl lg:rounded-tr-xl">
                <MapPlot className="h-full w-full" />
              </div>
            </div>
          </div>
        </Section>

        <Section title={t("What does {{ school }}’s student body look like?")} date={Date.now()}>
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
          title={t(
            "How does {{ school }} compare to other {{ school level }} schools in Malaysia?"
          )}
          menu={
            <Tabs.List
              options={KEY_VARIABLES_SCHEMA.map(item => item.name)}
              current={0}
              onChange={index => null}
            />
          }
          date={Date.now()}
        >
          <Tabs hidden current={0}>
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:grid-cols-3">
              <Panel key={1} name={"1"}>
                <div className="grid w-full grid-cols-1 gap-12 lg:grid-cols-3">
                  {[0, 1, 2, 3, 4, 5].map(_ => (
                    <Line
                      className="h-[250px] w-full"
                      title={"Number of Students"}
                      enableGridX={false}
                      data={lineDummy}
                      stats={[
                        {
                          title: "Your School",
                          value: "919",
                        },
                        {
                          title: "National median",
                          value: "1,147",
                        },
                      ]}
                    />
                  ))}
                </div>
              </Panel>
            </div>
          </Tabs>
        </Section>
      </Container>
    </>
  );
};

export default Sekolahku;
