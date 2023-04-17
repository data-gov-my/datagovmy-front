import dynamic from "next/dynamic";
import Image from "next/image";
import { FunctionComponent } from "react";
import { BarMeter, Lost, Won } from "@components/Chart/Table/BorderlessTable";
import ComboBox from "@components/Combobox";
import { Panel, Section, StateDropdown, Tabs } from "@components/index";
import { OptionType } from "@components/types";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { PoliticalParty } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import ElectionCard from "@components/Card/ElectionCard";

/**
 * Election Explorer Dashboard - Political Parties Tab
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});

interface ElectionPartiesProps {}

const ElectionParties: FunctionComponent<ElectionPartiesProps> = ({}) => {
  const { t, i18n } = useTranslation();

  const PARTY_OPTIONS: Array<OptionType> = [
    "ph",
    "pn",
    "bn",
    "warisan",
    "kdm",
    "gps",
    "grs",
    "mca",
  ].map((key: string) => ({
    label: key,
    value: key,
  }));

  const { data, setData } = useData({
    state: "",
    tabs: 0,
    party: PARTY_OPTIONS[0],

    // query
    q_party: "",
  });

  type Party = {
    date: string;
    seats: string;
    perc: number;
    votes: string;
    result: string;
  };

  const dummyData: Party[] = [
    {
      date: "23 Jan 2022",
      seats: "111 / 222",
      perc: 40.5,
      votes: "18,911 (40.5%)",
      result: "formed_gov",
    },
    {
      date: "23 Jan 2018",
      seats: "111 / 222",
      perc: 40.5,
      votes: "17,076 (44.0%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2013",
      seats: "111 / 222",
      perc: 40.5,
      votes: "22,045 (59.8%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2008",
      seats: "111 / 222",
      perc: 40.5,
      votes: "20,230 (76.1%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2004",
      seats: "111 / 222",
      perc: 40.5,
      votes: "20,065 (82.3%)",
      result: "formed_opp",
    },
  ];

  const columnHelper = createColumnHelper<Party>();

  const columns: ColumnDef<Party, any>[] = [
    columnHelper.accessor((row: any) => row.date, {
      header: t("dashboard-election-explorer:date"),
      cell: (info: any) => <p className="whitespace-nowrap">{info.getValue()}</p>,
    }),
    columnHelper.accessor("seats", {
      header: t("dashboard-election-explorer:seats_won"),
      cell: (info: any) => (
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <BarMeter perc={Number(info.getValue())} />
          {/* <BarMeter perc={Number(String(info.getValue()).substring(info.getValue().length - 6, info.getValue().length - 2))} /> */}
          <p className="whitespace-nowrap">{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor("perc", {
      header: t("dashboard-election-explorer:perc_votes_won"),
      cell: (info: any) => (
        <div className="flex flex-col items-center gap-2 md:flex-row">
          <BarMeter perc={info.getValue()} />
          <p className="whitespace-nowrap">{`${numFormat(info.getValue(), "standard")}%`}</p>
        </div>
      ),
    }),
    columnHelper.accessor("votes", {
      header: t("dashboard-election-explorer:votes_won"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("result", {
      header: t("dashboard-election-explorer:result"),
      cell: (info: any) =>
        info.getValue() === "formed_gov" ? (
          <Won desc={t("dashboard-election-explorer:party.formed_gov")} />
        ) : (
          <Lost desc={t("dashboard-election-explorer:party.formed_opp")} />
        ),
    }),
    columnHelper.display({
      id: "fullResult",
      cell: () => (
        <ElectionCard desc={t("dashboard-election-explorer:full_result")} title={"GE-15 Result"} />
      ),
    }),
  ];
  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-10 lg:col-start-2">
          <h4 className="text-center">{t("dashboard-election-explorer:party.header")}</h4>
          <div className="pt-6 pb-12">
            <div className="flex items-center justify-center">
              <ComboBox
                placeholder={t("dashboard-election-explorer:party.search_party")}
                options={PARTY_OPTIONS}
                selected={
                  data.q_party
                    ? PARTY_OPTIONS.find(e => e.value === data.q_party.value)
                    : data.q_party
                }
                onChange={e => {
                  if (e) setData("party", e);
                  setData("q_party", e);
                }}
                enableFlag
              />
            </div>
          </div>
          <Tabs
            title={
              <div className="flex flex-row items-center gap-2">
                <Image
                  src={`/static/images/parties/${data.party.value}.png`}
                  width={28}
                  height={16}
                  alt={PoliticalParty[data.party.value]}
                />
                <div className="text-base font-bold">
                  {t("dashboard-election-explorer:party.title", {
                    party: PoliticalParty[data.party.value],
                  })}
                </div>
                <StateDropdown
                  currentState={data.state}
                  onChange={selected => setData("state", selected.value)}
                  exclude={["mys"]}
                  width="min-w-max"
                  anchor="left"
                  disabled={data.tabs === 0}
                />
              </div>
            }
            current={data.tabs}
            onChange={index => setData("tabs", index)}
          >
            <Panel name={t("dashboard-election-explorer:parliament_elections")}>
              <BorderlessTable
                data={dummyData}
                columns={columns}
                empty={
                  <p>
                    {t("dashboard-election-explorer:candidate.never_compete", {
                      name: data.q_party ? data.q_party.value : null,
                      context: data.tabs === 0 ? "parliament" : "state",
                    })}
                  </p>
                }
              />
            </Panel>
            <Panel name={t("dashboard-election-explorer:state_elections")}>
              <BorderlessTable
                data={dummyData}
                columns={columns}
                empty={
                  <p>
                    {t("dashboard-election-explorer:candidate.never_compete", {
                      name: data.party ? data.party.value : "",
                      context: data.tabs === 0 ? "parliament" : "state",
                    })}
                  </p>
                }
              />
            </Panel>
          </Tabs>
        </div>
      </div>
    </Section>
  );
};

export default ElectionParties;
