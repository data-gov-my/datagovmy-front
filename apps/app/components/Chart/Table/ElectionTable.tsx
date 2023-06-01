import { FunctionComponent, ReactNode } from "react";
import Card from "@components/Card";
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
  highlightedRow?: false | number;
  result?: ElectionResult;
  isLoading: boolean;
}

type ElectionTableIds =
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
  highlightedRow = false,
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
      case "election_name":
        return (
          <Tooltip
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
                {t(value)}
              </div>
            )}
          </Tooltip>
        );
      case "party":
        return (
          <>
            <ImageWithFallback
              className="border-outline dark:border-outlineHover-dark aspect-4/3 absolute rounded border object-contain"
              src={`/static/images/parties/${value}.png`}
              width={32}
              height={32}
              alt={t(value)}
            />
            <span className="relative pl-10">
              {!table
                .getAllColumns()
                .map(col => col.id)
                .includes("full_result")
                ? t(value)
                : value}
            </span>
          </>
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
          <div className="flex items-center gap-2 md:flex-col md:items-start lg:flex-row lg:items-center">
            <div className="lg:self-center">
              <BarPerc hidden value={value.perc} />
            </div>
            <span className="whitespace-nowrap">
              {value.abs !== null ? numFormat(value.abs, "standard") : `—`}
              {value.perc !== null ? ` (${numFormat(value.perc, "compact", [1, 1])}%)` : " (—)"}
            </span>
          </div>
        );
      default:
        return flexRender(cell.column.columnDef.cell, cell.getContext());
    }
  };

  const lookupMobile = (id: ElectionTableIds, cell: any) => {
    if (!cell) return <></>;
    const value = cell.getValue();
    switch (id) {
      case "party":
        return (
          <div className="flex flex-row items-center gap-1.5">
            <ImageWithFallback
              className="border-outline dark:border-outlineHover-dark aspect-4/3 absolute rounded border object-contain"
              src={`/static/images/parties/${value}.png`}
              width={32}
              height={18}
              alt={t(value)}
            />
            {cell.row.original.name ? (
              <span className="relative pl-10">{`${cell.row.original.name} (${value})`}</span>
            ) : (
              <span className="relative pl-10">{t(value)}</span>
            )}
          </div>
        );
      case "election_name":
        return (
          <div className="flex gap-3 text-sm">
            <p className="font-medium">{t(value)}</p>
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
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2">
              <BarPerc hidden value={value.perc} />
              <p>{`${value.abs !== null ? numFormat(value.abs, "standard") : "—"} (${
                value.perc !== null ? `${numFormat(value.perc, "compact", [1, 1])}%` : "—"
              })`}</p>
            </div>
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
                        {lookupDesktop(cell.column.columnDef.id, cell)}
                        {rowIndex === highlightedRow && colIndex === 0 && (
                          <ResultBadge hidden value={result} />
                        )}
                      </div>
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
                index === highlightedRow ? "bg-background dark:bg-background-dark" : "bg-inherit"
              )}
              key={index}
            >
              {/* Row 1 - Election Name / Date / Full result */}
              {["election_name", "full_result"].some(id => ids.includes(id)) && (
                <div className="flex flex-row justify-between">
                  {_row.election_name}
                  {_row.full_result}
                </div>
              )}
              {/* Row 2 - Seat (if available)*/}
              {_row.result && (
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
          <Card className="flex h-[200px] items-center justify-center px-3 text-sm lg:text-base">
            <Card className="bg-outline dark:bg-washed-dark mx-auto flex h-min w-fit flex-row gap-2 self-center rounded-md px-3 py-1.5">
              <FaceFrownIcon className="min-h-4 min-w-4 text-dim mx-auto mt-1 h-8 w-auto dark:text-white md:h-4 md:w-auto" />
              {empty}
            </Card>
          </Card>
        )}
      </div>
    </div>
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
