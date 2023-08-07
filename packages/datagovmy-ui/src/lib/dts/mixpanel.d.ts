import { OverridedMixpanel, Mixpanel } from "mixpanel-browser";

declare global {
  interface Window {
    mixpanel: OverridedMixpanel & {
      instance: Mixpanel;
    };
  }
}
