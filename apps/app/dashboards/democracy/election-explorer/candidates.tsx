import { FunctionComponent, ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Panel, Section, Tabs } from "@components/index";
import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { OptionType } from "@components/types";
import { BarMeter, Lost, Won } from "@components/Chart/Table/BorderlessTable";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { useWatch } from "@hooks/useWatch";
import { get } from "@lib/api";
import { PoliticalParty } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import { DateTime } from "luxon";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

/**
 * Election Explorer Dashboard - Candidates Tab
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});

interface ElectionCandidatesProps {
  candidate: any;
}

const ElectionCandidates: FunctionComponent<ElectionCandidatesProps> = ({ candidate }) => {
  const { t, i18n } = useTranslation();

  type Candidate = {
    election_name: string;
    date: string;
    seat: string;
    party: string;
    votes: Record<string, number>;
    result: string;
  };

  const columnHelper = createColumnHelper<Candidate>();

  const results: { [key: string]: ReactNode } = {
    won: <Won desc={t("dashboard-election-explorer:candidate.won")} />,
    won_uncontested: <Won desc={t("dashboard-election-explorer:candidate.won_uncontested")} />,
    lost: <Lost desc={t("dashboard-election-explorer:candidate.lost")} />,
    lost_deposit: <Lost desc={t("dashboard-election-explorer:candidate.lost_deposit")} />,
  };

  const columns: ColumnDef<Candidate, any>[] = [
    columnHelper.accessor("election_name", {
      id: "election_name",
      header: t("dashboard-election-explorer:election_name"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor((row: any) => row.date, {
      id: "date",
      header: t("dashboard-election-explorer:date"),
      cell: (info: any) => (
        <p>
          {DateTime.fromISO(info.getValue())
            .setLocale(i18n.language)
            .toLocaleString(DateTime.DATE_MED)}
        </p>
      ),
    }),
    columnHelper.accessor("seat", {
      id: "seat",
      header: t("dashboard-election-explorer:constituency"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("party", {
      id: "party",
      header: t("dashboard-election-explorer:party_name"),
      cell: (info: any) => {
        const party = info.getValue().toLowerCase() as string;
        return (
          <div className="flex flex-row items-center gap-1.5 pr-7 xl:pr-0">
            <Image
              src={`/static/images/parties/${party}.png`}
              width={28}
              height={16}
              alt={PoliticalParty[party]}
            />
            <span>{PoliticalParty[party] ? PoliticalParty[party] : party}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("votes", {
      id: "votes",
      header: t("dashboard-election-explorer:votes_won"),
      cell: (info: any) => {
        const votes = info.getValue();
        return (
          <div className="flex flex-row items-center gap-2">
            <BarMeter perc={votes.perc} />
            <p>{`${votes.abs === 0 ? "—" : numFormat(votes.abs, "standard")} ${
              votes.perc !== null ? "(" + numFormat(votes.perc, "standard", 1).concat("%)") : ""
            }`}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("result", {
      id: "result",
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
          title={
            <div className="flex flex-row gap-2 uppercase">
              <h5>P148 - Ayer Hitam</h5>
              <span className="text-dim font-normal">Johor</span>
            </div>
          }
        />
      ),
    }),
  ];

  const { data, setData } = useData({
    data: {},
    candidate_list: [],
    tabs: 0,
    // placeholder in combobox
    p_candidate: "",

    // query
    candidate: "Tunku Abdul Rahman Putra Al-Haj",
    loading: false,
  });

  const CANDIDATE_OPTIONS: Array<OptionType> =
    data.candidate_list &&
    data.candidate_list.map((key: string) => ({
      label: key,
      value: key,
    }));

  useEffect(() => {
    get("/explorer", {
      explorer: "ELECTIONS",
      dropdown: "candidate_list",
    }).then(({ data }) => {
      setData("candidate_list", data);
    });
  }, []);

  useWatch(() => {
    setData("loading", true);
    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "candidates",
      name: data.candidate,
      type: data.tabs === 0 ? "parlimen" : "dun",
    })
      .then(({ data }) => {
        setData("data", data.reverse());
      })
      .then(() => setData("loading", false));
  }, [data.candidate, data.tabs]);

  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-10 lg:col-start-2">
          <h4 className="text-center">{t("dashboard-election-explorer:candidate.header")}</h4>
          <div className="pb-12 pt-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <ComboBox
                placeholder={t("dashboard-election-explorer:candidate.search_candidate")}
                options={CANDIDATE_OPTIONS}
                selected={
                  data.p_candidate
                    ? CANDIDATE_OPTIONS.find(e => e.value === data.p_candidate.value)
                    : null
                }
                onChange={e => {
                  if (e) setData("candidate", e.value);
                  setData("p_candidate", e);
                }}
              />
            </div>
          </div>
          <Tabs
            title={
              <div className="text-base font-bold">
                {t("dashboard-election-explorer:candidate.title")}
                <span className="text-primary">{data.candidate}</span>
              </div>
            }
            current={data.tabs}
            onChange={index => setData("tabs", index)}
          >
            <Panel name={t("dashboard-election-explorer:parliament_elections")}>
              <BorderlessTable
                data={data.data}
                columns={columns}
                isLoading={data.loading}
                empty={
                  <p>
                    {t("dashboard-election-explorer:candidate.never_compete", {
                      name: data.candidate ? data.candidate : "",
                      context: data.tabs === 0 ? "parliament" : "state",
                    })}
                  </p>
                }
              />
            </Panel>
            <Panel name={t("dashboard-election-explorer:state_elections")}>
              <BorderlessTable
                data={data.data}
                columns={columns}
                isLoading={data.loading}
                empty={
                  <p>
                    {t("dashboard-election-explorer:candidate.never_compete", {
                      name: data.candidate ? data.candidate : "",
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

export default ElectionCandidates;
