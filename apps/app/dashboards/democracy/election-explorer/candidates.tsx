import { FunctionComponent, useMemo } from "react";
import dynamic from "next/dynamic";
import { AgencyBadge, Container, Hero, Panel, Section, Tabs } from "@components/index";
import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { SPRIcon, SPRIconSolid } from "@components/Icon/agency";
import { FullResult, Result } from "@components/Chart/Table/ElectionTable";
import ContainerTabs from "@components/Tabs/ContainerTabs";
import { FlagIcon, MapIcon, UserIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { routes } from "@lib/routes";
import { DateTime } from "luxon";
import { useRouter } from "next/router";
import type { BaseResult, Candidate, ElectionResource, ElectionResult } from "./types";
import { generateSchema } from "@lib/schema/election-explorer";
import { ResultBadge } from "@components/Badge/election";

/**
 * Election Explorer Dashboard - Candidates Tab
 * @overview Status: In-development
 */

const ElectionTable = dynamic(() => import("@components/Chart/Table/ElectionTable"), {
  ssr: false,
});

interface ElectionCandidatesProps extends ElectionResource<Candidate> {
  selection: string[];
}

const ElectionCandidatesDashboard: FunctionComponent<ElectionCandidatesProps> = ({
  elections,
  selection,
  params,
}) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);
  const { push } = useRouter();
  const candidate_schema = generateSchema<Candidate>([
    { key: "election_name", id: "election_name", header: t("election_name") },
    { key: "seat", id: "seat", header: t("constituency") },
    { key: "party", id: "party", header: t("party_name") },
    { key: "votes", id: "votes", header: t("votes_won") },
    { key: "result", id: "result", header: t("result") },
    {
      key: "fullResult" as any,
      id: "fullResult",
      header: "",
      cell: ({ row }) => {
        return (
          <FullResult
            desc={t("full_result")}
            onClick={() => {
              setData("table_index", row.index);
              fetchResult(row.index);
            }}
          />
        );
      },
    },
  ]);

  const { data, setData } = useData({
    candidate: params.candidate_name,
    loading: false,

    modal_loading: false,
    modal_open: false,
    full_results: [],
    tab_index: 0, // parlimen = 0; dun = 1
    table_index: 0,
  });

  const navigateToCandidate = (name?: string) => {
    if (!name) return;
    setData("loading", true);
    setData("candidate", name);

    push(`${routes.ELECTION_EXPLORER}/candidates/${encodeURIComponent(name)}`, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  const fetchResult = (rowIndex: number) => {
    setData("modal_open", true);
    setData("modal_loading", true);

    const type = data.tab_index === 0 ? "parlimen" : "dun";

    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "full_result",
      type: "candidates",
      election: elections[type][rowIndex].election_name,
      seat: elections[type][rowIndex].seat,
    })
      .then(({ data }) => {
        setData(
          "full_results",
          data.data.sort((a: Result, b: Result) => b.votes.abs - a.votes.abs)
        );
        setData("modal_loading", false);
      })
      .catch(e => {
        console.error(e);
      });
  };

  const CANDIDATE_OPTIONS = selection.map((key: string) => {
    return { label: key, value: key };
  });

  const election_result = useMemo<{
    name: string;
    result: ElectionResult | undefined;
    area: string;
    state: string;
    date: string;
    total: number;
  }>(() => {
    const election = data.tab_index === 0 ? elections.parlimen : elections.dun;
    if (election.length <= 0)
      return {
        name: "",
        result: undefined,
        area: "",
        state: "",
        date: "",
        total: 0,
      };
    const [area, state] = election[data.table_index].seat.split(",");
    return {
      name: election[data.table_index].election_name,
      result: election[data.table_index].result,
      area: area,
      state: state,
      date: DateTime.fromISO(election[data.table_index].date)
        .setLocale(i18n.language)
        .toLocaleString(DateTime.DATE_MED),
      total: election.length,
    };
  }, [data.tab_index, data.table_index]);

  return (
    <>
      <Hero
        background="red"
        category={[t("common:categories.democracy"), "text-danger"]}
        header={[t("header")]}
        description={[t("description")]}
        agencyBadge={
          <AgencyBadge
            agency={"Election Comission (EC)"}
            link="https://www.spr.gov.my/"
            icon={<SPRIcon />}
          />
        }
      />

      <Container className="min-h-fit">
        <ContainerTabs.List
          options={[
            {
              name: t("elections"),
              icon: <SPRIconSolid className="-mb-1" />,
              url: routes.ELECTION_EXPLORER.concat("/elections"),
            },
            {
              name: t("candidates"),
              icon: <UserIcon className="m-1 h-5 w-5" />,
            },
            {
              name: t("parties"),
              icon: <FlagIcon className="m-1 h-5 w-5" />,
              url: routes.ELECTION_EXPLORER.concat("/parties"),
            },
            {
              name: t("seats"),
              icon: <MapIcon className="m-1 h-5 w-5" />,
              url: routes.ELECTION_EXPLORER.concat("/seats"),
            },
          ]}
          current={1}
        />
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
                      data.candidate
                        ? CANDIDATE_OPTIONS.find(e => e.value === data.candidate)
                        : null
                    }
                    onChange={selected => navigateToCandidate(selected?.value)}
                  />
                </div>
              </div>
              <Tabs
                title={
                  <div className="text-base font-bold">
                    {t("candidate.title")}
                    <span className="text-primary">{data.candidate}</span>
                  </div>
                }
                current={data.tab_index}
                onChange={index => {
                  setData("tab_index", index);
                }}
                className="pb-6"
              >
                <Panel name={t("parliament_elections")}>
                  <ElectionTable
                    data={elections.parlimen}
                    columns={candidate_schema}
                    isLoading={data.loading}
                    empty={
                      <p>
                        {t("candidate.no_data", {
                          name: data.candidate,
                          context: "parliament",
                        })}
                      </p>
                    }
                  />
                </Panel>
                <Panel name={t("state_elections")}>
                  <ElectionTable
                    data={elections.dun}
                    columns={candidate_schema}
                    isLoading={data.loading}
                    empty={
                      <p>
                        {t("candidate.no_data", {
                          name: data.candidate,
                          context: "dun",
                        })}
                      </p>
                    }
                  />
                </Panel>
              </Tabs>
            </div>
          </div>
          {data.modal_open && (
            <ElectionCard
              open={data.modal_open}
              onClose={() => setData("modal_open", false)}
              onChange={(index: number) => {
                setData("table_index", index);
                fetchResult(index);
              }}
              onNext={() => {
                setData("table_index", data.table_index + 1);
                fetchResult(data.table_index + 1);
              }}
              onPrev={() => {
                setData("table_index", data.table_index - 1);
                fetchResult(data.table_index - 1);
              }}
              win={election_result.result}
              election_name={election_result.name}
              columns={generateSchema<BaseResult>([
                {
                  key: "name",
                  id: "name",
                  header: t("candidate_name"),
                },
                {
                  key: "party",
                  id: "party",
                  header: t("party_name"),
                },
                {
                  key: "votes",
                  id: "votes",
                  header: t("votes_won"),
                },
              ])}
              date={election_result.date}
              title={
                <div className="flex w-full justify-between pr-10">
                  <div className="flex flex-col uppercase md:flex-row md:gap-2">
                    <h5>{election_result.area}</h5>
                    <span className="text-dim text-lg font-normal">{election_result.state}</span>
                  </div>
                  <ResultBadge value={election_result.result} />
                </div>
              }
              isLoading={data.modal_loading}
              data={data.full_results}
              highlightedRow={data.full_results.findIndex((r: Result) => r.name === data.candidate)}
              page={data.table_index}
              total={election_result.total}
            />
          )}
        </Section>
      </Container>
    </>
  );
};

export default ElectionCandidatesDashboard;
