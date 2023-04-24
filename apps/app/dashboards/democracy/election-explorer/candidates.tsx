import { FunctionComponent, ReactNode } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Panel, Section, Tabs } from "@components/index";
import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { OptionType } from "@components/types";
import { Lost, Won } from "@components/Chart/Table/BorderlessTable";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { PoliticalParty } from "@lib/constants";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

/**
 * Election Explorer Dashboard - Candidates Tab
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});

interface ElectionCandidatesProps {}

const ElectionCandidates: FunctionComponent<ElectionCandidatesProps> = ({}) => {
  const { t, i18n } = useTranslation();

  const CANDIDATE_OPTIONS: Array<OptionType> = [
    "Abdul Ghani Bin Ahmad",
    "Abdul Hadi Bin Awang",
    "Abdul Khalib Abdullah",
    "Abdul Latiff Bin Abdul Rahman",
    "Abdul Rahman Bin Mohammad",
    "Anwar Ibrahim",
    "Mahathir Muhammad",
    "Wee Ka Siong",
  ].map((key: string) => ({
    label: key,
    value: key,
  }));

  const { data, setData } = useData({
    popular_searches: ["Wee Ka Siong", "Anwar Ibrahim", "Mahathir Muhammad"],
    test: [],
    tabs: 0,
    candidate: CANDIDATE_OPTIONS[7],

    // query
    q_candidate: "",
  });

  type Candidate = {
    date: string;
    area: string;
    party: string;
    votes: string;
    result: string;
  };

  const dummyData: Candidate[] = [
    {
      date: "23 Jan 2022",
      area: "P148 - Ayer Hitam, Johor",
      party: "mca",
      votes: "18,911 (40.5%)",
      result: "won",
    },
    {
      date: "23 Jan 2018",
      area: "P148 - Ayer Hitam, Johor",
      party: "mca",
      votes: "17,076 (44.0%)",
      result: "won_uncontested",
    },
    {
      date: "23 Jan 2013",
      area: "P148 - Ayer Hitam, Johor",
      party: "mca",
      votes: "22,045 (59.8%)",
      result: "lost",
    },
    {
      date: "23 Jan 2008",
      area: "P148 - Ayer Hitam, Johor",
      party: "mca",
      votes: "20,230 (76.1%)",
      result: "lost_deposit",
    },
    {
      date: "23 Jan 2004",
      area: "P148 - Ayer Hitam, Johor",
      party: "mca",
      votes: "20,065 (82.3%)",
      result: "won",
    },
  ];

  const columnHelper = createColumnHelper<Candidate>();

  const results: { [key: string]: ReactNode } = {
    won: <Won desc={t("candidate.won")} />,
    won_uncontested: <Won desc={t("candidate.won_uncontested")} />,
    lost: <Lost desc={t("candidate.lost")} />,
    lost_deposit: <Lost desc={t("candidate.lost_deposit")} />,
  };

  const columns: ColumnDef<Candidate, any>[] = [
    columnHelper.accessor((row: any) => row.date, {
      header: t("date"),
      cell: (info: any) => <p className="whitespace-nowrap">{info.getValue()}</p>,
    }),
    columnHelper.accessor("area", {
      header: t("constituency"),
      cell: (info: any) => <p className="whitespace-nowrap">{info.getValue()}</p>,
    }),
    columnHelper.accessor("party", {
      header: t("party_name"),
      cell: (info: any) => {
        const party = info.getValue() as string;
        return (
          <div className="flex flex-row items-center gap-1.5 pr-7 lg:pr-0">
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
    columnHelper.accessor("votes", {
      header: t("votes_won"),
      cell: (info: any) => <p className="whitespace-nowrap">{info.getValue()}</p>,
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
          title={
            <div className="flex flex-row gap-2 uppercase">
              <h5>P148 - Ayer Hitam</h5>
              <span className="text-dim font-normal">Johor</span>
            </div>
          }
        >
          <BorderlessTable
            highlightedRow={0}
            win={["won", "won_uncontested"].includes(info.getValue())}
          />
        </ElectionCard>
      ),
    }),
  ];

  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-10 lg:col-start-2">
          <h4 className="text-center">{t("candidate.header")}</h4>
          <div className="pb-12 pt-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <ComboBox
                placeholder={t("candidate.search_candidate")}
                options={CANDIDATE_OPTIONS}
                selected={
                  data.q_candidate
                    ? CANDIDATE_OPTIONS.find(e => e.value === data.q_candidate.value)
                    : null
                }
                onChange={e => {
                  if (e) setData("candidate", e);
                  setData("q_candidate", e);
                }}
              />
              <div className="flex flex-col text-center lg:flex-row">
                <span className="whitespace-pre">{t("popular_searches")}</span>
                <div>
                  <span
                    className="text-primary dark:text-primary-dark font-semibold"
                    onClick={() => {
                      setData(
                        "candidate",
                        CANDIDATE_OPTIONS.find(e => e.value === data.popular_searches[0])
                      );
                      setData(
                        "q_candidate",
                        CANDIDATE_OPTIONS.find(e => e.value === data.popular_searches[0])
                      );
                    }}
                  >
                    {data.popular_searches[0]}
                  </span>
                  <span>, </span>
                  <span
                    className="text-primary dark:text-primary-dark font-semibold"
                    onClick={() => {
                      setData(
                        "candidate",
                        CANDIDATE_OPTIONS.find(e => e.value === data.popular_searches[1])
                      );
                      setData(
                        "q_candidate",
                        CANDIDATE_OPTIONS.find(e => e.value === data.popular_searches[1])
                      );
                    }}
                  >
                    {data.popular_searches[1]}
                  </span>
                  <span>, </span>
                  <span
                    className="text-primary dark:text-primary-dark font-semibold"
                    onClick={() => {
                      setData(
                        "candidate",
                        CANDIDATE_OPTIONS.find(e => e.value === data.popular_searches[2])
                      );
                      setData(
                        "q_candidate",
                        CANDIDATE_OPTIONS.find(e => e.value === data.popular_searches[2])
                      );
                    }}
                  >
                    {data.popular_searches[2]}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Tabs
            title={
              <div className="text-base font-bold">
                {t("candidate.title")}
                <span className="text-primary">{data.candidate.value}</span>
              </div>
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
                      name: data.candidate ? data.candidate.value : "",
                      context: data.tabs === 0 ? "parliament" : "state",
                    })}
                  </p>
                }
              />
            </Panel>
            <Panel name={t("state_elections")}>
              <BorderlessTable
                data={dummyData}
                columns={columns}
                empty={
                  <p>
                    {t("candidate.never_compete", {
                      name: data.candidate ? data.candidate.value : "",
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
