// GENERAL
export enum BREAKPOINTS {
  SM = 640,
  MD = 768,
  LG = 1024,
  XL = 1440,
}

// COUNTRY & STATES
export const MALAYSIA: Record<string, string> = {
  key: "mys",
  name: "Malaysia",
};

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
    key: "kvy",
    name: "Klang Valley",
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

export const CountryAndStates = (() => {
  return [MALAYSIA, ...STATES].reduce((prev, current) => {
    return { ...prev, ...{ [current.key]: current.name } };
  }, {});
})();

// CHOROPLETH COLOR SCALE
export const CHOROPLETH_RED_SCALE = [
  "#FFF5F0",
  "#FEE0D2",
  "#FBBCA1",
  "#FC9272",
  "#FB694A",
  "#EF3B2C",
  "#CA191D",
  "#A40F15",
  "#67000D",
];

export const CHOROPLETH_GREEN_SCALE = [
  "#F7FCF5",
  "#E5F5E0",
  "#C8E8BF",
  "#A2D89B",
  "#74C476",
  "#42AB5D",
  "#238B44",
  "#026C2C",
  "#00451B",
];

export const CHOROPLETH_BLUE_SCALE = [
  "#F7FBFF",
  "#DEEBF7",
  "#C7DAEF",
  "#9DCAE0",
  "#6AAED6",
  "#4292C6",
  "#2270B5",
  "#08529C",
  "#092F6B",
];

export const CHOROPLETH_YELLOW_GREEN_BLUE_SCALE = [
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

export const CHOROPLETH_RED_PURPLE_SCALE = [
  "#FDE0DD",
  "#FBC5C0",
  "#FBC5C0",
  "#FA9FB5",
  "#F768A1",
  "#DD3597",
  "#AD017E",
  "#7A0177",
  "#49006A",
];

// HEATMAP COLORS
export const BLOOD_SUPPLY_COLOR: Array<string> = [
  "rgba(255, 78, 78, 1)",
  "rgba(255, 192, 192, 1)",
  "rgba(248, 250, 252, 1)",
  "rgba(255, 255, 255, 1)",
];

export const BLOOD_DONATION_COLOR: Array<string> = [
  "rgba(237, 246, 252, 1)",
  "rgba(181, 221, 242, 1)",
  "rgba(96, 185, 225, 1)",
  "rgba(22, 168, 220, 1)",
  "rgba(0, 114, 197, 1)",
];

// COVID COLORS
export const COVID_COLOR: Record<number, string> = {
  100: "#2563EB4D",
  200: "#6BABFA",
  300: "#2563EB",
};
// COVIDVAX COLORS
export const COVIDVAX_COLOR: Record<number, string> = {
  100: "#9FE8B1",
  200: "#31C752",
  300: "#228F3A",
  400: "#135523",
};

// BLOOD DONATION COLORS
export const BLOOD_COLOR: Record<number, string> = {
  100: "#FFC0C0",
  200: "#FF6F70",
  300: "#FF4E4E",
  400: "#FF0001",
  500: "#DC2626",
};

export const ORGAN_COLOR: Record<number, string> = {
  100: "#CFF6D9",
  200: "#9FE8B1",
  300: "#84E19A",
  400: "#31C752",
  500: "#29AB47",
  600: "#228F3A",
};

export const PEKA_COLOR: Record<number, string> = {
  100: "#FCEDFF",
  200: "#F6CCFD",
  300: "#DA9FE3",
  400: "#B560C2",
  500: "#9154C0",
  600: "#6731A8",
};

export const GRAYBAR_COLOR: Record<number, string> = {
  100: "#D1D5DB",
  200: "#94A3B8",
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
