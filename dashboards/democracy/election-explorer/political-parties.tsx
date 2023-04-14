import { BarMeter, Lost, Won } from "@components/Chart/Table/BorderlessTable";
import ComboBox from "@components/Combobox";
import { Section } from "@components/index";
import { OptionType } from "@components/types";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import dynamic from "next/dynamic";
import { FunctionComponent } from "react";

/**
 * Election Explorer Dashboard - Political Parties Tab
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});

interface ElectionPartiesProps {}

const ElectionParties: FunctionComponent<ElectionPartiesProps> = ({}) => {
  const { t, i18n } = useTranslation();

  const PARTY_OPTIONS: Array<OptionType> = [
    "Pakatan Harapan",
    "Perikatan Nasional",
    "Barisan Nasional",
  ].map((key: string) => ({
    label: key,
    value: key,
  }));

  const { data, setData } = useData({
    party: "",

    // query
    q_party: "",
  });
  type Candidate = {
    date: string;
    seats: string;
    perc: number;
    votes: string;
    result: string;
  };

  const dummyData: Candidate[] = [
    {
      date: "23 Jan 2022",
      seats: "111 / 222",
      perc: 40.5,
      votes: "18,911 (40.5%)",
      result: "formed_gov",
    },
    {
      date: "23 Jan 2018",
      seats: "111 / 222",
      perc: 40.5,
      votes: "17,076 (44.0%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2013",
      seats: "111 / 222",
      perc: 40.5,
      votes: "22,045 (59.8%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2008",
      seats: "111 / 222",
      perc: 40.5,
      votes: "20,230 (76.1%)",
      result: "formed_opp",
    },
    {
      date: "23 Jan 2004",
      seats: "111 / 222",
      perc: 40.5,
      votes: "20,065 (82.3%)",
      result: "formed_opp",
    },
  ];

  const columnHelper = createColumnHelper<Candidate>();

  const columns: ColumnDef<Candidate, any>[] = [
    columnHelper.accessor((row: any) => row.date, {
      header: "Date",
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("seats", {
      header: "Seats Won",
      cell: (info: any) => (
        <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-3">
          <BarMeter perc={Number(info.getValue())} />
          {/* <BarMeter perc={Number(String(info.getValue()).substring(info.getValue().length - 6, info.getValue().length - 2))} /> */}
          <p>{info.getValue()}</p>
        </div>
      ),
    }),
    columnHelper.accessor("perc", {
      header: "% of Votes Won",
      cell: (info: any) => (
        <div className="flex flex-col items-center gap-1 lg:flex-row lg:gap-3">
          <BarMeter perc={info.getValue()} />
          <p>{`${numFormat(info.getValue(), "standard")}%`}</p>
        </div>
      ),
    }),
    columnHelper.accessor("votes", {
      header: "Votes won",
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("result", {
      header: "Result",
      cell: (info: any) =>
        info.getValue() === "formed_gov" ? (
          <Won desc={t("dashboard-election-explorer:party.formed_gov")} />
        ) : (
          <Lost desc={t("dashboard-election-explorer:party.formed_opp")} />
        ),
    }),
    columnHelper.accessor("result", {
      header: "",
      cell: () => (
        <button className="flex flex-col items-center gap-1 lg:flex-row lg:gap-3">
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
          <h4 className="py-4 text-center">{t("dashboard-election-explorer:party.header")}</h4>
          <div className="flex items-center justify-center py-6">
            <ComboBox
              placeholder={t("dashboard-election-explorer:party.search_party")}
              options={PARTY_OPTIONS}
              selected={
                data.party ? PARTY_OPTIONS.find(e => e.value === data.party.value) : data.q_party
              }
              onChange={e => {
                if (e) setData("party", e);
                else {
                  setData("q_party", e);
                  setData("party", "");
                }
              }}
            />
          </div>
          <BorderlessTable data={dummyData} columns={columns} />
        </div>
      </div>
    </Section>
  );
};

export default ElectionParties;
