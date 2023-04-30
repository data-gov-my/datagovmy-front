import { FunctionComponent, useEffect } from "react";
import dynamic from "next/dynamic";
import { Trans } from "next-i18next";
import { BarMeter, FullResult } from "@components/Chart/Table/BorderlessTable";
import ElectionCard from "@components/Card/ElectionCard";
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
import { clx } from "@lib/helpers";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useWatch } from "@hooks/useWatch";
import { get } from "@lib/api";
import { DateTime } from "luxon";
import { routes } from "@lib/routes";
import { SPRIcon, SPRIconSolid } from "@components/Icon/agency";
import ContainerTabs from "@components/Tabs/ContainerTabs";
import { useFilter } from "@hooks/useFilter";

/**
 * Election Explorer Dashboard - Political Parties Tab
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});

interface ElectionPartiesProps {
  party: any;
  query: any;
}

const ElectionPartiesDashboard: FunctionComponent<ElectionPartiesProps> = ({ party, query }) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);

  const { data, setData } = useData({
    tabs: 0,

    // Placeholder for Combobox
    p_party: "",
    party_list: [],

    // Query for Table
    q_party: query.party ? query.party : "PERIKATAN",
    state: query.state ? query.state : "mys",
    type: query.type ? query.type : "parlimen",
    loading: false,
    data: party,

    // Election full result
    modalLoading: false,
    open: false,
    result: [],
    index: 0,
  });

  const { filter, setFilter } = useFilter({
    party: query.party,
    type: query.type,
    state: query.state,
  });

  type Party = {
    election_name: string;
    date: string;
    seats: Record<string, number>;
    votes: Record<string, number>;
    result: string;
  };
  const columnHelper = createColumnHelper<Party>();
  const columns: ColumnDef<Party, any>[] = [
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
    columnHelper.accessor("seats", {
      id: "seats",
      header: t("seats_won"),
      cell: (info: any) => {
        const seats = info.getValue();
        return (
          <div className="flex flex-row items-center gap-2">
            <BarMeter perc={seats.perc} />
            <p>{`${seats.won === 0 ? "0" : seats.won + "/" + seats.total} ${
              seats.perc === 0 ? "(—)" : `(${Number(seats.perc).toFixed(1)}%)`
            }`}</p>
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
              setData("open", true);
              setData("index", row.index);
            }}
          />
        );
      },
    }),
  ];

  type Result = {
    name: string;
    party: string;
    seats: Record<string, number>;
    votes: Record<string, number>;
  };
  const resultsColumnHelper = createColumnHelper<Result>();
  const resultsColumns: ColumnDef<Result, any>[] = [
    resultsColumnHelper.accessor("party", {
      id: "party",
      header: t("party_name"),
      cell: (info: any) => info.getValue(),
    }),
    resultsColumnHelper.accessor("seats", {
      id: "seats",
      header: data.data[0]
        ? t("seats_won").concat(` / ${data.data[0].seats.total}`)
        : t("seats_won"),
      cell: (info: any) => {
        const seats = info.getValue();
        return (
          <div className="flex flex-row items-center gap-2">
            <BarMeter perc={seats.perc} />
            <p>{`${seats.won === 0 ? "0" : seats.won} ${
              seats.perc === 0 ? "(—)" : `(${Number(seats.perc).toFixed(1)}%)`
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

  const PARTY_OPTIONS: Array<OptionType> =
    data.party_list &&
    data.party_list.map((key: string) => ({
      label: t(`${key}`),
      value: key,
    }));

  useEffect(() => {
    get("/explorer", {
      explorer: "ELECTIONS",
      dropdown: "party_list",
    }).then(({ data }) => {
      setData("party_list", data);
    });
  }, []);

  useWatch(() => {
    setData("loading", true);
    setFilter("party", data.q_party);
    setFilter("type", data.type);
    setFilter("state", data.state);
    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "party",
      party_name: data.q_party,
      type: data.type,
      state: data.state,
    })
      .then(({ data }) => {
        setData(
          "data",
          data.sort((a: Party, b: Party) => Number(new Date(b.date)) - Number(new Date(a.date)))
        );
      })
      .then(() => setData("loading", false));
  }, [data.q_party, data.state, data.type]);

  useWatch(() => {
    setData("modalLoading", true);
    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "full_result",
      type: "party",
      election: data.data[data.index].election_name,
      state: data.state,
    })
      .then(({ data }) => {
        setData(
          "result",
          data.sort((a: Result, b: Result) => {
            if (a.seats.won === b.seats.won) {
              return b.votes.perc - a.votes.perc;
            } else {
              return b.seats.won - a.seats.won;
            }
          })
        );
      })
      .then(() => setData("modalLoading", false));
  }, [data.index, data.open]);

  return (
    <div className={clx(data.modalLoading ? "cursor-wait" : "")}>
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
              <h4 className="text-center">{t("party.header")}</h4>
              <div className="grid grid-cols-12 pb-12 pt-6 lg:grid-cols-10">
                <div className="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-4">
                  <ComboBox
                    placeholder={t("party.search_party")}
                    options={PARTY_OPTIONS}
                    selected={
                      data.p_party ? PARTY_OPTIONS.find(e => e.value === data.p_party.value) : null
                    }
                    onChange={e => {
                      if (e) {
                        setData("q_party", e.value.toUpperCase());
                      }
                      setData("party", e);
                    }}
                    enableFlag
                  />
                </div>
              </div>
              <Tabs
                title={
                  <Trans>
                    <span className="text-lg font-normal leading-9">
                      <ImageWithFallback
                        className="mr-2 inline-flex items-center"
                        src={`/static/images/parties/${data.q_party}.png`}
                        width={28}
                        height={16}
                        alt={t(`${data.q_party}`)}
                      />
                      {t("party.title", {
                        party: `$t(dashboard-election-explorer:${data.q_party})`,
                      })}
                      <StateDropdown
                        currentState={data.state}
                        onChange={selected => {
                          setData("state", selected.value);
                        }}
                        width="inline-block pl-1 min-w-max"
                        anchor="left"
                      />
                    </span>
                  </Trans>
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
                      <Trans>
                        {t("party.no_data", {
                          party: `$t(dashboard-election-explorer:${data.q_party})`,
                          context: "parliament",
                        })}
                      </Trans>
                    }
                  />
                </Panel>
                <Panel name={t("state_elections")}>
                  <BorderlessTable
                    data={data.data}
                    columns={columns}
                    isLoading={data.loading}
                    empty={
                      <Trans>
                        {t("party.no_data", {
                          party: `$t(dashboard-election-explorer:${data.q_party})`,
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
                <div className="flex flex-row gap-2 uppercase">
                  <h5>{data.data[data.index].election_name.concat(" Results")}</h5>
                </div>
              }
              isLoading={data.modalLoading}
              data={data.result}
              columns={resultsColumns}
              highlightedRow={data.result.findIndex((r: Result) => r.party === data.q_party)}
              page={data.index}
              total={data.data.length}
            />
          )}
        </Section>
      </Container>
    </div>
  );
};

export default ElectionPartiesDashboard;
