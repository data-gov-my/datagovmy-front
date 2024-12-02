import { _DeepPartialObject } from "chart.js/types/utils";
import type { Color } from "./hooks";
import type { ChartOptions, ChartTypeRegistry } from "chart.js";
import type { AnnotationPluginOptions } from "chartjs-plugin-annotation";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import { Options } from "chartjs-plugin-datalabels/types/options";

export type SiteName = "opendosm" | "kkmnow" | "datagovmy";

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
    datalabels?: _DeepPartialObject<Options> | false;
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
    type: "misc" | "dashboard" | "data-catalogue" | "publication";
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
  | "audit"
  | "bnm"
  | "bomba"
  | "doa"
  | "dosm"
  | "epf"
  | "epu"
  | "govt"
  | "icu-jpm"
  | "imigresen"
  | "jakoa"
  | "janm"
  | "jas"
  | "jdn"
  | "jmg"
  | "jpa"
  | "jpj"
  | "jpn"
  | "kdn"
  | "kpdn"
  | "kpkt"
  | "jps"
  | "ktmb"
  | "kwap"
  | "lhdn"
  | "mafs"
  | "mampu"
  | "mcmc"
  | "mers-999"
  | "met"
  | "moe"
  | "mof"
  | "moh"
  | "mohe"
  | "mot"
  | "napic"
  | "npra"
  | "nres"
  | "ntrc"
  | "parlimen"
  | "penjara"
  | "perhutanan"
  | "perikanan"
  | "pdn"
  | "pdrm"
  | "perkeso"
  | "phcorp"
  | "prasarana"
  | "sesb"
  | "span"
  | "st"
  | "swk-energy"
  | "spr"
  | "ssm"
  | "tnb"
  | "unhcr";

export type StateCode =
  | "mys"
  | "jhr"
  | "kdh"
  | "ktn"
  | "kul"
  | "lbn"
  | "mlk"
  | "nsn"
  | "phg"
  | "prk"
  | "pls"
  | "png"
  | "pjy"
  | "sbh"
  | "swk"
  | "sgr"
  | "trg";
