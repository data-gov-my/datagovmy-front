import { FunctionComponent, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Button, Dropdown, Modal, Section, StateDropdown, Tabs } from "@components/index";
import Card from "@components/Card";
import ComboBox from "@components/Combobox";
import Label from "@components/Label";
import LeftRightCard from "@components/LeftRightCard";
import { BarMeter } from "@components/Chart/Table/BorderlessTable";
import { List, Panel } from "@components/Tabs";
import { OptionType } from "@components/types";
import { BuildingLibraryIcon, FlagIcon, MapIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { CountryAndStates, PoliticalParty, PoliticalPartyColours } from "@lib/constants";
import { clx, numFormat } from "@lib/helpers";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useWindowScroll } from "@hooks/useWindowWidth";

/**
 * Election Explorer Dashboard - Elections Tab
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});
const Choropleth = dynamic(() => import("@components/Chart/Choropleth"), { ssr: false });
const Waffle = dynamic(() => import("@components/Chart/Waffle"), { ssr: false });

interface ElectionProps {}

const Election: FunctionComponent<ElectionProps> = ({}) => {
  const { t, i18n } = useTranslation();
  const [hasShadow, setHasShadow] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const scroll = useWindowScroll();
  const show = useMemo(() => scroll.scrollY > 350, [scroll.scrollY]);

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    const handleScroll = () => {
      setHasShadow(div.getBoundingClientRect().top === 64);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [divRef]);

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

  const ELECTION_OPTIONS: Array<OptionType> = [
    "GE-15 (2022)",
    "GE-14 (2018)",
    "GE-13 (2013)",
    "GE-12 (2008)",
    "GE-11 (2004)",
    "GE-10 (1999)",
    "GE-9 (1995)",
    "GE-8 (1990)",
    "GE-7 (1986)",
    "GE-6 (1982)",
    "GE-5 (1978)",
    "GE-4 (1974)",
    "GE-3 (1969)",
    "GE-2 (1964)",
    "GE-1 (1959)",
  ].map((key: string) => ({
    label: key,
    value: key,
  }));

  const SEAT_OPTIONS: Array<OptionType> = [
    "P.001 Padang Besar, Perlis",
    "P.002 Kangar, Perlis",
    "P.003 Arau, Perlis",
    "P.004 Langkawi, Kedah",
    "P.005 Jerlun, Kedah",
  ].map((key: string) => ({
    label: key,
    value: key,
  }));

  const FILTER_OPTIONS: Array<OptionType> = [
    "voter_turnout",
    "majority_%",
    "rejected_votes",
    "%_PH",
    "num_voters",
  ].map((key: string) => ({
    label: t(`election.${key}`),
    value: key,
  }));

  const waffleDummy = [
    {
      id: "ph",
      label: "ph",
      value: 82,
    },
    {
      id: "bn",
      label: "bn",
      value: 30,
    },
    {
      id: "pn",
      label: "pn",
      value: 74,
    },
    {
      id: "gps",
      label: "gps",
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
    tabs: 0,
    tabs_section1: 0,
    tabs_section3: 0,
    section1_loading: false,
    section2_loading: false,
    section3_loading: false,
    filter: FILTER_OPTIONS[0],
    election: ELECTION_OPTIONS[0],
    seat: "",
    state: "",

    // query
    q_seat: SEAT_OPTIONS[0],
  });

  type Candidate = {
    name: string;
    party: string;
    votes: number;
    perc: number;
  };

  const dummyData: Candidate[] = [
    {
      name: "Rushdan Bin Rusmi",
      party: "pn",
      votes: 24267,
      perc: 60.45,
    },
    {
      name: "Ko Chu Liang",
      party: "ph",
      votes: 11753,
      perc: 30.05,
    },
    {
      name: "Zahida Binti Zarik Khan",
      party: "bn",
      votes: 9267,
      perc: 4.5,
    },
    {
      name: "Kapt (B) Hj Mohamad Yahya",
      party: "warisan",
      votes: 7085,
      perc: 3.5,
    },
    {
      name: "Zahidi Zainul Abidin",
      party: "bebas",
      votes: 244,
      perc: 1.5,
    },
  ];

  const columnHelper = createColumnHelper<Candidate>();

  const dummyColumns: Array<ColumnDef<Candidate, any>> = [
    columnHelper.accessor("name", {
      id: "name",
      cell: (info: any) => info.getValue(),
      header: t("candidate_name"),
    }),
    columnHelper.accessor((row: any) => row.party, {
      id: "party",
      cell: (info: any) => {
        const party = info.getValue().toLowerCase() as string;
        return (
          <div className="flex items-center gap-2 pr-7 xl:pr-0">
            <Image
              src={`/static/images/parties/${party}.png`}
              width={28}
              height={16}
              alt={PoliticalParty[party]}
            />
            <span className="text-center">{PoliticalParty[party]}</span>
          </div>
        );
      },
      header: t("party_name"),
    }),
    columnHelper.accessor("votes", {
      id: "votes",
      cell: (info: any) => numFormat(info.getValue(), "standard"),
      header: t("total_votes"),
    }),
    columnHelper.accessor("perc", {
      id: "perc",
      cell: (info: any) => (
        <div className="flex flex-row items-center gap-2">
          <BarMeter perc={info.getValue()} />
          <p>{`${numFormat(info.getValue(), "standard")}%`}</p>
        </div>
      ),
      header: t("perc_votes"),
    }),
  ];

  // const topStateIndices = getTopIndices(choropleth.data.y.perc, 3, true);

  return (
    <>
      <Section>
        <h4 className="text-center">{t("election.section_1")}</h4>
        <div className={clx(show ? "fixed right-0 top-16 z-10 lg:hidden" : "hidden")}>
          <Modal
            trigger={open => (
              <Button
                onClick={open}
                className="border-outline bg-background dark:border-outlineHover-dark dark:bg-washed-dark dark:shadow-washed-dark mr-3 block self-center border px-3 py-1.5 shadow-lg"
              >
                <span>{t("common:catalogue.filter")}:</span>
                <span className="bg-primary dark:bg-primary-dark rounded-md px-1 py-0.5 text-xs text-white">
                  {3}
                </span>
              </Button>
            )}
            title={
              <Label
                label={t("common:catalogue.filter") + ":"}
                className="block text-sm font-bold text-black dark:text-white"
              />
            }
          >
            {close => (
              <div className="flex-grow space-y-4 overflow-y-auto pb-24 pt-4">
                <Label
                  label={t("election.election") + ":"}
                  className="block text-sm font-medium text-black dark:text-white"
                />
                <div className="border-outline dark:border-washed-dark max-w-fit rounded-full border bg-white p-1 dark:bg-black">
                  <List
                    options={PANELS.map(item => item.name)}
                    icons={PANELS.map(item => item.icon)}
                    current={data.tabs}
                    onChange={index => setData("tabs", index)}
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
                    onChange={selected => setData("state", selected.value)}
                    exclude={["mys", "kul", "lbn", "pjy"]}
                    width="w-full"
                    anchor="left"
                    disabled={data.tabs === 0}
                  />
                  <Dropdown
                    width="w-full"
                    placeholder={t("common:common.select")}
                    options={ELECTION_OPTIONS}
                    selected={ELECTION_OPTIONS.find(e => e.value === data.election.value)}
                    onChange={e => setData("election", e)}
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
          className={clx(
            "sticky top-16 z-10 mt-6 hidden items-center justify-center gap-2 lg:flex lg:pl-2",
            hasShadow ? "drop-shadow-xl" : "drop-shadow-none"
          )}
        >
          <div
            className={clx(
              "border-outline dark:border-washed-dark max-w-fit rounded-full border bg-white p-1 dark:bg-black",
              hasShadow ? "shadow-lg dark:shadow-neutral-700" : "shadow-none"
            )}
          >
            <List
              options={PANELS.map(item => item.name)}
              icons={PANELS.map(item => item.icon)}
              current={data.tabs}
              onChange={index => setData("tabs", index)}
            />
          </div>
          <StateDropdown
            shadow={clx(hasShadow ? "shadow-lg dark:shadow-neutral-700" : "shadow-none")}
            currentState={data.state}
            onChange={selected => setData("state", selected.value)}
            exclude={["mys", "kul", "lbn", "pjy"]}
            width="min-w-max"
            anchor="left"
            disabled={data.tabs === 0}
          />
          <Dropdown
            shadow={clx(hasShadow ? "shadow-lg dark:shadow-neutral-700" : "shadow-none")}
            anchor="left"
            width="max-w-fit"
            options={ELECTION_OPTIONS}
            selected={ELECTION_OPTIONS.find(e => e.value === data.election.value)}
            onChange={e => setData("election", e)}
          />
        </div>
        <Tabs hidden current={data.tabs} onChange={index => setData("tabs", index)}>
          {PANELS.map((panel, index) => (
            <Tabs.Panel name={panel.name as string} icon={panel.icon} key={index}>
              <div className="py-12 lg:grid lg:grid-cols-12">
                <div className="space-y-6 lg:col-span-10 lg:col-start-2">
                  <Tabs
                    title={
                      <div className="text-base font-bold">
                        {t("election.parliament_of")}
                        <span className="text-primary">
                          {data.tabs === 1 && data.state
                            ? CountryAndStates[data.state]
                            : CountryAndStates["mys"]}
                        </span>
                        <span>: </span>
                        <span className="text-primary">{data.election.value}</span>
                      </div>
                    }
                    current={data.tabs_section1}
                    onChange={index => setData("tabs_section1", index)}
                  >
                    <Panel name={t("election.summary")}>
                      <div className="space-y-6">
                        <p className="text-center text-sm font-medium">{t("election.majority")}</p>
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
                            <div className="flex flex-row items-center gap-1">
                              {label === "Others" ? (
                                <div className="bg-dim h-4 w-7 rounded-md"></div>
                              ) : (
                                <Image
                                  src={`/static/images/parties/${label}.png`}
                                  width={28}
                                  height={16}
                                  alt={PoliticalParty[label]}
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
                    <Panel name={t("election.map")} icon={<MapIcon className="mr-1 h-5 w-5" />}>
                      <Card
                        className="border-outline dark:border-washed-dark static h-[500px] rounded-xl border"
                        type="gray"
                      >
                        <Choropleth type={data.tabs === 1 ? "dun" : "parlimen"} />
                      </Card>
                    </Panel>
                    <Panel
                      name={t("election.table")}
                      icon={<TableCellsIcon className="mr-1 h-5 w-5" />}
                    >
                      <BorderlessTable
                        isLoading={data.section1_loading}
                        highlightedRow={4}
                        data={dummyData}
                        columns={dummyColumns}
                      />
                    </Panel>
                  </Tabs>
                </div>
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
        <div className="dark:border-t-outlineHover-dark border-t py-12 lg:grid lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-10 lg:col-start-2">
            <div className="space-y-6">
              <h4 className="text-center">{t("election.section_2")}</h4>
              <div className="flex items-center justify-center">
                <ComboBox
                  placeholder={t("election.search_area")}
                  options={SEAT_OPTIONS}
                  selected={data.seat ? SEAT_OPTIONS.find(e => e.value === data.seat.value) : null}
                  onChange={e => {
                    if (e) setData("q_seat", e);
                    setData("seat", e);
                  }}
                />
              </div>
            </div>
            <BorderlessTable
              title={
                <div className="text-base font-bold">
                  {t("election.full_result", {
                    election: data.election.value,
                  })}
                  <span className="text-primary">{data.q_seat.value}</span>
                </div>
              }
              data={dummyData}
              columns={dummyColumns}
              isLoading={data.section2_loading}
              highlightedRow={1}
              win
            />
          </div>
        </div>
        <div className="dark:border-t-outlineHover-dark border-t py-12 lg:grid lg:grid-cols-12">
          <div className="lg:col-span-10 lg:col-start-2">
            <h4 className="py-4 text-center">{t("election.section_3")}</h4>
            <div className="flex flex-row justify-between gap-4 sm:flex-row">
              <div className="flex flex-row items-baseline gap-2 lg:gap-4">
                <p className="w-fit text-sm">{t("common:catalogue.filter")}</p>
                <Dropdown
                  anchor="left"
                  width="w-fit"
                  options={FILTER_OPTIONS}
                  selected={FILTER_OPTIONS.find(e => e.value === data.filter.value)}
                  onChange={e => setData("filter", e)}
                />
              </div>
              <List
                options={[t("election.map"), t("election.table")]}
                icons={[
                  <MapIcon className="mr-1 h-5 w-5" />,
                  <TableCellsIcon className="mr-1 h-5 w-5" />,
                ]}
                current={data.tabs_section3}
                onChange={index => setData("tabs_section3", index)}
              />
            </div>
            <Tabs
              hidden
              current={data.tabs_section3}
              onChange={index => setData("tabs_section3", index)}
            >
              <Panel name={t("election.map")} icon={<MapIcon className="mr-1 h-5 w-5" />}>
                <div className="pt-6">
                  <LeftRightCard
                    left={
                      <div className="flex h-full w-full flex-col space-y-6 p-8">
                        <div className="flex flex-col gap-2">
                          <h4>
                            {t("election.choro_header", {
                              stat: t(`election.${data.filter.value}`),
                            })}
                          </h4>
                          <span className="text-dim text-sm">
                            {/* {t("common.data_of", { date: choropleth.data_as_of })} */}
                          </span>
                        </div>
                        <div className="flex grow flex-col justify-between space-y-6">
                          <div className="space-y-3 pt-6">
                            <p className="font-bold">{t("election.choro_rank")}</p>
                            {/* {topStateIndices.map((pos, i) => {
                          return (
                            <div className="flex space-x-3">
                              <div className="text-dim font-medium">#{i + 1}</div>
                              <div className="grow">{CountryAndStates[choropleth.data.x[pos]]}</div>
                              <div className="font-bold text-[#16A34A]">
                                {displayPercent(choropleth.data.y.perc[pos])}
                              </div>
                              <ArrowRightIcon className="text-dim h-4 w-4 self-center stroke-[1.5px]" />
                            </div>
                          );
                        })} */}
                          </div>
                        </div>
                      </div>
                    }
                    right={<Choropleth type={data.tabs === 1 ? "dun" : "parlimen"} />}
                  />
                </div>
              </Panel>
              <Panel name={t("election.table")} icon={<TableCellsIcon className="mr-1 h-5 w-5" />}>
                <BorderlessTable
                  isLoading={data.section3_loading}
                  data={dummyData}
                  columns={dummyColumns}
                />
              </Panel>
            </Tabs>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Election;
