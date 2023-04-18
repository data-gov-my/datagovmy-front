import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { BarMeter } from "@components/Chart/Table/BorderlessTable";
import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { Section } from "@components/index";
import { OptionType } from "@components/types";
import { MinusIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import { PoliticalParty } from "@lib/constants";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

/**
 * Election Explorer Dashboard - Seats Tab
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});

interface ElectionSeatsProps {}

const ElectionSeats: FunctionComponent<ElectionSeatsProps> = ({}) => {
  const { t, i18n } = useTranslation();

  const SEAT_OPTIONS: Array<OptionType> = [
    "P.001 Padang Besar, Perlis",
    "P.002 Kangar, Perlis",
    "P.003 Arau, Perlis",
    "P.004 Langkawi, Kedah",
    "P.005 Jerlun, Kedah",
  ].map((key: string) => ({
    label: key,
    value: key,
  }));

  const { data, setData } = useData({
    popular_searches: [
      "P.001 Padang Besar, Perlis",
      "P.004 Langkawi, Kedah",
      "P.005 Jerlun, Kedah",
    ],
    seat: SEAT_OPTIONS[0],

    // query
    q_seat: "",
  });

  type Seat = {
    date: string;
    party: string;
    name: string;
    majority: number;
    result: string;
  };

  const dummyData: Seat[] = [
    {
      date: "23 Jan 2022",
      party: "pn",
      name: "Abdul Ghani Bin Ahmad",
      majority: 55,
      result: "comfortable",
    },
    {
      date: "23 Jan 2018",
      party: "pn",
      name: "Abdul Ghani Bin Ahmad",
      majority: 55,
      result: "close",
    },
    {
      date: "23 Jan 2013",
      party: "pn",
      name: "Abdul Ghani Bin Ahmad",
      majority: 55,
      result: "comfortable",
    },
    {
      date: "23 Jan 2008",
      party: "pn",
      name: "Abdul Ghani Bin Ahmad",
      majority: 55,
      result: "uncontested",
    },
    {
      date: "23 Jan 2004",
      party: "pn",
      name: "Abdul Ghani Bin Ahmad",
      majority: 55,
      result: "comfortable",
    },
  ];

  const columnHelper = createColumnHelper<Seat>();

  const columns: ColumnDef<Seat, any>[] = [
    columnHelper.accessor("date", {
      header: t("dashboard-election-explorer:date"),
      cell: (info: any) => <p className="whitespace-nowrap">{info.getValue()}</p>,
    }),
    columnHelper.accessor((row: any) => row.party, {
      header: t("dashboard-election-explorer:winning_party"),
      cell: (info: any) => {
        const party = info.getValue() as string;
        return (
          <div className="flex items-center gap-1.5 pr-7 lg:pr-0">
            <Image
              src={`/static/images/parties/${party}.png`}
              width={28}
              height={16}
              alt={PoliticalParty[party] as string}
            />
            <span className="whitespace-nowrap">{PoliticalParty[party]}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("name", {
      header: t("dashboard-election-explorer:candidate_name"),
      cell: (info: any) => <p className="whitespace-nowrap">{info.getValue()}</p>,
    }),
    columnHelper.accessor("majority", {
      header: t("dashboard-election-explorer:majority"),
      cell: (info: any) => (
        <div className="flex flex-row items-center gap-1.5">
          <BarMeter perc={info.getValue()} />
          <p>{`${numFormat(info.getValue(), "standard")}%`}</p>
        </div>
      ),
    }),
    columnHelper.accessor("result", {
      header: t("dashboard-election-explorer:result"),
      cell: (info: any) =>
        info.getValue() === "comfortable" ? (
          <span className="flex flex-row items-center gap-1.5 uppercase">
            <span className="w-4">💪</span>
            <p className="whitespace-nowrap text-[#10B981]">
              {t("dashboard-election-explorer:seat.comfortable")}
            </p>
          </span>
        ) : info.getValue() === "close" ? (
          <span className="flex flex-row items-center gap-1.5 uppercase">
            <span className="w-4">🔥</span>
            <p className="text-danger whitespace-nowrap">
              {t("dashboard-election-explorer:seat.close")}
            </p>
          </span>
        ) : (
          <span className="text-dim flex flex-row items-center gap-1.5 uppercase">
            <MinusIcon className="h-4 w-4" />
            <p className="whitespace-nowrap">{t("dashboard-election-explorer:seat.uncontested")}</p>
          </span>
        ),
    }),
    columnHelper.display({
      id: "fullResult",
      cell: () => (
        <ElectionCard
          label={t("dashboard-election-explorer:full_result")}
          title={
            <div>
              <span className="text-lg font-bold uppercase text-black dark:text-white">
                {data.seat.value.split(",")[0]}
              </span>
              <span className="text-dim pl-2 text-lg font-normal uppercase">
                {data.seat.value.split(",")[1]}
              </span>
            </div>
          }
        >
          <BorderlessTable />
        </ElectionCard>
      ),
    }),
  ];
  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-10 lg:col-start-2">
          <h4 className="text-center">{t("dashboard-election-explorer:seat.header")}</h4>
          <div className="pb-12 pt-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <ComboBox
                placeholder={t("dashboard-election-explorer:seat.search_seat")}
                options={SEAT_OPTIONS}
                selected={
                  data.q_seat ? SEAT_OPTIONS.find(e => e.value === data.q_seat.value) : null
                }
                onChange={e => {
                  if (e) setData("seat", e);
                  setData("q_seat", e);
                }}
              />
              <div className="flex flex-col text-center lg:flex-row">
                <span className="whitespace-pre">
                  {t("dashboard-election-explorer:popular_searches")}
                </span>
                <span>
                  <span
                    className="text-primary dark:text-primary-dark font-semibold"
                    onClick={() => {
                      setData(
                        "seat",
                        SEAT_OPTIONS.find(e => e.value === data.popular_searches[0])
                      );
                      setData(
                        "q_seat",
                        SEAT_OPTIONS.find(e => e.value === data.popular_searches[0])
                      );
                    }}
                  >
                    {data.popular_searches[0]}
                  </span>
                  <span>, </span>
                  <span
                    className="text-primary dark:text-primary-dark font-semibold"
                    onClick={() => {
                      setData(
                        "seat",
                        SEAT_OPTIONS.find(e => e.value === data.popular_searches[1])
                      );
                      setData(
                        "q_seat",
                        SEAT_OPTIONS.find(e => e.value === data.popular_searches[1])
                      );
                    }}
                  >
                    {data.popular_searches[1]}
                  </span>
                  <span>, </span>
                  <span
                    className="text-primary dark:text-primary-dark font-semibold"
                    onClick={() => {
                      setData(
                        "seat",
                        SEAT_OPTIONS.find(e => e.value === data.popular_searches[2])
                      );
                      setData(
                        "q_seat",
                        SEAT_OPTIONS.find(e => e.value === data.popular_searches[2])
                      );
                    }}
                  >
                    {data.popular_searches[2]}
                  </span>
                </span>
              </div>
            </div>
          </div>
          <BorderlessTable
            title={
              <div className="text-base font-bold">
                {t("dashboard-election-explorer:candidate.title")}
                <span className="text-primary">{data.seat.value}</span>
              </div>
            }
            data={dummyData}
            columns={columns}
          />
        </div>
      </div>
    </Section>
  );
};

export default ElectionSeats;
