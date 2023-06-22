import ElectionAnalysis from "./analysis";
import BallotSeat from "./ballot-seat";
import ElectionLayout from "../layout";
import { Party, PartyResult, Seat, ElectionEnum } from "../types";
import Card from "@components/Card";
import ImageWithFallback from "@components/ImageWithFallback";
import {
  Button,
  Container,
  Dropdown,
  Modal,
  Section,
  StateDropdown,
  Tabs,
} from "@components/index";
import Label from "@components/Label";
import { List, Panel } from "@components/Tabs";
import { OptionType } from "@components/types";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { BuildingLibraryIcon, FlagIcon, MapIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useScrollIntersect } from "@hooks/useScrollIntersect";
import { useTranslation } from "@hooks/useTranslation";
import { CountryAndStates, PoliticalPartyColours } from "@lib/constants";
import { clx } from "@lib/helpers";
import { routes } from "@lib/routes";
import { generateSchema } from "@lib/schema/election-explorer";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent, useMemo, useRef } from "react";

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
  params: {
    state: string;
    election: string;
  };
  seats: Seat[];
  selection: Record<string, any>;
  table: PartyResult;
}

const ElectionExplorer: FunctionComponent<ElectionExplorerProps> = ({
  params,
  seats,
  selection,
  table,
}) => {
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

  const ELECTION_ACRONYM = params.election.slice(-5);
  const ELECTION_FULLNAME = params.election;
  const CURRENT_STATE = params.state;

  const { data, setData } = useData({
    toggle_index: ELECTION_ACRONYM.startsWith("G") ? ElectionEnum.Parlimen : ElectionEnum.Dun,
    election: ELECTION_ACRONYM,
    state: CURRENT_STATE,
  });

  const TOGGLE_IS_DUN = data.toggle_index === ElectionEnum.Dun;
  const TOGGLE_IS_PARLIMEN = data.toggle_index === ElectionEnum.Parlimen;
  const NON_SE_STATE = ["mys", "kul", "lbn", "pjy"];

  const GE_OPTIONS: Array<OptionType> = selection["mys"]
    .map((election: Record<string, any>) => ({
      label: t(election.name) + ` (${election.year})`,
      value: election.name,
    }))
    .reverse();

  const SE_OPTIONS = useMemo<Array<OptionType>>(() => {
    let _options: Array<OptionType> = [];
    if (data.state !== null && NON_SE_STATE.includes(data.state) === false)
      _options = selection[data.state]
        .map((election: Record<string, any>) => ({
          label: t(election.name) + ` (${election.year})`,
          value: election.name,
        }))
        .reverse();
    return _options;
  }, [data.state]);

  const navigateToElection = (election: string, state?: string) => {
    if (!election) return;
    setData("loading", true);
    setData("election", election);

    const route = `${routes.ELECTION_EXPLORER}/elections/${encodeURIComponent(election)}/${state}`;

    push(route, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  const handleElectionTab = (index: number) => {
    if (index === ElectionEnum.Dun) {
      setData("state", !NON_SE_STATE.includes(CURRENT_STATE) ? data.state || CURRENT_STATE : null);
      setData("election", null);
    } else {
      setData("state", data.state || CURRENT_STATE);
    }
    setData("toggle_index", index);
  };

  return (
    <>
      <ElectionLayout>
        <Container className="min-h-fit">
          {/* Explore any election from Merdeka to the present! */}
          <Section>
            <h4 className="text-center">{t("election.header_1")}</h4>

            {/* Mobile */}
            <div className={clx("fixed right-3 top-16 z-10 lg:hidden")}>
              <Modal
                trigger={open => (
                  <button
                    onClick={open}
                    className="btn btn-dropdown shadow-[0_6px_24px_rgba(0,0,0,0.1)]"
                  >
                    <span>{t("filter")}:</span>
                    <div className="bg-primary dark:bg-primary-dark w-4.5 h-5 rounded-md">
                      <p className="text-center text-white">3</p>
                    </div>
                    <ChevronDownIcon
                      className="disabled:text-outlineHover dark:disabled:text-outlineHover-dark absolute right-3 -mx-[5px] h-5 w-5"
                      aria-hidden="true"
                    />
                  </button>
                )}
                title={<Label label={t("filter") + ":"} className="text-sm font-bold" />}
              >
                {close => (
                  <div className="flex-grow space-y-4 overflow-y-auto pb-[100px] pt-4">
                    <Label label={t("election.election") + ":"} className="text-sm" />
                    <div className="border-outline dark:border-washed-dark max-w-fit rounded-full border bg-white p-1 dark:bg-black">
                      <List
                        options={PANELS.map(item => item.name)}
                        icons={PANELS.map(item => item.icon)}
                        current={data.toggle_index}
                        onChange={handleElectionTab}
                      />
                    </div>
                    <div className="dark:border-outlineHover-dark grid grid-cols-2 gap-2 border-y py-4">
                      <Label label={t("election.state") + ":"} className="text-sm" />
                      <Label label={t("election.election_year") + ":"} className="text-sm" />
                      <StateDropdown
                        currentState={data.state}
                        onChange={selected => {
                          navigateToElection(data.election, selected.value);
                          setData("state", selected.value);
                          TOGGLE_IS_DUN && setData("election", null);
                        }}
                        exclude={TOGGLE_IS_DUN ? NON_SE_STATE : []}
                        width="w-full"
                        anchor="left-0 bottom-10"
                      />
                      <Dropdown
                        width="w-full"
                        anchor="right-0 bottom-10"
                        placeholder={t("select_election")}
                        options={TOGGLE_IS_PARLIMEN ? GE_OPTIONS : SE_OPTIONS}
                        selected={
                          TOGGLE_IS_PARLIMEN
                            ? GE_OPTIONS.find(e => e.value === data.election ?? ELECTION_FULLNAME)
                            : SE_OPTIONS.find(e => e.value === data.election ?? ELECTION_ACRONYM)
                        }
                        disabled={!data.state}
                        onChange={selected => {
                          setData("election", selected.value);
                          navigateToElection(selected.value, data.state);
                        }}
                      />
                    </div>
                    <div className="fixed bottom-0 left-0 flex w-full flex-col gap-2 bg-white px-2 py-3 dark:bg-black">
                      <Button className="btn btn-primary w-full justify-center" onClick={close}>
                        {t("election.apply_filters")}
                      </Button>
                      <Button className="btn w-full justify-center" onClick={close}>
                        {t("common:common.close")}
                      </Button>
                    </div>
                  </div>
                )}
              </Modal>
            </div>

            {/* Desktop */}
            <div
              ref={divRef}
              className="sticky top-16 z-20 mt-6 hidden items-center justify-center gap-2 transition-all duration-200 ease-in lg:flex lg:pl-2"
            >
              <div className="border-outline dark:border-washed-dark max-w-fit rounded-full border bg-white p-1 dark:bg-black">
                <List
                  options={PANELS.map(item => item.name)}
                  icons={PANELS.map(item => item.icon)}
                  current={data.toggle_index}
                  onChange={handleElectionTab}
                />
              </div>
              <StateDropdown
                currentState={data.state}
                onChange={selected => {
                  TOGGLE_IS_PARLIMEN
                    ? navigateToElection(data.election, selected.value)
                    : setData("election", null);
                  setData("state", selected.value);
                }}
                exclude={TOGGLE_IS_DUN ? NON_SE_STATE : []}
                width="w-fit"
                anchor="left"
              />
              <Dropdown
                anchor="left"
                placeholder={t("select_election")}
                options={TOGGLE_IS_PARLIMEN ? GE_OPTIONS : SE_OPTIONS}
                selected={
                  TOGGLE_IS_PARLIMEN
                    ? GE_OPTIONS.find(e => e.value === data.election ?? ELECTION_FULLNAME)
                    : SE_OPTIONS.find(e => e.value === data.election ?? ELECTION_ACRONYM)
                }
                onChange={selected => {
                  setData("election", selected.value);
                  navigateToElection(selected.value, data.state);
                }}
                disabled={!data.state}
              />
            </div>
            <Section>
              <Tabs
                hidden
                current={data.toggle_index}
                onChange={index => setData("toggle_index", index)}
              >
                {PANELS.map((panel, index) => (
                  <Tabs.Panel name={panel.name as string} icon={panel.icon} key={index}>
                    <div className="grid grid-cols-12">
                      <div className="col-span-full col-start-1 space-y-6 lg:col-span-10 lg:col-start-2">
                        <Tabs
                          title={
                            <div className="text-base font-bold">
                              {t("election.parliament_of")}
                              <span className="text-primary">
                                {CountryAndStates[CURRENT_STATE]}
                              </span>
                              <span>: </span>
                              <span className="text-primary">{t(ELECTION_ACRONYM)}</span>
                            </div>
                          }
                        >
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
                                  header: t("seats_won"),
                                },
                                { key: "votes", id: "votes", header: t("votes_won") },
                              ])}
                            />
                          </Panel>
                          {/* <Panel
                            name={t("election.map")}
                            icon={<MapIcon className="mr-1 h-5 w-5" />}
                          >
                            <Card className="bg-background dark:bg-background-dark static xl:py-4">
                              <Choropleth
                                className="h-[400px] w-auto lg:h-[500px]"
                                type={TOGGLE_IS_DUN ? "dun" : "parlimen"}
                              />
                            </Card>
                          </Panel> */}
                          {/* <Panel name={t("election.summary")}>
                            <div className="space-y-6">
                              <p className="text-center text-sm font-medium">
                                {t("election.simple_majority")}
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
                                        className="border-outline dark:border-outlineHover-dark rounded border"
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
                              <p className="text-dim whitespace-pre-line text-center text-sm">
                                {t("election.explore")}
                              </p>
                            </div>
                          </Panel> */}
                        </Tabs>
                      </div>
                    </div>
                  </Tabs.Panel>
                ))}
              </Tabs>
            </Section>
            {/* View the full ballot for a specific seat */}
            <BallotSeat seats={seats} state={CURRENT_STATE} election={ELECTION_FULLNAME} />

            {/* Election analysis */}
            <ElectionAnalysis index={data.toggle_index} seats={seats} />
          </Section>
        </Container>
      </ElectionLayout>
    </>
  );
};

export default ElectionExplorer;
