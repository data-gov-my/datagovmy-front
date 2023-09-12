import { UserConfig } from "next-i18next";

export type I18nConfig = UserConfig & { autoloadNs: string[] };

export type defineConfig = (namespace: string[], autoloadNs: string[]) => I18nConfig;
