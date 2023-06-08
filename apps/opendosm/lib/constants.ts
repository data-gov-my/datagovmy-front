// GENERAL
export enum BREAKPOINTS {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1440,
}

/**
 * MALAYSIA def.
 */
export const MALAYSIA: Record<string, string> = {
  key: "mys",
  name: "Malaysia",
};

/**
 * STATES defs.
 */
export const STATES: Array<Record<string, any>> = [
  {
    key: "jhr",
    name: "Johor",
  },
  {
    key: "kdh",
    name: "Kedah",
  },
  {
    key: "ktn",
    name: "Kelantan",
  },
  {
    key: "kul",
    name: "W.P. Kuala Lumpur",
  },
  {
    key: "lbn",
    name: "W.P. Labuan",
  },
  {
    key: "mlk",
    name: "Melaka",
  },
  {
    key: "nsn",
    name: "Negeri Sembilan",
  },
  {
    key: "phg",
    name: "Pahang",
  },
  {
    key: "prk",
    name: "Perak",
  },
  {
    key: "pls",
    name: "Perlis",
  },
  {
    key: "png",
    name: "Pulau Pinang",
  },
  {
    key: "pjy",
    name: "W.P. Putrajaya",
  },
  {
    key: "sbh",
    name: "Sabah",
  },
  {
    key: "swk",
    name: "Sarawak",
  },
  {
    key: "sgr",
    name: "Selangor",
  },
  {
    key: "trg",
    name: "Terengganu",
  },
];

/**
 * Dictionary of code to country/state name. IIFE
 * @example CountryAndStates["mlk"] -> "Melaka"
 */
export const CountryAndStates: Record<string, string> = (() => {
  return [MALAYSIA, ...STATES].reduce((prev, current) => {
    return { ...prev, ...{ [current.key]: current.name } };
  }, {});
})();

/**
 * MYR denomination colors
 * @example MYR_COLOR.RM100 -> "#A199C0"
 */
export const MYR_COLOR = {
  RM100: "#A199C0",
  RM100_H: "#A199C01A",
  RM50: "#20A5A4",
  RM50_H: "#20A5A41A",
  RM20: "#FCCA6B",
  RM20_H: "#FCCA6B1A",
  RM10: "#F6908B",
  RM10_H: "#F6908B1A",
  RM5: "#7DC698",
  RM5_H: "#7DC6981A",
  RM1: "#7DAEE8",
  RM1_H: "#7DAEE81A",
  SEN50: "#C6B453",
  SEN50_H: "#C6B4531A",
  SEN20: "#C6B453",
  SEN20_H: "#C6B4531A",
  SEN10: "#A5A5A5",
  SEN10_H: "#A5A5A51A",
};

/**
 * Dictionary of AKSARA's color palette.
 * @example AKSARA_COLOR.PRIMARY -> "#2563EB"
 */
export const AKSARA_COLOR = {
  BLACK: "#0F172A",
  BLACK_H: "#0F172A1A",
  DANGER: "#DC2626",
  DANGER_H: "#DC26261A",
  PRIMARY: "#2563EB",
  PRIMARY_H: "#2563EB1A",
  PRIMARY_DARK: "#0C204E",
  PRIMARY_DARK_H: "#0C204E1A",
  SUCCESS: "#22C55E",
  SUCCESS_H: "#22C55E1A",
  GREEN: "#2E804C",
  GREEN_H: "#2E804C1A",
  WARNING: "#FBBF24",
  WARNING_H: "#FBBF241A",
  DIM: "#64748B",
  DIM_H: "#64748B1A",
  WASHED: "#F1F5F9",
  WASHED_H: "#F1F5F9CC",
  OUTLINE: "#E2E8F0",
  OUTLINE_H: "#E2E8F01A",
  LABOUR: "#FF8328",
  LABOUR_H: "#FF83281A",
  TURQUOISE: "#30C3B2",
  TURQUOISE_H: "#30C3B21A",
  GREY: "#94A3B8",
  GREY_H: "#94A3B81A",
  DARK_BLUE: "#0C3284",
  DARK_BLUE_H: "#0C32841A",
} as const;

export const CHOROPLETH_YELLOW_GREEN_BLUE_SCALE: string[] = [
  "#061E58",
  "#215FA8",
  "#215FA8",
  "#1D91C0",
  "#41B6C4",
  "#7FCDBB",
  "#C7E9B4",
  "#EDF8B1",
  "#FFFFD9",
];

/**
 * Convert locale code to shorter code. Used in reference to AKSARA's API
 * @example SHORT_LANG["ms-MY"] -> "bm"
 */
export const SHORT_LANG = {
  "ms-MY": "bm",
  "en-GB": "en",
} as const;

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
