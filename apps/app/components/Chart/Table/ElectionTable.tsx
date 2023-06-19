import { FunctionComponent, ReactNode } from "react";
import ImageWithFallback from "@components/ImageWithFallback";
import Spinner from "@components/Spinner";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "@hooks/useTranslation";
import { clx, numFormat, toDate } from "@lib/helpers";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Tooltip } from "@components/index";
import BarPerc from "@components/Chart/BarMeter/BarPerc";
import { ResultBadge } from "@components/Badge/election";
import { ElectionResult } from "@dashboards/democracy/election-explorer/types";

export interface ElectionTableProps {
  className?: string;
  title?: string | ReactNode;
  empty?: string | ReactNode;
  data?: any;
  columns: Array<ColumnDef<any, any>>;
  highlightedRows?: Array<number>;
  result?: ElectionResult;
  isLoading: boolean;
}

type ElectionTableIds =
  | "index"
  | "party"
  | "election_name"
  | "name"
  | "votes"
  | "majority"
  | "seats"
  | "seat"
  | "result"
  | "full_result";

const ElectionTable: FunctionComponent<ElectionTableProps> = ({
  className = "",
  title,
  empty,
  data = dummyData,
  columns,
  highlightedRows = [-1],
  result,
  isLoading = false,
}) => {
  const { t, i18n } = useTranslation(["dashboard-election-explorer", "common"]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  /**
   * Special cells
   * keys: party | election_name | seats | result | votes | majority
   */
  const lookupDesktop = (id: ElectionTableIds, cell: any) => {
    const value = cell.getValue();
    switch (id) {
      case "index":
        return highlightedRows.includes(value - 1) ? (
          <p className="text-primary dark:text-primary-dark">{value}</p>
        ) : (
          value
        );
      case "name":
        return highlightedRows.includes(+cell.row.id) ? (
          <>
            {value}
            <span className="inline-flex translate-y-0.5 pl-1">
              <ResultBadge hidden value={cell.row.original.result} />
            </span>
          </>
        ) : (
          value
        );
      case "election_name":
        return (
          <Tooltip
            className="tooltip-left"
            tip={
              cell.row.original.date && toDate(cell.row.original.date, "dd MMM yyyy", i18n.language)
            }
          >
            {open => (
              <div
                className="cursor-help whitespace-nowrap underline decoration-dotted underline-offset-[3px]"
                tabIndex={0}
                onClick={open}
              >
                {value === "By-Election" ? t(value) : value.slice(0, -5) + t(value.slice(-5))}
              </div>
            )}
          </Tooltip>
        );
      case "party":
        return (
          <div className="flex items-center">
            <ImageWithFallback
              className="border-outline dark:border-outlineHover-dark absolute rounded border"
              src={`/static/images/parties/${value}.png`}
              width={32}
              height={18}
              alt={t(value)}
              style={{ width: "auto", maxWidth: "32px", height: "auto", maxHeight: "32px" }}
            />
            <span className="pl-10">
              {!table
                .getAllColumns()
                .map(col => col.id)
                .includes("full_result")
                ? t(value)
                : value}
            </span>
          </div>
        );
      case "seats":
        return (
          <div className="flex items-center gap-2 md:flex-col md:items-start lg:flex-row lg:items-center">
            <div>
              <BarPerc hidden value={value.perc} />
            </div>
            <p className="whitespace-nowrap">{`${value.won} / ${value.total} ${
              value.perc !== null ? ` (${numFormat(value.perc, "compact", [1, 1])}%)` : " (—)"
            }`}</p>
          </div>
        );
      case "result":
        return <ResultBadge value={value} />;

      case "votes":
      case "majority":
        return (
          <>
            {typeof value === "number" ? (
              value
            ) : (
              <div className="flex items-center gap-2 md:flex-col md:items-start lg:flex-row lg:items-center">
                <div className="lg:self-center">
                  <BarPerc hidden value={value.perc} />
                </div>
                <span className="whitespace-nowrap">
                  {value.abs !== null ? numFormat(value.abs, "standard") : `—`}
                  {value.perc !== null ? ` (${numFormat(value.perc, "compact", [1, 1])}%)` : " (—)"}
                </span>
              </div>
            )}
          </>
        );
      default:
        return flexRender(cell.column.columnDef.cell, cell.getContext());
    }
  };
  const lookupMobile = (id: ElectionTableIds, cell: any) => {
    if (!cell) return <></>;
    const value = cell.getValue();
    switch (id) {
      case "index":
        return highlightedRows.includes(value - 1) ? (
          <p className="text-primary dark:text-primary-dark font-bold">#{value}</p>
        ) : (
          <>#{value}</>
        );
      case "party":
        return (
          <div className="flex flex-row items-center gap-1.5">
            <ImageWithFallback
              className="border-outline dark:border-outlineHover-dark absolute rounded border"
              src={`/static/images/parties/${value}.png`}
              width={32}
              height={18}
              alt={t(value)}
              style={{ width: "32px", height: "auto" }}
            />
            {cell.row.original.name ? (
              <p className="relative pl-10">
                <span className="font-medium">{cell.row.original.name}</span>
                <span>{` (${value})`}</span>
              </p>
            ) : (
              <span className="relative pl-10 font-medium">{t(value)}</span>
            )}
          </div>
        );
      case "election_name":
        return (
          <div className="flex flex-wrap gap-x-3 text-sm">
            <p className="font-medium">
              {value === "By-Election" ? t(value) : value.slice(0, -5) + t(value.slice(-5))}
            </p>
            {cell.row.original.date && (
              <p className="text-dim">
                {toDate(cell.row.original.date, "dd MMM yyyy", i18n.language)}
              </p>
            )}
          </div>
        );
      case "seats":
        return (
          <div className="flex flex-col space-y-1">
            <p className="text-dim font-medium">
              {flexRender(cell.column.columnDef.header, cell.getContext())}
            </p>
            <div className="flex items-center gap-2">
              <BarPerc hidden value={value?.perc} />
              <p>
                {`${value?.won} / ${value?.total}
                 (${
                   value?.perc !== null ? `${numFormat(value?.perc, "compact", [1, 1])}%` : "(—)"
                 })`}
              </p>
            </div>
          </div>
        );
      case "votes":
        return (
          <div className="flex flex-col space-y-1">
            <p className="text-dim font-medium">
              {flexRender(cell.column.columnDef.header, cell.getContext())}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <BarPerc hidden value={value.perc} />
              <p>{`${value.abs !== null ? numFormat(value.abs, "standard") : "—"} (${
                value.perc !== null ? `${numFormat(value.perc, "compact", [1, 1])}%` : "—"
              })`}</p>
            </div>
          </div>
        );
      case "majority":
        return (
          <div className="flex flex-row gap-2">
            <p className="text-dim font-medium">
              {flexRender(cell.column.columnDef.header, cell.getContext())}
            </p>
            {typeof value === "number" ? (
              <p className="font-bold">{value}</p>
            ) : (
              <div className="flex items-center gap-2">
                <BarPerc hidden value={value.perc} />
                <p>{`${value.abs !== null ? numFormat(value.abs, "standard") : "—"} (${
                  value.perc !== null ? `${numFormat(value.perc, "compact", [1, 1])}%` : "—"
                })`}</p>
              </div>
            )}
          </div>
        );
      case "result":
        return (
          <div className="flex flex-col space-y-1">
            <p className="text-dim font-medium">
              {flexRender(cell.column.columnDef.header, cell.getContext())}
            </p>
            <ResultBadge value={value} />
          </div>
        );
      default:
        return flexRender(cell.column.columnDef.cell, cell.getContext());
    }
  };

  return (
    <>
      <div>
        {title && typeof title === "string" ? (
          <span className="pb-6 text-base font-bold dark:text-white">{title}</span>
        ) : (
          title
        )}
      </div>
      <div className={clx("relative", className)}>
        {/* Desktop */}
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
                    highlightedRows.includes(rowIndex)
                      ? "bg-background dark:bg-background-dark"
                      : "bg-inherit",
                    "border-outline dark:border-washed-dark border-b"
                  )}
                >
                  {row.getVisibleCells().map((cell: any, colIndex: number) => (
                    <td
                      key={cell.id}
                      className={clx(
                        highlightedRows.includes(rowIndex) && colIndex === 0
                          ? "font-medium"
                          : "font-normal",
                        "px-2 py-[10px]"
                      )}
                    >
                      {lookupDesktop(cell.column.columnDef.id, cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {/* Mobile */}
        {table.getRowModel().rows.map((row: any, index: number) => {
          const ids = table.getAllColumns().map(col => col.id);
          let _row: Record<string, ReactNode> = {};
          row.getVisibleCells().forEach((cell: any) => {
            _row[cell.column.columnDef.id] = lookupMobile(cell.column.columnDef.id, cell);
          });
          return isLoading ? (
            <></>
          ) : (
            <div
              className={clx(
                "border-outline dark:border-washed-dark flex flex-col space-y-2 border-b p-3 text-sm first:border-t-2 md:hidden",
                index === 0 && "border-t-2",
                highlightedRows.includes(index)
                  ? "bg-background dark:bg-background-dark"
                  : "bg-inherit"
              )}
              key={index}
            >
              {/* Row 1 - Election Name / Date / Full result */}
              {["election_name", "full_result"].some(id => ids.includes(id)) && (
                <div className="flex items-start justify-between gap-x-2">
                  <div className="flex gap-x-2">
                    {_row.index}
                    {_row.election_name}
                  </div>
                  {_row.full_result}
                </div>
              )}
              {/* Row 2 - Seat (if available)*/}
              {(_row.result || _row.index) && (
                <div>
                  <p>{_row.seat} </p>
                </div>
              )}
              {/* Row 3 - Party */}
              {_row.party && <div>{_row.party}</div>}

              {/* Row 4 - Result *Depends on page shown */}
              {_row.name && ( // SEATS
                <div className="flex flex-row gap-2">
                  {_row.majority}
                  {_row.votes}
                </div>
              )}
              {_row.result && ( // CANDIDATES
                <div className="flex flex-row space-x-4">
                  {_row.votes}
                  {_row.result}
                </div>
              )}
              {_row.seats && ( // PARTIES
                <div className="flex flex-row space-x-3">
                  {_row.seats}
                  {_row.votes}
                </div>
              )}
            </div>
          );
        })}
        {isLoading && (
          <div className="flex h-20 w-full items-center justify-center">
            <Spinner loading={isLoading} />
          </div>
        )}
        {!data.length && !isLoading && (
          <div className="flex items-center justify-center md:h-[200px]">
            <div className="bg-outline dark:bg-washed-dark flex h-auto w-[300px] rounded-md px-3 pb-2 pt-1 lg:w-fit">
              <p className="text-sm">
                <span className="inline-flex pr-1">
                  <FaceFrownIcon className="h-5 w-5 translate-y-1" />
                </span>
                {empty}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ElectionTable;

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
