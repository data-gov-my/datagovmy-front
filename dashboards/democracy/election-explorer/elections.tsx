import { FunctionComponent, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Dropdown, Section, StateDropdown, Tabs } from "@components/index";
import { List, Panel } from "@components/Tabs";
import { BuildingLibraryIcon, FlagIcon, MapIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { OptionType } from "@components/types";
import { CountryAndStates, PoliticalParty, PoliticalPartyColours } from "@lib/constants";
import Card from "@components/Card";
import { clx, numFormat } from "@lib/helpers";
import ComboBox from "@components/Combobox";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { BarMeter } from "@components/Chart/Table/BorderlessTable";

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
      name: t("dashboard-election-explorer:election.parliament"),
      icon: <BuildingLibraryIcon className="mr-1 h-5 w-5" />,
    },
    {
      name: t("dashboard-election-explorer:election.state"),
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
    "P001 Padang Besar, Perlis",
    "P002 Kangar, Perlis",
    "P003 Arau, Perlis",
    "P004 Langkawi, Kedah",
    "P005 Jerlun, Kedah",
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
    label: t(`dashboard-election-explorer:election.${key}`),
    value: key,
  }));

  const dummy = [
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

  const { data, setData } = useData({
    tabs: 0,
    tabs_section_1: 0,
    tabs_section_3: 0,
    filter: FILTER_OPTIONS[0],
    election: ELECTION_OPTIONS[0],
    state: "",
    seat: SEAT_OPTIONS[0].value,

    // query
    q_seat: "",
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
      header: t("dashboard-election-explorer:candidate_name"),
    }),
    columnHelper.accessor((row: any) => row.party, {
      id: "party",
      cell: (info: any) => {
        const party = info.getValue() as string;
        return (
          <div className="flex flex-row items-center gap-2">
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
      header: t("dashboard-election-explorer:party_name"),
    }),
    columnHelper.accessor("votes", {
      id: "votes",
      cell: (info: any) => numFormat(info.getValue(), "standard"),
      header: t("dashboard-election-explorer:total_votes"),
    }),
    columnHelper.accessor("perc", {
      id: "perc",
      cell: (info: any) => (
        <div className="flex flex-row items-center gap-2">
          <BarMeter perc={info.getValue()} />
          <p>{`${numFormat(info.getValue(), "standard")}%`}</p>
        </div>
      ),
      header: t("dashboard-election-explorer:perc_votes"),
    }),
  ];

  return (
    <>
      <Section>
        <h4 className="text-center">{t("dashboard-election-explorer:election.section_1")}</h4>
        <div
          ref={divRef}
          className={clx("sticky top-16 z-10 mt-6 flex items-center justify-center gap-2 lg:pl-2")}
        >
          <div className="max-w-fit rounded-full border border-outline bg-white p-1 dark:border-washed-dark dark:bg-black">
            <List
              shadow={clx(
                hasShadow ? "shadow-2xl" : "shadow-none",
                "shadow-black dark:shadow-white"
              )}
              options={PANELS.map(item => item.name)}
              icons={PANELS.map(item => item.icon)}
              current={data.tabs}
              onChange={index => setData("tabs", index)}
            />
          </div>
          <StateDropdown
            shadow={clx(hasShadow ? "shadow-2xl" : "shadow-none", "shadow-black dark:shadow-white")}
            currentState={data.state}
            onChange={selected => setData("state", selected.value)}
            exclude={["mys", "kul", "lbn", "pjy"]}
            width="min-w-max"
            anchor="left"
            disabled={data.tabs === 0}
          />
          <Dropdown
            shadow={clx(hasShadow ? "shadow-2xl" : "shadow-none", "shadow-black dark:shadow-white")}
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
                        {t("dashboard-election-explorer:election.parliament_of")}
                        <span className="text-primary">
                          {data.tabs === 1 && data.state
                            ? CountryAndStates[data.state]
                            : CountryAndStates["mys"]}
                        </span>
                        <span>: </span>
                        <span className="text-primary">{data.election.value}</span>
                      </div>
                    }
                    current={data.tabs_section_1}
                    onChange={index => setData("tabs_section_1", index)}
                  >
                    <Panel name={t("dashboard-election-explorer:election.summary")}>
                      <div className="space-y-6">
                        <p className="text-center text-sm font-medium">
                          {t("dashboard-election-explorer:election.majority")}
                        </p>
                        <div className="relative">
                          <Waffle
                            className="h-[50px] min-h-max w-full"
                            fillDirection={"left"}
                            data={dummy}
                            margin={{ top: 0, right: 0, bottom: 0, left: 2 }}
                            total={222}
                            rows={3}
                            cols={74}
                            color={["#e2462f", "#000080", "#003152", "#FF9B0E", "#E2E8F0"]}
                          />
                          <hr className="absolute inset-x-1/2 -top-3 h-[36px] w-0 border border-dashed border-background-dark dark:border-white lg:h-[72px]"></hr>
                        </div>
                        <div className="flex flex-row flex-wrap items-center justify-center gap-6 text-dim">
                          {dummy.map(({ label, value }) => (
                            <div className="flex flex-row items-center gap-1">
                              {label === "Others" ? (
                                <div className="h-4 w-7 rounded-md bg-dim"></div>
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
                        <p className="whitespace-pre-line text-center text-sm text-dim ">
                          {t("dashboard-election-explorer:election.explore")}
                        </p>
                      </div>
                    </Panel>
                    <Panel
                      name={t("dashboard-election-explorer:election.map")}
                      icon={<MapIcon className="mr-1 h-5 w-5" />}
                    >
                      <Card
                        className="static h-[500px] rounded-xl border border-outline dark:border-washed-dark"
                        type="gray"
                      >
                        <Choropleth type={data.tabs === 1 ? "dun" : "parlimen"} />
                      </Card>
                    </Panel>
                    <Panel
                      name={t("dashboard-election-explorer:election.table")}
                      icon={<TableCellsIcon className="mr-1 h-5 w-5" />}
                    >
                      <BorderlessTable data={dummyData} columns={dummyColumns} />
                    </Panel>
                  </Tabs>
                </div>
              </div>
            </Tabs.Panel>
          ))}
        </Tabs>
        <div className="border-t py-12 dark:border-t-outlineHover-dark lg:grid lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-10 lg:col-start-2">
            <div className="space-y-6">
              <h4 className="text-center">{t("dashboard-election-explorer:election.section_2")}</h4>
              <div className="flex items-center justify-center">
                <ComboBox
                  placeholder={t("dashboard-election-explorer:election.search_area")}
                  options={SEAT_OPTIONS}
                  selected={
                    data.q_seat ? SEAT_OPTIONS.find(e => e.value === data.q_seat.value) : null
                  }
                  onChange={e => {
                    if (e) setData("seat", e.value);
                    setData("q_seat", e);
                  }}
                />
              </div>
            </div>
            <BorderlessTable
              title={
                <div className="text-base font-bold">
                  {t("dashboard-election-explorer:election.full_result", {
                    election: data.election.value,
                  })}
                  <span className="text-primary">{data.seat}</span>
                </div>
              }
              data={dummyData}
              columns={dummyColumns}
              // highlightedRow={1}
              // win={true}
            />
          </div>
        </div>
        <div className="border-t py-12 dark:border-t-outlineHover-dark lg:grid lg:grid-cols-12">
          <div className="lg:col-span-10 lg:col-start-2">
            <h4 className="py-4 text-center">
              {t("dashboard-election-explorer:election.section_3")}
            </h4>
            <div className="flex flex-row justify-between gap-4 pb-6 sm:flex-row">
              <div className="flex flex-row">
                <div className="w-fit px-2 py-1 text-sm lg:px-4">{t("catalogue.filter")}</div>
                <Dropdown
                  anchor="left"
                  width="w-fit"
                  options={FILTER_OPTIONS}
                  selected={FILTER_OPTIONS.find(e => e.value === data.filter.value)}
                  onChange={e => setData("filter_age", e)}
                />
              </div>
              <List
                options={[
                  t("dashboard-election-explorer:election.map"),
                  t("dashboard-election-explorer:election.table"),
                ]}
                icons={[
                  <MapIcon className="mr-1 h-5 w-5" />,
                  <TableCellsIcon className="mr-1 h-5 w-5" />,
                ]}
                current={data.tabs_section_3}
                onChange={index => setData("tabs_section_3", index)}
              />
            </div>
            <Tabs
              hidden
              current={data.tabs_section_3}
              onChange={index => setData("tabs_section_3", index)}
            >
              <Panel
                name={t("dashboard-election-explorer:election.map")}
                icon={<MapIcon className="mr-1 h-5 w-5" />}
              >
                <Card
                  className="static h-[500px] rounded-xl border border-outline dark:border-washed-dark"
                  type="gray"
                >
                  {/* <Choropleth type={data.tabs === 1 ? "dun" : "parlimen"} /> */}
                </Card>
              </Panel>
              <Panel
                name={t("dashboard-election-explorer:election.table")}
                icon={<TableCellsIcon className="mr-1 h-5 w-5" />}
              >
                <BorderlessTable data={dummyData} columns={dummyColumns} />
              </Panel>
            </Tabs>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Election;
