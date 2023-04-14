import type { TableConfig } from "@components/Chart/Table";
import { numFormat } from "@lib/helpers";
import At from "@components/At";

/**
 * Table schema for data catalogue
 * @param {UniversalColumn} column
 * @param freezeKeys Freeze cols
 * @returns Table schema
 */
export const UNIVERSAL_TABLE_SCHEMA = (
  column: Record<string, string>,
  freezeKeys?: string[],
  accessorFn?: (item: any, key: string) => string
): TableConfig[] => {
  const columns = Object.entries(column);
  if (!freezeKeys) return columns.map(([key, value]) => generateSchema(key, value, accessorFn));

  const [index_cols, rest]: [[string, string][], [string, string][]] = [[], []];
  columns.forEach(([key, value]: [string, string]) => {
    if (freezeKeys.includes(key)) index_cols.push([key, value]);
    else rest.push([key, value]);
  });
  return index_cols.concat(rest).map(([key, value]) => generateSchema(key, value, accessorFn));
};

/**
 * Metadata table schema.
 * @param {Function} t
 * @param freezeKeys Freeze cols
 * @returns {TableConfig[]} Metadata schema
 */
export const METADATA_TABLE_SCHEMA = (
  t: (key: string, params?: any) => string,
  isTable: boolean = false
): TableConfig[] => {
  return [
    {
      id: "variable",
      header: t("catalogue.meta_variable_name"),
      accessorFn({ variable, data_type }) {
        return `${variable}$$${data_type ? `(${data_type})` : ""}`;
      },
      cell: value => {
        const [variable, data_type] = value.getValue().split("$$");
        return (
          <p className="font-mono text-sm">
            {variable} {data_type}
          </p>
        );
      },
      className: "text-left",
      enableSorting: false,
    },
    {
      id: "variable_name",
      header: t("catalogue.meta_variable"),
      accessorFn: (item: any) => JSON.stringify({ uid: item.uid, name: item.variable_name }),
      className: "text-left min-w-[140px]",
      enableSorting: false,
      cell: value => {
        const [item, index] = [JSON.parse(value.getValue()), value.row.index];
        return (
          <>
            {Boolean(item.uid) ? (
              <At href={`/data-catalogue/${item.uid}`} className="hover:underline dark:text-white">
                {item.name}
              </At>
            ) : (
              <p>{item.name}</p>
            )}
            {index === 0 && !isTable && (
              <p className="font-normal text-dim">
                <i>{t("catalogue.meta_chart_above")}</i>
              </p>
            )}
          </>
        );
      },
    },
    {
      id: "definition",
      header: t("catalogue.meta_definition"),
      accessorKey: "definition",
      className: "text-left leading-relaxed",
      cell: value => <p>{value.getValue()}</p>,
      enableSorting: false,
    },
  ];
};

const generateSchema = (
  key: string,
  value: any,
  accessorFn?: (item: any, key: string) => string
): TableConfig => {
  return {
    id: key,
    header: value,
    // Filter bug, cannot have number type in table: https://github.com/TanStack/table/issues/4280
    accessorFn: accessorFn
      ? (item: any) => accessorFn(item, key)
      : (item: any) => {
          if (typeof item[key] === "string") return item[key];
          if (typeof item[key] === "number") return numFormat(item[key], "standard");
          return "";
        },
    className: "text-left",
    sortingFn: "localeNumber",
  };
};
