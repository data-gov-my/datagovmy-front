declare namespace NodeJS {
  export interface ProcessEnv {
    APP_URL: string;
    REVALIDATE_TOKEN: string;

    NEXT_PUBLIC_AUTHORIZATION_TOKEN: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_GMAP_API_KEY: string;
    NEXT_PUBLIC_MAPTILER_API_KEY: string;
  }
}

declare module "*.gql" {
  import { DocumentNode } from "graphql";
  const Schema: DocumentNode;

  export = Schema;
}

declare module "chartjs-plugin-crosshair" {
  export const CrosshairPlugin: any;
  export const Interpolate: any;

  export interface InteractionModeMap {
    interpolate: Function;
  }
}
