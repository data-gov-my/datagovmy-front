import { Agency } from "@lib/types";

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
  GREEN: "#2E804C",
  GREEN_H: "#2E804C1A",
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
 * PARTY_COLOURS defs.
 */
export const PARTY_COLOURS: Array<Record<string, any>> = [
  {
    key: "amanah",
    colour: "#f7911f",
  },
  {
    key: "bebas",
    colour: "#ffffff",
  },
  {
    key: "bersatu",
    colour: "#e30007",
  },
  {
    key: "BN",
    colour: "#000080",
  },
  {
    key: "dap",
    colour: "#cc0000",
  },
  {
    key: "gerakan",
    colour: "ff0000",
  },
  {
    key: "GPS",
    colour: "#ff9b0e",
  },
  {
    key: "muda",
    colour: "#000000",
  },
  {
    key: "pas",
    colour: "#008000",
  },
  {
    key: "pejuang",
    colour: "#006a8e",
  },
  {
    key: "PH",
    colour: "#E2462F",
  },
  {
    key: "pkr",
    colour: "#00bfff",
  },
  {
    key: "PN",
    colour: "#003152",
  },
  {
    key: "umno",
    colour: "c00000",
  },
  {
    key: "upko",
    colour: "#183980",
  },
];

/**
 * Dictionary of code to party colour.
 * @example PoliticalPartyColours["bebas"] -> "#FFFFFF"
 */
export const PoliticalPartyColours: Record<string, string> = (() => {
  return [...PARTY_COLOURS].reduce((prev, current) => {
    return { ...prev, ...{ [current.key]: current.colour } };
  }, {});
})();

export const AgencyLink: Record<Agency, string> = {
  "BNM": "https://www.bnm.gov.my/publications/mhs",
  "BOMBA": "https://www.bomba.gov.my/",
  "DOSM": "https://open.dosm.gov.my/",
  "EPF": "https://www.kwsp.gov.my/",
  "EPU": "https://www.epu.gov.my/en",
  "GOVT": "https://www.malaysia.gov.my/portal/index",
  "ICU JPM": "https://www.icu.gov.my/",
  "Imigresen": "https://www.imi.gov.my/index.php/en/",
  "JAKOA": "https://www.jakoa.gov.my/",
  "JPA": "https://www.jpa.gov.my/",
  "JPJ": "https://www.jpj.gov.my/en/web/main-site/utama",
  "JPN": "https://www.jpn.gov.my/en/",
  "JPS": "https://www.jps.gov.my/",
  "KTMB": "https://www.ktmb.com.my/",
  "KWAP": "https://www.kwap.gov.my/",
  "LHDN": "https://www.hasil.gov.my",
  "MAMPU": "https://www.mampu.gov.my/",
  "MCMC": "https://www.mcmc.gov.my/en/home",
  "MERS 999": "https://999.gov.my/",
  "Met": "https://www.met.gov.my/?lang=en",
  "MoE": "https://www.moe.gov.my",
  "MoF": "https://www.mof.gov.my/portal/en",
  "MoH": "https://www.moh.gov.my",
  "MoT": "https://www.mot.gov.my/en/",
  "NTRC": "https://www.dermaorgan.gov.my/ntrc",
  "PDN": "https://pdn.gov.my/v2/",
  "PDRM": "https://www.rmp.gov.my/",
  "PHCorp": "https://www.perkeso.gov.my/en/",
  "PERKESO": "https://protecthealth.com.my",
  "SPR": "https://www.spr.gov.my/",
  "UNHCR": "https://www.unhcr.org/my/",
} as const;
