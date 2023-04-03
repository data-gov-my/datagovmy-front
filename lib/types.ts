import type { ChartOptions, ChartTypeRegistry } from "chart.js";
import { AnnotationPluginOptions } from "chartjs-plugin-annotation";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type AppPropsLayout = AppProps & {
  Component: Page;
};

export type Page = NextPage & {
  layout?: (page: ReactNode) => ReactElement;
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
  };
};

export type DownloadOption = {
  key: string;
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
