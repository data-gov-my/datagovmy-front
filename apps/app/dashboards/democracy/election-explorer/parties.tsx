import { ElectionResource, Party, PartyResult } from "./types";
import ElectionCard, { Result } from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import ImageWithFallback from "@components/ImageWithFallback";
import { Container, Panel, Section, StateDropdown, Tabs } from "@components/index";
import { toast } from "@components/Toast";
import type { OptionType } from "@components/types";
import { useCache } from "@hooks/useCache";
import { useData } from "@hooks/useData";
import { useFilter } from "@hooks/useFilter";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { CountryAndStates } from "@lib/constants";
import { generateSchema } from "@lib/schema/election-explorer";
import { Trans } from "next-i18next";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

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
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);
  const { cache } = useCache();

  const PARTY_OPTIONS: Array<OptionType> = selection.map(option => ({
    label: t(option),
    value: option,
  }));

  const DEFAULT_PARTY = "PERIKATAN";
  const PARTY_OPTION = PARTY_OPTIONS.find(e => e.value === (params.party_name ?? DEFAULT_PARTY));

  const { data, setData } = useData({
    tab_index: 0, // parlimen = 0; dun = 1
    party_option: PARTY_OPTION,
    party_name: PARTY_OPTION?.label,
    loading: false,
    parlimen: elections.parlimen,
    dun: elections.dun,
  });

  const party_schema = generateSchema<Party>([
    {
      key: "election_name",
      id: "election_name",
      header: t("election_name"),
    },
    {
      key: "seats",
      id: "seats",
      header: t("seats_won"),
    },
    {
      key: "votes",
      id: "votes",
      header: t("votes_won"),
    },
    {
      key: item => item,
      id: "full_result",
      header: "",
      cell: ({ row, getValue }) => {
        const selection = data.tab_index === 0 ? data.parlimen : data.dun;
        const item = getValue() as Party;
        return (
          <ElectionCard
            defaultParams={item}
            onChange={(option: Party) => fetchFullResult(option.election_name, option.state)}
            columns={generateSchema<PartyResult[number]>([
              {
                key: "party",
                id: "party",
                header: t("party_name"),
              },
              {
                key: "seats",
                id: "seats",
                header: t("seats_won"),
              },
              {
                key: "votes",
                id: "votes",
                header: t("votes_won"),
              },
            ])}
            options={selection}
            highlighted={data.party_name}
            page={row.index}
          />
        );
      },
    },
  ]);

  const { filter, setFilter } = useFilter({
    name: params.party_name,
    state: params.state,
  });

  const fetchResult = async (
    party_name: OptionType,
    state: string
  ): Promise<Record<"parlimen" | "dun", Party[]>> => {
    setData("loading", true);
    setData("party_name", party_name.label);
    setFilter("name", party_name.value);
    setFilter("state", state);

    const identifier = `${party_name}_${state}`;
    return new Promise(resolve => {
      if (cache.has(identifier)) {
        setData("loading", false);
        return resolve(cache.get(identifier));
      }

      get("/explorer", {
        explorer: "ELECTIONS",
        chart: "party",
        party_name: party_name.value,
        state,
      })
        .then(({ data }: { data: { data: Record<"parlimen" | "dun", Party[]> } }) => {
          const party = {
            parlimen:
              data.data.parlimen.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) ?? [],
            dun: data.data.dun.sort((a, b) => Date.parse(b.date) - Date.parse(a.date)) ?? [],
          };
          cache.set(identifier, party);
          resolve(party);
          setData("loading", false);
        })
        .catch(e => {
          toast.error(t("common:error.toast.request_failure"), t("common:error.toast.try_again"));
          console.error(e);
        });
    });
  };

  const fetchFullResult = async (election: string, state: string): Promise<Result<PartyResult>> => {
    const identifier = `${election}_${state}`;
    return new Promise(resolve => {
      if (cache.has(identifier)) return resolve(cache.get(identifier));
      get("/explorer", {
        explorer: "ELECTIONS",
        chart: "full_result",
        type: "party",
        election,
        state,
      })
        .then(({ data }: { data: { data: PartyResult } }) => {
          const result: Result<PartyResult> = {
            data: data.data.sort((a: PartyResult[number], b: PartyResult[number]) => {
              if (a.seats.won === b.seats.won) {
                return b.votes.abs - a.votes.abs;
              } else {
                return b.seats.won - a.seats.won;
              }
            }),
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

  return (
    <Container>
      <Section>
        <div className="xl:grid xl:grid-cols-12">
          <div className="xl:col-span-10 xl:col-start-2">
            {/* Explore any party's entire electoral history */}
            <h4 className="text-center">{t("party.header")}</h4>
            <div className="mx-auto w-full p-6 sm:w-[500px]">
              <ComboBox
                placeholder={t("party.search_party")}
                imageSource="/static/images/parties/"
                options={PARTY_OPTIONS}
                selected={data.party_option ?? null}
                onChange={selected => {
                  if (selected) {
                    fetchResult(selected, filter.state ?? "mys").then(({ parlimen, dun }) => {
                      setData("parlimen", parlimen);
                      setData("dun", dun);
                    });
                  }
                  setData("party_option", selected);
                }}
                enableFlag
              />
            </div>
            <Tabs
              title={
                <span className="text-lg leading-9">
                  <ImageWithFallback
                    className="border-outline dark:border-outlineHover-dark mr-2 inline-block rounded border"
                    src={`/static/images/parties/${filter.name ?? DEFAULT_PARTY}.png`}
                    width={32}
                    height={18}
                    alt={t(filter.name ?? DEFAULT_PARTY)}
                    inline
                  />
                  <Trans>
                    {t("party.title", {
                      party: `$t(dashboard-election-explorer:${filter.name ?? DEFAULT_PARTY})`,
                    })}
                  </Trans>
                  <StateDropdown
                    currentState={filter.state ?? "mys"}
                    onChange={selected => {
                      fetchResult(data.party_option, selected.value).then(({ parlimen, dun }) => {
                        setData("parlimen", parlimen);
                        setData("dun", dun);
                      });
                    }}
                    width="inline-flex ml-0.5"
                    anchor="left"
                  />
                </span>
              }
              current={data.tab_index}
              onChange={(index: number) => setData("tab_index", index)}
              className="py-6"
            >
              <Panel name={t("parlimen")}>
                <ElectionTable
                  data={data.parlimen}
                  columns={party_schema}
                  isLoading={data.loading}
                  empty={
                    <Trans>
                      {t("party.no_data", {
                        party: `$t(dashboard-election-explorer:${filter.name ?? DEFAULT_PARTY})`,
                        state: CountryAndStates[filter.state],
                        context: "parlimen",
                      })}
                    </Trans>
                  }
                />
              </Panel>
              <Panel name={t("dun")}>
                <ElectionTable
                  data={["mys", null].includes(filter.state) ? [] : data.dun}
                  columns={party_schema}
                  isLoading={data.loading}
                  empty={
                    <Trans>
                      {t("party.no_data", {
                        party: `$t(dashboard-election-explorer:${filter.name ?? DEFAULT_PARTY})`,
                        state: CountryAndStates[filter.state],
                        context: ["kul", "lbn", "pjy"].includes(filter.state)
                          ? "dun_wp"
                          : ["mys", null].includes(filter.state)
                          ? "dun_mys"
                          : "dun",
                      })}
                    </Trans>
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

export default ElectionPartiesDashboard;
