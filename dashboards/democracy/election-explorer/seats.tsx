import { FunctionComponent } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { BarMeter } from "@components/Chart/Table/BorderlessTable";
import ComboBox from "@components/Combobox";
import { Section } from "@components/index";
import { OptionType } from "@components/types";
import { ArrowsPointingOutIcon, MinusIcon } from "@heroicons/react/20/solid";
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
    "P001 Padang Besar, Perlis",
    "P002 Kangar, Perlis",
    "P003 Arau, Perlis",
    "P004 Langkawi, Kedah",
    "P005 Jerlun, Kedah",
  ].map((key: string) => ({
    label: key,
    value: key,
  }));

  const { data, setData } = useData({
    popular_searches: ["P.001", "P.011", "P.111"],
    seat: "",

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
      header: "Date",
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor((row: any) => row.party, {
      header: "Winning Party",
      cell: (info: any) => {
        const party = info.getValue() as string;
        return (
          <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2">
            <Image
              src={`/static/images/parties/${party}.png`}
              width={28}
              height={16}
              alt={PoliticalParty[party]}
            />
            <span className="text-center">{PoliticalParty[party]}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("name", {
      header: "Candidate",
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("majority", {
      header: "Majority",
      cell: (info: any) => (
        <div className="flex flex-col items-center gap-1 md:flex-row md:gap-2">
          <BarMeter perc={info.getValue()} />
          <p>{`${numFormat(info.getValue(), "standard")}%`}</p>
        </div>
      ),
    }),
    columnHelper.accessor("result", {
      header: "Result",
      cell: (info: any) =>
        info.getValue() === "comfortable" ? (
          <span className="flex flex-col items-center gap-1 uppercase md:flex-row md:gap-2">
            <span className="w-4">💪</span>
            <span className="text-[#10B981]">
              {t("dashboard-election-explorer:seat.comfortable")}
            </span>
          </span>
        ) : info.getValue() === "close" ? (
          <span className="flex flex-col items-center gap-1 uppercase md:flex-row md:gap-2">
            <span className="w-4">🔥</span>
            <span className="text-danger">{t("dashboard-election-explorer:seat.close")}</span>
          </span>
        ) : (
          <span className="flex flex-col items-center gap-1 uppercase md:flex-row md:gap-2">
            <MinusIcon className="h-4 w-4 text-black dark:text-white" />
            <span>{t("dashboard-election-explorer:seat.uncontested")}</span>
          </span>
        ),
    }),
    columnHelper.accessor("result", {
      header: "",
      cell: () => (
        <button className="flex flex-col items-center gap-1 md:flex-row md:gap-2">
          <ArrowsPointingOutIcon className="h-4 w-4 text-black dark:text-white" />
          <p>{t("dashboard-election-explorer:full_result")}</p>
        </button>
      ),
    }),
  ];
  return (
    <Section>
      <div className="grid grid-cols-12">
        <div className="col-span-10 col-start-2">
          <h4 className="py-4 text-center">{t("dashboard-election-explorer:seat.header")}</h4>
          <div className="flex flex-col items-center justify-center space-y-3 py-6">
            <ComboBox
              placeholder={t("dashboard-election-explorer:seat.search_seat")}
              options={SEAT_OPTIONS}
              selected={
                data.seat ? SEAT_OPTIONS.find(e => e.value === data.seat.value) : data.q_seat
              }
              onChange={e => {
                if (e) setData("seat", e);
                else {
                  setData("q_seat", e);
                  setData("seat", "");
                }
              }}
            />
            <div className="flex flex-col text-center md:flex-row">
              <span className="whitespace-pre">
                {t("dashboard-election-explorer:popular_searches")}
              </span>
              <span>
                <span className="font-semibold text-primary dark:text-primary-dark">
                  {data.popular_searches[0]}
                </span>
                <span>, </span>
                <span className="font-semibold text-primary dark:text-primary-dark">
                  {data.popular_searches[1]}
                </span>
                <span>, </span>
                <span className="font-semibold text-primary dark:text-primary-dark">
                  {data.popular_searches[2]}
                </span>
              </span>
            </div>
          </div>
          <BorderlessTable data={dummyData} columns={columns} />
        </div>
      </div>
    </Section>
  );
};

export default ElectionSeats;
