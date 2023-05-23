import { FunctionComponent, useRef } from "react";
import dynamic from "next/dynamic";
import Card from "@components/Card";
import { SPRIcon, SPRIconSolid } from "@components/Icon/agency";
import ImageWithFallback from "@components/ImageWithFallback";
import {
  AgencyBadge,
  Button,
  Container,
  Dropdown,
  Hero,
  Modal,
  Section,
  StateDropdown,
  Tabs,
} from "@components/index";
import Label from "@components/Label";
import { List, Panel } from "@components/Tabs";
import ContainerTabs from "@components/Tabs/ContainerTabs";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import {
  BuildingLibraryIcon,
  FlagIcon,
  MapIcon,
  TableCellsIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { CountryAndStates, PoliticalPartyColours } from "@lib/constants";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import { useScrollIntersect } from "@hooks/useScrollIntersect";
import { useRouter } from "next/router";
import { Party, PartyResult, Seat } from "../types";
import BallotSeat from "./ballot-seat";
import ElectionAnalysis from "./analysis";
import { generateSchema } from "@lib/schema/election-explorer";
import ElectionLayout from "../layout";

/**
 * Election Explorer Dashboard
 * @overview Status: In-development
 */

const ElectionTable = dynamic(() => import("@components/Chart/Table/ElectionTable"), {
  ssr: false,
});
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Waffle = dynamic(() => import("@components/Chart/Waffle"), { ssr: false });
interface ElectionExplorerProps {
  seats: Seat[];
  table: PartyResult;
  params: {
    state: string;
    election: string;
  };
}

const ElectionExplorer: FunctionComponent<ElectionExplorerProps> = ({ seats, params, table }) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);
  const { push } = useRouter();

  const divRef = useRef<HTMLDivElement>(null);
  useScrollIntersect(divRef.current, "drop-shadow-xl");

  const PANELS = [
    {
      name: t("election.parliament"),
      icon: <BuildingLibraryIcon className="mr-1 h-5 w-5" />,
    },
    {
      name: t("election.state"),
      icon: <FlagIcon className="mr-1 h-5 w-5" />,
    },
  ];

  const waffleDummy = [
    {
      id: "PH",
      label: "PH",
      value: 82,
    },
    {
      id: "BN",
      label: "BN",
      value: 30,
    },
    {
      id: "PN",
      label: "PN",
      value: 74,
    },
    {
      id: "GPS",
      label: "GPS",
      value: 23,
    },
    {
      id: "Others",
      label: "Others",
      value: 13,
    },
  ];
  const waffleColours = ["#e2462f", "#000080", "#003152", "#FF9B0E", "#E2E8F0"];

  const { data, setData } = useData({
    list_index: params.election.startsWith("G") ? 0 : 1, // 0 - parlimen; 1 - dun
    election: params.election,
    state: params.state,
  });

  const ELECTION_OPTIONS: Array<OptionType> = Array(16)
    .fill(null)
    .map((n, index: number) => ({
      label: (data.list_index === 0 ? t("GE") : t("SE")) + `-${String(index).padStart(2, "0")}`,
      value: (data.list_index === 0 ? "GE" : "SE") + `-${String(index).padStart(2, "0")}`,
    }))
    .reverse();

  const navigateToElection = (election?: string, state?: string) => {
    if (!election) return;
    setData("loading", true);
    setData("election", election);

    const route = state
      ? `${routes.ELECTION_EXPLORER}/elections/${encodeURIComponent(election)}/${state}`
      : `${routes.ELECTION_EXPLORER}/elections/${encodeURIComponent(election)}`;

    push(route, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  return (
    <>
      <ElectionLayout>
        <Container className="min-h-fit">
          {/* Explore any election from Merdeka to the present! */}
          <Section>
            <h4 className="text-center">{t("election.section_1")}</h4>
            <div className={clx("fixed right-0 top-16 z-10 lg:hidden")}>
              <Modal
                trigger={open => (
                  <Button
                    onClick={open}
                    className="border-outline bg-background dark:border-outlineHover-dark dark:bg-washed-dark dark:shadow-washed-dark mr-3 block self-center border px-3 py-1.5 shadow-lg"
                  >
                    <span>{t("filter")}:</span>
                    <span className="bg-primary dark:bg-primary-dark rounded-md px-1 py-0.5 text-xs text-white">
                      {3}
                    </span>
                  </Button>
                )}
                title={
                  <Label
                    label={t("filter") + ":"}
                    className="block text-sm font-bold text-black dark:text-white"
                  />
                }
              >
                {close => (
                  <div className="flex-grow space-y-4 overflow-y-auto pb-36 pt-4">
                    <Label
                      label={t("election.election") + ":"}
                      className="block text-sm font-medium text-black dark:text-white"
                    />
                    <div className="border-outline dark:border-washed-dark max-w-fit rounded-full border bg-white p-1 dark:bg-black">
                      <List
                        options={PANELS.map(item => item.name)}
                        icons={PANELS.map(item => item.icon)}
                        current={data.list_index}
                        onChange={index => {
                          setData("list_index", index);
                        }}
                      />
                    </div>
                    <div className="dark:border-outlineHover-dark grid grid-cols-2 gap-2 border-y py-4">
                      <Label
                        label={t("election.state") + ":"}
                        className="block text-sm font-medium text-black dark:text-white"
                      />
                      <Label
                        label={t("election.election_year") + ":"}
                        className="block text-sm font-medium text-black dark:text-white"
                      />
                      <StateDropdown
                        currentState={data.state}
                        onChange={selected => {
                          setData("state", selected.value);
                        }}
                        exclude={data.list_index === 0 ? [] : ["mys", "kul", "lbn", "pjy"]}
                        width="w-full"
                        anchor="left"
                      />
                      <Dropdown
                        width="w-full"
                        placeholder={t("select_election")}
                        options={ELECTION_OPTIONS}
                        selected={
                          data.election
                            ? ELECTION_OPTIONS.find(e => e.value === data.election)
                            : undefined
                        }
                        onChange={e => {
                          setData("election", e.value);
                        }}
                      />
                    </div>
                    <div className="fixed bottom-0 left-0 flex w-full flex-col gap-2 bg-white px-2 py-3 dark:bg-black">
                      <Button className="btn btn-primary w-full justify-center" onClick={close}>
                        {t("election.apply_filters")}
                      </Button>
                      <Button className="btn btn-default w-full justify-center" onClick={close}>
                        {t("common:common.close")}
                      </Button>
                    </div>
                  </div>
                )}
              </Modal>
            </div>

            <div
              ref={divRef}
              className="sticky top-16 z-10 mt-6 hidden items-center justify-center gap-2 transition-all duration-200 ease-in lg:flex lg:pl-2"
            >
              <div className="border-outline dark:border-washed-dark max-w-fit rounded-full border bg-white p-1 dark:bg-black">
                <List
                  options={PANELS.map(item => item.name)}
                  icons={PANELS.map(item => item.icon)}
                  current={data.list_index}
                  onChange={index => {
                    setData("election", "");
                    setData("list_index", index);
                  }}
                />
              </div>
              <StateDropdown
                currentState={data.state}
                onChange={selected => {
                  navigateToElection(data.election, selected.value);
                  setData("state", selected.value);
                }}
                exclude={data.list_index === 0 ? [] : ["mys", "kul", "lbn", "pjy"]}
                width="min-w-max"
                anchor="left"
              />
              <Dropdown
                anchor="left"
                width="max-w-fit"
                placeholder={t("select_election")}
                options={ELECTION_OPTIONS}
                selected={
                  data.election ? ELECTION_OPTIONS.find(e => e.value === data.election) : undefined
                }
                onChange={selected => {
                  navigateToElection(selected.value, data.state);
                  setData("election", selected.value);
                }}
              />
            </div>
            <Tabs hidden current={data.list_index} onChange={index => setData("list_index", index)}>
              {PANELS.map((panel, index) => (
                <Tabs.Panel name={panel.name as string} icon={panel.icon} key={index}>
                  <div className="py-12 lg:grid lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-10 lg:col-start-2">
                      <Tabs
                        title={
                          <div className="text-base font-bold">
                            {t("election.parliament_of")}
                            <span className="text-primary">
                              {data.state ? CountryAndStates[data.state] : CountryAndStates["mys"]}
                            </span>
                            <span>: </span>
                            <span className="text-primary">
                              {ELECTION_OPTIONS.find(e => e.value === data.election)?.label}
                            </span>
                          </div>
                        }
                        current={data.s1_tabs}
                        onChange={index => setData("s1_tabs", index)}
                      >
                        <Panel name={t("election.map")} icon={<MapIcon className="mr-1 h-5 w-5" />}>
                          <Card className="border-outline dark:border-washed-dark bg-background dark:bg-background-dark static rounded-xl border xl:py-4">
                            <Choropleth
                              enableOutline={false}
                              type={data.list_index === 1 ? "dun" : "parlimen"}
                            />
                          </Card>
                        </Panel>
                        <Panel
                          name={t("election.table")}
                          icon={<TableCellsIcon className="mr-1 h-5 w-5" />}
                        >
                          <ElectionTable
                            isLoading={false}
                            data={table}
                            columns={generateSchema<Party>([
                              {
                                key: "party",
                                id: "party",
                                header: t("party_name"),
                              },
                              {
                                key: "seats",
                                id: "seats",
                                header:
                                  table.length > 0
                                    ? `${t("seats_won")} / ${table[0].seats.total}`
                                    : t("seats_won"),
                              },
                              { key: "votes", id: "votes", header: t("votes_won") },
                            ])}
                          />
                        </Panel>
                        <Panel name={t("election.summary")}>
                          <div className="space-y-6">
                            <p className="text-center text-sm font-medium">
                              {t("election.majority")}
                            </p>
                            <div className="relative h-12 w-full">
                              <Waffle
                                className="h-[50px] min-h-max w-full"
                                fillDirection={"left"}
                                data={waffleDummy}
                                margin={{ top: 0, right: 0, bottom: 0, left: 2 }}
                                total={222}
                                rows={3}
                                cols={74}
                                color={waffleColours}
                              />
                              <hr className="border-background-dark absolute inset-x-1/2 -top-3 h-[72px] w-0 border border-dashed dark:border-white"></hr>
                            </div>
                            <div className="text-dim flex flex-row flex-wrap items-center justify-center gap-6">
                              {waffleDummy.map(({ label, value }) => (
                                <div className="flex flex-row items-center gap-1" key={label}>
                                  {label === "Others" ? (
                                    <div className="bg-dim h-4 w-4 rounded-md"></div>
                                  ) : (
                                    <ImageWithFallback
                                      className="border-outline dark:border-washed-dark rounded border"
                                      src={`/static/images/parties/${label}.png`}
                                      width={32}
                                      height={18}
                                      alt={t(`${label}`)}
                                    />
                                  )}
                                  <span
                                    className="uppercase"
                                    style={{ color: PoliticalPartyColours[label] }}
                                  >
                                    {label}
                                  </span>
                                  <span
                                    className="font-bold"
                                    style={{ color: PoliticalPartyColours[label] }}
                                  >
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <p className="text-dim whitespace-pre-line text-center text-sm ">
                              {t("election.explore")}
                            </p>
                          </div>
                        </Panel>
                      </Tabs>
                    </div>
                  </div>
                </Tabs.Panel>
              ))}
            </Tabs>
          </Section>

          {/* View the full ballot for a specific seat */}
          <BallotSeat seats={seats} election={data.election} />

          {/* Election analysis */}
          <ElectionAnalysis />
        </Container>
      </ElectionLayout>
    </>
  );
};

export default ElectionExplorer;
