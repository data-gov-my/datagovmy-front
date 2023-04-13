import { FunctionComponent, ReactNode } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { clx } from "@lib/helpers";
import { useTranslation } from "@hooks/useTranslation";
import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { Button } from "@components/index";

export interface BorderlessTableProps {
  className?: string;
  title?: string | ReactNode;
  data?: any;
  responsive?: Boolean;
  enablePagination?: false | number;
  highlightedRow?: false | number;
  win?: boolean;
}

const BorderlessTable: FunctionComponent<BorderlessTableProps> = ({
  className = "",
  title,
  data = defaultData,
  responsive = true,
  enablePagination = false,
  highlightedRow = false,
  win = undefined,
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
          <thead className="">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border-b-2 border-outline py-[10px] pl-2 font-medium dark:border-washed-dark"
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
                  "border-b border-outline dark:border-washed-dark"
                )}
              >
                {row.getVisibleCells().map((cell: any, colIndex: number) => (
                  <td
                    key={cell.id}
                    className={clx(
                      rowIndex === highlightedRow && colIndex === 0 ? "font-medium" : "font-normal",
                      "py-[10px] pl-2"
                    )}
                  >
                    <div className="flex flex-row">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      {rowIndex === highlightedRow &&
                        colIndex === 0 &&
                        (win ? (
                          <span className="ml-2 flex flex-row space-x-1">
                            <CheckCircleIcon className="h-4 w-4 self-center text-[#10B981]" />
                            <span className="uppercase text-[#10B981]">{t("common.won")}</span>
                          </span>
                        ) : (
                          <span className="ml-2 flex flex-row space-x-1">
                            <XCircleIcon className="h-4 w-4 self-center text-danger" />
                            <span className="uppercase text-danger">{t("common.lost")}</span>
                          </span>
                        ))}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {enablePagination && (
        <div className="space-y-3">
          <span className="flex items-center justify-center gap-1 text-center text-sm">
            {t("common.page_of", {
              current: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount(),
            })}
          </span>
          <div className={`flex items-center justify-center gap-4 text-sm ${className}`}>
            <Button
              className="group flex flex-row gap-2 rounded border py-2 px-3 disabled:bg-washed dark:disabled:bg-washed-dark"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeftIcon className="h-4 w-4 text-black dark:text-white" />
              {t("common.previous")}
            </Button>
            <Button
              className="group flex flex-row gap-2 rounded border py-2 px-3 disabled:bg-washed dark:disabled:bg-washed-dark"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {t("common.next")} <ChevronRightIcon className="h-4 w-4 text-black dark:text-white" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorderlessTable;

type Candidate = {
  name: string;
  party: string;
  votes: number;
  perc: string;
};

const defaultData: Candidate[] = [
  {
    name: "Rushdan Bin Rusmi",
    party: "Perikatan Nasional (PN)",
    votes: 24267,
    perc: "60.45%",
  },
  {
    name: "Ko Chu Liang",
    party: "Pakatan Harapan (PH)",
    votes: 11753,
    perc: "30.05%",
  },
  {
    name: "Zahida Binti Zarik Khan",
    party: "Barisan Nasional (PN)",
    votes: 9267,
    perc: "4.50%",
  },
  {
    name: "Kapt (B) Hj Mohamad Yahya",
    party: "Parti Warisan Sabah (WARISAN)",
    votes: 7085,
    perc: "3.50%",
  },
  {
    name: "Zahidi Zainul Abidin",
    party: "Bebas (BEBAS)",
    votes: 244,
    perc: "1.50%",
  },
];

const columnHelper = createColumnHelper<Candidate>();

const columns = [
  columnHelper.accessor("name", {
    cell: (info: any) => info.getValue(),
    header: "Candidate name",
  }),
  columnHelper.accessor((row: any) => row.party, {
    id: "party",
    cell: (info: any) => info.getValue(),
    header: "Party",
  }),
  columnHelper.accessor("votes", {
    header: "Total votes",
    cell: (info: any) => info.renderValue(),
  }),
  columnHelper.accessor("perc", {
    header: "% of votes",
  }),
];
