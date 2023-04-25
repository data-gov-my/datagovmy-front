import { GetServerSideProps, GetStaticProps } from "next";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import type { ParsedUrlQuery } from "querystring";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import merge from "lodash/merge";

type Context = Parameters<GetStaticProps | GetServerSideProps>[0];
export type UniversalContext = GetStaticPropsContext<ParsedUrlQuery> &
  GetServerSidePropsContext<ParsedUrlQuery>;

type ResolvedProps = GetStaticPropsResult<{}> & GetServerSidePropsResult<{}>;

/**
 * Decorator function to merge i18n context together with prop. Auto-loads "common" namespace
 * @param {string | string[] | null} namespace Namespaces to load
 * @param {Function} getStaticProps GetStaticProps Function
 * @returns {Promise<ResolvedProps>} Merged props with i18n
 *
 * @example {null} i18n(null, ...) // loads "common" namespace only
 * @example {string} i18n("dashboard-999-tracker", ...) // loads "common" & "dashboard-999-tracker" namespace
 * @example {string[]} i18n(["dashboard-999-tracker", "dashboard-blood-donation"], ...) // loads "common","dashboard-999-tracker" & "dashboard-blood-donation" namespace
 */
export const withi18n = <T extends Context>(
  namespace: string | string[] | null,
  getProps: (ctx: T) => Promise<ResolvedProps>
): ((ctx: T) => Promise<ResolvedProps>) => {
  return async (context: T) => {
    const props = await getProps(context);
    const i18n = await serverSideTranslations(
      context.locale!,
      namespace !== null ? ["common"].concat(namespace) : ["common"],
      null
    );
    return merge({ props: i18n }, props);
  };
};
