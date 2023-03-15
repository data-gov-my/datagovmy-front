import { Hero, Container, Tabs, Panel, Section, StateDropdown } from "@components/index";
import dynamic from "next/dynamic";
import { useData } from "@hooks/useData";
import { useWindowWidth } from "@hooks/useWindowWidth";
import { AKSARA_COLOR, CountryAndStates, BREAKPOINTS } from "@lib/constants";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useMemo } from "react";
import { routes } from "@lib/routes";
import { useTranslation } from "next-i18next";
import { DateTime } from "luxon";
import Slider, { SliderRef } from "@components/Chart/Slider";

const Bar = dynamic(() => import("@components/Chart/Bar"), { ssr: false });
const Timeseries = dynamic(() => import("@components/Chart/Timeseries"), { ssr: false });
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });

interface OrganDonationDashboardProps {
  last_updated: number;
  timeseries_pledge: any;
  bar_age: any;
  bar_time: any;
  bar_reasons: any;
  choropleth_malaysia_organ_donation: any;
}

const OrganDonationDashboard: FunctionComponent<OrganDonationDashboardProps> = ({
  last_updated,
  timeseries_pledge,
  bar_age,
  bar_time,
  bar_reasons,
  choropleth_malaysia_organ_donation,
}) => {
  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth < BREAKPOINTS.MD;
  const currentState = (router.query.state as string) ?? "mys";
  const { data, setData } = useData({
    minmax: [timeseries_pledge.data.x.length - 182, timeseries_pledge.data.x.length - 1],
  });
  const { t } = useTranslation("common");
  const filtered_timeline = useCallback(() => {
    return {
      x: timeseries_pledge.data.x.slice(data.minmax[0], data.minmax[1] + 1),
      line: timeseries_pledge.data.line.slice(data.minmax[0], data.minmax[1] + 1),
      daily: timeseries_pledge.data.daily.slice(data.minmax[0], data.minmax[1] + 1),
    };
  }, [data.minmax, timeseries_pledge]);

  return (
    <>
      <Hero background="organ-banner">
        <div className="space-y-4 xl:w-2/3">
          <span className="text-sm font-bold uppercase tracking-widest text-dim">
            {t("organ.title")}
          </span>
          <h3 className="text-black">{t("organ.title_header")}</h3>
          <p className="text-dim">
            {t("organ.title_description")}{" "}
            <a href="#" className="font-semibold text-blue-600">
              {t("organ.title_link")}
            </a>
          </p>
          <StateDropdown
            url={routes.ORGAN_DONATION}
            currentState={currentState}
            exclude={["kvy"]}
          />

          <p className="text-sm text-dim">
            {t("common.last_updated", {
              date: DateTime.fromMillis(last_updated)
                .setLocale(router.locale ?? router.defaultLocale!)
                .toFormat("dd MMM yyyy, HH:mm"),
            })}
          </p>
        </div>
      </Hero>

      <Container className="min-h-screen">
        <Section
          title={t("organ.bar_header", { state: CountryAndStates[currentState] })}
          description={
            <p className="pt-2 text-dim">
              {t("organ.bar_description1")} <strong> {t("organ.bar_description2")}</strong>
              {t("organ.bar_description3")}
            </p>
          }
          date={timeseries_pledge.data_as_of}
        >
          <div className="space-y-4">
            <Timeseries
              title={t("organ.timeseries_title")}
              className="h-[350px]"
              state={currentState}
              data={{
                labels: filtered_timeline().x,
                datasets: [
                  {
                    type: "line",
                    label: t("organ.timeseries_line"),
                    data: filtered_timeline().line,
                    // borderColor: #228F3A,
                    borderWidth: 1.5,
                  },
                  {
                    type: "bar",
                    label: t("organ.timeseries_bar"),
                    data: filtered_timeline().daily,
                    // backgroundColor: #D1D5DB,
                  },
                ],
              }}
              stats={null}
            />
            <Slider
              className="pt-7"
              type="range"
              value={data.minmax}
              data={timeseries_pledge.data.x}
              onChange={(item: any) => setData("minmax", [item.min, item.max])}
            />
            <span className="text-sm text-dim">{t("common.slider")}</span>
          </div>
        </Section>
        {/* Choropleth view of organ donar in Malaysia */}
        <Section
          title={t("organ.choro_header")}
          description={t("organ.choro_description")}
          date={choropleth_malaysia_organ_donation.data_as_of}
          className={isMobile ? "border-b pt-12" : "border-b py-12"}
        >
          <div>
            <Choropleth
              className={isMobile ? "h-[400px] w-auto" : "h-[500px] w-full"}
              enableScale={false}
              colorScale="greens"
              borderColor="#000"
              borderWidth={0.5}
              data={choropleth_malaysia_organ_donation.data.map((item: any) => ({
                id: CountryAndStates[item.state],
                state: CountryAndStates[item.state],
                value: item.data.perc,
              }))}
              unitY="%"
              graphChoice="state"
            />
          </div>
        </Section>
        {/* How strong is the new donor recruitment in {{ area }}? */}
        <Section
          title={t("organ.bar1_header", { state: CountryAndStates[currentState] })}
          description={t("organ.bar1_description")}
          date={bar_time.data_as_of}
        >
          <div className="grid w-full grid-cols-1 gap-12 xl:grid-cols-2">
            <div>
              <Tabs
                title={t("organ.bar_title")}
                state={currentState}
                //   menu={<MenuDropdown />}
              >
                <Panel name={t("organ.annual")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: bar_time.data.annual.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: bar_time.data.annual.y,
                          //   backgroundColor: #94A3B8,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("organ.monthly")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: bar_time.data.monthly.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: bar_time.data.monthly.y,
                          //   backgroundColor: #D1D5DB,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
            <div>
              <Tabs
                title={t("organ.bar2_title")}
                state={currentState}
                //   menu={<MenuDropdown />}
              >
                <Panel name={t("organ.year")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: bar_age.data.past_year.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: bar_age.data.past_year.y,
                          //   backgroundColor: #94A3B8,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
                <Panel name={t("organ.month")}>
                  <Bar
                    className="h-[250px]"
                    data={{
                      labels: bar_age.data.past_month.x,
                      datasets: [
                        {
                          label: "New Donors",
                          data: bar_age.data.past_month.y,
                          //   backgroundColor: #D1D5DB,
                        },
                      ],
                    }}
                    enableGridX={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section>
        {/* What proportion of the population in {{ area }} donates blood?  */}
        {/* <Section
          title={t("organ.heatmap_header", { state: CountryAndStates[currentState] })}
          description={t("organ.heatmap_description")}
          date={heatmap_donorrate.data_as_of}
        >
          <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
            <div className="w-full">
              <Tabs
                title="Donor rates across key demographics"
                //menu={<MenuDropdown />}
                state={currentState}
              >
                <Panel name={t("organ.capita")}>
                  <>
                    <Heatmap
                      className="flex h-[140px] overflow-visible"
                      data={[
                        heatmap_donorrate.data.capita.male,
                        heatmap_donorrate.data.capita.female,
                      ]}
                      subdata
                      axisLeft="default"
                      color="greens"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("organ.heatmap2_title")}
                      data={[
                        heatmap_donorrate.data.capita.male_chinese,
                        heatmap_donorrate.data.capita.male_indian,
                        heatmap_donorrate.data.capita.male_bumi,
                        heatmap_donorrate.data.capita.male_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      color="greens"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title="Female"
                      data={[
                        heatmap_donorrate.data.capita.female_chinese,
                        heatmap_donorrate.data.capita.female_indian,
                        heatmap_donorrate.data.capita.female_bumi,
                        heatmap_donorrate.data.capita.female_other,
                      ]}
                      subdata
                      axisLeft="default"
                      axisTop={null}
                      color="greens"
                    />
                  </>
                </Panel>
                <Panel name={t("organ.heatmap1_panel2")}>
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-auto lg:overflow-visible"
                      data={[heatmap_donorrate.data.perc.male, heatmap_donorrate.data.perc.female]}
                      subdata
                      axisLeft="default"
                      unitY="%"
                      color="greens"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("organ.heatmap2_title")}
                      data={[
                        heatmap_donorrate.data.perc.male_chinese,
                        heatmap_donorrate.data.perc.male_indian,
                        heatmap_donorrate.data.perc.male_bumi,
                        heatmap_donorrate.data.perc.male_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      color="greens"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("organ.heatmap3_title")}
                      data={[
                        heatmap_donorrate.data.perc.female_chinese,
                        heatmap_donorrate.data.perc.female_indian,
                        heatmap_donorrate.data.perc.female_bumi,
                        heatmap_donorrate.data.perc.female_other,
                      ]}
                      subdata
                      unitY="%"
                      axisLeft="default"
                      axisTop={null}
                      color="greens"
                    />
                  </>
                </Panel>
                <Panel name={t("organ.heatmap1_panel3")}>
                  <>
                    <Heatmap
                      className="flex h-[150px] overflow-visible"
                      data={[heatmap_donorrate.data.abs.male, heatmap_donorrate.data.abs.female]}
                      subdata
                      axisLeft="default"
                      valueFormat="<-,.1~s"
                      color="greens"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("organ.heatmap2_title")}
                      data={[
                        heatmap_donorrate.data.abs.male_chinese,
                        heatmap_donorrate.data.abs.male_indian,
                        heatmap_donorrate.data.abs.male_bumi,
                        heatmap_donorrate.data.abs.male_other,
                      ]}
                      subdata
                      valueFormat="<-,.2~s"
                      axisLeft="default"
                      axisTop={null}
                      color="greens"
                    />

                    <Heatmap
                      className="flex h-[200px] overflow-visible"
                      title={t("organ.heatmap3_title")}
                      data={[
                        heatmap_donorrate.data.abs.female_chinese,
                        heatmap_donorrate.data.abs.female_indian,
                        heatmap_donorrate.data.abs.female_bumi,
                        heatmap_donorrate.data.abs.female_other,
                      ]}
                      subdata
                      valueFormat="<-,.1~s"
                      axisLeft="default"
                      axisTop={null}
                      color="greens"
                    />
                  </>
                </Panel>
              </Tabs>
            </div>

            <div>
              <Tabs title={t("organ.bar1_title")} state={currentState}>
                <Panel name={t("organ.annual")}>
                  <Bar
                    className="h-[500px]"
                    layout="horizontal"
                    data={{
                      labels: bar_reasons.data.all_time.x,
                      datasets: [
                        {
                          label: t("organ.donor"),
                          data: bar_reasons.data.all_time.y,
                          backgroundColor: #D1D5DB,
                        },
                      ],
                    }}
                    enableGridY={false}
                  />
                </Panel>
                <Panel name={t("organ.monthly")}>
                  <Bar
                    className="h-[500px]"
                    layout="horizontal"
                    data={{
                      labels: bar_reasons.data.last_month.x,
                      datasets: [
                        {
                          label: t("organ.donor"),
                          data: bar_reasons.data.last_month.y,
                          backgroundColor: #D1D5DB,
                        },
                      ],
                    }}
                    enableGridY={false}
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
        </Section> */}
        {/* How is this data collected? */}
        {/* <Section title={t("organ.map_btm")} description={t("organ.map_desc")} /> */}
      </Container>
    </>
  );
};

export default OrganDonationDashboard;
