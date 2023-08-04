import At from "../../components/At";
import { TableConfig } from "datagovmy-ui/charts/table";

/**
 * Table schema for data catalogue
 * @param {string[]} column
 * @param {Record<string, any>} translations i18n key-value
 * @param {string[]} freezeKeys Freeze cols
 * @returns {TableConfig[]} Table schema
 */
export const UNIVERSAL_TABLE_SCHEMA = (
  column: string[],
  translations: Record<string, string>,
  freezeKeys?: string[],
  accessorFn?: (item: any, key: string) => string
): TableConfig[] => {
  const yieldValue = (key: string) => (!isEmpty(translations) ? translations[key] ?? key : key);

  if (!freezeKeys)
    return column.map((key: string) => generateSchema(key, yieldValue(key), accessorFn));

  const [index_cols, rest]: [[string, string][], [string, string][]] = [[], []];
  column.forEach((key: string) => {
    if (freezeKeys.includes(key)) index_cols.push([key, yieldValue(key)]);
    else rest.push([key, yieldValue(key)]);
  });

  return index_cols.concat(rest).map(([key, value]) => generateSchema(key, value, accessorFn));
};

/**
 * Metadata table schema.
 * @param {Function} t
 * @param {boolean} isTable is-type TABLE
 * @returns {TableConfig[]} Metadata schema
 */
export const METADATA_TABLE_SCHEMA = (
  t: (key: string, params?: any) => string,
  isTable: boolean = false
): TableConfig[] => {
  return [
    {
      id: "variable",
      header: t("meta_variable_name"),
      accessorFn({ variable, data_type }) {
        return `${variable}$$${data_type ? `(${data_type})` : ""}`;
      },
      cell: value => {
        const [variable, data_type] = value.getValue().split("$$");
        return (
          <p className="whitespace-normal font-mono text-sm">
            {variable} {data_type}
          </p>
        );
      },
      className: "text-left",
      enableSorting: false,
    },
    {
      id: "variable_name",
      header: t("meta_variable"),
      accessorFn: (item: any) => JSON.stringify({ uid: item.uid, name: item.variable_name }),
      className: "text-left min-w-[140px] whitespace-normal",
      enableSorting: false,
      cell: value => {
        const [item, index] = [JSON.parse(value.getValue()), value.row.index];
        return (
          <>
            {Boolean(item.uid) ? (
              <At
                href={`/data-catalogue/${item.uid}`}
                className="[text-underline-position:from-font] hover:underline dark:text-white"
              >
                {item.name}
              </At>
            ) : (
              <p>{item.name}</p>
            )}
            {index === 0 && !isTable && (
              <p className="text-dim font-normal">
                <i>{t("meta_chart_above")}</i>
              </p>
            )}
          </>
        );
      },
    },
    {
      id: "definition",
      header: t("meta_definition"),
      accessorKey: "definition",
      className: "text-left leading-relaxed whitespace-normal",
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
    accessorKey: key,
    accessorFn: accessorFn ? (item: any) => accessorFn(item, key) : (item: any) => item[key],
  };
};

const isEmpty = (obj: Object) => Object.keys(obj).length === 0;
