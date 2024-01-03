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

export type DownloadFileFormat = "svg" | "png" | "csv" | "parquet";

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
  update_download: T extends "dasboard" ? never : (id: string, format: DownloadFileFormat) => void;
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
  update_download() {},
});

export const AnalyticsProvider: FunctionComponent<ContextChildren> = ({ meta, children }) => {
  const [data, setData] = useState<AnalyticsResult<"dashboard" | "data-catalogue"> | undefined>();
  const router = useRouter();
  // auto-increment view count for id
  useEffect(() => {
    track(meta.id, meta.type, "view_count");
  }, [router.asPath]);

  // Tinybird increment view count
  const track = async (id: string, type: Meta["type"], metric: MetricType) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/events?name=${
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
      const updatedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/pipes/${
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
      const { data } = await updatedResponse.json();

      if (type === "data-catalogue") {
        const downloadsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/pipes/${
            process.env.NEXT_PUBLIC_APP_ENV === "production" ? "prod" : "staging"
          }_dgmy_dc_downlaods_id_pipe.json?catalogue_id=${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TINYBIRD_TOKEN}`,
            },
          }
        );
        if (downloadsResponse.ok) {
          const { data: download_count } = await downloadsResponse.json();
          const download_data = {
            download_csv:
              download_count.find((list: any) => list.format === "csv")?.total_downloads ?? 0,
            download_parquet:
              download_count.find((list: any) => list.format === "parquet")?.total_downloads ?? 0,
            download_png:
              download_count.find((list: any) => list.format === "png")?.total_downloads ?? 0,
            download_svg:
              download_count.find((list: any) => list.format === "svg")?.total_downloads ?? 0,
          };

          setData({
            ...data.find((item: any) => item.id === id && item.type === type),
            ...download_data,
          });
        } else {
          const download_data = {
            download_csv: 0,
            download_parquet: 0,
            download_png: 0,
            download_svg: 0,
          };
          setData({
            ...data.find((item: any) => item.id === id && item.type === type),
            ...download_data,
          });
        }
      } else {
        setData(data.find((item: any) => item.id === id && item.type === type));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // For DC only. Tinybird update download count for DC.
  const updateDownloadCount = async (id: string, format: DownloadFileFormat) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/events?name=${
          process.env.NEXT_PUBLIC_APP_ENV === "production" ? "prod" : "staging"
        }_dgmy_dc_downloads`,
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
            format: format,
          }),
        }
      );

      if (response.ok) {
        setData(
          data && {
            ...data,
            [`download_${format}`]: data[`download_${format}`] + 1,
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AnalyticsContext.Provider
      value={{ result: data, realtime_track: track, update_download: updateDownloadCount }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
