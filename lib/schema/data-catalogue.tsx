// import { useTranslation } from "@hooks/useTranslation";
// import { numFormat, toDate } from "@lib/helpers";
import type { TableConfig } from "@components/Chart/Table";
import { numFormat, toDate } from "@lib/helpers";
import type { DCPeriod } from "@lib/types";

// /**
//  * For timeseries & choropleth.
//  * @param {XYColumn} column Column
//  * @param {en|bm}locale en | bm
//  * @param {Period} period Period
//  * @returns table schema
//  */
// export const TIMESERIES_TABLE_SCHEMA = (
//   column: Record<string, string>,
//   period: DCPeriod,
//   precision: number | [number, number]
// ) => {
//   const formatBy = {
//     DAILY: "dd MMM yyyy",
//     WEEKLY: "dd MMM yyyy",
//     MONTHLY: "MMM yyyy",
//     QUARTERLY: "qQ yyyy",
//     YEARLY: "yyyy",
//   };

// //   const y_headers = headers
// //     .filter((y: string) => !["line", "x"].includes(y))
// //     .map((y: string) => ({
// //       id: y,
// //       header: locale === "en" ? column[`${y}_en`] : column[`${y}_bm`],
// //       accessorFn: (item: any) =>
// //         typeof item[y] === "number" ? numFormat(item[y], "standard", precision) : item[y],
// //       sortingFn: "localeNumber",
// //     }));

//   return [
//     {
//       id: "x",
//       header: column.x,

//       accessorFn: (item: any) => {
//         if (typeof item[key] === "string") return item[key];
//         if (typeof item[key] === "number") return numFormat(item[key], "standard");
//         return "";
//       },
//     },
//     ...y_headers,
//   ];
// };

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
