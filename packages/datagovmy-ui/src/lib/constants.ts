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
  "audit": "https://www.audit.gov.my",
  "bnm": "https://www.bnm.gov.my/publications/mhs",
  "bomba": "https://www.bomba.gov.my/",
  "doa": "https://www.doa.gov.my/",
  "dosm": "https://www.dosm.gov.my/portal-main/home",
  "epf": "https://www.kwsp.gov.my/",
  "epu": "https://www.epu.gov.my/en",
  "govt": "https://www.malaysia.gov.my/portal/index",
  "icu-jpm": "https://www.icu.gov.my/",
  "imigresen": "https://www.imi.gov.my/index.php/en/",
  "jakoa": "https://www.jakoa.gov.my/",
  "janm": "https://www.janm.gov.my/",
  "jas": "https://www.jas.gov.my/",
  "jdn": "https://www.jdn.gov.my/",
  "jmg": "https://www.jmg.gov.my/",
  "jpa": "https://www.jpa.gov.my/",
  "jpj": "https://www.jpj.gov.my/en/web/main-site/utama",
  "jpn": "https://www.jpn.gov.my/en/",
  "kdn": "https://moha.gov.my/index.php/ms/",
  "kpdn": "https://www.kpdn.gov.my/ms",
  "kpkt": "https://www.kpkt.gov.my/",
  "jps": "https://www.jps.gov.my/",
  "ktmb": "https://www.ktmb.com.my/",
  "kwap": "https://www.kwap.gov.my/",
  "lhdn": "https://www.hasil.gov.my",
  "mafs": "https://www.kpkm.gov.my/bm",
  "mohe": "https://www.mohe.gov.my/en",
  "mampu": "https://www.jdn.gov.my/",
  "mcmc": "https://www.mcmc.gov.my/en/home",
  "mers-999": "https://999.gov.my/",
  "met": "https://www.met.gov.my/?lang=en",
  "moe": "https://www.moe.gov.my",
  "mof": "https://www.mof.gov.my/portal/en",
  "moh": "https://www.moh.gov.my",
  "mot": "https://www.mot.gov.my/en/",
  "ntrc": "https://www.dermaorgan.gov.my/ntrc",
  "npra": "https://www.npra.gov.my/index.php/en/",
  "nres": "https://www.nres.gov.my/",
  "parlimen": "https://www.parlimen.gov.my/",
  "penjara": "https://www.prison.gov.my/",
  "perhutanan": "https://www.forestry.gov.my/my",
  "perikanan": "https://www.dof.gov.my",
  "pdn": "https://pdn.gov.my/v2/",
  "pdrm": "https://www.rmp.gov.my/",
  "perkeso": "https://www.perkeso.gov.my/en/",
  "phcorp": "https://protecthealth.com.my",
  "prasarana": "https://www.prasarana.com.my/",
  "sesb": "https://www.sesb.com.my/",
  "span": "https://www.span.gov.my/",
  "st": "https://www.st.gov.my/",
  "swk-energy": "https://www.sarawakenergy.com/",
  "spr": "https://www.spr.gov.my/",
  "ssm": "https://www.ssm.com.my/Pages/Home.aspx",
  "tnb": "https://www.tnb.com.my/",
  "unhcr": "https://www.unhcr.org/my/",
} as const;

export const SOURCE_TRANSLATIONS: Record<string, { "ms-MY": string; "en-GB": string }> = {
  "AUDIT": { "ms-MY": "Jabatan Audit Negara", "en-GB": "National Audit Department" },
  "BNM": { "ms-MY": "Bank Negara Malaysia", "en-GB": "Central Bank of Malaysia" },
  "DOA": { "ms-MY": "Jabatan Pertanian", "en-GB": "Department of Agriculture" },
  "DOSM": { "ms-MY": "Jabatan Perangkaan Malaysia", "en-GB": "Department of Statistics Malaysia" },
  "Imigresen": {
    "ms-MY": "Jabatan Imigresen Malaysia",
    "en-GB": "Immigration Department of Malaysia",
  },
  "JANM": {
    "ms-MY": "Jabatan Akauntan Negara Malaysia",
    "en-GB": "Accountant General’s Department of Malaysia",
  },
  "JAS": { "ms-MY": "Jabatan Alam Sekitar", "en-GB": "Department of Environment" },
  "JDN": { "ms-MY": "Jabatan Diraja Negeri", "en-GB": "Royal Department of State" },
  "JMG": {
    "ms-MY": "Jabatan Mineral dan Geosains",
    "en-GB": "Department of Minerals and Geoscience",
  },
  "JPJ": { "ms-MY": "Jabatan Pengangkutan Jalan", "en-GB": "Road Transport Department" },
  "JPN": { "ms-MY": "Jabatan Pendaftaran Negara", "en-GB": "National Registration Department" },
  "KDN": { "ms-MY": "Kementerian Dalam Negeri", "en-GB": "Ministry of Home Affairs" },
  "KPDN": {
    "ms-MY": "Kementerian Perdagangan Dalam Negeri",
    "en-GB": "Ministry of Domestic Trade",
  },
  "KPKT": {
    "ms-MY": "Kementerian Perumahan dan Kerajaan Tempatan",
    "en-GB": "Ministry of Housing and Local Government",
  },
  "KTMB": { "ms-MY": "Keretapi Tanah Melayu Berhad", "en-GB": "Malayan Railways Limited" },
  "MAFS": {
    "ms-MY": "Kementerian Pertanian dan Industri Makanan",
    "en-GB": "Ministry of Agriculture and Food Industries",
  },
  "MOE": { "ms-MY": "Kementerian Pendidikan", "en-GB": "Ministry of Education" },
  "MOF": { "ms-MY": "Kementerian Kewangan", "en-GB": "Ministry of Finance" },
  "MOH": { "ms-MY": "Kementerian Kesihatan", "en-GB": "Ministry of Health" },
  "MOHE": { "ms-MY": "Kementerian Pengajian Tinggi", "en-GB": "Ministry of Higher Education" },
  "MOT": { "ms-MY": "Kementerian Pengangkutan", "en-GB": "Ministry of Transport" },
  "NPRA": {
    "ms-MY": "Bahagian Regulatori Farmasi Negara",
    "en-GB": "National Pharmaceutical Regulatory Agency",
  },
  "NRES": {
    "ms-MY": "Jabatan Sumber Asli dan Alam Sekitar",
    "en-GB": "Department of Natural Resources and Environment",
  },
  "NTRC": {
    "ms-MY": "Pusat Penyelidikan dan Pembangunan Teknologi",
    "en-GB": "National Technology Research Centre",
  },
  "Parlimen": { "ms-MY": "Parlimen Malaysia", "en-GB": "Parliament of Malaysia" },
  "PDN": { "ms-MY": "Pusat Darah Negara", "en-GB": "National Blood Centre" },
  "PDRM": { "ms-MY": "Polis Diraja Malaysia", "en-GB": "Royal Malaysia Police" },
  "Penjara": { "ms-MY": "Jabatan Penjara Malaysia", "en-GB": "Prison Department of Malaysia" },
  "Perhutanan": {
    "ms-MY": "Jabatan Perhutanan Semenanjung Malaysia",
    "en-GB": "Forestry Department Peninsular Malaysia",
  },
  "Perikanan": {
    "ms-MY": "Jabatan Perikanan Malaysia",
    "en-GB": "Department of Fisheries Malaysia",
  },
  "PHCorp": {
    "ms-MY": "Perbadanan Harta Intelek Malaysia",
    "en-GB": "Intellectual Property Corporation of Malaysia",
  },
  "Prasarana": { "ms-MY": "Prasarana Malaysia Berhad", "en-GB": "Prasarana Malaysia Berhad" },
  "SESB": { "ms-MY": "Sabah Electricity Sdn Bhd", "en-GB": "Sabah Electricity Sdn Bhd" },
  "SPAN": {
    "ms-MY": "Suruhanjaya Perkhidmatan Air Negara",
    "en-GB": "National Water Services Commission",
  },
  "ST": { "ms-MY": "Suruhanjaya Tenaga", "en-GB": "Energy Commission" },
  "SWK-ENERGY": { "ms-MY": "Sarawak Energy Berhad", "en-GB": "Sarawak Energy Berhad" },
  "TNB": { "ms-MY": "Tenaga Nasional Berhad", "en-GB": "Tenaga Nasional Berhad" },
};
