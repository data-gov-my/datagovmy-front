import { FunctionComponent, ReactNode, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Trans } from "next-i18next";
import { BarMeter, Lost, Won } from "@components/Chart/Table/BorderlessTable";
import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { Panel, Section, StateDropdown, Tabs } from "@components/index";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { CountryAndStates } from "@lib/constants";
import { numFormat } from "@lib/helpers";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useWatch } from "@hooks/useWatch";
import { get } from "@lib/api";

/**
 * Election Explorer Dashboard - Political Parties Tab
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});

interface ElectionPartiesProps {
  party: any;
}

const ElectionParties: FunctionComponent<ElectionPartiesProps> = ({ party }) => {
  const { t, i18n } = useTranslation();

  const { data, setData } = useData({
    data: party,
    party_list: [],
    state: "mys",
    tabs: 0,
    party: "",

    // query
    q_party: "PERIKATAN",
    loading: false,
  });

  type Party = {
    election_name: string;
    date: string;
    seats: Record<string, number>;
    votes: Record<string, number>;
    result: string;
  };

  const columnHelper = createColumnHelper<Party>();

  const results: { [key: string]: ReactNode } = {
    formed_gov: <Won desc={t("party.formed_gov")} />,
    formed_opp: <Lost desc={t("party.formed_opp")} />,
  };

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
            <p>{`${seats.abs === 0 ? "—" : seats.won + "/" + seats.total} ${
              seats.perc !== null ? `(${+seats.perc.toFixed(1)}%)` : ""
            }`}</p>
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
      id: "fullResult",
      header: "",
      cell: (info: any) => (
        <ElectionCard
          label={t("full_result")}
          win={results[info.getValue()]}
          title={"GE-15 Result"}
        />
      ),
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
    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "party",
      party_name: data.q_party,
      type: data.tabs === 0 ? "parlimen" : "dun",
      state: data.state,
    })
      .then(({ data }) => {
        setData("data", data.reverse());
      })
      .then(() => setData("loading", false));
  }, [data.q_party, data.state, data.tabs]);

  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-10 lg:col-start-2">
          <h4 className="text-center">{t("party.header")}</h4>
          <div className="pb-12 pt-6">
            <div className="flex items-center justify-center">
              <div className="lg:col-span-4 lg:col-start-5">
                <ComboBox
                  placeholder={t("party.search_party")}
                  options={PARTY_OPTIONS}
                  selected={
                    data.party ? PARTY_OPTIONS.find(e => e.value === data.party.value) : null
                  }
                  onChange={e => {
                    if (e) setData("q_party", e.value.toUpperCase());
                    setData("party", e);
                  }}
                  enableFlag
                />
              </div>
            </div>
          </div>
          <Tabs
            title={
              <Trans>
                <span className="text-lg font-normal leading-9">
                  <Image
                    className="mr-2 inline-flex items-center"
                    src={`/static/images/parties/${data.q_party}.png`}
                    width={28}
                    height={16}
                    alt={t(`${data.q_party}`)}
                  />
                  {t("party.title", {
                    party: `$t(${data.q_party})`,
                  })}
                  <StateDropdown
                    currentState={data.state}
                    onChange={selected => setData("state", selected.value)}
                    width="inline-block pl-1 min-w-max"
                    anchor="left"
                  />
                </span>
              </Trans>
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
                  <Trans>
                    {t("party.no_data", {
                      party: `$t(${data.q_party})`,
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
                      party: `$t(${data.q_party})`,
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
    </Section>
  );
};

export default ElectionParties;
