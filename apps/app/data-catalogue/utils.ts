import { AKSARA_COLOR } from "@lib/constants";

/**
 * Color ordering for data-catalogue.
 * @example CATALOGUE_COLORS[0] -> AKSARA_COLOR.PRIMARY
 */
export const CATALOGUE_COLORS = [
  AKSARA_COLOR.PRIMARY,
  AKSARA_COLOR.GREY,
  AKSARA_COLOR.DANGER,
  AKSARA_COLOR.WARNING,
] as const;

/**
 * Convert AKSARA API's periods to the designated timeseries interval.
 * @example SHORT_PERIOD["WEEKLY"] -> "weekly"
 */
export const SHORT_PERIOD = {
  DAILY: "auto",
  WEEKLY: "day",
  MONTHLY: "month",
  QUARTERLY: "quarter",
  YEARLY: "year",
} as const;

/**
 * Convert AKSARA API's periods to the designated timeseries interval.
 * @example SHORT_PERIOD["WEEKLY"] -> "weekly"
 */
export const SHORT_PERIOD_FORMAT = {
  DAILY: "dd MMM yyyy",
  WEEKLY: "dd MMM yyyy",
  MONTHLY: "MMM yyyy",
  QUARTERLY: "qQ yyyy",
  YEARLY: "yyyy",
} as const;
