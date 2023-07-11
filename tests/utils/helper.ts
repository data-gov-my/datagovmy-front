import { DateTime } from "luxon";

/**
 * Common assertion patterns
 */
export const PATTERN = {
  I18N_FAILURE: /[a-z0-9]\.[a-z0-9]/,
} as const;

type KeyValueType<T extends string> = {
  [K in Uppercase<SnakeCase<T>>]: T;
};

type SnakeCase<S extends string> = S extends `${infer T}-${infer U}`
  ? `${Lowercase<T>}_${SnakeCase<U>}`
  : Lowercase<S>;

export function enumify<T extends string>(strings: T[]): KeyValueType<T> {
  const keyValuePair = {} as KeyValueType<T>;
  for (const str of strings) {
    keyValuePair[toSnakeCase<T>(str)] = str;
  }
  return keyValuePair;
}

function toSnakeCase<T extends string>(str: T) {
  return str.replace(/-/g, "_").toUpperCase() as Uppercase<SnakeCase<T>>;
}

export const toDate = (
  timestamp: number | string,
  format: string = "dd MMM yyyy",
  locale: string = "en-GB"
): string => {
  const date =
    typeof timestamp === "number" ? DateTime.fromMillis(timestamp) : DateTime.fromSQL(timestamp);
  const formatted_date = date.setLocale(locale).toFormat(format);

  return formatted_date !== "Invalid DateTime" ? formatted_date : "N/A";
};
