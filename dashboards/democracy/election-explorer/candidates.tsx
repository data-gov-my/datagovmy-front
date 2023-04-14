import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Section } from "@components/index";
import Card from "@components/Card";
import ComboBox from "@components/Combobox";
import { OptionType } from "@components/types";
import { Lost, Won } from "@components/Chart/Table/BorderlessTable";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { PoliticalParty } from "@lib/constants";

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
  ].map((key: string) => ({
    label: key,
    value: key,
  }));

  const { data, setData } = useData({
    popular_searches: ["Wee Ka Siong", "Anwar Ibrahim", "Mahathir Muhammad"],
    test: [],
    tabs: 0,
    candidate: "",

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
  const emptyData: Candidate[] = [];
  const dummyData: Candidate[] = [
    {
      date: "23 Jan 2022",
      area: "P148 - Ayer Hitam, Johor",
      party: "MCA",
      votes: "18,911 (40.5%)",
      result: "won",
    },
    {
      date: "23 Jan 2018",
      area: "P148 - Ayer Hitam, Johor",
      party: "MCA",
      votes: "17,076 (44.0%)",
      result: "won",
    },
    {
      date: "23 Jan 2013",
      area: "P148 - Ayer Hitam, Johor",
      party: "MCA",
      votes: "22,045 (59.8%)",
      result: "won",
    },
    {
      date: "23 Jan 2008",
      area: "P148 - Ayer Hitam, Johor",
      party: "MCA",
      votes: "20,230 (76.1%)",
      result: "won",
    },
    {
      date: "23 Jan 2004",
      area: "P148 - Ayer Hitam, Johor",
      party: "MCA",
      votes: "20,065 (82.3%)",
      result: "won",
    },
  ];

  const columnHelper = createColumnHelper<Candidate>();

  const columns: ColumnDef<Candidate, any>[] = [
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("area", {
      header: "Constituency",
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor((row: any) => row.party, {
      header: "Party",
      cell: (info: any) => {
        const party = info.getValue() as string;
        return (
          <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-3">
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
    }),
    columnHelper.accessor("votes", {
      header: "Votes won",
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("result", {
      header: "Result",
      cell: (info: any) =>
        info.getValue() === "won" ? (
          <Won desc={t("dashboard-election-explorer:candidate.won")} />
        ) : (
          <Lost desc={t("dashboard-election-explorer:candidate.lost")} />
        ),
    }),
    columnHelper.accessor("result", {
      header: "",
      cell: () => (
        <button className="flex flex-col items-center gap-1 lg:flex-row lg:gap-3">
          <ArrowsPointingOutIcon className="h-4 w-4 text-black dark:text-white" />
          <p>{t("dashboard-election-explorer:full_result")}</p>
        </button>
      ),
    }),
  ];

  return (
    <Section>
      <div className="grid grid-cols-12">
        <div className="col-span-10 col-start-2">
          <h4 className="py-4 text-center">{t("dashboard-election-explorer:candidate.header")}</h4>
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <ComboBox
              placeholder={t("dashboard-election-explorer:candidate.search_candidate")}
              options={CANDIDATE_OPTIONS}
              selected={
                data.candidate
                  ? CANDIDATE_OPTIONS.find(e => e.value === data.candidate.value)
                  : data.q_candidate
              }
              onChange={e => {
                if (e) setData("candidate", e);
                else {
                  setData("q_candidate", e);
                  setData("candidate", "");
                }
              }}
            />
            <div className="flex flex-col text-center lg:flex-row">
              <span>{t("dashboard-election-explorer:popular_searches")}</span>
              <span>
                <span className="font-semibold text-primary dark:text-primary-dark">
                  {data.popular_searches[0]}
                </span>
                <span>, </span>
                <span className="font-semibold text-primary dark:text-primary-dark">
                  {data.popular_searches[1]}
                </span>
                <span>, </span>
                <span className="font-semibold text-primary dark:text-primary-dark">
                  {data.popular_searches[2]}
                </span>
              </span>
            </div>
          </div>
          <BorderlessTable data={dummyData} columns={columns} />
          <div>
            {emptyData && (
              <Card className="flex h-[200px] items-center justify-center">
                <Card className="mx-auto flex h-min w-fit flex-row gap-2 self-center rounded-md bg-outline py-1.5 px-3 dark:bg-washed-dark">
                  <FaceFrownIcon className="mx-auto mt-1 h-4 w-4 text-black dark:text-white" />
                  <p>
                    {t("dashboard-election-explorer:candidate.never_compete", {
                      name: data.candidate ? data.candidate.value : "",
                      context: data.tabs === 0 ? "parliament" : "state",
                    })}
                  </p>
                </Card>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default ElectionCandidates;
