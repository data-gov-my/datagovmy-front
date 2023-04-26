import { FunctionComponent, ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";
import { Panel, Section, Tabs } from "@components/index";
import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import ImageWithFallback from "@components/ImageWithFallback";
import { BarMeter, Lost, Result, Won } from "@components/Chart/Table/BorderlessTable";
import { OptionType } from "@components/types";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { useWatch } from "@hooks/useWatch";
import { get } from "@lib/api";
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
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);

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
    won: <Won desc={t("candidate.won")} />,
    won_uncontested: <Won desc={t("candidate.won_uncontested")} />,
    lost: <Lost desc={t("candidate.lost")} />,
    lost_deposit: <Lost desc={t("candidate.lost_deposit")} />,
  };

  const columns: ColumnDef<Candidate, any>[] = [
    columnHelper.accessor("election_name", {
      id: "election_name",
      header: t("election_name"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor((row: any) => row.date, {
      id: "date",
      header: t("date"),
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
      header: t("constituency"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("party", {
      id: "party",
      header: t("party_name"),
      cell: (info: any) => {
        const party = info.getValue() as string;
        return (
          <div className="flex flex-row items-center gap-2 pr-7 xl:pr-0">
            <ImageWithFallback
              src={`/static/images/parties/${party}.png`}
              width={28}
              height={16}
              alt={t(`${party}`)}
            />
            <span>{t(`${party}`)}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("votes", {
      id: "votes",
      header: t("votes_won"),
      cell: (info: any) => {
        const votes = info.getValue();
        return (
          <div className="flex flex-row items-center gap-2">
            <BarMeter perc={votes.perc} />
            <p>{`${votes.abs === 0 ? "—" : numFormat(votes.abs, "standard")} ${
              votes.perc !== null ? `(${+votes.perc.toFixed(1)}%)` : ""
            }`}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("result", {
      id: "result",
      header: t("result"),
      cell: (info: any) => results[info.getValue()],
    }),
    columnHelper.display({
      id: "fullResult",
      header: "",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <button
              className="flex flex-row items-center gap-1.5 px-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              onClick={() => {
                setData("open", true);
                setData("index", row.index);
              }}
            >
              <ArrowsPointingOutIcon className="h-4 w-4 text-black dark:text-white" />
              <p>{t("full_result")}</p>
            </button>
          </div>
        );
      },
    }),
  ];

  const { data, setData } = useData({
    data: candidate,
    candidate_list: [],
    tabs: 0,
    index: 0,
    open: false,
    result: [],
    // placeholder
    p_candidate: "",

    // query
    q_candidate: "Tunku Abdul Rahman Putra Al-Haj",
    loading: false,
    modalLoading: false,
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
      name: data.q_candidate,
      type: data.tabs === 0 ? "parlimen" : "dun",
    })
      .then(({ data }) => {
        setData("data", data.reverse());
      })
      .then(() => setData("loading", false));
  }, [data.q_candidate, data.tabs]);

  useWatch(() => {
    setData("modalLoading", true);
    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "full_result",
      type: "candidates",
      election: data.data[data.index].election_name,
      seat: data.data[data.index].seat,
    })
      .then(({ data }) => {
        setData("result", data);
      })
      .then(() => setData("modalLoading", false));
  }, [data.index, data.open]);

  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-10 lg:col-start-2">
          <h4 className="text-center">{t("candidate.header")}</h4>
          <div className="grid grid-cols-12 pb-12 pt-6 lg:grid-cols-10">
            <div className="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-4">
              <ComboBox
                placeholder={t("candidate.search_candidate")}
                options={CANDIDATE_OPTIONS}
                selected={
                  data.p_candidate
                    ? CANDIDATE_OPTIONS.find(e => e.value === data.p_candidate.value)
                    : null
                }
                onChange={e => {
                  if (e) setData("q_candidate", e.value);
                  setData("p_candidate", e);
                }}
              />
            </div>
          </div>
          <Tabs
            title={
              <div className="text-base font-bold">
                {t("candidate.title")}
                <span className="text-primary">{data.q_candidate}</span>
              </div>
            }
            current={data.tabs}
            onChange={index => setData("tabs", index)}
          >
            <Panel name={t("parliament_elections")}>
              <BorderlessTable
                data={data.data}
                columns={columns}
                isLoading={data.loading}
                empty={
                  <p>
                    {t("candidate.no_data", {
                      name: data.q_candidate,
                      context: "parliament",
                    })}
                  </p>
                }
              />
            </Panel>
            <Panel name={t("state_elections")}>
              <BorderlessTable
                data={data.data}
                columns={columns}
                isLoading={data.loading}
                empty={
                  <p>
                    {t("candidate.no_data", {
                      name: data.q_candidate,
                      context: "dun",
                    })}
                  </p>
                }
              />
            </Panel>
          </Tabs>
        </div>
      </div>
      {data.open && (
        <ElectionCard
          open={data.open}
          onClose={() => setData("open", false)}
          onNext={() => (data.index === data.data.length ? null : setData("index", data.index + 1))}
          onPrev={() => (data.index === 0 ? null : setData("index", data.index - 1))}
          win={data.data[data.index].result === "won"}
          election_name={data.data[data.index].election_name}
          date={DateTime.fromISO(data.data[data.index].date)
            .setLocale(i18n.language)
            .toLocaleString(DateTime.DATE_MED)}
          title={
            <div className="flex flex-row gap-2 uppercase">
              <h5>{data.data[data.index].seat.split(",")[0]}</h5>
              <span className="text-dim font-normal">
                {data.data[data.index].seat.split(",")[1]}
              </span>
              <span className="ml-4">{results[data.data[data.index].result]}</span>
            </div>
          }
          isLoading={data.modalLoading}
          data={data.result}
          highlightedRow={data.result.findIndex((r: Result) => r.name === data.q_candidate)}
          page={data.index}
          total={data.data.length}
        />
      )}
    </Section>
  );
};

export default ElectionCandidates;
