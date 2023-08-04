import COVIDVaccinationTrends from "./vaccine-trends";
import { routes } from "@lib/routes";
import {
  AgencyBadge,
  Container,
  Dropdown,
  Hero,
  Panel,
  Section,
  StateDropdown,
  Tabs,
  Tooltip,
} from "datagovmy-ui/components";
import { CountryAndStates } from "datagovmy-ui/constants";
import { numFormat } from "datagovmy-ui/helpers";
import { useData, useTranslation } from "datagovmy-ui/hooks";
import { MOHIcon } from "datagovmy-ui/icons/agency";
import dynamic from "next/dynamic";
import { FunctionComponent, ReactNode } from "react";

/**
 * COVID Vaccination Dashboard
 * @overview Status: In-development
 */

interface COVIDVaccinationProps {
  last_updated: string;
  params: { state: string };
  timeseries: Record<string, any>;
  statistics: Record<string, any>;
  barmeter: Record<string, any>;
  waffle: Record<string, any>;
}

const BarMeter = dynamic(() => import("datagovmy-ui/charts/bar-meter"), { ssr: false });
const Waffle = dynamic(() => import("datagovmy-ui/charts/waffle"), { ssr: false });

const COVIDVaccination: FunctionComponent<COVIDVaccinationProps> = ({
  params,
  last_updated,
  timeseries,
  statistics,
  barmeter,
  waffle,
}) => {
  const { t } = useTranslation(["dashboard-covid-vaccination", "common"]);
  const currentState = params.state;

  const AGE_OPTIONS = ["total", "child", "adolescent", "adult", "elderly"].map((key: string) => ({
    label: t(key),
    value: key,
  }));
  const DOSE_OPTIONS = ["dose1", "dose2", "booster1", "booster2"].map((key: string) => ({
    label: t(key),
    value: key,
  }));

  const { data, setData } = useData({
    vax_tab: 0,
    filter_age: AGE_OPTIONS[0],
    filter_dose: DOSE_OPTIONS[0],
  });

  const WAFFLE_LIST: { doseType: string; color: string; dosePerc: ReactNode }[] = [
    {
      doseType: "dose1",
      color: "#9FE8B1",
      dosePerc: (
        <Tooltip tip={<span>{t("tooltips_dose1")}</span>}>
          {open => (
            <>
              <p
                className="pl-1 underline decoration-dashed [text-underline-position:from-font]"
                onClick={() => open()}
              >
                {numFormat(waffle.data[data.filter_age.value].dose1.perc, "standard", 1)}%
              </p>
            </>
          )}
        </Tooltip>
      ),
    },
    {
      doseType: "dose2",
      color: "#31C752",
      dosePerc: (
        <Tooltip tip={<span>{t("tooltips_dose2")}</span>}>
          {open => (
            <>
              <p
                className="pl-1 underline decoration-dashed [text-underline-position:from-font]"
                onClick={() => open()}
              >
                {numFormat(waffle.data[data.filter_age.value].dose2.perc, "standard", 1)}%
              </p>
            </>
          )}
        </Tooltip>
      ),
    },
    {
      doseType: "booster1",
      color: "#228F3A",
      dosePerc: (
        <span className="pl-1">
          {numFormat(waffle.data[data.filter_age.value].booster1.perc, "standard", 1)}%
        </span>
      ),
    },
    {
      doseType: "booster2",
      color: "#135523",
      dosePerc: (
        <span className="pl-1">
          {numFormat(waffle.data[data.filter_age.value].booster2.perc, "standard", 1)}%
        </span>
      ),
    },
  ];

  return (
    <>
      <Hero
        background="green"
        category={[t("common:categories.healthcare"), "text-green-600"]}
        header={[t("header")]}
        description={[t("description")]}
        action={<StateDropdown url={routes.COVID_VACCINATION} currentState={currentState} />}
        last_updated={last_updated}
        agencyBadge={
          <AgencyBadge
            agency="moh"
            icon={<MOHIcon fillColor="#16A34A" />} // green-600
          />
        }
      />
      <Container className="min-h-screen">
        {/* How vaccinated against COVID-19 are we? */}
        <Section
          title={t("waffle_header", {
            state: CountryAndStates[currentState],
          })}
          date={waffle.data_as_of}
        >
          <div className="flex flex-col justify-between gap-4 sm:flex-row">
            {data.vax_tab === 0 ? (
              <Dropdown
                anchor="left"
                width="w-fit"
                options={AGE_OPTIONS}
                selected={AGE_OPTIONS.find(age => age.value === data.filter_age.value)}
                onChange={e => setData("filter_age", e)}
              />
            ) : (
              <Dropdown
                anchor="left"
                width="w-fit"
                options={DOSE_OPTIONS}
                selected={DOSE_OPTIONS.find(dose => dose.value === data.filter_dose.value)}
                onChange={e => setData("filter_dose", e)}
              />
            )}
            <Tabs.List
              options={[t("filter_age"), t("filter_dose")]}
              current={data.vax_tab}
              onChange={i => setData("vax_tab", i)}
            />
          </div>

          <Tabs hidden current={data.vax_tab} onChange={i => setData("vax_tab", i)}>
            <Panel name={t("filter_age")} key={t("filter_age")}>
              <div className="grid grid-cols-2 gap-x-2 gap-y-10 py-5 lg:grid-cols-4 lg:gap-6">
                {WAFFLE_LIST.map(({ doseType, dosePerc, color }) => (
                  <Waffle
                    key={doseType}
                    className="aspect-square w-full lg:h-[250px] lg:w-auto"
                    title={
                      <div className="flex self-center text-base font-bold">
                        {t(`${doseType}`).concat(` - `)}
                        {dosePerc}
                      </div>
                    }
                    color={color}
                    data={waffle.data[data.filter_age.value][doseType].data}
                  >
                    <div className="text-dim">
                      <p>
                        {`${t("total")} - `}
                        <span className="font-medium">
                          {(
                            waffle.data[data.filter_age.value][doseType].total as number
                          ).toLocaleString()}
                        </span>
                      </p>
                      <p>
                        {`${t("common:time.daily")} - `}
                        <span className="font-medium">
                          {waffle.data[data.filter_age.value][doseType].daily}
                        </span>
                      </p>
                    </div>
                  </Waffle>
                ))}
              </div>
            </Panel>
            <Panel name={t("filter_dose")} key={t("filter_dose")}>
              <BarMeter
                className="col-span-2"
                data={barmeter.data[data.filter_dose.value]}
                unit="%"
                layout="vertical"
              />
            </Panel>
          </Tabs>
        </Section>

        {/* What is the current state of the COVID-19 vaccination program? */}
        <COVIDVaccinationTrends
          currentState={currentState}
          timeseries={timeseries}
          statistics={statistics}
        />
      </Container>
    </>
  );
};

export default COVIDVaccination;
