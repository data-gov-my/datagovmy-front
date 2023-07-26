import mixpanel from "mixpanel-browser";

type EventType =
  | "image_download"
  | "file_download"
  | "page_view"
  | "change_language"
  | "select_dropdown"
  | "code_copy";

/**
 * Mixpanel track events.
 * @param event file_download | file_download | page_view | change_language | select_dropdown
 * @param prop Object
 */
export const track = (event: EventType, prop?: Record<string, any>): void => {
  mixpanel.track(event, prop);
};

/**
 * Mixpanel track session period.
 */
export const init_session = (): void => {
  mixpanel.time_event("page_view");
};

/**
 * GoogleAnalytics track - https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 * @param url URL path
 */
export const ga_track = (url: string) => {
  window.gtag("config", process.env.NEXT_PUBLIC_GA_TAG as string, {
    page_path: url,
  });
};
