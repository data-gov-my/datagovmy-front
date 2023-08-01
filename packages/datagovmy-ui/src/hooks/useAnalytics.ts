import { useContext } from "react";
import { AnalyticsContext } from "../contexts/analytics";
import { track as mixpanel_track } from "../lib/mixpanel";

/**
 * For data-catalogue only.
 */
export const useAnalytics = (dataset: any) => {
  const { result, realtime_track } = useContext(AnalyticsContext);

  const track = (ext: "svg" | "png" | "csv" | "parquet") => {
    const meta = {
      uid: dataset.meta.unique_id.concat(`_${ext}`),
      id: dataset.meta.unique_id,
      name: dataset.meta.title,
      type: ["svg", "png"].includes(ext) ? "image" : "file",
      ext,
    };
    mixpanel_track(["svg", "png"].includes(ext) ? "file_download" : "image_download", meta);
    realtime_track(dataset.meta.unique_id, "data-catalogue", `download_${ext}`);
  };
  return { result, track };
};
