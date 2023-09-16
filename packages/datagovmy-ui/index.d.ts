declare namespace NodeJS {
  export interface ProcessEnv {
    APP_URL: string;
    APP_ENV: string;
    NEXT_PUBLIC_APP_ENV: "production" | "staging" | "development";
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_AI_URL: string;
    NEXT_PUBLIC_I18N_URL: string;
    NEXT_PUBLIC_AUTHORIZATION_TOKEN: string;

    REVALIDATE_TOKEN: string;
    AUTH_TOKEN: string;
    ANALYZE: string;

    NEXT_PUBLIC_TILESERVER_URL: string;
    NEXT_PUBLIC_GA_TAG: string;

    MIXPANEL_TOKEN: string;
    MIXPANEL_PROJECT_ID: string;
    MIXPANEL_SA_USER: string;
    MIXPANEL_SA_SECRET: string;
    NEXT_PUBLIC_MIXPANEL_TOKEN: string;
  }
}

declare module "chartjs-plugin-crosshair" {
  export const CrosshairPlugin: any;
  export const Interpolate: any;

  export interface InteractionModeMap {
    interpolate: Function;
  }
}

// canvas2svg mock typings
declare module "canvas2svg" {
  export default (width: number, height: number) => any;
  getSerializedSvg();
}

declare module "geojson-bbox" {
  export default function (geojson: GeoJSONObject): [number, number, number, number] {}
}
