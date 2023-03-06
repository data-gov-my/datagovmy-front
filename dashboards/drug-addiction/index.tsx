import { Container, Hero, Section, StateDropdown } from "@components/index";
import { FunctionComponent, useEffect } from "react";
import dynamic from "next/dynamic";
import { toDate } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import { useRouter } from "next/router";
import { routes } from "@lib/routes";
import { AKSARA_COLOR, CountryAndStates } from "@lib/constants";
import { track } from "@lib/mixpanel";

/**
 * Drug Addiction Dashboard
 * @overview Status: Live
 */

const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const BarMeter = dynamic(() => import("@components/Chart/BarMeter"), { ssr: false });

interface DrugAddictionDashboardProps {
  last_updated: number;
  timeseries: any;
  barmeter: any;
}

const DrugAddictionDashboard: FunctionComponent<DrugAddictionDashboardProps> = ({
  last_updated,
  timeseries,
  barmeter,
}) => {
  const router = useRouter();
  const state = (router.query.state as string) ?? "mys";
  const { t, i18n } = useTranslation();

  useEffect(() => {
    track("page_view", {
      type: "dashboard",
      id: "drug.header",
      name_en: "Drug Addiction",
      name_bm: "Penagihan Dadah",
      route: routes.DRUG,
    });
  }, []);
  return (
    <>
      <Hero background="drug-addiction-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-danger">
            {t("nav.megamenu.categories.social")}
          </span>
          <h3 className="text-white">{t("drug.header")}</h3>
          <p className="whitespace-pre-line text-white">{t("drug.description")}</p>

          <StateDropdown url={routes.DRUG} currentState={state} />

          <p className="text-sm text-white">
            {t("common.last_updated", {
              date: toDate(last_updated, "dd MMM yyyy, HH:mm", i18n.language),
            })}
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        {/* How has drug addiction in {state} changed over time? */}
        <Section
          title={t("drug.section_1.title", { state: CountryAndStates[state] })}
          description={t("drug.section_1.description")}
          date={timeseries.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <Timeseries
              state={state}
              className="h-[250px] w-full"
              title={t("drug.keys.male")}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "line",
                    data: timeseries.data.male,
                    label: t("drug.keys.male"),
                    borderColor: AKSARA_COLOR.DANGER,
                    backgroundColor: AKSARA_COLOR.DANGER_H,
                    fill: true,
                    borderWidth: 1.5,
                  },
                ],
              }}
            />
            <Timeseries
              state={state}
              className="h-[250px] w-full"
              title={t("drug.keys.female")}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "line",
                    data: timeseries.data.female,
                    label: t("drug.keys.female"),
                    borderColor: AKSARA_COLOR.DANGER,
                    backgroundColor: AKSARA_COLOR.DANGER_H,
                    fill: true,
                    borderWidth: 1.5,
                  },
                ],
              }}
            />
            <Timeseries
              state={state}
              className="h-[250px] w-full"
              title={t("drug.keys.total")}
              interval="year"
              data={{
                labels: timeseries.data.x,
                datasets: [
                  {
                    type: "line",
                    data: timeseries.data.total,
                    label: t("drug.keys.total"),
                    borderColor: AKSARA_COLOR.DANGER,
                    backgroundColor: AKSARA_COLOR.DANGER_H,
                    fill: true,
                    borderWidth: 1.5,
                  },
                ],
              }}
            />
          </div>
        </Section>

        {/* A deeper look at drug addiction in {state} */}
        <Section
          title={t("drug.section_2.title", { state: CountryAndStates[state] })}
          date={barmeter.data_as_of}
        >
          <div className="col-span-1 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-12">
            <BarMeter
              title={t("drug.keys.age")}
              layout="horizontal"
              data={barmeter.data.age}
              relative
              sort={(a, b) => a.x.localeCompare(b.x)}
            />
            <BarMeter
              title={t("drug.keys.sex")}
              layout="horizontal"
              className="flex-col"
              data={barmeter.data.sex}
              formatX={x => t(`drug.keys.${x}`)}
              sort="desc"
              relative
            />
            <BarMeter
              title={t("drug.keys.ethnicity")}
              layout="horizontal"
              className="flex-col"
              data={barmeter.data.ethnicity}
              formatX={x => t(`drug.keys.${x}`)}
              sort="desc"
              relative
            />
            <BarMeter
              title={t("drug.keys.drug")}
              layout="horizontal"
              className="flex-col"
              data={barmeter.data.drug}
              formatX={x => t(`drug.keys.${x}`)}
              sort="desc"
              relative
            />
            <BarMeter
              title={t("drug.keys.schooling")}
              layout="horizontal"
              className="flex-col"
              data={barmeter.data.schooling}
              formatX={x => t(`drug.keys.${x}`)}
              sort="desc"
              relative
            />
            <BarMeter
              title={t("drug.keys.job")}
              layout="horizontal"
              className="flex-col"
              data={barmeter.data.job}
              formatX={x => t(`drug.keys.${x}`)}
              sort="desc"
              relative
            />
          </div>
        </Section>
      </Container>
    </>
  );
};

export default DrugAddictionDashboard;
