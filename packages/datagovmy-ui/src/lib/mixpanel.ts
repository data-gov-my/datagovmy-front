import { EventType } from "../../types";

/**
 * Mixpanel track events.
 * @param event file_download | file_download | page_view | change_language | select_dropdown
 * @param prop Object
 */
export const track = (event: EventType, prop?: Record<string, any>): void => {
  if (window.mixpanel?.instance) window.mixpanel.instance.track(event, prop);
};

/**
 * Mixpanel track session period.
 */
export const init_session = (): void => {
  if (window.mixpanel?.instance) window.mixpanel.instance.time_event("page_view");
};

/**
 * GoogleAnalytics track - https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 * @param url URL path
 */
export const ga_track = (url: string): void => {
  if (window.gtag) window.gtag("config", process.env.NEXT_PUBLIC_GA_TAG, { page_path: url });
};
