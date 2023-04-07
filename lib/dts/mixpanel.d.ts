import type { OverridedMixpanel } from "mixpanel-browser";

declare global {
  interface Window {
    mixpanel: OverridedMixpanel;
  }
}
