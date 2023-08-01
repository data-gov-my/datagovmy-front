import type {
  GetServerSideProps,
  GetStaticProps,
  GetServerSidePropsResult,
  GetStaticPropsResult,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import merge from "lodash/merge";
import type { MetaPage } from "./types";
import { existsSync } from "fs";
import { resolve } from "path";
import { I18nConfig } from "../../types/i18n";

type Context = Parameters<GetStaticProps | GetServerSideProps>[0];
type ResolvedProps<T> = GetStaticPropsResult<T> & GetServerSidePropsResult<T>;

/**
 * Decorator function to merge i18n context together with prop. Auto-loads "common" & "agencies" namespace
 * @param {string | string[] | null} namespace Namespaces to load
 * @param {GetStaticProps | GetServerSideProps} getProps Generic "getProps" function
 * @returns {Promise<ResolvedProps>} Merged props with i18n
 *
 * @example {null} i18n(null, ...) // loads "common" & "agencies" namespace only
 * @example {string} i18n("dashboard-999-tracker", ...) // loads "common", "agencies" & "dashboard-999-tracker" namespace
 * @example {string[]} i18n(["dashboard-999-tracker", "dashboard-blood-donation"], ...) // loads "common", "agencies", "dashboard-999-tracker" & "dashboard-blood-donation" namespace
 */
export const withi18n = <T extends Context>(
  namespace: string | string[] | null,
  getProps: (ctx: T) => Promise<ResolvedProps<MetaPage>>
): ((ctx: T) => Promise<ResolvedProps<MetaPage>>) => {
  return async (context: T) => {
    const config = await readNextI18nConfig();
    if (!config) throw new Error("Config next-i18next.config.js is not found");
    const { autoloadNs = [], ...userConfig } = config;

    const namespaces =
      namespace === null
        ? autoloadNs
        : Array.isArray(namespace)
        ? namespace.concat(autoloadNs)
        : [namespace].concat(autoloadNs);

    const [i18n, props] = await Promise.all([
      serverSideTranslations(context.locale!, namespaces, userConfig),
      getProps(context),
    ]);

    return merge(props, { props: i18n });
  };
};

const readNextI18nConfig = async (): Promise<I18nConfig | undefined> => {
  const DEFAULT_CONFIG_PATH = "./next-i18next.config.js";
  const path = resolve(DEFAULT_CONFIG_PATH);

  if (existsSync(path))
    return import(/* webpackIgnore: true */ path).then(config => config.default);
  return undefined;
};
