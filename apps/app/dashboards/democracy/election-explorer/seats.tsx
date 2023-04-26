import { FunctionComponent, useEffect } from "react";
import dynamic from "next/dynamic";
import { BarMeter } from "@components/Chart/Table/BorderlessTable";
import ElectionCard from "@components/Card/ElectionCard";
import ComboBox from "@components/Combobox";
import ImageWithFallback from "@components/ImageWithFallback";
import { Section } from "@components/index";
import { OptionType } from "@components/types";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/solid";
import { useData } from "@hooks/useData";
import { useTranslation } from "@hooks/useTranslation";
import { numFormat } from "@lib/helpers";
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
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);

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
        const party = info.getValue() as string;
        return (
          <div className="flex items-center gap-2 pr-7 xl:pr-0">
            <ImageWithFallback
              src={`/static/images/parties/${party}.png`}
              width={28}
              height={16}
              alt={t(`${party}`)}
            />
            <span>{t(`${party}`)}</span>
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
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center">
            <button
              className="flex flex-row items-center gap-1.5 px-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              onClick={() => {
                setData("open", true);
                setData("index", row.index);
              }}
            >
              <ArrowsPointingOutIcon className="h-4 w-4 text-black dark:text-white" />
              <p>{t("full_result")}</p>
            </button>
          </div>
        );
      },
    }),
  ];

  const { data, setData } = useData({
    data: seat,
    seats_list: [],
    index: 0,
    open: false,
    result: [],
    // placeholder
    p_seat: "",

    // query
    q_seat: "Padang Besar, Perlis",
    loading: false,
    modalLoading: false,
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

  useWatch(() => {
    setData("modalLoading", true);
    get("/explorer", {
      explorer: "ELECTIONS",
      chart: "full_result",
      type: "seats",
      election: data.data[data.index].election_name,
      seat: data.data[data.index].seat,
    })
      .then(({ data }) => {
        setData("result", data);
      })
      .then(() => setData("modalLoading", false));
  }, [data.index, data.open]);

  return (
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
                  data.p_seat ? SEAT_OPTIONS.find(e => e.value === data.p_seat.value) : null
                }
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
      {data.open && (
        <ElectionCard
          open={data.open}
          onClose={() => setData("open", false)}
          onNext={() => (data.index === data.data.length ? null : setData("index", data.index + 1))}
          onPrev={() => (data.index === 0 ? null : setData("index", data.index - 1))}
          election_name={data.data[data.index].election_name}
          date={DateTime.fromISO(data.data[data.index].date)
            .setLocale(i18n.language)
            .toLocaleString(DateTime.DATE_MED)}
          title={
            <div className="flex flex-row gap-2 uppercase">
              <h5>{data.data[data.index].seat.split(",")[0]}</h5>
              <span className="text-dim font-normal">
                {data.data[data.index].seat.split(",")[1]}
              </span>
            </div>
          }
          isLoading={data.modalLoading}
          data={data.result}
          page={data.index}
          total={data.data.length}
        />
      )}
    </Section>
  );
};

export default ElectionSeats;
