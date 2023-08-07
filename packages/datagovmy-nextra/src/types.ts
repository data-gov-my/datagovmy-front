/* eslint typescript-sort-keys/interface: error */
import { PageOpts } from "nextra";
import { ReactNode } from "react";
import { DocsThemeConfig } from "./constants";

export type Context = {
  pageOpts: PageOpts;
  themeConfig: DocsThemeConfig;
};

export type SearchResult = {
  children: ReactNode;
  id: string;
  prefix?: ReactNode;
  route: string;
};
