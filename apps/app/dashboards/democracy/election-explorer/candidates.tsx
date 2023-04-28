import { FunctionComponent, ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";
import { AgencyBadge, Container, Hero, Panel, Section, Tabs } from "@components/index";
import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { SPRIcon, SPRIconSolid } from "@components/Icon/agency";
import ImageWithFallback from "@components/ImageWithFallback";
import { BarMeter, FullResult, Lost, Result, Won } from "@components/Chart/Table/BorderlessTable";
import ContainerTabs from "@components/Tabs/ContainerTabs";
import { OptionType } from "@components/types";
import { FlagIcon, MapIcon, UserIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { useWatch } from "@hooks/useWatch";
import { get } from "@lib/api";
import { numFormat } from "@lib/helpers";
import { routes } from "@lib/routes";
import { DateTime } from "luxon";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useFilter } from "@hooks/useFilter";

/**
 * Election Explorer Dashboard - Candidates Tab
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});

interface ElectionCandidatesProps {
  candidate: any;
  query: any;
}

const ElectionCandidatesDashboard: FunctionComponent<ElectionCandidatesProps> = ({
  candidate,
  query,
}) => {
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
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("seat", {
      id: "seat",
      header: t("constituency"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("party", {
      id: "party",
      header: t("party_name"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("votes", {
      id: "votes",
      header: t("votes_won"),
      cell: (info: any) => info.getValue(),
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
          <FullResult
            desc={t("full_result")}
            onClick={() => {
              setData("open", true);
              setData("index", row.index);
            }}
          />
        );
      },
    }),
  ];

  const { data, setData } = useData({
    tabs: 0,
    // Placeholder for Combobox
    p_candidate: "",
    candidate_list: [],

    // Query for Table
    q_candidate: query.name ? query.name : "Tunku Abdul Rahman Putra Al-Haj",
    type: query.type ? query.type : "parlimen",
    loading: false,
    data: candidate,

    // Election full result
    modalLoading: false,
    open: false,
    result: [],
    index: 0,
  });

  const { filter, setFilter } = useFilter({
    name: query.name,
    type: query.type,
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
    setFilter("name", data.q_candidate);
    setFilter("type", data.type);
    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "candidates",
      name: data.q_candidate,
      type: data.type,
    })
      .then(({ data }) => {
        setData(
          "data",
          data.sort(
            (a: Candidate, b: Candidate) => Number(new Date(b.date)) - Number(new Date(a.date))
          )
        );
      })
      .then(() => setData("loading", false));
  }, [data.q_candidate, data.type]);

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
        setData(
          "result",
          data.sort((a: Result, b: Result) => b.votes.abs - a.votes.abs)
        );
      })
      .then(() => setData("modalLoading", false));
  }, [data.index, data.open]);

  return (
    <>
      <Hero
        background="red"
        category={[t("common:nav.megamenu.categories.democracy"), "text-danger"]}
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
              url: routes.ELECTION_EXPLORER,
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
                onChange={index => {
                  setData("tabs", index);
                  setData("type", index === 0 ? "parlimen" : "dun");
                }}
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
              onChange={(index: number) =>
                index < data.data.length && index >= 0 ? setData("index", index) : null
              }
              onClose={() => setData("open", false)}
              onNext={() =>
                data.index === data.data.length ? null : setData("index", data.index + 1)
              }
              onPrev={() => (data.index === 0 ? null : setData("index", data.index - 1))}
              win={data.data[data.index].result}
              election_name={data.data[data.index].election_name}
              date={DateTime.fromISO(data.data[data.index].date)
                .setLocale(i18n.language)
                .toLocaleString(DateTime.DATE_MED)}
              title={
                <div className="flex flex-col uppercase lg:flex-row lg:gap-2">
                  <h5>{data.data[data.index].seat.split(",")[0]}</h5>
                  <span className="text-dim font-normal">
                    {data.data[data.index].seat.split(",")[1]}
                  </span>
                  <span>{results[data.data[data.index].result]}</span>
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
      </Container>
    </>
  );
};

export default ElectionCandidatesDashboard;
