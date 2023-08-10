import type { NextSeoProps } from "next-seo";
import { DiscordIcon, GitHubIcon } from "nextra/icons";
import { Item } from "nextra/normalize-pages";
import { FC, ReactNode } from "react";
import { isValidElement } from "react";
import { z } from "zod";
import { Anchor, Flexsearch, Footer, Navbar, TOC } from "./components";
import { MatchSorterSearch } from "./components/match-sorter-search";
import { NavBarProps } from "./components/navbar";
import { themeOptionsSchema, ThemeSwitch } from "./components/theme-switch";
import { TOCProps } from "./components/toc";
import { useConfig } from "./contexts";
import { getGitIssueUrl, useGitEditUrl } from "./utils";
import { useTranslation } from "./utils/hooks";

export const DEFAULT_LOCALE = "en";

export const IS_BROWSER = typeof window !== "undefined";

function isReactNode(value: unknown): boolean {
  return value == null || isString(value) || isFunction(value) || isValidElement(value as any);
}

function isFunction(value: unknown): boolean {
  return typeof value === "function";
}

function isString(value: unknown): boolean {
  return typeof value === "string";
}

const i18nSchema = z.array(
  z.strictObject({
    direction: z.enum(["ltr", "rtl"]).optional(),
    locale: z.string(),
    text: z.string(),
  })
);

const reactNode = [isReactNode, { message: "Must be React.ReactNode or React.FC" }] as const;
const fc = [isFunction, { message: "Must be React.FC" }] as const;

export const themeSchema = z.strictObject({
  banner: z.strictObject({
    dismissible: z.boolean(),
    key: z.string(),
    text: z.custom<ReactNode | FC>(...reactNode).optional(),
  }),
  chat: z.strictObject({
    icon: z.custom<ReactNode | FC>(...reactNode),
    link: z.string().startsWith("https://").optional(),
  }),
  components: z.record(z.custom<FC>(...fc)).optional(),
  darkMode: z.boolean(),
  direction: z.enum(["ltr", "rtl"]),
  docsRepositoryBase: z.string().startsWith("https://"),
  editLink: z.strictObject({
    component: z.custom<
      FC<{
        children: ReactNode;
        className?: string;
        filePath?: string;
      }>
    >(...fc),
    text: z.function().returns(z.string()),
  }),
  faviconGlyph: z.string().optional(),
  feedback: z.strictObject({
    content: z.function().returns(z.string()),
    labels: z.string(),
    useLink: z.function().returns(z.string()),
  }),
  footer: z.strictObject({
    component: z.custom<ReactNode | FC>(...reactNode),
    govMy: z.function().returns(z.string()),
    dtsa: z.function().returns(z.string()),
    openSource: z.function().returns(z.string()),
    fe: z.function().returns(z.string()),
    be: z.function().returns(z.string()),
    uiux: z.function().returns(z.string()),
    openData: z.function().returns(z.string()),
    guide: z.function().returns(z.string()),
    tos: z.function().returns(z.string()),
  }),
  gitTimestamp: z.custom<ReactNode | FC<{ timestamp: Date }>>(...reactNode),
  head: z.custom<ReactNode | FC>(...reactNode),
  i18n: i18nSchema,
  logo: z.custom<ReactNode | FC>(...reactNode),
  logoLink: z.boolean().or(z.string()),
  main: z.custom<FC<{ children: ReactNode }>>(...fc).optional(),
  navbar: z.strictObject({
    component: z.custom<ReactNode | FC<NavBarProps>>(...reactNode),
    extraContent: z.custom<ReactNode | FC>(...reactNode).optional(),
  }),
  navigation: z.boolean().or(
    z.strictObject({
      next: z.boolean(),
      prev: z.boolean(),
    })
  ),
  nextThemes: z.strictObject({
    defaultTheme: z.string(),
    forcedTheme: z.string().optional(),
    storageKey: z.string(),
  }),
  notFound: z.strictObject({
    content: z.custom<ReactNode | FC>(...reactNode),
    labels: z.string(),
  }),
  primaryHue: z.number().or(
    z.strictObject({
      dark: z.number(),
      light: z.number(),
    })
  ),
  project: z.strictObject({
    icon: z.custom<ReactNode | FC>(...reactNode),
    link: z.string().startsWith("https://").optional(),
  }),
  search: z.strictObject({
    component: z.custom<ReactNode | FC<{ className?: string; directories: Item[] }>>(...reactNode),
    emptyResult: z.custom<ReactNode | FC>(...reactNode),
    error: z.string().or(z.function().returns(z.string())),
    loading: z.custom<ReactNode | FC>(...reactNode),
    // Can't be React component
    placeholder: z.string().or(z.function().returns(z.string())),
  }),
  serverSideError: z.strictObject({
    content: z.custom<ReactNode | FC>(...reactNode),
    labels: z.string(),
  }),
  sidebar: z.strictObject({
    defaultMenuCollapseLevel: z.number().min(1).int(),
    titleComponent: z.custom<ReactNode | FC<{ title: string; type: string; route: string }>>(
      ...reactNode
    ),
    toggleButton: z.boolean(),
  }),
  themeSwitch: z.strictObject({
    component: z.custom<ReactNode | FC<{ lite?: boolean; className?: string }>>(...reactNode),
    useOptions: themeOptionsSchema.or(z.function().returns(themeOptionsSchema)),
  }),
  toc: z.strictObject({
    component: z.custom<ReactNode | FC<TOCProps>>(...reactNode),
    extraContent: z.custom<ReactNode | FC>(...reactNode),
    float: z.boolean(),
    headingComponent: z.custom<FC<{ id: string; children: string }>>(...fc).optional(),
    title: z.custom<ReactNode | FC>(...reactNode),
  }),
  useNextSeoProps: z.custom<() => NextSeoProps | void>(isFunction),
});

const publicThemeSchema = themeSchema.deepPartial().extend({
  // to have `locale` and `text` as required properties
  i18n: i18nSchema.optional(),
});

export type DocsThemeConfig = z.infer<typeof themeSchema>;
export type PartialDocsThemeConfig = z.infer<typeof publicThemeSchema>;

export const DEFAULT_THEME: DocsThemeConfig = (() => {
  // const { t } = useTranslation();
  return {
    banner: {
      dismissible: true,
      key: "nextra-banner",
    },
    chat: {
      icon: (
        <>
          <DiscordIcon />
          <span className="sr-only">Discord</span>
        </>
      ),
    },
    darkMode: true,
    direction: "ltr",
    docsRepositoryBase: "https://github.com/data-gov-my/datagovmy-front/tree/main/apps/docs",
    editLink: {
      component: function EditLink({ className, filePath, children }) {
        const editUrl = useGitEditUrl(filePath);
        if (!editUrl) {
          return null;
        }
        return (
          <Anchor className={className} href={editUrl}>
            {children}
          </Anchor>
        );
      },
      text() {
        const { t } = useTranslation();
        return t("common.edit-github");
      },
    },
    feedback: {
      content() {
        const { t } = useTranslation();
        return t("common.feedback");
      },
      labels: "feedback",
      useLink() {
        const config = useConfig();
        return getGitIssueUrl({
          labels: config.feedback.labels,
          repository: config.docsRepositoryBase,
          title: `Feedback for “${config.title}”`,
        });
      },
    },
    footer: {
      component: Footer,
      govMy() {
        const { t } = useTranslation();
        return t("footer.govt");
      },
      dtsa() {
        const { t } = useTranslation();
        return t("footer.dtsa");
      },
      openSource() {
        const { t } = useTranslation();
        return t("footer.open-source");
      },
      fe() {
        const { t } = useTranslation();
        return t("footer.fe");
      },
      be() {
        const { t } = useTranslation();
        return t("footer.be");
      },
      uiux() {
        const { t } = useTranslation();
        return t("footer.uiux");
      },
      openData() {
        const { t } = useTranslation();
        return t("footer.open-data");
      },
      guide() {
        const { t } = useTranslation();
        return t("footer.guide");
      },
      tos() {
        const { t } = useTranslation();
        return t("footer.tos");
      },
    },
    gitTimestamp: ({ timestamp }) => {
      const { t, locale } = useTranslation();
      return (
        <>
          {t("common.last-updated")}{" "}
          <time dateTime={timestamp.toISOString()}>
            {timestamp.toLocaleDateString(locale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </>
      );
    },
    head: (
      <>
        <meta name="msapplication-TileColor" content="#fff" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="apple-mobile-web-app-title" content="Open API Docs" />
      </>
    ),
    i18n: [],
    logo: (
      <>
        <span className="font-extrabold">data.gov.my-nextra</span>
      </>
    ),
    logoLink: true,
    navbar: {
      component: Navbar,
    },
    navigation: true,
    nextThemes: {
      defaultTheme: "system",
      storageKey: "theme",
    },
    notFound: {
      content: () => {
        const { t } = useTranslation();
        return t("common.error-500");
      },
      labels: "bug",
    },
    primaryHue: {
      dark: 204,
      light: 212,
    },
    project: {
      icon: (
        <>
          <GitHubIcon />
          <span className="sr-only">GitHub</span>
        </>
      ),
    },
    search: {
      component: ({ className, directories }) => {
        const config = useConfig();
        return config.flexsearch ? (
          <Flexsearch className={className} />
        ) : (
          <MatchSorterSearch className={className} directories={directories} />
        );
      },
      emptyResult: () => {
        const { t } = useTranslation();
        return (
          <span className="block select-none p-8 text-center text-sm text-gray-400">
            {t("common.empty-result")}
          </span>
        );
      },
      error: "Failed to load search index.",
      loading: () => {
        const { t } = useTranslation();
        return `${t("common.loading")}...`;
      },
      placeholder: () => {
        const { t } = useTranslation();
        return `${t("common.search-docs")}...`;
      },
    },
    serverSideError: {
      content: () => {
        const { t } = useTranslation();
        return t("common.error-500");
      },
      labels: "bug",
    },
    sidebar: {
      defaultMenuCollapseLevel: 2,
      titleComponent: ({ title }) => <>{title}</>,
      toggleButton: true,
    },
    themeSwitch: {
      component: ThemeSwitch,
      useOptions() {
        // const { locale } = useRouter();
        // if (locale === "zh-CN") {
        //   return { dark: "深色主题", light: "浅色主题", system: "系统默认" };
        // }
        return { dark: "Dark", light: "Light", system: "System" };
      },
    },
    toc: {
      component: TOC,
      float: true,
      title: "On This Page",
    },
    useNextSeoProps: () => ({ titleTemplate: "%s – OpenAPI" }),
  };
})();

export const DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME)
  .map(([key, value]) => {
    const isObject =
      value && typeof value === "object" && !Array.isArray(value) && !isValidElement(value);
    if (isObject) {
      return key;
    }
  })
  .filter(Boolean);
