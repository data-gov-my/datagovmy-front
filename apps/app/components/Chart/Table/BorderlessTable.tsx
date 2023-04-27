import { FunctionComponent, ReactNode } from "react";
import Card from "@components/Card";
import ImageWithFallback from "@components/ImageWithFallback";
import Spinner from "@components/Spinner";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
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
  const { t } = useTranslation(["dashboard-election-explorer", "common"]);

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
      cell: (info: any) => {
        const party = info.getValue() as string;
        return (
          <div className="flex flex-row items-center gap-2 pr-7 xl:pr-0">
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
    columnHelper.accessor("votes", {
      id: "votes",
      header: t("votes_won"),
      cell: (info: any) => {
        const votes = info.getValue();
        return (
          <div className="flex flex-row items-center gap-2">
            <BarMeter perc={votes.perc} />
            <p>{`${votes.abs === 0 ? "—" : numFormat(votes.abs, "standard")} ${
              votes.perc === 0 ? "(—)" : `(${+votes.perc.toFixed(1)}%)`
            }`}</p>
          </div>
        );
      },
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
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        {rowIndex === highlightedRow && colIndex === 0 && results[win]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
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
