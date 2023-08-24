import ElectionAnalysis from "./analysis";
import BallotSeat from "./ballot-seat";
import ElectionFilter from "./filter";
import { ElectionEnum, OverallSeat, Party, PartyResult } from "../types";
import { BuildingLibraryIcon, FlagIcon, MapIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { generateSchema } from "@lib/schema/election-explorer";
import { get } from "datagovmy-ui/api";
import {
  Button,
  Card,
  Container,
  Dropdown,
  ImageWithFallback,
  Label,
  List,
  Modal,
  Panel,
  Section,
  StateDropdown,
  Tabs,
  toast,
} from "datagovmy-ui/components";
import { CountryAndStates, PoliticalPartyColours } from "datagovmy-ui/constants";
import { WindowProvider } from "datagovmy-ui/contexts/window";
import {
  useCache,
  useData,
  useFilter,
  useScrollIntersect,
  useTranslation,
} from "datagovmy-ui/hooks";
import { OptionType } from "datagovmy-ui/types";
import dynamic from "next/dynamic";
import { FunctionComponent, useMemo, useRef } from "react";

/**
 * Election Explorer Dashboard
 * @overview Status: In-development
 */

const ElectionTable = dynamic(() => import("@components/Chart/Table/ElectionTable"), {
  ssr: false,
});
const Choropleth = dynamic(() => import("datagovmy-ui/charts/choropleth"), { ssr: false });
const Waffle = dynamic(() => import("datagovmy-ui/charts/waffle"), { ssr: false });

interface ElectionExplorerProps {
  params: {
    state: string;
    election: string;
  };
  seats: OverallSeat[];
  selection: Record<string, any>;
  table: PartyResult;
}

const ElectionExplorer: FunctionComponent<ElectionExplorerProps> = ({
  params,
  seats,
  selection,
  table,
}) => {
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);
  const { cache } = useCache();

  const divRef = useRef<HTMLDivElement>(null);
  useScrollIntersect(divRef.current, "drop-shadow-xl");

  const PANELS = [
    {
      name: t("parlimen"),
      icon: <BuildingLibraryIcon className="mr-1 h-5 w-5" />,
    },
    {
      name: t("state"),
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

  const { filter, setFilter } = useFilter({
    election: params.election,
    state: params.state,
  });

  const ELECTION_FULLNAME = filter.election ?? "GE-15";
  const ELECTION_ACRONYM = ELECTION_FULLNAME.slice(-5);
  const CURRENT_STATE = filter.state ?? "mys";

  const { data, setData } = useData({
    toggle_index: ELECTION_ACRONYM.startsWith("G") ? ElectionEnum.Parlimen : ElectionEnum.Dun,
    tab_index: 0,
    election_fullname: ELECTION_FULLNAME,
    election_acronym: ELECTION_ACRONYM,
    state: CURRENT_STATE,
    showFullTable: false,
    seats: seats,
    table: table,
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

  const fetchResult = async (
    _election: string,
    state: string
  ): Promise<{ seats: OverallSeat[]; table: Party[] }> => {
    setData("loading", true);
    setFilter("election", _election);
    setFilter("state", state);
    const identifier = `${state}_${_election}`;

    const election =
      _election.startsWith("S") && state && ["mys", "kul", "lbn", "pjy"].includes(state) === false
        ? `${CountryAndStates[state]} ${_election}`
        : _election;
    setData("election_fullname", election);

    return new Promise(resolve => {
      if (cache.has(identifier)) {
        setData("loading", false);
        return resolve(cache.get(identifier));
      }

      Promise.all([
        get("/explorer", {
          explorer: "ELECTIONS",
          chart: "overall_seat",
          election,
          state,
        }),
        get("/explorer", {
          explorer: "ELECTIONS",
          chart: "full_result",
          type: "party",
          election,
          state,
        }),
      ])
        .then(
          ([{ data: _seats }, { data: _table }]: [
            { data: { data: OverallSeat[] } },
            { data: { data: Party[] } }
          ]) => {
            const elections = {
              seats: _seats.data,
              table: _table.data.sort((a, b) => {
                if (a.seats.won === b.seats.won) {
                  return b.votes.perc - a.votes.perc;
                } else {
                  return b.seats.won - a.seats.won;
                }
              }),
            };
            cache.set(identifier, elections);
            setData("loading", false);
            return resolve(elections);
          }
        )
        .catch(e => {
          toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
          console.error(e);
        });
    });
  };

  const handleElectionTab = (index: number) => {
    if (index === ElectionEnum.Dun) {
      setData(
        "state",
        !NON_SE_STATE.includes(filter.state ?? "mys") ? data.state || CURRENT_STATE : null
      );
      setData("election", null);
    } else {
      setData("state", data.state || CURRENT_STATE);
    }
    setData("toggle_index", index);
  };

  return (
    <Container>
      {/* Explore any election from Merdeka to the present! */}
      <Section className="pt-8 lg:pt-12">
        <h4 className="text-center">{t("header_1")}</h4>

        {/* Mobile */}
        <Modal
          trigger={open => (
            <WindowProvider>
              <ElectionFilter onClick={open} />
            </WindowProvider>
          )}
          title={<Label label={t("filter") + ":"} className="text-sm font-bold" />}
        >
          {close => (
            <div className="flex flex-col">
              <div className="space-y-4 bg-white p-3 dark:bg-black">
                <div className="space-y-2">
                  <Label label={t("election") + ":"} className="text-sm" />
                  <div className="border-outline dark:border-washed-dark max-w-fit rounded-full border bg-white p-1 dark:bg-black">
                    <List
                      options={PANELS.map(item => item.name)}
                      icons={PANELS.map(item => item.icon)}
                      current={data.toggle_index}
                      onChange={handleElectionTab}
                    />
                  </div>
                </div>
                <div className="dark:border-outlineHover-dark grid grid-cols-2 gap-2 border-y py-4">
                  <Label label={t("state") + ":"} className="text-sm" />
                  <Label label={t("election_year") + ":"} className="text-sm" />
                  <StateDropdown
                    currentState={data.state}
                    onChange={selected => {
                      setData("state", selected.value);
                      TOGGLE_IS_DUN && setData("election_acronym", null);
                    }}
                    exclude={TOGGLE_IS_DUN ? NON_SE_STATE : []}
                    width="w-full"
                    anchor="bottom-10"
                  />
                  <Dropdown
                    width="w-full"
                    anchor="right-0 bottom-10"
                    placeholder={t("select_election")}
                    options={TOGGLE_IS_PARLIMEN ? GE_OPTIONS : SE_OPTIONS}
                    selected={
                      TOGGLE_IS_PARLIMEN
                        ? GE_OPTIONS.find(e => e.value === data.election_acronym)
                        : SE_OPTIONS.find(e => e.value === data.election_acronym)
                    }
                    disabled={!data.state}
                    onChange={selected => setData("election_acronym", selected.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Button
                    className="btn-primary w-full justify-center"
                    onClick={() => {
                      fetchResult(data.election_acronym, data.state).then(({ seats, table }) => {
                        setData("seats", seats);
                        setData("table", table);
                        close();
                      });
                    }}
                  >
                    {t("apply_filters")}
                  </Button>
                  <Button className="btn w-full justify-center px-3 py-1.5" onClick={close}>
                    {t("common:common.close")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Modal>

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
                ? fetchResult(data.election_acronym, selected.value).then(({ seats, table }) => {
                    setData("seats", seats);
                    setData("table", table);
                  })
                : setData("election_acronym", null);
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
                ? GE_OPTIONS.find(e => e.value === data.election_acronym)
                : SE_OPTIONS.find(e => e.value === data.election_acronym)
            }
            onChange={selected => {
              setData("election_acronym", selected.value);
              fetchResult(selected.value, data.state).then(({ seats, table }) => {
                setData("seats", seats);
                setData("table", table);
              });
            }}
            disabled={!data.state}
          />
        </div>

        <Tabs
          className="mt-8 lg:mt-12"
          hidden
          current={data.toggle_index}
          onChange={index => setData("toggle_index", index)}
        >
          {PANELS.map((panel, index) => (
            <Tabs.Panel name={panel.name as string} icon={panel.icon} key={index}>
              <div className="xl:grid xl:grid-cols-12">
                <div className="flex flex-col gap-y-3 xl:col-span-10 xl:col-start-2">
                  <div className="flex flex-col items-baseline justify-between gap-y-3 sm:flex-row md:gap-y-0">
                    <h5 className="w-fit">
                      {t("election_of", {
                        context: (filter.election ?? "GE-15").startsWith("G") ? "parlimen" : "dun",
                      })}
                      <span className="text-primary">
                        {CountryAndStates[filter.state ?? "mys"]}
                      </span>
                      <span>: </span>
                      <span className="text-primary">{t(filter.election ?? "GE-15")}</span>
                    </h5>
                    <div className="flex w-full justify-start sm:w-auto">
                      <List
                        options={[t("table"), t("map"), t("summary")]}
                        icons={[
                          <TableCellsIcon key="table_cell_icon" className="mr-1 h-5 w-5" />,
                          <MapIcon key="map_icon" className="mr-1 h-5 w-5" />,
                        ]}
                        current={data.tab_index}
                        onChange={index => 0} //setData("tab_index", index)}
                      />
                    </div>
                  </div>
                  <Tabs
                    hidden
                    current={data.tab_index}
                    onChange={index => setData("tab_index", index)}
                  >
                    <Panel name={t("table")} icon={<TableCellsIcon className="mr-1 h-5 w-5" />}>
                      <>
                        <ElectionTable
                          isLoading={false}
                          data={data.showFullTable ? data.table : data.table.slice(0, 10)}
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
                        {data.showFullTable !== true && (
                          <Button
                            className="btn-default mx-auto mt-6"
                            onClick={() => setData("showFullTable", true)}
                          >
                            {t("show_more")}
                          </Button>
                        )}
                      </>
                    </Panel>
                    <Panel name={t("map")} icon={<MapIcon className="mr-1 h-5 w-5" />}>
                      <Card className="bg-background dark:bg-background-dark static xl:py-4">
                        <Choropleth
                          className="h-[400px] w-auto lg:h-[500px]"
                          type={(filter.election ?? "GE-15").startsWith("S") ? "dun" : "parlimen"}
                        />
                      </Card>
                    </Panel>
                    <Panel name={t("summary")}>
                      <div className="space-y-6">
                        <p className="text-center text-sm font-medium">{t("simple_majority")}</p>
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
                          {t("explore")}
                        </p>
                      </div>
                    </Panel>
                  </Tabs>
                </div>
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
        <hr className="dark:bg-washed-dark bg-outline mt-8 h-px lg:mt-12"></hr>
        {/* View the full ballot for a specific seat */}
        <BallotSeat
          seats={data.seats}
          state={filter.state ?? "mys"}
          election={data.election_fullname}
        />
        <hr className="dark:bg-washed-dark bg-outline h-px"></hr>
        {/* Election analysis */}
        <ElectionAnalysis
          state={filter.state ?? "mys"}
          index={data.toggle_index}
          seats={data.seats}
        />
      </Section>
    </Container>
  );
};

export default ElectionExplorer;
