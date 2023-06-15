var n = /* @__PURE__ */ (e => (
  (e[(e.SM = 640)] = "SM"),
  (e[(e.MD = 768)] = "MD"),
  (e[(e.LG = 1024)] = "LG"),
  (e[(e.XL = 1440)] = "XL"),
  e
))(n || {});
const k = {
    key: "mys",
    name: "Malaysia",
  },
  o = [
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
  ],
  r = (() => [k, ...o].reduce((e, a) => ({ ...e, [a.key]: a.name }), {}))(),
  y = {
    BLACK: "#18181B",
    BLACK_H: "#18181B1A",
    WHITE: "FFFFFF",
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
  },
  A = [
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
[...A].reduce((e, a) => ({ ...e, [a.key]: a.colour }), {});
export {
  y as AKSARA_COLOR,
  n as BREAKPOINTS,
  r as CountryAndStates,
  k as MALAYSIA,
  A as PARTY_COLOURS,
  o as STATES,
};
