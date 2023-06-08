import { useTranslation } from "@hooks/useTranslation";
import { numFormat, toDate } from "@lib/helpers";

type XYColumn = {
  x_en: string;
  x_bm: string;
  [y_lang: string]: string;
};

type Period = "DAILY" | "WEEKLY" | "MONTHLY" | "QUARTERLY" | "YEARLY";

/**
 * For timeseries & choropleth.
 * @param {XYColumn} column Column
 * @param {en|bm}locale en | bm
 * @param {Period} period Period
 * @returns table schema
 */
export const CATALOGUE_TABLE_SCHEMA = (
  column: XYColumn,
  locale: "en" | "bm" = "en",
  period: Period,
  headers: string[],
  precision: number | [number, number]
) => {
  const formatBy = {
    DAILY: "dd MMM yyyy",
    WEEKLY: "dd MMM yyyy",
    MONTHLY: "MMM yyyy",
    QUARTERLY: "qQ yyyy",
    YEARLY: "yyyy",
  };
  const { t } = useTranslation();
  const y_headers = headers
    .filter((y: string) => !["line", "x"].includes(y))
    .map((y: string) => ({
      id: y,
      header: locale === "en" ? column[`${y}_en`] : column[`${y}_bm`],
      accessorFn: (item: any) =>
        typeof item[y] === "number" ? numFormat(item[y], "standard", precision) : item[y],
      sortingFn: "localeNumber",
    }));

  return [
    {
      id: "x",
      header: locale === "en" ? column.x_en : column.x_bm,
      accessorKey: "x",
      cell: (item: any) => {
        const x: number | string = item.getValue();
        return (
          <div>
            <span className="text-sm">
              {
                {
                  number: toDate(x, formatBy[period], locale),
                  string: !t(`catalogue.show_filters.${x}`).includes(".show_filters")
                    ? t(`catalogue.show_filters.${x}`)
                    : x,
                }[typeof x as number | string]
              }
            </span>
          </div>
        );
      },
    },
    ...y_headers,
  ];
};

export type UniversalColumn = {
  en: Record<string, string>;
  bm: Record<string, string>;
};

/**
 *
 * @param {UniversalColumn} column
 * @param locale en | bm
 * @param keys
 * @returns Table schema
 */
export const UNIVERSAL_TABLE_SCHEMA = (
  column: UniversalColumn,
  locale: "en" | "bm",
  keys: string[]
) => {
  const columns = Object.entries(column[locale]);
  const [index_cols, rest]: [[string, string][], [string, string][]] = [[], []];

  columns.forEach(([key, value]: [string, string]) => {
    if (keys.includes(key)) index_cols.push([key, value]);
    else rest.push([key, value]);
  });

  return [...index_cols, ...rest].map(([key, value]) => {
    return {
      id: key,
      header: value,
      // accessorKey: key,
      // Filter bug, cannot have number type in table: https://github.com/TanStack/table/issues/4280
      accessorFn: (item: any) => {
        if (typeof item[key] === "string") return item[key];
        if (typeof item[key] === "number") return item[key].toString();
        return "";
      },
      className: "text-left",
    };
  });
};
