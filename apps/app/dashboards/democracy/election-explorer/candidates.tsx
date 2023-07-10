import type { BaseResult, Candidate, CandidateResult, ElectionResource } from "./types";
import ElectionCard, { Result } from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { Container, Panel, Section, Tabs } from "@components/index";
import { toast } from "@components/Toast";
import { OptionType } from "@components/types";
import { useCache } from "@hooks/useCache";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { slugify } from "@lib/helpers";
import { routes } from "@lib/routes";
import { generateSchema } from "@lib/schema/election-explorer";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";

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
  const { cache } = useCache();
  const candidate_schema = generateSchema<Candidate>([
    { key: "election_name", id: "election_name", header: t("election_name") },
    { key: "seat", id: "seat", header: t("constituency") },
    { key: "party", id: "party", header: t("party_name") },
    { key: "votes", id: "votes", header: t("votes_won") },
    { key: "result", id: "result", header: t("result") },
    {
      key: item => item,
      id: "full_result",
      header: "",
      cell: ({ row, getValue }) => {
        const selection = data.tab_index === 0 ? elections.parlimen : elections.dun;
        const item = getValue() as Candidate;

        return (
          <ElectionCard
            defaultParams={item}
            onChange={(option: Candidate) => fetchResult(option.election_name, option.seat)}
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
            highlighted={params.candidate_name}
            options={selection}
            page={row.index}
          />
        );
      },
    },
  ]);

  const { data, setData } = useData({
    tab_index: 0, // parlimen = 0; dun = 1
    candidate: params.candidate_name,
    loading: false,
  });

  const navigateToCandidate = (name?: string) => {
    if (!name) {
      setData("candidate", null);
      return;
    }
    setData("loading", true);
    setData("candidate", name);

    push(`${routes.ELECTION_EXPLORER}/candidates/${name}`, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => {
      setData("loading", false);
      cache.clear();
    });
  };

  const fetchResult = async (election: string, seat: string): Promise<Result<BaseResult[]>> => {
    const identifier = `${election}_${seat}`;
    return new Promise(resolve => {
      if (cache.has(identifier)) return resolve(cache.get(identifier));
      get("/explorer", {
        explorer: "ELECTIONS",
        chart: "full_result",
        type: "candidates",
        election,
        seat,
      })
        .then(({ data }: { data: { data: CandidateResult } }) => {
          const data2 = data.data;
          const result: Result<BaseResult[]> = {
            data: data2.data.sort((a, b) => b.votes.abs - a.votes.abs),
            votes: [
              {
                x: "majority",
                abs: data2.votes.majority,
                perc: data2.votes.majority_perc,
              },
              {
                x: "voter_turnout",
                abs: data2.votes.voter_turnout,
                perc: data2.votes.voter_turnout_perc,
              },
              {
                x: "rejected_votes",
                abs: data2.votes.votes_rejected,
                perc: data2.votes.votes_rejected_perc,
              },
            ],
          };
          cache.set(identifier, result);
          resolve(result);
        })
        .catch(e => {
          toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
          console.error(e);
        });
    });
  };

  const CANDIDATE_OPTIONS: Array<OptionType> = selection.map((key: string) => {
    return { label: key, value: slugify(key) };
  });

  return (
    <Container className="min-h-fit">
      <Section>
        <div className="xl:grid xl:grid-cols-12">
          <div className="xl:col-span-10 xl:col-start-2">
            <h4 className="text-center">{t("candidate.header")}</h4>
            <div className="mx-auto w-full p-6 sm:w-[500px]">
              <ComboBox
                placeholder={t("candidate.search_candidate")}
                options={CANDIDATE_OPTIONS}
                selected={
                  data.candidate ? CANDIDATE_OPTIONS.find(e => e.value === data.candidate) : null
                }
                onChange={selected => navigateToCandidate(selected?.value)}
              />
            </div>
            <Tabs
              title={
                <h5>
                  {t("candidate.title")}
                  <span className="text-primary">
                    {CANDIDATE_OPTIONS.find(e => e.value === params.candidate_name)?.label}
                  </span>
                </h5>
              }
              current={data.tab_index}
              onChange={index => setData("tab_index", index)}
              className="py-6"
            >
              <Panel name={t("parlimen")}>
                <ElectionTable
                  data={elections.parlimen}
                  columns={candidate_schema}
                  isLoading={data.loading}
                  empty={
                    <>
                      {t("candidate.no_data", {
                        name: CANDIDATE_OPTIONS.find(e => e.value === params.candidate_name)?.label,
                        context: "parliament",
                      })}
                    </>
                  }
                />
              </Panel>
              <Panel name={t("dun")}>
                <ElectionTable
                  data={elections.dun}
                  columns={candidate_schema}
                  isLoading={data.loading}
                  empty={
                    <>
                      {t("candidate.no_data", {
                        name: CANDIDATE_OPTIONS.find(e => e.value === params.candidate_name)?.label,
                        context: "dun",
                      })}
                    </>
                  }
                />
              </Panel>
            </Tabs>
          </div>
        </div>
      </Section>
    </Container>
  );
};

export default ElectionCandidatesDashboard;
