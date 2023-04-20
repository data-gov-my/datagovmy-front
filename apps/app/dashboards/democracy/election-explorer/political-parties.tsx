import { FunctionComponent, ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Trans } from "next-i18next";
import { BarMeter, Lost, Won } from "@components/Chart/Table/BorderlessTable";
import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { Panel, Section, StateDropdown, Tabs } from "@components/index";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { PoliticalParty } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

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
    "pn",
    "ph",
    "bn",
    "gps",
    "grs",
    "warisan",
    "kdm",
    "mca",
    "pbm",
    "pcs",
    "phrs",
    "psb",
    "pejuang",
    "pas",
    "bebas",
    "pkr",
    "dap",
    "bersatu",
    "upko",
    "amanah",
  ].map((key: string) => ({
    label: key,
    value: key,
  }));

  const { data, setData } = useData({
    state: "",
    tabs: 0,
    party: "",

    // query
    q_party: PARTY_OPTIONS[0],
    loading: false,
  });

  type Party = {
    date: string;
    seats: [string, number];
    seats_perc: number;
    perc: number;
    votes: string;
    result: string;
  };

  const dummyData: Party[] = [
    {
      date: "23 Jan 2022",
      seats: ["111 / 222", 50],
      seats_perc: 50,
      perc: 40.5,
      votes: "18,911 (40.5%)",
      result: "formed_gov",
    },
    {
      date: "23 Jan 2018",
      seats: ["111 / 222", 50],
      seats_perc: 50,
      perc: 40.5,
      votes: "17,076 (44.0%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2013",
      seats: ["111 / 222", 50],
      seats_perc: 50,
      perc: 40.5,
      votes: "22,045 (59.8%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2008",
      seats: ["111 / 222", 50],
      seats_perc: 50,
      perc: 40.5,
      votes: "20,230 (76.1%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2004",
      seats: ["111 / 222", 50.148176],
      seats_perc: 50,
      perc: 40.5,
      votes: "20,065 (82.3%)",
      result: "formed_opp",
    },
  ];

  const columnHelper = createColumnHelper<Party>();

  const results: { [key: string]: ReactNode } = {
    formed_gov: <Won desc={t("dashboard-election-explorer:party.formed_gov")} />,
    formed_opp: <Lost desc={t("dashboard-election-explorer:party.formed_opp")} />,
  };

  const columns: ColumnDef<Party, any>[] = [
    columnHelper.accessor((row: any) => row.date, {
      header: t("dashboard-election-explorer:date"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("seats", {
      header: t("dashboard-election-explorer:seats_won"),
      cell: (info: any) => (
        <div className="flex flex-row items-center gap-2">
          <BarMeter perc={info.getValue()[1]} />
          <p>{info.getValue()[0] + ` (${numFormat(info.getValue()[1], "standard")}%)`}</p>
        </div>
      ),
    }),
    columnHelper.accessor("perc", {
      header: t("dashboard-election-explorer:perc_votes_won"),
      cell: (info: any) => (
        <div className="flex flex-row items-center gap-2">
          <BarMeter perc={info.getValue()} />
          <p>{`${numFormat(info.getValue(), "standard")}%`}</p>
        </div>
      ),
    }),
    columnHelper.accessor("votes", {
      header: t("dashboard-election-explorer:votes_won"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("result", {
      header: t("dashboard-election-explorer:result"),
      cell: (info: any) => results[info.getValue()],
    }),
    columnHelper.accessor("result", {
      id: "fullResult",
      header: "",
      cell: (info: any) => (
        <ElectionCard
          label={t("dashboard-election-explorer:full_result")}
          win={results[info.getValue()]}
          title={"GE-15 Result"}
        />
      ),
    }),
  ];

  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-10 lg:col-start-2">
          <h4 className="text-center">{t("dashboard-election-explorer:party.header")}</h4>
          <div className="pb-12 pt-6">
            <div className="flex items-center justify-center">
              <ComboBox
                placeholder={t("dashboard-election-explorer:party.search_party")}
                options={PARTY_OPTIONS}
                selected={data.party ? PARTY_OPTIONS.find(e => e.value === data.party.value) : null}
                onChange={e => {
                  if (e) setData("q_party", e);
                  setData("party", e);
                }}
                enableFlag
              />
            </div>
          </div>
          <Tabs
            title={
              <Trans>
                <span className="text-lg font-normal leading-9">
                  <Image
                    className="mr-2 inline-flex items-center"
                    src={`/static/images/parties/${data.q_party.value}.png`}
                    width={28}
                    height={16}
                    alt={PoliticalParty[data.q_party.value]}
                  />
                  {t("dashboard-election-explorer:party.title", {
                    party: PoliticalParty[data.q_party.value],
                  })}
                  <StateDropdown
                    currentState={data.state}
                    onChange={selected => setData("state", selected.value)}
                    exclude={["mys"]}
                    width="inline-block pl-1 min-w-max"
                    anchor="left"
                    disabled={data.tabs === 0}
                  />
                </span>
              </Trans>
            }
            current={data.tabs}
            onChange={index => setData("tabs", index)}
          >
            <Panel name={t("dashboard-election-explorer:parliament_elections")}>
              <BorderlessTable
                data={dummyData}
                columns={columns}
                isLoading={data.loading}
                empty={
                  <p>
                    {t("dashboard-election-explorer:party.never_compete", {
                      name: data.q_party ? data.q_party.value : null,
                      context: data.tabs === 0 ? "parliament" : "state",
                    })}
                  </p>
                }
              />
            </Panel>
            <Panel name={t("dashboard-election-explorer:state_elections")}>
              <BorderlessTable
                data={[]}
                columns={columns}
                isLoading={data.loading}
                empty={
                  <p>
                    {t("dashboard-election-explorer:party.never_compete", {
                      name: data.q_party ? PoliticalParty[data.q_party.value] : "",
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
