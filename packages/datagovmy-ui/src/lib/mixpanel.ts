/**
 * GoogleAnalytics track - https://developers.google.com/analytics/devguides/collection/gtagjs/pages
 * @param url URL path
 */
export const ga_track = (url: string): void => {
  if (window.gtag) window.gtag("config", process.env.NEXT_PUBLIC_GA_TAG, { page_path: url });
};
