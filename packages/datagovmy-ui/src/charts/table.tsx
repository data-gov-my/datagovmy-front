import {
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
  ReactElement,
  Dispatch,
  SetStateAction,
  useCallback,
  ReactNode,
} from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  getPaginationRowModel,
  ColumnFiltersState,
  FilterFn,
  getFilteredRowModel,
  SortDirection,
} from "@tanstack/react-table";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { rankItem } from "@tanstack/match-sorter-utils";
import { CountryAndStates } from "../lib/constants";
import Image from "next/image";
import { useTranslation } from "../hooks/useTranslation";
import { default as debounce } from "lodash/debounce";
import { DebouncedFunc } from "lodash";
import { clx, numFormat } from "../lib/helpers";
import { UpDownIcon } from "../icons";
import Button from "../components/Button";
import { Precision } from "../../types";

export interface TableConfigColumn {
  id: string;
  header?: string;
  accessorKey?: string;
}

export type TableConfig<T = any> = {
  id: string | undefined;
  header?: ReactNode;
  accessorKey?: string;
  className?: string;
  enableSorting?: boolean;
  cell?: (item: any) => JSX.Element;
  columns?: TableConfigColumn[];
  accessorFn?: (props: T) => string;
  sortingFn?: string;
  sortDescFirst?: boolean;
};

export interface TableProps {
  "className"?: string;
  "title"?: string;
  "menu"?: ReactElement;
  "freeze"?: string[];
  "controls"?: (setColumnFilters: Dispatch<SetStateAction<ColumnFiltersState>>) => ReactNode;
  "search"?: (setGlobalFilter: DebouncedFunc<(query: string) => void>) => ReactNode;
  "sorts"?: SortingState;
  "cellClass"?: string;
  "data"?: any;
  "config"?: Array<TableConfig>;
  "responsive"?: Boolean;
  "enablePagination"?: false | number;
  "precision"?: number | Precision;
  "data-testid"?: string;
}

const relativeColor = (delta: number, inverse: boolean = false) => {
  const COLOR = {
    DEFAULT: "bg-outline",
    GREEN: "bg-green-400 text-green-600",
    RED: "bg-red-400 text-red-600",
  };
  if (inverse) return delta > 1 ? COLOR.RED : delta < 0 ? COLOR.GREEN : COLOR.DEFAULT;
  else return delta > 1 ? COLOR.GREEN : delta < 0 ? COLOR.RED : COLOR.DEFAULT;
};

const scaleColor = (value: number) =>
  value >= 75 ? "bg-[#FDC7B2]" : value >= 50 ? "bg-[#FFECE4]" : "bg-transparent";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const search = value.toLowerCase();
  let compareTo = row.getValue(columnId) as string;
  // Rank the item
  const itemRank = rankItem(compareTo, search);

  // Store the itemRank info
  addMeta({ itemRank });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const Table: FunctionComponent<TableProps> = ({
  className = "",
  title,
  menu,
  data = dummy,
  config = dummyConfig,
  sorts = [],
  freeze,
  controls,
  search,
  responsive = true,
  enablePagination = false,
  cellClass,
  precision,
  ...props
}) => {
  const columns = useMemo<ColumnDef<Record<string, any>>[]>(() => config as any, [config]);
  const [sorting, setSorting] = useState<SortingState>(sorts);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { t } = useTranslation("common");

  const sortTooltip = (sortDir: SortDirection | false) => {
    if (sortDir === false) return t("common:common.sort");
    else if (sortDir === "desc") return t("common:common.desc_order");
    else if (sortDir === "asc") return t("common:common.asc_order");
    return undefined;
  };
  const ReactTableProps: any = {
    data,
    columns,
    state: {
      sorting: sorting,
      columnFilters: columnFilters,
      globalFilter: globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    debugTable: false,
  };

  const table = useReactTable(ReactTableProps);

  useEffect(() => {
    if (enablePagination) table.setPageSize(enablePagination);
  }, [enablePagination]);

  const onSearch = useCallback(
    debounce((query: string) => {
      setGlobalFilter(query ?? "");
    }, 500),
    []
  );

  const calcStickyLeft = (cellId: string) => {
    // FIXME: clientWidth is not the exact width that ends up rendered
    const ele = document.getElementById(cellId)?.previousElementSibling;
    return ele !== undefined && ele !== null ? ele.clientWidth : 0;
  };

  return (
    <div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <span className="text-base font-bold">{title}</span>
        {menu && <div className="flex items-center justify-end gap-2">{menu}</div>}
      </div>

      {(search || controls) && (
        <div className="flex w-full flex-wrap items-center justify-between gap-4 pb-2">
          <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center">
            {controls && controls(setColumnFilters)}
          </div>
          {search && search(onSearch)}
        </div>
      )}
      <div className={clx(responsive && "relative overflow-x-auto")}>
        <table
          className={clx(
            "relative mx-auto w-full table-auto border-separate border-spacing-0 whitespace-nowrap md:w-fit",
            className
          )}
          data-testid={props["data-testid"]}
        >
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {
                  return (
                    <th
                      key={header.id}
                      id={header.id}
                      colSpan={header.colSpan}
                      className={clx(
                        freeze?.includes(header.id) && "sticky-col",
                        "border-outline dark:border-washed-dark border-b-2 py-[10px] font-medium"
                      )}
                      style={{
                        left: freeze?.includes(header.id) ? calcStickyLeft(header.id) : 0,
                      }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={clx(
                            header.subHeaders.length < 1
                              ? "flex select-none items-center justify-between gap-1 px-2 text-left text-sm"
                              : !header.column.columnDef.header
                              ? "hidden"
                              : "pr-2 text-end",
                            header.column.getCanSort() ? "cursor-pointer" : ""
                          )}
                          onClick={
                            header.column.getCanSort()
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          <div>
                            <p className="font-medium text-black dark:text-white">
                              {flexRender(header.column.columnDef.header, header.getContext())}
                            </p>
                            {header.column.columnDef?.subheader && (
                              <p className="text-dim text-left dark:text-white">
                                {header.column.columnDef?.subheader}
                              </p>
                            )}
                          </div>
                          {header.subHeaders.length < 1 && (
                            <span
                              className="ml-1 inline-block"
                              title={sortTooltip(header.column.getIsSorted())}
                            >
                              {
                                {
                                  asc: (
                                    <UpDownIcon
                                      className="h-5 w-5 text-black dark:text-white"
                                      transform="down"
                                    />
                                  ),
                                  desc: (
                                    <UpDownIcon
                                      className="h-5 w-5 text-black dark:text-white"
                                      transform="up"
                                    />
                                  ),
                                }[header.column.getIsSorted() as SortDirection]
                              }
                              {header.column.getCanSort() && !header.column.getIsSorted() && (
                                <UpDownIcon className="-m-1 h-5 w-5 text-black dark:text-white" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell: any, index: number) => {
                      const lastCellInGroup = cell.column.parent
                        ? cell.column.parent?.columns[cell.column.parent?.columns.length - 1]
                        : cell.column;
                      const value = cell.getValue();
                      const unit = cell.column.columnDef.unit ?? undefined;
                      const inverse = cell.column.columnDef.inverse ?? undefined;
                      const relative = cell.column.columnDef.relative ?? undefined;
                      const scale = cell.column.columnDef.scale ?? undefined;

                      const getPrecision = (
                        precision?: number | Precision
                      ): number | [number, number] => {
                        if (!precision) return [1, 0];
                        else if (typeof precision === "number") return precision;
                        else if (precision.columns && cell.column.id in precision.columns)
                          return precision.columns[cell.column.id];
                        else return precision.default;
                      };

                      const classNames = clx(
                        "border-outline dark:border-washed-dark border-b px-2 py-2.5 max-sm:max-w-[150px] truncate",
                        typeof value === "number" && "tabular-nums text-right",
                        lastCellInGroup.id === cell.column.id && "text-sm",
                        relative ? relativeColor(value as number, inverse) : "bg-opacity-20",
                        scale && scaleColor(value as number),
                        freeze?.includes(cell.column.id) && "sticky-col",
                        cell.column.columnDef.className
                          ? cell.column.columnDef.className
                          : cellClass
                      );

                      const displayValue = () => {
                        if (typeof value === "number")
                          return numFormat(value, "standard", getPrecision(precision));
                        if (value === "NaN") return "-";
                        return flexRender(cell.column.columnDef.cell, cell.getContext());
                      };
                      return (
                        <td
                          id={cell.id}
                          key={cell.id}
                          className={classNames}
                          style={{
                            left: freeze?.includes(cell.column.id)
                              ? calcStickyLeft(cell.column.id)
                              : 0,
                          }}
                        >
                          {displayValue()}
                          {value !== null && unit}
                          {value === null && relative && "-"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={table.getAllColumns().length} className="border-r border-black">
                  <div>{t("common:common.no_entries")}. </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {enablePagination && (
        <div className={`mt-5 flex items-center justify-center gap-4 text-sm font-medium`}>
          <Button
            className="btn-disabled btn-default"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon className="h-4.5 w-4.5" />
            {t("common:common.previous")}
          </Button>

          <span className="flex items-center gap-1 text-center">
            {t("common:common.page_of", {
              current: table.getState().pagination.pageIndex + 1,
              total: table.getPageCount(),
            })}
          </span>
          <Button
            className="btn-disabled btn-default"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("common:common.next")}
            <ChevronRightIcon className="h-4.5 w-4.5" />
          </Button>
        </div>
      )}
    </div>
  );
};

//
const dummyConfig: TableConfig[] = [
  {
    header: "",
    id: "state",
    accessorKey: "state",
    enableSorting: false,
    cell: (item: any) => {
      const state = item.getValue() as string;
      return (
        <div className="flex items-center gap-3">
          <Image
            src={`/static/images/states/${state}.jpeg`}
            width={28}
            height={16}
            alt={CountryAndStates[state]}
          />
          <span>{CountryAndStates[state]}</span>
        </div>
      );
    },
  },
  {
    id: "total",
    header: "Total",
    columns: [
      {
        id: "total.perc_1dose",
        header: "% 1 Dose",
        accessorKey: "total.perc_1dose.child",
      },
      {
        id: "total.perc_2dose",
        header: "% 2 Doses",
        accessorKey: "total.perc_2dose",
      },
      {
        id: "perc_1booster",
        header: "% 1 Booster",
        accessorKey: "total.perc_1booster",
      },
    ],
  },
  {
    id: "adult",
    header: "Adults",
    columns: [
      {
        id: "adult.perc_1dose",
        header: "% 1 Dose",
        accessorKey: "adult.perc_1dose",
      },
      {
        id: "adult.perc_2dose",
        header: "% 2 Doses",
        accessorKey: "adult.perc_2dose",
      },
      {
        id: "adult.perc_1booster",
        header: "% 1 Booster",
        accessorKey: "adult.perc_1booster",
      },
    ],
  },
  {
    id: "adolescent",
    header: "Adolescent",
    columns: [
      {
        id: "adolescent.perc_1dose",
        header: "% 1 Dose",
        accessorKey: "adolescent.perc_1dose",
      },
      {
        id: "adolescent.perc_2dose",
        header: "% 2 Doses",
        accessorKey: "adolescent.perc_2dose",
      },
    ],
  },
  {
    id: "children",
    header: "Children",
    columns: [
      {
        id: "children.perc_1dose",
        header: "% 1 Dose",
        accessorKey: "children.perc_1dose",
      },
      {
        id: "children.perc_2dose",
        header: "% 2 Doses",
        accessorKey: "children.perc_1dose",
      },
    ],
  },
];

const dummy = Array(Object.keys(CountryAndStates).length)
  .fill(0)
  .map((_, index) => {
    const state = Object.keys(CountryAndStates)[index];
    return {
      id: index, //
      state: state, // state code: sgr, mlk etc
      total: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
        perc_1booster: Math.floor(Math.random() * 10) + 1,
      },
      adult: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
        perc_1booster: Math.floor(Math.random() * 10) + 1,
      },
      adolescent: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
      },
      children: {
        perc_1dose: Math.floor(Math.random() * 10) + 1,
        perc_2dose: Math.floor(Math.random() * 10) + 1,
      },
    };
  });

export default Table;
