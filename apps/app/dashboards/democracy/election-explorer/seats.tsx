import { FunctionComponent, useMemo } from "react";
import dynamic from "next/dynamic";
import { FullResult, Result } from "@components/Chart/Table/ElectionTable";
import ElectionCard, { getElectionTrans } from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { SPRIcon, SPRIconSolid } from "@components/Icon/agency";
import { AgencyBadge, Container, Hero, Section } from "@components/index";
import ContainerTabs from "@components/Tabs/ContainerTabs";
import { OptionType } from "@components/types";
import { FlagIcon, MapIcon, UserIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { get } from "@lib/api";
import { routes } from "@lib/routes";
import { DateTime } from "luxon";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useRouter } from "next/router";
import { ElectionResource, ElectionType, Seat } from "./types";

/**
 * Election Explorer Dashboard - Seats Tab
 * @overview Status: In-development
 */

const ElectionTable = dynamic(() => import("@components/Chart/Table/ElectionTable"), {
  ssr: false,
});

interface ElectionSeatsProps extends ElectionResource<Seat> {
  selection: {
    seat_name: string;
    type: ElectionType;
  }[];
}

const ElectionSeatsDashboard: FunctionComponent<ElectionSeatsProps> = ({
  params,
  selection,
  elections,
}) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);
  const { push } = useRouter();

  const columnHelper = createColumnHelper<Seat>();
  const columns: ColumnDef<Seat, any>[] = [
    columnHelper.accessor("election_name", {
      id: "election_name",
      header: t("election_name"),
      cell: (info: any) => {
        const [e, num] = getElectionTrans(info.getValue());
        return num ? t(e).concat("-" + num) : t(e);
      },
    }),
    columnHelper.accessor("seat", {
      id: "seat",
      header: t("constituency"),
      cell: (info: any) => info.getValue().split(",")[0],
    }),
    columnHelper.accessor("party", {
      id: "party",
      header: t("winning_party"),
      cell: (info: any) => <div className="relative pl-10">{info.getValue()}</div>,
    }),
    columnHelper.accessor("name", {
      id: "candidate_name",
      header: t("candidate_name"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("majority", {
      id: "majority",
      header: t("majority"),
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

  const { data, setData } = useData({
    seat: params?.seat_name,
    loading: false,

    // Election full result
    modal_loading: false,
    modal_open: false,
    full_results: [],

    table_index: 0,
  });

  const SEAT_OPTIONS: Array<OptionType> = selection.map(key => ({
    label: key.seat_name.concat(` (${t(key.type)})`),
    value: key.seat_name,
  }));

  const navigateToSeat = (name?: string) => {
    if (!name) return;
    setData("loading", true);
    setData("seat", name);

    push(`${routes.ELECTION_EXPLORER}/seats/${name}`, undefined, {
      scroll: false,
      locale: i18n.language,
    }).then(() => setData("loading", false));
  };

  const fetchResult = (rowIndex: number) => {
    setData("modal_open", true);
    setData("modal_loading", true);

    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "full_result",
      type: "seats",
      election: elections[rowIndex].election_name,
      seat: elections[rowIndex].seat,
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

  const election_result = useMemo<{
    name: string;
    area: string;
    state: string;
    date: string;
    total: number;
  }>(() => {
    if (elections.length <= 0)
      return {
        name: "",
        area: "",
        state: "",
        date: "",
        total: 0,
      };

    const [area, state] = elections[data.table_index].seat.split(",");

    return {
      name: elections[data.table_index].election_name,
      area,
      state,
      date: DateTime.fromISO(elections[data.table_index].date)
        .setLocale(i18n.language)
        .toLocaleString(DateTime.DATE_MED),
      total: elections.length,
    };
  }, [data.table_index]);

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
              url: routes.ELECTION_EXPLORER.concat("/parties"),
            },
            {
              name: t("seats"),
              icon: <MapIcon className="m-1 h-5 w-5" />,
            },
          ]}
          current={3}
        />
        <Section>
          <div className="grid grid-cols-12">
            <div className="col-span-full col-start-1 lg:col-span-10 lg:col-start-2">
              <h4 className="text-center">{t("seat.header")}</h4>
              <div className="grid grid-cols-12 pb-12 pt-6 lg:grid-cols-10">
                <div className="col-span-10 col-start-2 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-4">
                  <ComboBox
                    placeholder={t("seat.search_seat")}
                    options={SEAT_OPTIONS}
                    selected={
                      data.seat ? SEAT_OPTIONS.find(e => e.value === data.seat.value) : null
                    }
                    onChange={e => navigateToSeat(e?.value)}
                    enableType={true}
                  />
                </div>
              </div>
              <ElectionTable
                title={
                  <div className="pb-6 text-base font-bold">
                    {t("candidate.title")}
                    <span className="text-primary">{data.seat}</span>
                  </div>
                }
                data={elections}
                columns={columns}
                isLoading={data.loading}
              />
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
                <div className="flex flex-col uppercase md:flex-row md:gap-2">
                  <h5>{election_result.area}</h5>
                  <span className="text-dim font-normal">{election_result.state}</span>
                </div>
              }
              isLoading={data.modal_loading}
              data={data.full_results}
              page={data.table_index}
              total={election_result.total}
            />
          )}
        </Section>
      </Container>
    </>
  );
};

export default ElectionSeatsDashboard;
