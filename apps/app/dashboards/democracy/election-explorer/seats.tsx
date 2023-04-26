import { FunctionComponent, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { BarMeter } from "@components/Chart/Table/BorderlessTable";
import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import { Section } from "@components/index";
import { OptionType } from "@components/types";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
import { PoliticalParty } from "@lib/constants";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { get } from "@lib/api";
import { useWatch } from "@hooks/useWatch";
import { DateTime } from "luxon";

/**
 * Election Explorer Dashboard - Seats Tab
 * @overview Status: In-development
 */

const BorderlessTable = dynamic(() => import("@components/Chart/Table/BorderlessTable"), {
  ssr: false,
});

interface ElectionSeatsProps {
  seat: any;
}

const ElectionSeats: FunctionComponent<ElectionSeatsProps> = ({ seat }) => {
  const { t, i18n } = useTranslation();

  // const SEAT_OPTIONS: Array<OptionType> = [
  //   "Padang Besar, Perlis",
  //   "Kangar, Perlis",
  //   "Arau, Perlis",
  //   "Langkawi, Kedah",
  //   "Jerlun, Kedah",
  // ].map((key: string) => ({
  //   label: key,
  //   value: key,
  // }));

  type Seat = {
    election_name: string;
    date: string;
    seat: string;
    party: string;
    name: string;
    majority: Record<string, number>;
    result: string;
  };

  const columnHelper = createColumnHelper<Seat>();

  const columns: ColumnDef<Seat, any>[] = [
    columnHelper.accessor("election_name", {
      id: "election_name",
      header: t("election_name"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("date", {
      id: "date",
      header: t("date"),
      cell: (info: any) => (
        <p>
          {DateTime.fromISO(info.getValue())
            .setLocale(i18n.language)
            .toLocaleString(DateTime.DATE_MED)}
        </p>
      ),
    }),
    columnHelper.accessor("seat", {
      id: "seat",
      header: t("constituency"),
      cell: (info: any) => info.getValue().split(",")[0],
    }),
    columnHelper.accessor((row: any) => row.party, {
      id: "party",
      header: t("winning_party"),
      cell: (info: any) => {
        const party = info.getValue().toLowerCase() as string;
        return (
          <div className="flex items-center gap-2 pr-7 xl:pr-0">
            <Image
              src={`/static/images/parties/${party}.png`}
              width={28}
              height={16}
              alt={PoliticalParty[party] as string}
            />
            <span>{PoliticalParty[party] ? PoliticalParty[party] : party}</span>
          </div>
        );
      },
    }),
    columnHelper.accessor("name", {
      header: t("candidate_name"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("majority", {
      header: t("majority"),
      cell: (info: any) => {
        const majority = info.getValue();
        return (
          <div className="flex flex-row items-center gap-2">
            <BarMeter perc={majority.perc} />
            <p>{`${majority.abs === 0 ? "—" : numFormat(majority.abs, "standard")} ${
              majority.perc !== null ? `(${+majority.perc.toFixed(1)}%)` : ""
            }`}</p>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "fullResult",
      cell: () => (
        <ElectionCard
          label={t("full_result")}
          title={
            <div>
              <span className="text-lg font-bold uppercase text-black dark:text-white">
                {data.q_seat.split(",")[0]}
              </span>
              <span className="text-dim pl-2 text-lg font-normal uppercase">
                {data.q_seat.split(",")[1]}
              </span>
            </div>
          }
        />
      ),
    }),
  ];

  const { data, setData } = useData({
    data: seat,
    seats_list: [],
    loading: false,
    seat: "",

    // query
    q_seat: "Padang Besar, Perlis",
  });

  const SEAT_OPTIONS: Array<OptionType> =
    data.seats_list &&
    data.seats_list.map((key: string) => ({
      label: key,
      value: key,
    }));

  useEffect(() => {
    get("/explorer", {
      explorer: "ELECTIONS",
      dropdown: "seats_list",
    }).then(({ data }) => {
      setData("seats_list", data);
    });
  }, []);

  useWatch(() => {
    setData("loading", true);
    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "seats",
      seat_name: data.q_seat,
    })
      .then(({ data }) => {
        setData("data", data.reverse());
      })
      .then(() => setData("loading", false));
  }, [data.q_seat]);

  return (
    <Section>
      <div className="lg:grid lg:grid-cols-12">
        <div className="lg:col-span-10 lg:col-start-2">
          <h4 className="text-center">{t("seat.header")}</h4>
          <div className="pb-12 pt-6">
            <div className="flex flex-col items-center justify-center space-y-3">
              <ComboBox
                placeholder={t("seat.search_seat")}
                options={SEAT_OPTIONS}
                selected={data.seat ? SEAT_OPTIONS.find(e => e.value === data.seat.value) : null}
                onChange={e => {
                  if (e) setData("q_seat", e.value);
                  setData("seat", e);
                }}
              />
            </div>
          </div>
          <BorderlessTable
            title={
              <div className="text-base font-bold">
                {t("candidate.title")}
                <span className="text-primary">{data.q_seat}</span>
              </div>
            }
            data={data.data}
            columns={columns}
            isLoading={data.loading}
          />
        </div>
      </div>
    </Section>
  );
};

export default ElectionSeats;
