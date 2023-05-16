import { FunctionComponent, useMemo } from "react";
import dynamic from "next/dynamic";
import { Trans } from "next-i18next";
import { BarMeter, FullResult } from "@components/Chart/Table/ElectionTable";
import ElectionCard, { getElectionTrans } from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import ImageWithFallback from "@components/ImageWithFallback";
import {
  AgencyBadge,
  Container,
  Hero,
  Panel,
  Section,
  StateDropdown,
  Tabs,
} from "@components/index";
import { OptionType } from "@components/types";
import { FlagIcon, MapIcon, UserIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { CountryAndStates } from "@lib/constants";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { get } from "@lib/api";
import { DateTime } from "luxon";
import { routes } from "@lib/routes";
import { SPRIcon, SPRIconSolid } from "@components/Icon/agency";
import ContainerTabs from "@components/Tabs/ContainerTabs";
import { numFormat } from "@lib/helpers";
import { useRouter } from "next/router";
import type { ElectionResource, Party } from "./types";

/**
 * Election Explorer Dashboard - Political Parties Tab
 * @overview Status: In-development
 */

const ElectionTable = dynamic(() => import("@components/Chart/Table/ElectionTable"), {
  ssr: false,
});

interface ElectionPartiesProps extends ElectionResource<Party> {
  selection: string[];
}

const ElectionPartiesDashboard: FunctionComponent<ElectionPartiesProps> = ({
  params,
  selection,
  elections,
}) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);
  const { push } = useRouter();

  const { data, setData } = useData({
    tab_index: 0,
    table_index: 0,

    // params for Table
    party: params.party_name,
    state: params.state,

    loading: false,

    // Election full result
    modal_loading: false,
    modal_open: false,
    full_results: [],
  });

  const columnHelper = createColumnHelper<Party>();
  const columns: ColumnDef<Party, any>[] = [
    columnHelper.accessor("election_name", {
      id: "election_name",
      header: t("election_name"),
      cell: (info: any) => {
        const [e, num] = getElectionTrans(info.getValue());
        return num ? t(e).concat("-" + num) : t(e);
      },
    }),
    columnHelper.accessor("seats", {
      id: "seats",
      header: t("seats_won"),
      cell: (info: any) => {
        const seats = info.getValue();
        return (
          <div className="flex items-center gap-2 md:flex-col md:items-start lg:flex-row lg:items-center">
            <div>
              <BarMeter perc={seats.perc} />
            </div>
            <p className="whitespace-nowrap">{`${
              seats.won === 0 ? "0" : seats.won + "/" + seats.total
            } ${seats.perc === 0 ? "(—)" : `(${numFormat(seats.perc, "compact", [1, 1])}%)`}`}</p>
          </div>
        );
      },
    }),
    columnHelper.accessor("votes", {
      id: "votes",
      header: t("votes_won"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.display({
      id: "fullResult",
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
    }),
  ];

  const resultsColumnHelper = createColumnHelper<Party>();
  const resultsColumns: ColumnDef<Party, any>[] = [
    resultsColumnHelper.accessor("party", {
      id: "party",
      header: t("party_name"),
      cell: (info: any) => info.getValue(),
    }),
    resultsColumnHelper.accessor("seats", {
      id: "seats",
      header: () => {
        const election = elections.parlimen;
        return data.table_index !== undefined
          ? t("seats_won").concat(` / ${election[data.table_index].seats.total}`)
          : t("seats_won");
      },
      cell: (info: any) => {
        const seats = info.getValue();
        return (
          <div className="flex items-center gap-2 md:flex-col md:items-start lg:flex-row lg:items-center">
            <div>
              <BarMeter perc={seats.perc} />
            </div>
            <p>{`${seats.won === 0 ? "0" : seats.won} ${
              seats.perc === 0 ? "(—)" : `(${numFormat(seats.perc, "compact", [1, 1])}%)`
            }`}</p>
          </div>
        );
      },
    }),
    resultsColumnHelper.accessor("votes", {
      id: "votes",
      header: t("votes_won"),
      cell: (info: any) => info.getValue(),
    }),
  ];

  const PARTY_OPTIONS: Array<OptionType> = selection.map(option => ({
    label: t(`${option}`),
    value: option,
  }));

  const navigateToParty = (name?: string, state?: string) => {
    if (!name) return;
    setData("loading", true);
    setData("party", name);

    const route = state
      ? `${routes.ELECTION_EXPLORER}/parties/${encodeURIComponent(name)}/${state}`
      : `${routes.ELECTION_EXPLORER}/parties/${encodeURIComponent(name)}`;

    push(route, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  const fetchResult = (rowIndex: number) => {
    setData("modal_open", true);
    setData("modal_loading", true);

    const election = data.tab_index === 0 ? elections.parlimen : elections.dun;

    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "full_result",
      type: "party",
      election: election[rowIndex].election_name,
      state: data.state,
    })
      .then(({ data }) => {
        setData(
          "full_results",
          data.sort((a: Party, b: Party) => b.votes.abs - a.votes.abs)
        );
        setData("modal_loading", false);
      })
      .catch(e => {
        console.error(e);
      });
  };

  const election_result = useMemo<{
    name: string;
    date: string;
    total: number;
  }>(() => {
    const election = data.tab_index === 0 ? elections.parlimen : elections.dun;
    if (election.length <= 0)
      return {
        name: "",
        result: "",
        area: "",
        state: "",
        date: "",
        total: 0,
      };
    return {
      name: election[data.table_index].election_name,
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
              url: routes.ELECTION_EXPLORER,
            },
            {
              name: t("candidates"),
              icon: <UserIcon className="m-1 h-5 w-5" />,
              url: routes.ELECTION_EXPLORER.concat("/candidates"),
            },
            {
              name: t("parties"),
              icon: <FlagIcon className="m-1 h-5 w-5" />,
            },
            {
              name: t("seats"),
              icon: <MapIcon className="m-1 h-5 w-5" />,
              url: routes.ELECTION_EXPLORER.concat("/seats"),
            },
          ]}
          current={2}
        />
        <Section>
          <div className="lg:grid lg:grid-cols-12">
            <div className="lg:col-span-10 lg:col-start-2">
              {/* Explore any party's entire electoral history */}
              <h4 className="text-center">{t("party.header")}</h4>
              <div className="grid grid-cols-12 pb-12 pt-6 lg:grid-cols-10">
                <div className="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-4">
                  <ComboBox
                    placeholder={t("party.search_party")}
                    options={PARTY_OPTIONS}
                    selected={data.party ? PARTY_OPTIONS.find(e => e.value === data.party) : null}
                    onChange={selected => navigateToParty(selected?.value, data.state)}
                    enableFlag
                  />
                </div>
              </div>
              <Tabs
                title={
                  <Trans>
                    <span className="text-lg font-normal leading-9">
                      <ImageWithFallback
                        className="border-outline dark:border-washed-dark mr-2 inline-flex items-center rounded border"
                        src={`/static/images/parties/${data.party}.png`}
                        width={32}
                        height={18}
                        alt={t(`${data.party}`)}
                      />
                      {t("party.title", {
                        party: `$t(dashboard-election-explorer:${data.party})`,
                      })}
                      <StateDropdown
                        currentState={data.state}
                        onChange={selected => {
                          setData("state", selected.value);
                          navigateToParty(data.party, selected.value);
                        }}
                        width="inline-block pl-1 min-w-max"
                        anchor="left"
                      />
                    </span>
                  </Trans>
                }
                current={data.tab_index}
                onChange={(index: number) => setData("tab_index", index)}
                className="pb-6"
              >
                <Panel name={t("parliament_elections")}>
                  <ElectionTable
                    data={elections.parlimen}
                    columns={columns}
                    isLoading={data.loading}
                    empty={
                      <Trans>
                        {t("party.no_data", {
                          party: `$t(dashboard-election-explorer:${data.party})`,
                          context: "parliament",
                        })}
                      </Trans>
                    }
                  />
                </Panel>
                <Panel name={t("state_elections")}>
                  <ElectionTable
                    data={elections.dun} // TODO: Replace with DUN later
                    columns={columns}
                    isLoading={data.loading}
                    empty={
                      <Trans>
                        {t("party.no_data", {
                          party: `$t(dashboard-election-explorer:${data.party})`,
                          state: CountryAndStates[data.state],
                          context: data.state === "mys" ? "dun_mys" : "dun",
                        })}
                      </Trans>
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
              win={undefined}
              election_name={election_result.name}
              date={election_result.date}
              title={
                <div className="flex flex-row gap-2 uppercase">
                  <h5>{election_result.name}</h5>
                </div>
              }
              isLoading={data.modal_loading}
              data={data.full_results}
              columns={resultsColumns}
              highlightedRow={data.full_results.findIndex((r: Party) => r.party === data.party)}
              page={data.table_index}
              total={election_result.total}
            />
          )}
        </Section>
      </Container>
    </>
  );
};

export default ElectionPartiesDashboard;
