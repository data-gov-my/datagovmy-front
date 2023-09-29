import { DateTime } from "luxon";
import { createElement, ReactElement } from "react";
import { CountryAndStates } from "./constants";
import DomToImage from "dom-to-image";
import canvasToSvg from "canvas2svg";
import { twMerge, ClassNameValue } from "tailwind-merge";

/**
 * Conditional class joiner.
 * @param args classNames
 * @returns string
 */
export const clx = (...args: ClassNameValue[]): string => {
  return twMerge(args);
};

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
 * Returns the object of min value by a given key in the array.
 * @param array Object array
 * @param key Comparing key
 * @returns Object
 */
export const minBy = (array: Array<any>, key: string) => {
  return array.reduce((prev, current) => {
    return prev[key] < current[key] ? prev : current;
  });
};

/**
 * Find max or limit to 100 if above.
 * @param e number
 * @returns max || 100
 */
export const limitMax = (e: number, max: number = 100) => {
  if (!e) return 0;
  return Math.min(Math.max(e, 0), max);
};

/**
 * Finds the min and max in an array.
 * @param value number[]
 * @returns [min, max]
 */
export const minMax = (values: Array<number | null>): [min: number, max: number] => {
  let min: number | null = null;
  let max: number | null = null;
  for (let num of values) {
    if (num === null) continue;

    if (min === null || num < min) {
      min = num;
    }
    if (max === null || num > max) {
      max = num;
    }
  }

  return [min ?? 0, max ?? 0];
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
  precision: number | [max: number, min: number] = 0,
  compactDisplay: "short" | "long" = "short",
  locale: string = "en",
  smart: boolean = false
): string => {
  const [max, min] = Array.isArray(precision) ? precision : [precision, precision];

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
 * Returns a formatted date string from epoch millis or SQL date (YYYY-MM-DD)
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
  if (typeof timestamp === "number") {
    const formatted_date = DateTime.fromMillis(timestamp).setLocale(locale).toFormat(format);
    return formatted_date !== "Invalid DateTime" ? formatted_date : "N/A";
  }

  if (/^\d{4}-\d{2}$/.test(timestamp)) {
    // Format: YYYY-MM
    return DateTime.fromFormat(timestamp, "yyyy-MM").setLocale(locale).toFormat("MMM yyyy");
  } else if (/^\d{4}-Q[1-4]$/.test(timestamp)) {
    // Format: YYYY-QQ
    return DateTime.fromFormat(timestamp, "yyyy-'Q'q")
      .setLocale(locale)
      .toFormat(`${locale === "ms-MY" ? "'ST'" : ""}q${locale === "ms-MY" ? "" : "Q"} yyyy`);
  } else if (/^\d+$/.test(timestamp)) {
    // Format: YYYY
    return DateTime.fromFormat(timestamp, "yyyy").setLocale(locale).toFormat("yyyy");
  } else {
    const date = DateTime.fromSQL(timestamp);
    const formatted_date = date.setLocale(locale).toFormat(format);

    return formatted_date !== "Invalid DateTime" ? formatted_date : "N/A";
  }
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

export const sortMulti = <T extends number>(
  object: Record<string, any[]>,
  index: string,
  sort: (a: T, b: T) => number
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
 * Returns indices of top n largest/smallest item from an array
 */
export const getTopIndices = (arr: number[], n: number, reverse = false): number[] => {
  // create an array of [value, index] pairs
  const pairs = arr.map((value, index) => [value, index]);

  // sort the pairs by value (in descending or ascending order depending on the "reverse" flag)
  pairs.sort((a, b) => (reverse ? b[0] - a[0] : a[0] - b[0]));

  // extract the first n indices from the sorted pairs
  const topPairs = pairs.slice(0, n);

  // extract the indices from the top pairs and return them
  return topPairs.map(pair => pair[1]);
};

/**
 * Slugify a given string
 * @param value String to slugify
 */
export const slugify = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .replace(/\s+/g, "-") // separator
    .replace(/-+/g, "-"); // collapse dashes
};

/**
 * Generic download helper function
 * @param url URL or URLData
 * @param callback Callback function
 */
export const download = (url: string, title: string): void => {
  let v_anchor = document.createElement("a");
  v_anchor.href = url;
  v_anchor.target = "_blank";
  v_anchor.download = title;
  v_anchor.click();
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

export const exportAs = async (
  type: "svg" | "png",
  element: HTMLCanvasElement
): Promise<string> => {
  if (type === "svg") {
    return new Promise(resolve => {
      const canvas = canvasToSvg(element.width, element.height);
      canvas.drawImage(element, 0, 0);
      resolve("data:svg+xml;utf8,".concat(canvas.getSerializedSvg()));
    });
  }
  return DomToImage.toPng(element);
};

/**
 * @tutorial interpolate Pass the raw text with markdown link syntax eg. [some-link](/url-goes-here)
 * @example interpolate("This is an example of a [link](https://data.gov.my)")
 * // ["This is an example of a", <a href="https://data.gov.my">link</a>]
 * @param {string} raw_text Raw text
 * @returns {string | ReactElement[]} string | React elements
 */
export const interpolate = (raw_text: string): string | ReactElement[] => {
  const delimiter = /\[(.*?)\)/;
  let matches = raw_text.split(delimiter);

  if (matches.length <= 1) return raw_text;

  return matches.map(item => {
    const match = item.split("](");
    if (match.length <= 1) return createElement("span", { className: "text-inherit" }, item);
    const [text, url] = match;
    return createElement(
      "a",
      {
        href: url,
        className:
          "text-primary dark:text-primary-dark hover:underline inline [text-underline-position:from-font]",
        target: "_blank",
      },
      text
    );
  }) as ReactElement[];
};

/**
 * Check if the URL is correct
 * @param {string} url URL to validate
 * @returns {boolean} true | false
 */
export const isValidURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Parses to a cookie map.
 * @param {string} cookie Cookie string
 * @returns {Record<string, string>} Cookie map
 */
export const parseCookies = (cookie: string) => {
  const cookies = cookie.split(";");
  const parsedCookies: Record<string, string> = {};

  cookies.forEach(cookie => {
    const [name, value] = cookie.trim().split("=");
    parsedCookies[name] = decodeURIComponent(value);
  });

  return parsedCookies;
};

export const enumify = <T extends string>(strings: T[]): KeyValueType<T> => {
  const keyValuePair = {} as KeyValueType<T>;
  for (const str of strings) {
    keyValuePair[snakeCase<T>(str)] = str;
  }
  return keyValuePair;
};

export const snakeCase = <T extends string>(str: T) => {
  return str.replace(/-/g, "_").toUpperCase() as Uppercase<SnakeCase<T>>;
};

// MATH helpers
export const average = (values: number[]): number => values.reduce((a, b) => a + b) / values.length;

export const standardDeviation = (values: number[]): number => {
  const mean = average(values);
  const variance = average(values.map(x => Math.pow(x - mean, 2)));
  return Math.sqrt(variance);
};

export const normalize = (value: number, min: number, max: number): number =>
  (value - min) / (max - min);

type KeyValueType<T extends string> = {
  [K in Uppercase<SnakeCase<T>>]: T;
};

type SnakeCase<S extends string> = S extends `${infer T}-${infer U}`
  ? `${Lowercase<T>}_${SnakeCase<U>}`
  : Lowercase<S>;
