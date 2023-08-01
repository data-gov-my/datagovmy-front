import type { ChartOptions, ChartTypeRegistry } from "chart.js";
import type { AnnotationPluginOptions } from "chartjs-plugin-annotation";
import type { Color } from "datagovmy-ui/hooks";
import type { OptionType } from "datagovmy-ui/types";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type AppPropsLayout = AppProps & {
  Component: Page;
};

export type Page = NextPage & {
  layout?: (page: ReactNode) => ReactElement;
};

export type Geotype = "state" | "parlimen" | "dun" | "district";

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
  };
};

export type DownloadOption = {
  id: string;
  image: string | null | false | undefined;
  title: ReactNode;
  description: ReactNode;
  icon: JSX.Element;
  href: string | (() => void);
};

export type DownloadOptions = {
  chart: DownloadOption[];
  data: DownloadOption[];
};

export type ChoroplethColors =
  | "BrBG"
  | "PRGn"
  | "PiYG"
  | "PuOr"
  | "RdBu"
  | "RdGy"
  | "RdYlBu"
  | "RdYlGn"
  | "spectral"
  | "blues"
  | "greens"
  | "greys"
  | "oranges"
  | "purples"
  | "reds"
  | "BuGn"
  | "BuPu"
  | "GnBu"
  | "OrRd"
  | "PuBuGn"
  | "PuBu"
  | "PuRd"
  | "RdPu"
  | "YlGnBu"
  | "YlGn"
  | "YlOrBr"
  | "YlOrRd";

export interface AnalyticsEvent {
  action: string;
  category: string;
  label: string;
  value: string;
}

/*************************** MIXPANEL ***************************** */

export type EventType =
  | "file_download"
  | "page_view"
  | "change_language"
  | "select_dropdown"
  | "code_copy";

export type MixpanelBase = {
  project_id: string | number;
  event: EventType;
};

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
  | "STACKED_BAR";
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

// Usage
export type DCConfig = {
  context: {
    [key: string]: OptionType;
  };
  dates: FilterDate | null;
  options: FilterDefault[] | null;
  precision: number;
  freeze?: string[];
  color?: Color;
  geojson?: Geotype | null;
  line_variables?: Record<string, any>;
};
