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

  type ElectionResult = {
    party: string;
    seats: string;
    seats_perc: number;
    perc: number;
    votes: number;
  };

  const fullResultData: ElectionResult[] = [
    {
      party: "ph",
      seats: "82 / 222",
      seats_perc: 36.9,
      votes: 18911,
      perc: 40.5,
    },
    {
      party: "pn",
      seats: "74 / 222",
      seats_perc: 33.3,
      votes: 17076,
      perc: 40.5,
    },
    {
      party: "bn",
      seats: "30 / 222",
      seats_perc: 13.5,
      votes: 22045,
      perc: 40.5,
    },
    {
      party: "gps",
      seats: "23 / 222",
      seats_perc: 10.4,
      perc: 40.5,
      votes: 20230,
    },
    {
      party: "grs",
      seats: "13 / 222",
      seats_perc: 5.9,
      votes: 20065,
      perc: 40.5,
    },
  ];

  const fullResultColumnHelper = createColumnHelper<ElectionResult>();

  const fullResultColumns: ColumnDef<ElectionResult, any>[] = [
    fullResultColumnHelper.accessor((row: any) => row.party, {
      id: "party",
      header: t("party_name"),
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
            <span>{PoliticalParty[party]}</span>
          </div>
        );
      },
    }),
    fullResultColumnHelper.accessor((row: any) => `${row.seats} (${row.seats_perc}%)`, {
      header: t("seats_won"),
      cell: (info: any) => (
        <div className="flex flex-row items-center gap-2">
          <BarMeter perc={info.row.original.seats_perc} />
          <p>{info.getValue()}</p>
        </div>
      ),
    }),
    fullResultColumnHelper.accessor("votes", {
      header: t("total_votes"),
      cell: (info: any) => numFormat(info.getValue(), "standard"),
    }),
    fullResultColumnHelper.accessor("perc", {
      header: t("perc_votes"),
      cell: (info: any) => (
        <div className="flex flex-row items-center gap-2">
          <BarMeter perc={info.getValue()} />
          <p>{`${numFormat(info.getValue(), "standard")}%`}</p>
        </div>
      ),
    }),
  ];

  type Party = {
    date: string;
    seats: string;
    seats_perc: number;
    perc: number;
    votes: string;
    result: string;
  };

  const dummyData: Party[] = [
    {
      date: "23 Jan 2022",
      seats: "111 / 222",
      seats_perc: 50,
      perc: 40.5,
      votes: "18,911 (40.5%)",
      result: "formed_gov",
    },
    {
      date: "23 Jan 2018",
      seats: "111 / 222",
      seats_perc: 50,
      perc: 40.5,
      votes: "17,076 (44.0%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2013",
      seats: "111 / 222",
      seats_perc: 50,
      perc: 40.5,
      votes: "22,045 (59.8%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2008",
      seats: "111 / 222",
      seats_perc: 50,
      perc: 40.5,
      votes: "20,230 (76.1%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2004",
      seats: "111 / 222",
      seats_perc: 50,
      perc: 40.5,
      votes: "20,065 (82.3%)",
      result: "formed_opp",
    },
  ];

  const columnHelper = createColumnHelper<Party>();

  const results: { [key: string]: ReactNode } = {
    formed_gov: <Won desc={t("party.formed_gov")} />,
    formed_opp: <Lost desc={t("party.formed_opp")} />,
  };

  const columns: ColumnDef<Party, any>[] = [
    columnHelper.accessor((row: any) => row.date, {
      header: t("date"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor((row: any) => `${row.seats} (${row.seats_perc}%)`, {
      header: t("seats_won"),
      cell: (info: any) => (
        <div className="flex flex-row items-center gap-2">
          <BarMeter perc={info.row.original.seats_perc} />
          <p>{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor("perc", {
      header: t("perc_votes_won"),
      cell: (info: any) => (
        <div className="flex flex-row items-center gap-2">
          <BarMeter perc={info.getValue()} />
          <p>{`${numFormat(info.getValue(), "standard")}%`}</p>
        </div>
      ),
    }),
    columnHelper.accessor("votes", {
      header: t("votes_won"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("result", {
      header: t("result"),
      cell: (info: any) => results[info.getValue()],
    }),
    columnHelper.accessor("result", {
      id: "fullResult",
      header: "",
      cell: (info: any) => (
        <ElectionCard
          label={t("full_result")}
          win={results[info.getValue()]}
          title={"GE-15 Result"}
        >
          <BorderlessTable
            data={fullResultData}
            columns={fullResultColumns}
            highlightedRow={0}
            win={info.getValue() === "formed_gov"}
          />
        </ElectionCard>
      ),
    }),
  ];

  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-10 lg:col-start-2">
          <h4 className="text-center">{t("party.header")}</h4>
          <div className="pb-12 pt-6">
            <div className="flex items-center justify-center">
              <ComboBox
                placeholder={t("party.search_party")}
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
              <Trans>
                <span className="text-lg font-normal leading-9">
                  <Image
                    className="mr-2 inline-flex items-center"
                    src={`/static/images/parties/${data.party.value}.png`}
                    width={28}
                    height={16}
                    alt={PoliticalParty[data.party.value]}
                  />
                  {t("party.title", {
                    party: PoliticalParty[data.party.value],
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
            <Panel name={t("parliament_elections")}>
              <BorderlessTable
                data={dummyData}
                columns={columns}
                empty={
                  <p>
                    {t("candidate.never_compete", {
                      name: data.q_party ? data.q_party.value : null,
                      context: data.tabs === 0 ? "parliament" : "state",
                    })}
                  </p>
                }
              />
            </Panel>
            <Panel name={t("state_elections")}>
              <BorderlessTable
                data={[]}
                columns={columns}
                empty={
                  <p>
                    {t("candidate.never_compete", {
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
