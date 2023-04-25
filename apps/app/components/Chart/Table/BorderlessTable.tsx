import { FunctionComponent, ReactNode } from "react";
import Image from "next/image";
import { Button } from "@components/index";
import Card from "@components/Card";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { PoliticalParty } from "@lib/constants";
import { clx, numFormat } from "@lib/helpers";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export interface BorderlessTableProps {
  className?: string;
  title?: string | ReactNode;
  empty?: string | ReactNode;
  data?: any;
  columns?: Array<ColumnDef<any, any>>;
  responsive?: Boolean;
  enablePagination?: false | number;
  highlightedRow?: false | number;
  win?: boolean;
}

const BorderlessTable: FunctionComponent<BorderlessTableProps> = ({
  className = "",
  title,
  empty,
  data = dummyData,
  columns = dummyColumns,
  responsive = true,
  enablePagination = false,
  highlightedRow = false,
  win = true,
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className={clx("flex flex-wrap items-start justify-between gap-2", className)}>
        <div>
          {title && typeof title === "string" ? (
            <span className="text-base font-bold dark:text-white">{title}</span>
          ) : (
            title
          )}
        </div>
      </div>
      <div className={responsive ? "table-responsive" : undefined}>
        <table className="w-full text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border-outline dark:border-washed-dark whitespace-nowrap border-b-2 px-2 py-[10px] font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row: any, rowIndex: number) => (
              <tr
                key={row.id}
                className={clx(
                  rowIndex === highlightedRow
                    ? "bg-background dark:bg-background-dark"
                    : "bg-inherit",
                  "border-outline dark:border-washed-dark border-b"
                )}
              >
                {row.getVisibleCells().map((cell: any, colIndex: number) => (
                  <td
                    key={cell.id}
                    className={clx(
                      rowIndex === highlightedRow && colIndex === 0 ? "font-medium" : "font-normal",
                      "whitespace-nowrap px-2 py-[10px] "
                    )}
                  >
                    <span className="flex flex-row gap-1.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      {rowIndex === highlightedRow &&
                        colIndex === 0 &&
                        (win ? (
                          <Won desc={t("common:common.won")} />
                        ) : (
                          <Lost desc={t("common:common.lost")} />
                        ))}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {!data.length && (
          <Card className="flex h-[200px] items-center justify-center">
            <Card className="bg-outline dark:bg-washed-dark mx-auto flex h-min w-fit flex-row gap-2 self-center rounded-md px-3 py-1.5">
              <FaceFrownIcon className="mx-auto mt-1 h-4 w-4 text-black dark:text-white" />
              {empty}
            </Card>
          </Card>
        )}
      </div>
      {enablePagination && (
        <div className="space-y-3">
          <span className="flex items-center justify-center gap-2 text-center text-sm">
            {t("common:common.page_of", {
              current: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount(),
            })}
          </span>
          <div className={`flex items-center justify-center gap-4 text-sm ${className}`}>
            <Button
              className="disabled:bg-washed dark:disabled:bg-washed-dark group flex flex-row gap-2 rounded border px-3 py-2"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4 text-black dark:text-white" />
              {t("common:common.previous")}
            </Button>
            <Button
              className="disabled:bg-washed dark:disabled:bg-washed-dark group flex flex-row gap-2 rounded border px-3 py-2"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("common:common.next")}{" "}
              <ChevronRightIcon className="h-4 w-4 text-black dark:text-white" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorderlessTable;

interface BarMeterProps {
  perc: number;
}

export const BarMeter: FunctionComponent<BarMeterProps> = ({ perc }) => {
  return (
    <div className="bg-outline dark:bg-outlineHover-dark relative flex h-[5px] w-[50px] self-center rounded-md">
      <div
        className="absolute left-0 top-0 z-10 h-full rounded-xl bg-black dark:bg-white"
        style={{
          left: `0%`,
          right: `${100 - perc}%`,
        }}
      />
    </div>
  );
};

interface WonProps {
  desc?: string;
}

export const Won: FunctionComponent<WonProps> = ({ desc }) => {
  return (
    <span className="flex flex-row items-center gap-1.5">
      <CheckCircleIcon className="h-4 w-4 self-center text-[#10B981]" />
      {desc && <span className="whitespace-nowrap uppercase text-[#10B981]">{desc}</span>}
    </span>
  );
};

interface LostProps {
  desc?: string;
}

export const Lost: FunctionComponent<LostProps> = ({ desc }) => {
  return (
    <span className="flex flex-row items-center gap-1.5">
      <XCircleIcon className="text-danger h-4 w-4 self-center" />
      {desc && <span className="text-danger whitespace-nowrap uppercase">{desc}</span>}
    </span>
  );
};

export type Candidate = {
  name: string;
  party: string;
  votes: number;
  perc: number;
};

const dummyData: Candidate[] = [
  {
    name: "Rushdan Bin Rusmi",
    party: "pn",
    votes: 24267,
    perc: 60.45,
  },
  {
    name: "Ko Chu Liang",
    party: "ph",
    votes: 11753,
    perc: 30.05,
  },
  {
    name: "Zahida Binti Zarik Khan",
    party: "bn",
    votes: 9267,
    perc: 4.5,
  },
  {
    name: "Kapt (B) Hj Mohamad Yahya",
    party: "warisan",
    votes: 7085,
    perc: 3.5,
  },
  {
    name: "Zahidi Zainul Abidin",
    party: "bebas",
    votes: 244,
    perc: 1.5,
  },
];

const columnHelper = createColumnHelper<Candidate>();

const dummyColumns: Array<ColumnDef<Candidate, any>> = [
  columnHelper.accessor("name", {
    id: "name",
    cell: (info: any) => info.getValue(),
    header: "Candidate name",
  }),
  columnHelper.accessor((row: any) => row.party, {
    id: "party",
    cell: (info: any) => {
      const party = info.getValue() as string;
      return (
        <div className="flex flex-row items-center gap-1.5 pr-7 lg:pr-0">
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
    header: "Party",
  }),
  columnHelper.accessor("votes", {
    id: "votes",
    cell: (info: any) => numFormat(info.getValue(), "standard"),
    header: "Total votes",
  }),
  columnHelper.accessor("perc", {
    id: "perc",
    cell: (info: any) => (
      <div className="flex flex-row items-center gap-2">
        <BarMeter perc={info.getValue()} />
        <p>{`${numFormat(info.getValue(), "standard")}%`}</p>
      </div>
    ),
    header: "% of votes",
  }),
];
