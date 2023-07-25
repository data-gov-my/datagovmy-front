import type { ChartOptions } from "chart.js";
import {
  AnnotationOptions,
  AnnotationPluginOptions,
  LabelAnnotationOptions,
} from "chartjs-plugin-annotation";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement } from "react";

export type { ReactElement, ReactNode } from "react";

export type AppPropsLayout = AppProps & {
  Component: Page;
};

export type Page = NextPage & {
  layout?: (page: ReactElement) => ReactElement;
};

// CHART INTERFACE
export interface IChart {
  id: string;
  keys: string[];
  data: any;
  [key: string]: any;
}

export type ChartCrosshairOption = ChartOptions & {
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
export type BarCrosshairOption = ChartOptions<"bar"> & ChartCrosshairOption;
export type LineCrosshairOption = ChartOptions<"line"> & ChartCrosshairOption;
