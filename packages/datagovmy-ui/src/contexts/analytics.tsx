import { MetaPage } from "../../types";
import { FunctionComponent, ReactNode, createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DateTime } from "luxon";

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
  total_views: number;
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
  const router = useRouter();
  // auto-increment view count for id
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      track(meta.id, meta.type, "view_count");
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events, meta]);

  // increment activity count
  const track = async (id: string, type: Meta["type"], metric: MetricType) => {
    try {
      const response = await fetch(
        `https://api.tinybird.co/v0/events?name=${
          process.env.NEXT_PUBLIC_APP_ENV === "production" ? "prod" : "staging"
        }_dgmy_views`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TINYBIRD_TOKEN}`,
          },
          body: JSON.stringify({
            id: id,
            timestamp: DateTime.now().toSQL({ includeOffset: false }),
            type: type,
          }),
        }
      );

      // Get updated view-count after POST request completed
      const updateResponse = await fetch(
        `https://api.tinybird.co/v0/pipes/${
          process.env.NEXT_PUBLIC_APP_ENV === "production" ? "prod" : "staging"
        }_dgmy_views_id_pipe.json?page_id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TINYBIRD_TOKEN}`,
          },
        }
      );
      const { data } = await updateResponse.json();
      setData(data.find((item: any) => item.id === id && item.type === type));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AnalyticsContext.Provider value={{ result: data, realtime_track: track }}>
      {children}
    </AnalyticsContext.Provider>
  );
};
