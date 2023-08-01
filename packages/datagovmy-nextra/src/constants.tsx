import type { NextSeoProps } from "next-seo";
import { useRouter } from "next/router";
import { DiscordIcon, GitHubIcon } from "nextra/icons";
import type { Item } from "nextra/normalize-pages";
import type { FC, ReactNode } from "react";
import { isValidElement } from "react";
import { z } from "zod";
import { Anchor, Flexsearch, Footer, Navbar, TOC } from "./components";
import { MatchSorterSearch } from "./components/match-sorter-search";
import type { NavBarProps } from "./components/navbar";
import { themeOptionsSchema, ThemeSwitch } from "./components/theme-switch";
import type { TOCProps } from "./components/toc";
import { useConfig } from "./contexts";
import { getGitIssueUrl, useGitEditUrl } from "./utils";

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

const LOADING_LOCALES: Record<string, string> = {
  "en": "Loading",
  "ms": "Memuatkan",
  "fr": "Сhargement",
  "ru": "Загрузка",
  "zh-CN": "正在加载",
};

const PLACEHOLDER_LOCALES: Record<string, string> = {
  "en": "Search documentation",
  "ms": "Cari dokumentasi",
  "fr": "Rechercher documents",
  "ru": "Поиск документации",
  "zh-CN": "搜索文档",
};

const FEEDBACK_LOCALES: Record<string, string> = {
  en: "Question? Give us feedback →",
  ms: "Ada soalan? Berikan maklum balas kepada kami →",
};

const EDIT_LOCALES: Record<string, string> = {
  en: "Edit this page on GitHub →",
  ms: "Sunting laman ini di GitHub →",
};

const UPDATED_LOCALES: Record<string, string> = {
  en: "Last updated on",
  ms: "Kemaskini terakhir pada",
};

type FooterProps = {
  govMy: string;
  dtsa: string;
  openSource: string;
  fe: string;
  be: string;
  uiux: string;
  openData: string;
  guide: string;
  tos: string;
};

const FOOTER_LOCALES: Record<string, FooterProps> = {
  en: {
    govMy: "Government of Malaysia",
    dtsa: "© 2023 Public Sector Open Data",
    openSource: "Open Source",
    fe: "Frontend Repo: NextJS",
    be: "Backend Repo: Django",
    uiux: "UI + UX Design: Figma",
    openData: "Open Data",
    guide: "Guiding Principles",
    tos: "Terms of Use",
  },
  ms: {
    govMy: "Kerajaan Malaysia",
    dtsa: "© 2023 Data Terbuka Sektor Awam",
    openSource: "Sumber Terbuka",
    fe: "Repo 'Frontend': NextJS",
    be: "Repo 'Backend': Django",
    uiux: "Reka Bentuk UI + UX: Figma",
    openData: "Data Terbuka",
    guide: "Prinsip Panduan",
    tos: "Syarat Penggunaan",
  },
};

export const DEFAULT_THEME: DocsThemeConfig = {
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
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const edit = (locale && EDIT_LOCALES[locale]) || EDIT_LOCALES[defaultLocale];
      return edit;
    },
  },
  feedback: {
    content() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const feedback = (locale && FEEDBACK_LOCALES[locale]) || FEEDBACK_LOCALES[defaultLocale];
      return feedback;
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
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const govMy = (locale && FOOTER_LOCALES[locale].govMy) || FOOTER_LOCALES[defaultLocale].govMy;
      return govMy;
    },
    dtsa() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const dtsa = (locale && FOOTER_LOCALES[locale].dtsa) || FOOTER_LOCALES[defaultLocale].dtsa;
      return dtsa;
    },
    openSource() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const openSource =
        (locale && FOOTER_LOCALES[locale].openSource) || FOOTER_LOCALES[defaultLocale].openSource;
      return openSource;
    },
    fe() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const fe = (locale && FOOTER_LOCALES[locale].fe) || FOOTER_LOCALES[defaultLocale].fe;
      return fe;
    },
    be() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const be = (locale && FOOTER_LOCALES[locale].be) || FOOTER_LOCALES[defaultLocale].be;
      return be;
    },
    uiux() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const uiux = (locale && FOOTER_LOCALES[locale].uiux) || FOOTER_LOCALES[defaultLocale].uiux;
      return uiux;
    },
    openData() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const openData =
        (locale && FOOTER_LOCALES[locale].openData) || FOOTER_LOCALES[defaultLocale].openData;
      return openData;
    },
    guide() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const guide = (locale && FOOTER_LOCALES[locale].guide) || FOOTER_LOCALES[defaultLocale].guide;
      return guide;
    },
    tos() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const tos = (locale && FOOTER_LOCALES[locale].tos) || FOOTER_LOCALES[defaultLocale].tos;
      return tos;
    },
  },
  gitTimestamp: function GitTimestamp({ timestamp }) {
    const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
    return (
      <>
        {(locale && UPDATED_LOCALES[locale]) || UPDATED_LOCALES[defaultLocale]}{" "}
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
      <meta name="description" content="Nextra: the next docs builder" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@shuding_" />
      <meta property="og:title" content="Nextra: the next docs builder" />
      <meta property="og:description" content="Nextra: the next docs builder" />
      <meta name="apple-mobile-web-app-title" content="Nextra" />
    </>
  ),
  i18n: [],
  logo: (
    <>
      <span className="font-extrabold">Nextra</span>
      <span className="ml-2 hidden font-normal text-gray-600 md:inline">The Next Docs Builder</span>
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
    content: "Submit an issue about broken link →",
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
    component: function Search({ className, directories }) {
      const config = useConfig();
      return config.flexsearch ? (
        <Flexsearch className={className} />
      ) : (
        <MatchSorterSearch className={className} directories={directories} />
      );
    },
    emptyResult: (
      <span className="block select-none p-8 text-center text-sm text-gray-400">
        No results found.
      </span>
    ),
    error: "Failed to load search index.",
    loading: function useLoading() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const text = (locale && LOADING_LOCALES[locale]) || LOADING_LOCALES[defaultLocale];
      return <>{text}…</>;
    },
    placeholder: function usePlaceholder() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter();
      const text = (locale && PLACEHOLDER_LOCALES[locale]) || PLACEHOLDER_LOCALES[defaultLocale];
      return `${text}…`;
    },
  },
  serverSideError: {
    content: "Submit an issue about error in url →",
    labels: "bug",
  },
  sidebar: {
    defaultMenuCollapseLevel: 2,
    titleComponent: ({ title }) => <>{title}</>,
    toggleButton: false,
  },
  themeSwitch: {
    component: ThemeSwitch,
    useOptions() {
      const { locale } = useRouter();

      if (locale === "zh-CN") {
        return { dark: "深色主题", light: "浅色主题", system: "系统默认" };
      }
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

export const DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME)
  .map(([key, value]) => {
    const isObject =
      value && typeof value === "object" && !Array.isArray(value) && !isValidElement(value);
    if (isObject) {
      return key;
    }
  })
  .filter(Boolean);
