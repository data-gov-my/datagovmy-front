import { FunctionComponent, ReactNode } from "react";
import Card from "@components/Card";
import ImageWithFallback from "@components/ImageWithFallback";
import Spinner from "@components/Spinner";
import { ArrowsPointingOutIcon, FaceFrownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { clx, numFormat, toDate } from "@lib/helpers";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Tooltip } from "@components/index";
import BarPerc from "@components/Chart/BarMeter/BarPerc";
import { ResultBadge } from "@components/Badge/election";

export interface ElectionTableProps {
  className?: string;
  title?: string | ReactNode;
  empty?: string | ReactNode;
  data?: any;
  columns?: Array<ColumnDef<any, any>>;
  highlightedRow?: false | number;
  win?: string;
  isLoading: boolean;
}

export type Result = {
  name: string;
  party: string;
  votes: {
    abs: number;
    perc: number;
  };
};

type ElectionTableIds =
  | "party"
  | "election_name"
  | "candidate_name"
  | "votes"
  | "majority"
  | "seats"
  | "result";

const ElectionTable: FunctionComponent<ElectionTableProps> = ({
  className = "",
  title,
  empty,
  data = dummyData,
  columns,
  highlightedRow = false,
  win = "null",
  isLoading = false,
}) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);

  const columnHelper = createColumnHelper<Result>();

  const dummyColumns: ColumnDef<Result, any>[] = [
    columnHelper.accessor("name", {
      id: "candidate_name",
      header: t("candidate_name"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("party", {
      id: "party",
      header: t("party_name"),
      cell: (info: any) => info.getValue(),
    }),
    columnHelper.accessor("votes", {
      id: "votes",
      header: t("votes_won"),
      cell: (info: any) => info.getValue(),
    }),
  ];

  const table = useReactTable({
    data,
    columns: columns ? columns : dummyColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  /**
   * Special cells
   * keys: party | election_name | seats | result | votes | majority
   */
  const lookupCell = (id: ElectionTableIds, cell: any) => {
    switch (id) {
      case "election_name":
        return (
          <Tooltip tip={toDate(cell.row.original.date, "dd MMM yyyy", i18n.language)}>
            {open => (
              <div className="whitespace-nowrap underline decoration-dotted underline-offset-[3px]">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            )}
          </Tooltip>
        );
      case "party":
        return (
          <>
            <ImageWithFallback
              className="border-outline dark:border-washed-dark aspect-4/3 absolute items-center self-center rounded border object-contain"
              src={`/static/images/parties/${cell.getValue()}.png`}
              width={32}
              height={32}
              alt={t(`${cell.getValue()}`)}
            />
            <span className="relative pl-10">
              {!table
                .getAllColumns()
                .map(col => col.id)
                .includes("fullResult")
                ? t(cell.getValue())
                : cell.getValue()}
            </span>
          </>
        );
      case "seats":
        return (
          <div className="flex items-center gap-2 md:flex-col md:items-start lg:flex-row lg:items-center">
            <div>
              <BarPerc hidden value={cell.getValue().perc} />
            </div>
            <p className="whitespace-nowrap">{`${
              cell.getValue().won === 0 ? "0" : cell.getValue().won + "/" + cell.getValue().total
            } ${
              cell.getValue().perc === 0
                ? "(—)"
                : `(${numFormat(cell.getValue().perc, "compact", [1, 1])}%)`
            }`}</p>
          </div>
        );
      case "result":
        return <ResultBadge value={cell.getValue()} />;

      case "votes":
      case "majority":
        return (
          <div
            className={clx(
              "z-0 flex gap-2",
              cell.getValue().abs === 0 ? "flex-row items-center" : "md:flex-col lg:flex-row"
            )}
          >
            <div className="lg:self-center">
              <BarPerc hidden value={cell.getValue().perc} />
            </div>
            <span className="whitespace-nowrap">
              {cell.getValue().abs === 0 ? `—` : numFormat(cell.getValue().abs, "standard")}
              {cell.getValue().perc === null
                ? ` (—)`
                : ` (${numFormat(cell.getValue().perc, "compact", [1, 1])}%)`}
            </span>
          </div>
        );
      default:
        return flexRender(cell.column.columnDef.cell, cell.getContext());
    }
  };

  return (
    <div>
      <div className={clx("flex flex-wrap items-start justify-between gap-2", className)}>
        <div>
          {title && typeof title === "string" ? (
            <span className="pb-6 text-base font-bold dark:text-white">{title}</span>
          ) : (
            title
          )}
        </div>
      </div>
      <div className={clx("relative", className)}>
        <table className="hidden w-full text-left text-sm md:table">
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
          {isLoading ? (
            <></>
          ) : (
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
                        rowIndex === highlightedRow && colIndex === 0
                          ? "font-medium"
                          : "font-normal",
                        "px-2 py-[10px]"
                      )}
                    >
                      <div className="flex flex-row gap-2">
                        {lookupCell(cell.column.columnDef.id, cell)}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {/* {table.getRowModel().rows.map((row: any, index: number) => {
          const headers = table.getHeaderGroups()[0].headers;
          const headerID = headers.map(h => h.id);
          const rowID = table.getAllColumns().map(col => col.id);
          const rowData = row.getVisibleCells();

          function render(key: string) {
            return (
              <>
                <div className="text-dim font-medium">
                  {flexRender(
                    headers.at(headerID.indexOf(key))?.column.columnDef.header,
                    headers.at(headerID.indexOf(key))!.getContext()
                  )}
                </div>
                <>
                  {["majority", "votes"].includes(
                    rowData.at(headerID.indexOf(key)).column.columnDef.id
                  ) ? (
                    <div className={clx("flex items-center gap-2")}>
                      <div>
                        <BarPerc hidden value={rowData.at(headerID.indexOf(key)).getValue().perc} />
                      </div>
                      <p>{`${
                        rowData.at(headerID.indexOf(key)).getValue().abs === 0
                          ? "—"
                          : numFormat(rowData.at(headerID.indexOf(key)).getValue().abs, "standard")
                      } ${
                        rowData.at(headerID.indexOf(key)).getValue().perc === null
                          ? "(—)"
                          : `(${numFormat(
                              rowData.at(headerID.indexOf(key)).getValue().perc,
                              "compact",
                              [1, 1]
                            )}%)`
                      }`}</p>
                    </div>
                  ) : (
                    flexRender(
                      rowData.at(headerID.indexOf(key)).column.columnDef.cell,
                      rowData.at(headerID.indexOf(key)).getContext()
                    )
                  )}
                </>
              </>
            );
          }
          return isLoading ? (
            <></>
          ) : (
            <div
              className={clx(
                "border-outline dark:border-washed-dark flex flex-col space-y-2 border-b py-3 text-sm first:border-t-2 md:hidden",
                index === 0 && "border-t-2"
              )}
              key={index}
            >
              {rowID.includes("fullResult") && (
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row space-x-3">
                    <p className="font-medium">
                      {table.getColumn("election_name") &&
                        flexRender(
                          rowData.at(rowID.indexOf("election_name")).column.columnDef.cell,
                          rowData.at(rowID.indexOf("election_name")).getContext()
                        )}
                    </p>
                    <p className="text-dim font-normal">
                      {row.original.date &&
                        DateTime.fromISO(row.original.date)
                          .setLocale(i18n.language)
                          .toLocaleString(DateTime.DATE_MED)}
                    </p>
                  </div>
                  <div className="pr-2">
                    {table.getColumn("fullResult") &&
                      flexRender(
                        rowData.at(rowID.indexOf("fullResult")).column.columnDef.cell,
                        rowData.at(rowID.indexOf("fullResult")).getContext()
                      )}
                  </div>
                </div>
              )}
              {rowID.includes("party") && (
                <div className="flex flex-row gap-1.5">
                  <ImageWithFallback
                    className="border-outline dark:border-washed-dark items-center self-center rounded border"
                    src={`/static/images/parties/${rowData
                      .at(rowID.indexOf("party"))
                      .getValue()}.png`}
                    width={32}
                    height={18}
                    alt={t(`${rowData.at(rowID.indexOf("party")).getValue()}`)}
                  />
                  {rowID.includes("candidate_name") ? (
                    <span>
                      {`${rowData.at(rowID.indexOf("candidate_name")).getValue()} 
                      (${rowData.at(rowID.indexOf("party")).getValue()})`}
                    </span>
                  ) : (
                    <span>{t(`${rowData.at(rowID.indexOf("party")).getValue()}`)}</span>
                  )}
                </div>
              )}
              {rowID.includes("candidate_name") ? (
                <>
                  {rowID.includes("majority") && (
                    <div className="flex flex-row gap-2">{render("majority")}</div>
                  )}
                  {rowID.includes("votes") && (
                    <div className="flex flex-row gap-2">{render("votes")}</div>
                  )}
                </>
              ) : rowID.includes("result") ? (
                <div className="flex flex-row space-x-4">
                  <div className="flex flex-col space-y-1">{render("votes")}</div>
                  <div className="flex flex-col space-y-1">{render("result")}</div>
                </div>
              ) : (
                rowID.includes("seats") && (
                  <div className="flex flex-row space-x-3">
                    <div className="flex flex-col space-y-1">{render("seats")}</div>
                    <div className="flex flex-col space-y-1">{render("votes")}</div>
                  </div>
                )
              )}
              {rowID.includes("constituency") && (
                <div className="space-y-1">
                  <div>
                    {flexRender(
                      rowData.at(rowID.indexOf("constituency")).column.columnDef.cell,
                      rowData.at(rowID.indexOf("constituency")).getContext()
                    )}
                  </div>
                  <div className="flex flex-row gap-2">{render("data")}</div>
                </div>
              )}
            </div>
          );
        })} */}
        {isLoading && (
          <div className="flex h-20 w-full">
            <div className="mx-auto self-center">
              <Spinner loading={isLoading} />
            </div>
          </div>
        )}
        {!data.length && !isLoading && (
          <Card className="flex h-[200px] items-center justify-center">
            <Card className="bg-outline dark:bg-washed-dark mx-auto flex h-min w-fit flex-row gap-2 self-center rounded-md px-3 py-1.5">
              <FaceFrownIcon className="mx-auto mt-1 h-4 w-4 text-black dark:text-white" />
              {empty}
            </Card>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ElectionTable;
interface FullResultProps {
  desc?: string;
  onClick: () => void;
}

export const FullResult: FunctionComponent<FullResultProps> = ({ desc, onClick }) => {
  return (
    <div className="flex items-center justify-center">
      <button
        className="text-dim flex flex-row items-center text-sm font-medium hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 dark:hover:text-white"
        onClick={onClick}
      >
        <ArrowsPointingOutIcon className="h-4 w-4 " />
        {desc && <p className="whitespace-nowrap pl-1.5 font-normal">{desc}</p>}
      </button>
    </div>
  );
};

const dummyData = [
  {
    name: "Rushdan Bin Rusmi",
    type: "parlimen",
    date: "2022-11-19",
    election_name: "GE-15",
    seat: "P.001 Padang Besar, Perlis",
    party: "PN",
    votes: {
      abs: 24267,
      perc: 53.583730789613135,
    },
    result: "won",
  },
  {
    name: "Ko Chu Liang",
    type: "parlimen",
    date: "2022-11-19",
    election_name: "GE-15",
    seat: "P.001 Padang Besar, Perlis",
    party: "WARISAN",
    votes: {
      abs: 244,
      perc: 0.5387740681858328,
    },
    result: "lost_deposit",
  },
  {
    name: "Zahidi Bin Zainul Abidin",
    type: "parlimen",
    date: "2022-11-19",
    election_name: "GE-15",
    seat: "P.001 Padang Besar, Perlis",
    party: "BEBAS",
    votes: {
      abs: 1939,
      perc: 4.281487369722664,
    },
    result: "lost_deposit",
  },
  {
    name: "Zahida Binti Zarik Khan",
    type: "parlimen",
    date: "2022-11-19",
    election_name: "GE-15",
    seat: "P.001 Padang Besar, Perlis",
    party: "BN",
    votes: {
      abs: 11753,
      perc: 25.95168698109875,
    },
    result: "lost",
  },
  {
    name: "Kapt (B) Hj Mohamad Yahaya",
    type: "parlimen",
    date: "2022-11-19",
    election_name: "GE-15",
    seat: "P.001 Padang Besar, Perlis",
    party: "PH",
    votes: {
      abs: 7085,
      perc: 15.644320791379615,
    },
    result: "lost",
  },
];
