import { FunctionComponent, ReactNode } from "react";
import Card from "@components/Card";
import ImageWithFallback from "@components/ImageWithFallback";
import Spinner from "@components/Spinner";
import { ArrowsPointingOutIcon, FaceFrownIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useTranslation } from "@hooks/useTranslation";
import { clx, numFormat } from "@lib/helpers";
import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DateTime } from "luxon";

export interface BorderlessTableProps {
  className?: string;
  title?: string | ReactNode;
  empty?: string | ReactNode;
  data?: any;
  columns?: Array<ColumnDef<any, any>>;
  responsive?: Boolean;
  highlightedRow?: false | number;
  win?: string;
  isLoading: boolean;
}

export type Result = {
  name: string;
  party: string;
  votes: Record<string, number>;
};

const BorderlessTable: FunctionComponent<BorderlessTableProps> = ({
  className = "",
  title,
  empty,
  data,
  columns,
  responsive = true,
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

  const results: { [key: string]: ReactNode } = {
    won: <Won />,
    won_uncontested: <Won />,
    lost: <Lost />,
    lost_deposit: <Lost />,
    null: <></>,
  };

  const table = useReactTable({
    data,
    columns: columns ? columns : dummyColumns,
    getCoreRowModel: getCoreRowModel(),
  });
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
        <table className="hidden w-full text-left text-sm lg:table">
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
                        "whitespace-nowrap px-2 py-[10px] "
                      )}
                    >
                      <span className="flex flex-row gap-1.5">
                        {cell.column.columnDef.id === "party" ? (
                          <>
                            <ImageWithFallback
                              className="items-center"
                              src={`/static/images/parties/${cell.getValue()}.png`}
                              width={28}
                              height={16}
                              alt={t(`${cell.getValue()}`)}
                            />
                            <span>{t(`${cell.getValue()}`)}</span>
                          </>
                        ) : cell.column.columnDef.id === "date" ? (
                          <>
                            {DateTime.fromISO(cell.getValue())
                              .setLocale(i18n.language)
                              .toLocaleString(DateTime.DATE_MED)}
                          </>
                        ) : ["majority", "votes"].includes(cell.column.columnDef.id) ? (
                          <div className="flex flex-row items-center gap-1.5">
                            <BarMeter perc={cell.getValue().perc} />
                            <span>
                              {cell.getValue().abs === 0
                                ? `—`
                                : numFormat(cell.getValue().abs, "standard")}
                            </span>
                            <span>
                              {cell.getValue().perc === null
                                ? `(—)`
                                : `(${Number(cell.getValue().perc).toFixed(1)}%)`}
                            </span>
                          </div>
                        ) : (
                          flexRender(cell.column.columnDef.cell, cell.getContext())
                        )}
                        {rowIndex === highlightedRow && colIndex === 0 && results[win]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {table.getRowModel().rows.map((row: any) => {
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
                    <div className="flex flex-row items-center gap-2">
                      <BarMeter perc={rowData.at(headerID.indexOf(key)).getValue().perc} />
                      <p>{`${
                        rowData.at(headerID.indexOf(key)).getValue().abs === 0
                          ? "—"
                          : numFormat(rowData.at(headerID.indexOf(key)).getValue().abs, "standard")
                      } ${
                        rowData.at(headerID.indexOf(key)).getValue().perc === null
                          ? "(—)"
                          : `(${Number(rowData.at(headerID.indexOf(key)).getValue().perc).toFixed(
                              1
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
          return (
            <div className="border-outline dark:border-washed-dark flex flex-col space-y-2 border-b p-3 text-sm lg:hidden">
              {rowID.includes("fullResult") && (
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row space-x-3">
                    <p className="font-medium">
                      {table.getColumn("election_name") &&
                        flexRender(rowData.at(0).column.columnDef.cell, rowData.at(0).getContext())}
                    </p>
                    <p className="text-dim font-normal">
                      {table.getColumn("date") &&
                        DateTime.fromISO(rowData.at(1).getValue())
                          .setLocale(i18n.language)
                          .toLocaleString(DateTime.DATE_MED)}
                    </p>
                  </div>
                  {table.getColumn("fullResult") &&
                    flexRender(rowData.at(-1).column.columnDef.cell, rowData.at(-1).getContext())}
                </div>
              )}
              {rowID.includes("seat") && rowID.includes("result") && (
                <div>
                  {flexRender(rowData.at(2).column.columnDef.cell, rowData.at(2).getContext())}
                </div>
              )}
              {rowID.includes("party") && (
                <div className="flex flex-row gap-1.5">
                  <ImageWithFallback
                    className="items-center self-center"
                    src={`/static/images/parties/${rowData
                      .at(rowID.indexOf("party"))
                      .getValue()}.png`}
                    width={28}
                    height={16}
                    alt={t(`${rowData.at(rowID.indexOf("party")).getValue()}`)}
                  />
                  {rowID.includes("candidate_name") ? (
                    <>
                      {`${rowData.at(rowID.indexOf("candidate_name")).getValue()} 
                      (${rowData.at(rowID.indexOf("party")).getValue()})`}
                    </>
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
                <div className="flex flex-row space-x-4">
                  <div className="flex flex-col space-y-1">{render("seats")}</div>
                  <div className="flex flex-col space-y-1">{render("votes")}</div>
                </div>
              )}
            </div>
          );
        })}
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

export default BorderlessTable;

interface BarMeterProps {
  perc: number;
}

export const BarMeter: FunctionComponent<BarMeterProps> = ({ perc }) => {
  return (
    <div className="bg-outline dark:bg-outlineHover-dark relative flex h-[5px] w-[30px] self-center rounded-md lg:w-[50px]">
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

interface FullResultProps {
  desc: string;
  onClick: () => void;
}

export const FullResult: FunctionComponent<FullResultProps> = ({ desc, onClick }) => {
  return (
    <div className="flex items-center justify-center">
      <button
        className="flex flex-row items-center gap-1.5 px-2 text-sm font-medium hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        onClick={onClick}
      >
        <ArrowsPointingOutIcon className="h-4 w-4 text-black dark:text-white" />
        <p className="font-normal">{desc}</p>
      </button>
    </div>
  );
};
