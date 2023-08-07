import { useRouter } from "next/router";
import { NextraThemeLayoutProps, PageOpts } from "nextra";
import { ReactElement, ReactNode } from "react";
import { useMemo } from "react";
import "focus-visible";
import cn from "clsx";
import { useFSRoute, useMounted } from "nextra/hooks";
import { MDXProvider } from "nextra/mdx";
import "./polyfill";
import { PageTheme } from "nextra/normalize-pages";
import { normalizePages } from "nextra/normalize-pages";
import { Banner, Breadcrumb, Head, NavLinks, Sidebar, SkipNavContent } from "./components";
import { DEFAULT_LOCALE, PartialDocsThemeConfig } from "./constants";
import { ActiveAnchorProvider, ConfigProvider, useConfig } from "./contexts";
import { getComponents } from "./mdx-components";
import { renderComponent } from "./utils";

interface BodyProps {
  themeContext: PageTheme;
  breadcrumb: ReactNode;
  timestamp?: number;
  navigation: ReactNode;
  children: ReactNode;
}

const classes = {
  toc: cn("nextra-toc order-last hidden w-64 shrink-0 xl:block print:hidden"),
  main: cn("w-full break-words"),
};

const Body = ({
  themeContext,
  breadcrumb,
  timestamp,
  navigation,
  children,
}: BodyProps): ReactElement => {
  const config = useConfig();
  const mounted = useMounted();

  if (themeContext.layout === "raw") {
    return <div className={classes.main}>{children}</div>;
  }

  const date =
    themeContext.timestamp && config.gitTimestamp && timestamp ? new Date(timestamp) : null;

  const gitTimestampEl =
    // Because a user's time zone may be different from the server page
    mounted && date ? (
      <div className="mb-8 mt-12 block text-xs text-gray-500 ltr:text-right rtl:text-left dark:text-gray-400">
        {renderComponent(config.gitTimestamp, { timestamp: date })}
      </div>
    ) : (
      <div className="mt-16" />
    );

  const content = (
    <>
      {children}
      {gitTimestampEl}
      {navigation}
    </>
  );

  const body = config.main?.({ children: content }) || content;

  if (themeContext.layout === "full") {
    return (
      <article
        className={cn(
          classes.main,
          "nextra-content min-h-[calc(100vh-var(--nextra-navbar-height))] pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]"
        )}
      >
        {body}
      </article>
    );
  }

  return (
    <article
      className={cn(
        classes.main,
        "nextra-content flex min-h-[calc(100vh-var(--nextra-navbar-height))] min-w-0 justify-center pb-8 pr-[calc(env(safe-area-inset-right)-1.5rem)]",
        themeContext.typesetting === "article" && "nextra-body-typesetting-article"
      )}
    >
      <main className="w-full min-w-0 max-w-6xl px-6 pt-4 md:px-12">
        {breadcrumb}
        {body}
      </main>
    </article>
  );
};

const InnerLayout = ({
  filePath,
  pageMap,
  frontMatter,
  headings,
  timestamp,
  children,
}: PageOpts & { children: JSX.Element }): ReactElement => {
  const config = useConfig();
  const { locale = DEFAULT_LOCALE, defaultLocale } = useRouter();
  const fsPath = useFSRoute();

  const {
    activeType,
    activeIndex,
    activeThemeContext,
    activePath,
    topLevelNavbarItems,
    docsDirectories,
    flatDirectories,
    flatDocsDirectories,
    directories,
  } = useMemo(
    () =>
      normalizePages({
        list: pageMap,
        locale,
        defaultLocale,
        route: fsPath,
      }),
    [pageMap, locale, defaultLocale, fsPath]
  );

  const themeContext = { ...activeThemeContext, ...frontMatter };
  const hideSidebar =
    !themeContext.sidebar || themeContext.layout === "raw" || activeType === "page";

  const tocEl =
    activeType === "page" || !themeContext.toc || themeContext.layout !== "default" ? (
      themeContext.layout !== "full" &&
      themeContext.layout !== "raw" && (
        <nav className={classes.toc} aria-label="table of contents" />
      )
    ) : (
      <nav className={cn(classes.toc, "px-4")} aria-label="table of contents">
        {renderComponent(config.toc.component, {
          headings: config.toc.float ? headings : [],
          filePath,
        })}
      </nav>
    );

  const localeConfig = config.i18n.find(l => l.locale === locale);
  const isRTL = localeConfig ? localeConfig.direction === "rtl" : config.direction === "rtl";

  const direction = isRTL ? "rtl" : "ltr";

  return (
    // This makes sure that selectors like `[dir=ltr] .nextra-container` work
    // before hydration as Tailwind expects the `dir` attribute to exist on the
    // `html` element.
    <div dir={direction}>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.setAttribute('dir','${direction}')`,
        }}
      />
      <Head />
      <Banner />
      {themeContext.navbar &&
        renderComponent(config.navbar.component, {
          flatDirectories,
          items: topLevelNavbarItems,
        })}
      <div className={cn("mx-auto flex", themeContext.layout !== "raw" && "max-w-[90rem]")}>
        <ActiveAnchorProvider>
          <Sidebar
            docsDirectories={docsDirectories}
            flatDirectories={flatDirectories}
            fullDirectories={directories}
            headings={headings}
            asPopover={hideSidebar}
            includePlaceholder={themeContext.layout === "default"}
          />
          {tocEl}
          <SkipNavContent />
          <Body
            themeContext={themeContext}
            breadcrumb={
              activeType !== "page" && themeContext.breadcrumb ? (
                <Breadcrumb activePath={activePath} />
              ) : null
            }
            timestamp={timestamp}
            navigation={
              activeType !== "page" && themeContext.pagination ? (
                <NavLinks flatDirectories={flatDocsDirectories} currentIndex={activeIndex} />
              ) : null
            }
          >
            <MDXProvider
              components={getComponents({
                isRawLayout: themeContext.layout === "raw",
                components: config.components,
              })}
            >
              {children}
            </MDXProvider>
          </Body>
        </ActiveAnchorProvider>
      </div>
      {themeContext.footer && renderComponent(config.footer.component, { menu: hideSidebar })}
    </div>
  );
};

export default function Layout({ children, ...context }: NextraThemeLayoutProps): ReactElement {
  return (
    <ConfigProvider value={context}>
      <InnerLayout {...context.pageOpts}>{children as JSX.Element}</InnerLayout>
    </ConfigProvider>
  );
}

export { useConfig, PartialDocsThemeConfig as DocsThemeConfig };
export { useMDXComponents } from "nextra/mdx";
export { Callout } from "nextra/components";
export { useTheme } from "next-themes";
export { Link } from "./mdx-components";
export {
  Bleed,
  Collapse,
  NotFoundPage,
  ServerSideErrorPage,
  Steps,
  Tabs,
  Tab,
  Cards,
  Card,
  FileTree,
  Navbar,
  SkipNavContent,
  SkipNavLink,
  ThemeSwitch,
  AIHelper,
} from "./components";
