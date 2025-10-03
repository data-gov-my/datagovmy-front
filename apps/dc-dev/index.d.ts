declare namespace NodeJS {
  export interface ProcessEnv {
    APP_URL: string;
    APP_ENV: string;
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_APP_ENV: "development" | "staging" | "production";
    NEXT_PUBLIC_AI_URL: string;
    REVALIDATE_TOKEN: string;
    AUTH_TOKEN: string;
    ANALYZE: boolean;

    NEXT_PUBLIC_AUTHORIZATION_TOKEN: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_TILESERVER_URL: string;
    NEXT_PUBLIC_GA_TAG: string;
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
