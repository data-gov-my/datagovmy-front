import { SHORT_PERIOD } from "./constants";

export * from "datagovmy-ui/src/data-catalogue";

/************************ DATA CATALOGUE ************************** */
export type DCChartKeys =
  | "TABLE"
  | "TIMESERIES"
  | "CHOROPLETH"
  | "GEOCHOROPLETH"
  | "GEOPOINT"
  | "GEOJSON"
  | "BAR"
  | "HBAR"
  | "LINE"
  | "PYRAMID"
  | "HEATTABLE"
  | "SCATTER"
  | "STACKED_AREA"
  | "STACKED_BAR"
  | "INTRADAY";
export type DCPeriod = "YEARLY" | "QUARTERLY" | "MONTHLY" | "WEEKLY" | "DAILY";

type BaseFilter = {
  name: string;
  selected: string;
  options: string[];
};
export type FilterDefault = BaseFilter & {
  interval: never;
};

export type FilterDate = BaseFilter & {
  interval: DCPeriod;
};

export type DCFilter = FilterDefault | FilterDate;

export type Precision = {
  default: number;
  columns?: Record<string, number>;
};

export type DCConfig = {
  context: {
    [key: string]: OptionType;
  };
  dates: FilterDate | null;
  options: FilterDefault[] | null;
  precision: number | Precision;
  freeze?: string[];
  color?: Color;
  geojson?: Geotype | null;
  line_variables?: Record<string, any>;
  exclude_openapi: boolean;
};

export type Catalogue = {
  id: string;
  title: string;
  description?: string;
  data_as_of?: string;
  data_source?: Array<string>;
};

export type DCVariable = {
  id: string;
  exclude_openapi: boolean;
  manual_trigger: string;
  title: string;
  description: string;
  link_parquet: string;
  link_csv: string;
  link_preview: string;
  frequency: keyof typeof SHORT_PERIOD;
  data_source: Array<string>;
  fields: Array<DCField>;
  data_as_of: string;
  last_updated: string;
  next_update: string;
  methodology: string;
  caveat: string;
  publication?: string;
  translations: Record<string, string>;
  related_datasets: Array<Pick<Catalogue, "id" | "title" | "description">>;
  dataviz_set: Array<DCDataViz>;
  dropdown: Array<DCFilter>;
  data: Array<Record<string, unknown>>;
};

export type DCField = {
  name: string;
  title: string;
  description: string;
};

export type DCDataViz = {
  dataviz_id: string;
  chart_type: DCChartKeys;
  title: string;
  config: {
    format: Record<"x" | "y", string | Array<string>>;
    precision: number;
    filter_columns?: Array<string>;
    freeze_columns?: Array<string>;
    operation?: string;
    colors?: string;
    geojson?: string;
    slider?: string;
  };
};

type DCDropdown = {
  name: string;
  selected: string;
  options: Array<string>;
};

export interface IDataViz {
  translation_key: string;
  chart_type: DCChartKeys;
  chart_filters: {
    SLICE_BY: Array<string>;
    precision: number;
  };
  chart_variables: {
    parents: Array<string>;
    operation: string;
    format: { x: string; y: Array<string> | string };
    config?: Record<string, unknown>;
  };
}
