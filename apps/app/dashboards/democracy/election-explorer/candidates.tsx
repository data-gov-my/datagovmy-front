import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import { AgencyBadge, Container, Hero, Panel, Section, Tabs } from "@components/index";
import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { SPRIcon, SPRIconSolid } from "@components/Icon/agency";
import ContainerTabs from "@components/Tabs/ContainerTabs";
import { FlagIcon, MapIcon, UserIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { routes } from "@lib/routes";
import { useRouter } from "next/router";
import type { BaseResult, Candidate, CandidateResult, ElectionResource } from "./types";
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
      key: item => item,
      id: "full_result",
      header: "",
      cell: ({ row, getValue }) => {
        const selection = data.tab_index === 0 ? elections.parlimen : elections.dun;
        const item = getValue() as Candidate;
        const [area, state] = item.seat.split(",");

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
            title={
              <div className="flex w-full justify-between pr-10">
                <div className="flex flex-col uppercase md:flex-row md:gap-2">
                  <h5>{area}</h5>
                  <span className="text-dim text-lg font-normal">{state}</span>
                </div>
                <ResultBadge value={item.result} />
              </div>
            }
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
    if (!name) return;
    setData("loading", true);
    setData("candidate", name);

    push(`${routes.ELECTION_EXPLORER}/candidates/${encodeURIComponent(name)}`, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  const fetchResult = async (election: string, seat: string) => {
    return get("/explorer", {
      explorer: "ELECTIONS",
      chart: "full_result",
      type: "candidates",
      election,
      seat,
    })
      .then(({ data }: { data: CandidateResult }) => {
        return {
          data: data.data.sort((a, b) => b.votes.abs - a.votes.abs),
          votes: [
            {
              x: "voter_turnout",
              y: data.votes.voter_turnout_perc,
            },
            {
              x: "rejected_votes",
              y: data.votes.votes_rejected_perc,
            },
          ],
        };
      })
      .catch(e => {
        console.error(e);
      });
  };

  const CANDIDATE_OPTIONS = selection.map((key: string) => {
    return { label: key, value: key };
  });

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
                onChange={index => setData("tab_index", index)}
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
        </Section>
      </Container>
    </>
  );
};

export default ElectionCandidatesDashboard;
