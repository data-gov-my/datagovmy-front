import { Agency } from "../../types";

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
  BLACK: "#18181B",
  BLACK_H: "#18181B1A",
  WHITE: "#FFFFFF",
  WHITE_H: "#FFFFFF1A",
  DANGER: "#DC2626",
  DANGER_H: "#DC26261A",
  PRIMARY: "#2563EB",
  PRIMARY_H: "#2563EB1A",
  PRIMARY_DARK: "#0C204E",
  PRIMARY_DARK_H: "#0C204E1A",
  SUCCESS: "#22C55E",
  SUCCESS_H: "#22C55E1A",
  GREEN: "#16A34A",
  GREEN_H: "#16A34A1A",
  WARNING: "#FBBF24",
  WARNING_H: "#FBBF241A",
  DIM: "#71717A",
  DIM_H: "#71717A1A",
  WASHED: "#F1F5F9",
  WASHED_H: "#F1F5F9CC",
  WASHED_DARK: "#27272A",
  OUTLINE: "#E2E8F0",
  OUTLINE_H: "#E2E8F01A",
  OUTLINE_DARK: "#3F3F46",
  LABOUR: "#FF8328",
  LABOUR_H: "#FF83281A",
  TURQUOISE: "#30C3B2",
  TURQUOISE_H: "#30C3B21A",
  GREY: "#94A3B8",
  GREY_H: "#94A3B81A",
  DARK_BLUE: "#0C3284",
  DARK_BLUE_H: "#0C32841A",
  PURPLE: "#7C3AED",
  PURPLE_H: "#7C3AED1A",
  ORANGE: "#FF820E",
  ORANGE_H: "#FF820E1A",
} as const;

/**
 * Convert locale code to shorter code. Used in reference to AKSARA's API
 * @example SHORT_LANG["ms-MY"] -> "bm"
 */
export const SHORT_LANG = {
  "ms-MY": "bm",
  "en-GB": "en",
} as const;

/**
 * Color ordering for data-catalogue.
 * @example CATALOGUE_COLORS[0] -> AKSARA_COLOR.PRIMARY
 */
export const CATALOGUE_COLORS = [
  AKSARA_COLOR.PRIMARY,
  AKSARA_COLOR.GREY,
  "#E2A614",
  AKSARA_COLOR.DANGER,
] as const;

/**
 * Convert AKSARA API periods to the designated timeseries interval.
 * @example SHORT_PERIOD["WEEKLY"] -> "weekly"
 */
export const SHORT_PERIOD = {
  DAILY: "auto",
  WEEKLY: "day",
  MONTHLY: "month",
  QUARTERLY: "quarter",
  YEARLY: "year",
  INTRADAY: "hour",
  INFREQUENT: "auto",
  AS_REQUIRED: "auto",
} as const;

/**
 * Convert AKSARA API periods to the designated timeseries tooltip format.
 * @example SHORT_PERIOD_FORMAT["WEEKLY"] -> "weekly"
 */
export const SHORT_PERIOD_FORMAT = {
  DAILY: "dd MMM yyyy",
  WEEKLY: "dd MMM yyyy",
  MONTHLY: "MMM yyyy",
  QUARTERLY: "qQ yyyy",
  YEARLY: "yyyy",
  INTRADAY: "dd MMM yyyy HH:mm",
  INFREQUENT: "dd MMM yyyy",
  AS_REQUIRED: "dd MMM yyyy",
} as const;

export const AgencyLink: Record<Agency, string> = {
  "aadk": "https://www.adk.gov.my/",
  "bnm": "https://www.bnm.gov.my/publications/mhs",
  "bomba": "https://www.bomba.gov.my/",
  "dosm": "https://www.dosm.gov.my/portal-main/home",
  "epf": "https://www.kwsp.gov.my/",
  "epu": "https://www.epu.gov.my/en",
  "govt": "https://www.malaysia.gov.my/portal/index",
  "icu-jpm": "https://www.icu.gov.my/",
  "imigresen": "https://www.imi.gov.my/index.php/en/",
  "jakoa": "https://www.jakoa.gov.my/",
  "jpa": "https://www.jpa.gov.my/",
  "jpj": "https://www.jpj.gov.my/en/web/main-site/utama",
  "jpn": "https://www.jpn.gov.my/en/",
  "jps": "https://www.jps.gov.my/",
  "ktmb": "https://www.ktmb.com.my/",
  "kwap": "https://www.kwap.gov.my/",
  "lhdn": "https://www.hasil.gov.my",
  "mampu": "https://www.mampu.gov.my/",
  "mcmc": "https://www.mcmc.gov.my/en/home",
  "mers-999": "https://999.gov.my/",
  "met": "https://www.met.gov.my/?lang=en",
  "moe": "https://www.moe.gov.my",
  "mof": "https://www.mof.gov.my/portal/en",
  "moh": "https://www.moh.gov.my",
  "mot": "https://www.mot.gov.my/en/",
  "ntrc": "https://www.dermaorgan.gov.my/ntrc",
  "pdn": "https://pdn.gov.my/v2/",
  "pdrm": "https://www.rmp.gov.my/",
  "perkeso": "https://www.perkeso.gov.my/en/",
  "phcorp": "https://protecthealth.com.my",
  "prasarana": "https://www.prasarana.com.my/",
  "spr": "https://www.spr.gov.my/",
  "ssm": "https://www.ssm.com.my/Pages/Home.aspx",
  "unhcr": "https://www.unhcr.org/my/",
} as const;
