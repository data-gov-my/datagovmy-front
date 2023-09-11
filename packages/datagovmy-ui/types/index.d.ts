import type { Color } from "./hooks";
import type { ChartOptions, ChartTypeRegistry } from "chart.js";
import type { AnnotationPluginOptions } from "chartjs-plugin-annotation";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type AppPropsLayout = AppProps & {
  Component: Page;
};

export type Page = NextPage & {
  layout?: (page: ReactNode, props: Record<string, any>) => ReactElement;
  theme?: "light" | "dark";
};

// CHART INTERFACE
export type ChartCrosshairOption<T extends keyof ChartTypeRegistry> = ChartOptions<T> & {
  plugins: {
    crosshair?:
      | {
          line: {
            width?: number;
            color?: string;
            dashPattern?: [number, number];
          };
          zoom: {
            enabled: boolean;
          };
          sync: {
            enabled: boolean;
          };
        }
      | false;
    annotation?: AnnotationPluginOptions | false;
    datalabels?: any | false;
  };
};

export type TimeseriesOption = {
  period: "auto" | "month" | "year";
  periodly: "daily_7d" | "daily" | "monthly" | "yearly";
};

export type DashboardPeriod = "daily_7d" | "daily" | "monthly" | "yearly";

export type DownloadOption = {
  id: string;
  image: string | null | false | undefined;
  title: ReactNode;
  description: ReactNode;
  icon: JSX.Element;
  href: () => void;
};

export type DownloadOptions = {
  chart: DownloadOption[];
  data: DownloadOption[];
};

export interface AnalyticsEvent {
  action: string;
  category: string;
  label: string;
  value: string;
}

export type OptionType = {
  label: string;
  value: string;
};

export type Geotype = "state" | "parlimen" | "dun" | "district";

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
  key: string;
  default: string;
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

// Usage
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

/*************************** MIXPANEL ***************************** */

export type EventType =
  | "image_download"
  | "file_download"
  | "page_view"
  | "change_language"
  | "select_dropdown"
  | "code_copy";

export type MixpanelBase = {
  project_id: string | number;
  event: EventType;
};

/**************************MISCELLANEOUS ******************************/
export type MetaPage = Record<string, any> & {
  meta: {
    id: string;
    type: "misc" | "dashboard" | "data-catalogue";
    category:
      | "construction"
      | "democracy"
      | "demography"
      | "digitalisation"
      | "economy"
      | "education"
      | "environment"
      | "financial-sector"
      | "government-programs"
      | "healthcare"
      | "households"
      | "national-accounts"
      | "public-administration"
      | "public-finances"
      | "public-safety"
      | "services"
      | "transportation"
      | "labour-markets"
      | "producer-price"
      | "trade"
      | null;
    agency: string | null;
  };
};

export type WithData<T> = { data_as_of: string; data: T };

export type Agency =
  | "aadk"
  | "bnm"
  | "bomba"
  | "dosm"
  | "epf"
  | "epu"
  | "govt"
  | "icu-jpm"
  | "imigresen"
  | "jakoa"
  | "jpa"
  | "jpj"
  | "jpn"
  | "jps"
  | "ktmb"
  | "kwap"
  | "lhdn"
  | "mampu"
  | "mcmc"
  | "mers-999"
  | "met"
  | "moe"
  | "mof"
  | "moh"
  | "mot"
  | "ntrc"
  | "pdn"
  | "pdrm"
  | "perkeso"
  | "phcorp"
  | "prasarana"
  | "spr"
  | "ssm"
  | "unhcr";
