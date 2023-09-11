import { post } from "../lib/api";
import { MetaPage } from "../../types";
import { FunctionComponent, ReactNode, createContext, useEffect, useState } from "react";

/**
 * Realtime view count for dashboard & data-catalogue.
 * @param {MetaPage['meta']} meta
 * @returns {{analytics: }} cache
 */

/**
 * id (required):
 * type: "dashboard" | "data-catalogue"
 * metric" "view_count" | "download_png" | "download_csv" | "download_svg" | "download_parquet"
 */
type MetricType =
  | "view_count"
  | "download_png"
  | "download_csv"
  | "download_svg"
  | "download_parquet";

export type Meta = Omit<MetaPage["meta"], "type"> & { type: "dashboard" | "data-catalogue" };

type AnalyticsResult<T extends "dashboard" | "data-catalogue"> = {
  id: string;
  type: T;
  view_count: number;
  download_csv: T extends "dashboard" ? never : number;
  download_parquet: T extends "dashboard" ? never : number;
  download_png: T extends "dashboard" ? never : number;
  download_svg: T extends "dashboard" ? never : number;
};

type AnalyticsContextProps<T extends "dashboard" | "data-catalogue"> = {
  result?: Partial<AnalyticsResult<T>>;
  realtime_track: (id: string, type: Meta["type"], metric: MetricType) => void;
};

interface ContextChildren {
  meta: Meta;
  children: ReactNode;
}

export const AnalyticsContext = createContext<
  AnalyticsContextProps<"dashboard" | "data-catalogue">
>({
  result: {},
  realtime_track(id, type, metric) {},
});

export const AnalyticsProvider: FunctionComponent<ContextChildren> = ({ meta, children }) => {
  const [data, setData] = useState<AnalyticsResult<"dashboard" | "data-catalogue"> | undefined>();
  // auto-increment view count for id
  useEffect(() => {
    track(meta.id, meta.type, "view_count");
  }, []);

  // increment activity count
  const track = (id: string, type: Meta["type"], metric: MetricType) => {
    post(`/view-count/?id=${id}&type=${type}&metric=${metric}`, null, "api")
      .then(response => setData(response.data))
      .catch(e => console.error(e));
  };

  return (
    <AnalyticsContext.Provider value={{ result: data, realtime_track: track }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
