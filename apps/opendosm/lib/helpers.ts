import { DateTime } from "luxon";
import { createElement, ReactElement } from "react";
import { CountryAndStates } from "./constants";

/**
 * Returns the object of max value by a given key in the array.
 * @param array Object array
 * @param key Comparing key
 * @returns Object
 */
export const maxBy = (array: Array<any>, key: string) => {
  return array.reduce((prev, current) => {
    return prev[key] > current[key] ? prev : current;
  });
};

/**
 * Find max or limit to 100 if above.
 * @param e number
 * @returns max || 100
 */
export const minMax = (e: number, max: number = 100) => {
  if (!e) return 0;
  return Math.min(Math.max(e, 0), max);
};

/**
 * Format a number to the given type.
 * @param value number
 * @param type Intl format type
 * @returns string
 */
export const numFormat = (
  value: number,
  type: "compact" | "standard" | "scientific" | "engineering" | undefined = "compact",
  precision: number | [min: number, max: number] = 1,
  compactDisplay: "short" | "long" = "short",
  locale: string = "en",
  smart: boolean = false
): string => {
  const [max, min] = Array.isArray(precision) ? precision : [precision, 0];

  if (smart === true) {
    let formatter: Intl.NumberFormat;

    if (value < 1_000_000 && value > -1_000_000) {
      formatter = Intl.NumberFormat(locale, {
        notation: type,
        maximumFractionDigits: max,
        minimumFractionDigits: min,
        compactDisplay: "short",
      });
    } else {
      formatter = Intl.NumberFormat(locale, {
        notation: type,
        maximumFractionDigits: max,
        minimumFractionDigits: min,
        compactDisplay,
      });
    }

    return formatter
      .format(value)
      .replace("trillion", "tril")
      .replace("trilion", "tril")
      .replace("billion", "bil")
      .replace("bilion", "bil")
      .replace("million", "mil");
  } else {
    return Intl.NumberFormat(locale, {
      notation: type,
      maximumFractionDigits: max,
      minimumFractionDigits: min,
      compactDisplay,
    }).format(value);
  }
};

/**
 * @todo Refactor this later. To be deprecated.
 * */
export function smartNumFormat({
  value,
  type = "compact",
  precision = 1,
  locale,
}: {
  value: number;
  type?: "compact" | "standard" | "scientific" | "engineering" | undefined;
  precision?: number | [min: number, max: number];
  locale: string;
}): string {
  return numFormat(value, type, precision, "long", locale, true);
}

/**
 * Returns a formatted date string from epoch millis or SQL date
 * @param {number | string} timestamp epoch millis | sql date
 * @param {string} locale en-GB | ms-MY
 * @param {string} format dd MMM yyyy
 * @returns {string} Formatted date
 */
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

/**
 * Sorts array of states alphabetically in a dataset, with Malaysia as first entry.
 * @param array Array of objects with state field
 * @param key Key containing state code (sgr, mlk etc)
 * @returns Sorted array of states
 */
export const sortMsiaFirst = (array: Array<any>, key?: string): Array<any> => {
  return array.sort((a: any, b: any) => {
    if (key) {
      if (a[key] === "mys") {
        return -1;
      }
      return (CountryAndStates[a[key]] as string).localeCompare(CountryAndStates[b[key]]);
    }
    if (a === "mys") {
      return -1;
    }
    return (CountryAndStates[a] as string).localeCompare(CountryAndStates[b]);
  });
};

/**
 * Sorts array of items alphabetically in a dataset.
 * @param array Array of objects
 * @param key Comparator key
 * @returns Sorted array of objects
 */
export const sortAlpha = (array: Array<Record<string, any>>, key: string): Array<any> => {
  return array.sort((a: any, b: any) => a[key].localeCompare(b[key]));
};

export const sortMulti = (
  object: Record<string, any[]>,
  index: string,
  sort: (a: number, b: number) => number
) => {
  const indexed = Array.from(object[index].keys()).sort((a, b) =>
    sort(object[index][a], object[index][b])
  );

  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => [key, indexed.map(i => value[i])])
  );
};

/**
 * Copies text to OS clipboard
 * @param text Text to copy
 */
export const copyClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

/**
 * Generic download helper function
 * @param url URL or URLData
 * @param callback Callback function
 */
export const download = (url: string, title: string, callback?: Function) => {
  let v_anchor = document.createElement("a");
  v_anchor.href = url;
  v_anchor.target = "_blank";
  v_anchor.download = title;
  v_anchor.click();

  if (callback) callback();
};

/**
 * Flips { key: value } -> { value: key }.
 * @param data Object
 * @returns Object
 */
export const flip = (data: Record<string, string>) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [value, key]));

/**
 * Splits the text to specified length & returns the array
 * @param text Long text
 * @param len Max char per split
 * @returns {string[]} Array of split text
 */
export const chunkSplit = (text: string, len: number): string[] => {
  const size = Math.ceil(text.length / len);
  const r = Array(size);
  let offset = 0;

  for (let i = 0; i < size; i++) {
    r[i] = text.substring(offset, len);
    offset += len;
  }

  return r;
};

/**
 * @tutorial interpolate Pass the raw text with markdown link syntax eg. [some-link](/url-goes-here)
 * @example interpolate("This is an example of a [link](https://open.dosm.gov.my)")
 * // ["This is an example of a", <a href="https://open.dosm.gov.my">link</a>]
 * @param {string} raw_text Raw text
 * @returns {string | ReactElement[]} string | React elements
 */
export const interpolate = (raw_text: string): string | ReactElement[] => {
  const delimiter = /\[(.*?)\)/;
  let matches = raw_text.split(delimiter);

  if (matches.length <= 1) return raw_text;

  return matches.map(item => {
    const match = item.split("](");
    if (match.length <= 1) return item;
    const [text, url] = match;
    return createElement(
      "a",
      { href: url, className: "text-primary hover:underline inline", target: "_blank" },
      text
    );
  }) as ReactElement[];
};
