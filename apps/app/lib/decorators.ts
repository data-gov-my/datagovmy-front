import type {
  GetServerSideProps,
  GetStaticProps,
  GetServerSidePropsResult,
  GetStaticPropsResult,
} from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import merge from "lodash/merge";
import type { MetaPage } from "./types";
import nextI18nextConfig from "../next-i18next.config";

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
    const namespaces =
      namespace === null
        ? ["common", "agencies"]
        : Array.isArray(namespace)
        ? namespace.concat("common", "agencies")
        : [namespace].concat("common", "agencies");

    const [i18n, props] = await Promise.all([
      serverSideTranslations(context.locale!, namespaces, nextI18nextConfig),
      getProps(context),
    ]);

    return merge({}, { props: i18n }, props);
  };
};
