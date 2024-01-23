import { useContext } from "react";
import { AnalyticsContext, DownloadFileFormat } from "../contexts/analytics";
import { track as mixpanel_track } from "../lib/mixpanel";

/**
 * For data-catalogue only.
 */
export const useAnalytics = (dataset: any) => {
  const { result, update_download } = useContext(AnalyticsContext);

  const track = (ext: DownloadFileFormat) => {
    const meta = {
      uid: dataset.meta.unique_id.concat(`_${ext}`),
      id: dataset.meta.unique_id,
      name: dataset.meta.title,
      type: ["svg", "png"].includes(ext) ? "image" : "file",
      ext,
    };
    mixpanel_track(["svg", "png"].includes(ext) ? "file_download" : "image_download", meta);
    update_download(dataset.meta.unique_id, ext);
  };
  return { result, track };
};
