import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactNode } from "react";

export type AppPropsLayout = AppProps & {
  Component: Page;
};

export type Page = NextPage & {
  layout?: (page: ReactNode, props: Record<string, any>) => ReactNode;
};

export type TimeseriesOption = {
  period: "auto" | "month" | "year";
  periodly: "daily_7d" | "daily" | "monthly" | "yearly";
};
