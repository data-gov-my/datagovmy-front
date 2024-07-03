import { MetaPage } from "../../types";
import {
  FunctionComponent,
  ReactNode,
  createContext,
  useEffect,
  useState,
  useContext,
} from "react";
import { useRouter } from "next/router";
import { DateTime } from "luxon";
import { v4 as uuidv4 } from "uuid";
import { UAParser } from "ua-parser-js";

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
  total_downloads: T extends "dashboard" ? never : number;
  download_csv: T extends "dashboard" ? never : number;
  download_parquet: T extends "dashboard" ? never : number;
  download_png: T extends "dashboard" ? never : number;
  download_svg: T extends "dashboard" ? never : number;
};

type AnalyticsContextProps<T extends "dashboard" | "data-catalogue"> = {
  result?: Partial<AnalyticsResult<T>>;
  realtime_track: (id: string, type: Meta["type"], metric: MetricType) => void;
  update_download: T extends "dasboard" ? never : (id: string, format: DownloadFileFormat) => void;
  send_new_analytics: (
    id: string,
    type: "dashboard" | "data-catalogue" | "publication",
    pageEvent: "page_view" | "file_download",
    additionalData?: {
      format?: string;
      publication_id?: string;
      resource_id?: number;
    }
  ) => Promise<void>;
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
  send_new_analytics: async (id, type, pageEvent, additionalData) => {},
});

interface GeolocationData {
  country: string;
  city: string;
  timestamp: number;
}

async function getGeolocation(): Promise<GeolocationData> {
  const GEOLOCATION_CACHE_KEY = "userGeolocation";
  const CACHE_DURATION = 24 * 60 * 60 * 1000;

  const cachedData = localStorage.getItem(GEOLOCATION_CACHE_KEY);
  if (cachedData) {
    const parsedData: GeolocationData = JSON.parse(cachedData);
    if (Date.now() - parsedData.timestamp < CACHE_DURATION) {
      return parsedData;
    }
  }

  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error("Failed to fetch geolocation data");
    }
    const data = await response.json();
    const geolocationData: GeolocationData = {
      country: data.country_name,
      city: data.city,
      timestamp: Date.now(),
    };

    localStorage.setItem(GEOLOCATION_CACHE_KEY, JSON.stringify(geolocationData));

    return geolocationData;
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return {
      country: "Unknown",
      city: "Unknown",
      timestamp: Date.now(),
    };
  }
}

function generateVisitorID(): string {
  let visitorId = localStorage.getItem("visitorId");
  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem("visitorId", visitorId);
  }
  return visitorId;
}

function getBrowser(): string {
  const parser = new UAParser();
  const result = parser.getBrowser();
  if (!result.name) {
    return "Unknown browser";
  }
  return result.name;
}

function getOS(): string {
  const parser = new UAParser();
  const result = parser.getOS();
  if (!result.name) {
    return "Unknown OS";
  }
  return result.name;
}

export const AnalyticsProvider: FunctionComponent<ContextChildren> = ({ meta, children }) => {
  const [data, setData] = useState<AnalyticsResult<"dashboard" | "data-catalogue"> | undefined>();
  const router = useRouter();

  // send new analytics data when the component mounts or when the route change
  useEffect(() => {
    let isInitialMount = true;
    const handleRouteChange = () => {
      if (isInitialMount) {
        isInitialMount = false;
        return;
      }
      sendNewAnalytics(
        meta.id,
        meta.type as "dashboard" | "data-catalogue" | "publication",
        "page_view"
      );
    };

    sendNewAnalytics(
      meta.id,
      meta.type as "dashboard" | "data-catalogue" | "publication",
      "page_view"
    );

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [meta, router]);

  // auto-increment view count for id
  useEffect(() => {
    track(meta.id, meta.type, "view_count");
  }, [router.asPath]);

  // Tinybird increment view count
  const track = async (id: string, type: Meta["type"], metric: MetricType) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/events?name=dgmy_views&wait=true`,
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
        `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/pipes/dgmy_total_views_by_id.json?page_id=${id}&page_type=${type}`,
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
          `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/pipes/dgmy_dc_analytics.json?catalogue_id=${id}`,
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
          const download_data = Object.assign(
            {},
            ...download_count.map((count: any) => {
              if (count.type === "total_views" || count.type === "total_downloads") {
                return { [count.type]: count.count };
              } else {
                return { [`download_${count.type}`]: count.count };
              }
            })
          );

          setData(download_data);
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
        `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/events?name=dgmy_dc_dls`,
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
            [`download_${format}`]: data[`download_${format}`] ? data[`download_${format}`] + 1 : 1,
            [`total_downloads`]: data[`total_downloads`] ? data[`total_downloads`] + 1 : 1,
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Send new data sources analytics to TinyBird
  const sendNewAnalytics = async (
    id: string,
    type: "dashboard" | "data-catalogue" | "publication",
    pageEvent: "page_view" | "file_download",
    additionalData?: {
      format?: string;
      publication_id?: string;
      resource_id?: number;
    }
  ) => {
    try {
      const { country, city } = await getGeolocation();

      let payload: any;

      if (pageEvent === "page_view") {
        payload = { type, id };
      } else if (pageEvent === "file_download") {
        if (type === "data-catalogue") {
          payload = {
            format: additionalData?.format,
            type: "data-catalogue",
            id,
          };
        } else if (type === "publication") {
          payload = {
            format: additionalData?.format,
            type: "publication",
            publication_id: additionalData?.publication_id,
            resource_id: additionalData?.resource_id,
          };
        }
      }

      const analyticsData = {
        timestamp: new Date().toISOString(),
        country,
        city,
        unique_session_id: generateVisitorID(),
        browser: getBrowser(),
        os: getOS(),
        screen_height: window.screen.height,
        screen_width: window.screen.width,
        device_language: navigator.language,
        referer: document.referrer,
        page_event: pageEvent,
        domain: window.location.origin,
        path: window.location.pathname,
        payload: JSON.stringify(payload),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_TINYBIRD_URL}/events?name=opendata_analytics`,
        {
          method: "POST",
          headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_TINYBIRD_TOKEN}`,
          },
          body: JSON.stringify(analyticsData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send new analytics data");
      }
    } catch (error) {
      console.error("Error sending new analytics data:", error);
    }
  };

  return (
    <AnalyticsContext.Provider
      value={{
        result: data,
        realtime_track: track,
        update_download: updateDownloadCount,
        send_new_analytics: sendNewAnalytics,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};
