// HEATMAP SCHEMAS
export type HeatmapSchema = {
  label?: string;
  labelColor?: string;
  max: number;
};

export const BLOOD_SUPPLY_SCHEMA: HeatmapSchema[] = [
  {
    label: "Low",
    labelColor: "#FFF",
    max: 0,
  },
  {
    label: "Mid",
    labelColor: "#000",
    max: 1,
  },
  {
    label: "Safe",
    labelColor: "#000",
    max: 2,
  },
  {
    label: "High",
    labelColor: "#000",
    max: 3,
  },
];
