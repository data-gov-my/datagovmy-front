import cn from "clsx";
import { useRouter } from "next/router";
import type { Heading } from "nextra";
import { useFSRoute } from "nextra/hooks";
import { ArrowRightIcon, ExpandIcon } from "nextra/icons";
import type { Item, MenuItem, PageItem } from "nextra/normalize-pages";
import type { ReactElement } from "react";
import { createContext, memo, useContext, useEffect, useMemo, useRef, useState } from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import { useActiveAnchor, useConfig, useMenu } from "../contexts";
import { renderComponent } from "../utils";
import { Anchor } from "./anchor";
import { Collapse } from "./collapse";
import { LocaleSwitch } from "./locale-switch";

const TreeState: Record<string, boolean> = Object.create(null);

const FocusedItemContext = createContext<null | string>(null);
const OnFocuseItemContext = createContext<null | ((item: string | null) => any)>(null);
const FolderLevelContext = createContext(0);

const Folder = memo(function FolderInner(props: FolderProps) {
  const level = useContext(FolderLevelContext);
  return (
    <FolderLevelContext.Provider value={level + 1}>
      <FolderImpl {...props} />
    </FolderLevelContext.Provider>
  );
});

const classes = {
  link: cn(
    "flex rounded px-2 py-1.5 text-sm transition-colors [word-break:break-word]",
    "cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border"
  ),
  inactive: cn(
    "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
    "dark:text-neutral-400 dark:hover:bg-primary-100/5 dark:hover:text-gray-50",
    "contrast-more:text-gray-900 contrast-more:dark:text-gray-50",
    "contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50"
  ),
  active: cn(
    "bg-primary-100 font-semibold text-primary-800 dark:bg-primary-400/10 dark:text-primary-600",
    "contrast-more:border-primary-500 contrast-more:dark:border-primary-500"
  ),
  list: cn("flex flex-col gap-1"),
  border: cn(
    "relative before:absolute before:inset-y-1",
    'before:w-px before:bg-gray-200 before:content-[""] dark:before:bg-neutral-800',
    "ltr:pl-2 ltr:before:left-0 rtl:pr-2 rtl:before:right-0"
  ),
};

type FolderProps = {
  item: PageItem | MenuItem | Item;
  anchors: Heading[];
};

function FolderImpl({ item, anchors }: FolderProps): ReactElement {
  const routeOriginal = useFSRoute();
  const [route] = routeOriginal.split("#");
  const active = [route, route + "/"].includes(item.route + "/");
  const activeRouteInside = active || route.startsWith(item.route + "/");

  const focusedRoute = useContext(FocusedItemContext);
  const focusedRouteInside = !!focusedRoute?.startsWith(item.route + "/");
  const level = useContext(FolderLevelContext);

  const { setMenu } = useMenu();
  const config = useConfig();
  const { theme } = item as Item;
  const open =
    TreeState[item.route] === undefined
      ? active ||
        activeRouteInside ||
        focusedRouteInside ||
        (theme && "collapsed" in theme
          ? !theme.collapsed
          : level < config.sidebar.defaultMenuCollapseLevel)
      : TreeState[item.route] || focusedRouteInside;

  const rerender = useState({})[1];

  useEffect(() => {
    if (activeRouteInside || focusedRouteInside) {
      TreeState[item.route] = true;
    }
  }, [activeRouteInside, focusedRouteInside, item.route]);

  if (item.type === "menu") {
    const menu = item as MenuItem;
    const routes = Object.fromEntries((menu.children || []).map(route => [route.name, route]));
    item.children = Object.entries(menu.items || {}).map(([key, item]) => {
      const route = routes[key] || {
        name: key,
        ...("locale" in menu && { locale: menu.locale }),
        route: menu.route + "/" + key,
      };
      return {
        ...route,
        ...item,
      };
    });
  }

  const isLink = "withIndexPage" in item && item.withIndexPage;
  // use button when link don't have href because it impacts on SEO
  const ComponentToUse = isLink ? Anchor : "button";

  return (
    <li className={cn({ open, active })}>
      <ComponentToUse
        href={isLink ? item.route : undefined}
        className={cn(
          "items-center justify-between gap-2",
          !isLink && "w-full text-left",
          classes.link,
          active ? classes.active : classes.inactive
        )}
        onClick={e => {
          const clickedToggleIcon = ["svg", "path"].includes(
            (e.target as HTMLElement).tagName.toLowerCase()
          );
          if (clickedToggleIcon) {
            e.preventDefault();
          }
          if (isLink) {
            // If it's focused, we toggle it. Otherwise, always open it.
            if (active || clickedToggleIcon) {
              TreeState[item.route] = !open;
            } else {
              TreeState[item.route] = true;
              setMenu(false);
            }
            rerender({});
            return;
          }
          if (active) return;
          TreeState[item.route] = !open;
          rerender({});
        }}
      >
        {renderComponent(config.sidebar.titleComponent, {
          title: item.title,
          type: item.type,
          route: item.route,
        })}
        <ArrowRightIcon
          className="h-[18px] min-w-[18px] rounded-sm p-0.5 hover:bg-gray-800/5 dark:hover:bg-gray-100/5"
          pathClassName={cn(
            "origin-center transition-transform rtl:-rotate-180",
            open && "ltr:rotate-90 rtl:rotate-[-270deg]"
          )}
        />
      </ComponentToUse>
      <Collapse className="pt-1 ltr:pr-0 rtl:pl-0" isOpen={open}>
        {Array.isArray(item.children) ? (
          <Menu
            className={cn(classes.border, "ltr:ml-2 rtl:mr-2")}
            directories={item.children}
            base={item.route}
            anchors={anchors}
          />
        ) : null}
      </Collapse>
    </li>
  );
}

function Separator({ title }: { title: string }): ReactElement {
  const config = useConfig();
  return (
    <li
      className={cn(
        "[word-break:break-word]",
        title
          ? "mb-2 mt-5 px-2 py-1.5 text-sm font-semibold text-gray-900 first:mt-0 dark:text-gray-100"
          : "my-4"
      )}
    >
      {title ? (
        renderComponent(config.sidebar.titleComponent, {
          title,
          type: "separator",
          route: "",
        })
      ) : (
        <hr className="dark:border-primary-100/10 mx-2 border-t border-gray-200" />
      )}
    </li>
  );
}

function File({ item, anchors }: { item: PageItem | Item; anchors: Heading[] }): ReactElement {
  const route = useFSRoute();
  const onFocus = useContext(OnFocuseItemContext);

  // It is possible that the item doesn't have any route - for example an external link.
  const active = item.route && [route, route + "/"].includes(item.route + "/");
  const activeAnchor = useActiveAnchor();
  const { setMenu } = useMenu();
  const config = useConfig();

  if (item.type === "separator") {
    return <Separator title={item.title} />;
  }

  return (
    <li className={cn(classes.list, { active })}>
      <Anchor
        href={(item as PageItem).href || item.route}
        newWindow={(item as PageItem).newWindow}
        className={cn(classes.link, active ? classes.active : classes.inactive)}
        onClick={() => {
          setMenu(false);
        }}
        onFocus={() => {
          onFocus?.(item.route);
        }}
        onBlur={() => {
          onFocus?.(null);
        }}
      >
        {renderComponent(config.sidebar.titleComponent, {
          title: item.title,
          type: item.type,
          route: item.route,
        })}
      </Anchor>
      {active && anchors.length > 0 && (
        // <ul className={cn(classes.list, classes.border, "ltr:ml-3 rtl:mr-3")}>
        <ul className={cn(classes.list, "ltr:ml-3 rtl:mr-3")}>
          {anchors.map(({ id, value }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cn(
                  classes.link,
                  'flex gap-2 before:opacity-25 before:content-["#"]',
                  activeAnchor[id]?.isActive ? classes.active : classes.inactive
                )}
                onClick={() => {
                  setMenu(false);
                }}
              >
                {value}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

interface MenuProps {
  directories: PageItem[] | Item[];
  anchors: Heading[];
  base?: string;
  className?: string;
  onlyCurrentDocs?: boolean;
}

function Menu({ directories, anchors, className, onlyCurrentDocs }: MenuProps): ReactElement {
  return (
    <ul className={cn(classes.list, className)}>
      {directories.map(item =>
        !onlyCurrentDocs || item.isUnderCurrentDocsTree ? (
          item.type === "menu" ||
          (item.children && (item.children.length || !item.withIndexPage)) ? (
            <Folder key={item.name} item={item} anchors={anchors} />
          ) : (
            <File key={item.name} item={item} anchors={anchors} />
          )
        ) : null
      )}
    </ul>
  );
}

interface SideBarProps {
  docsDirectories: PageItem[];
  flatDirectories: Item[];
  fullDirectories: Item[];
  asPopover?: boolean;
  headings: Heading[];
  includePlaceholder: boolean;
}

export function Sidebar({
  docsDirectories,
  flatDirectories,
  fullDirectories,
  asPopover = false,
  headings,
  includePlaceholder,
}: SideBarProps): ReactElement {
  const config = useConfig();
  const { menu, setMenu } = useMenu();
  const router = useRouter();
  const [focused, setFocused] = useState<null | string>(null);
  const [showSidebar, setSidebar] = useState(true);
  const [showToggleAnimation, setToggleAnimation] = useState(false);

  const anchors = useMemo(() => headings.filter(v => v.depth === 2), [headings]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menu) {
      document.body.classList.add("overflow-hidden", "md:overflow-auto");
    } else {
      document.body.classList.remove("overflow-hidden", "md:overflow-auto");
    }
  }, [menu]);

  useEffect(() => {
    const activeElement = sidebarRef.current?.querySelector("li.active");

    if (activeElement && (window.innerWidth > 767 || menu)) {
      const scroll = () => {
        scrollIntoView(activeElement, {
          block: "center",
          inline: "center",
          scrollMode: "always",
          boundary: containerRef.current,
        });
      };
      if (menu) {
        // needs for mobile since menu has transition transform
        setTimeout(scroll, 300);
      } else {
        scroll();
      }
    }
  }, [menu]);

  // Always close mobile nav when route was changed (e.g. logo click)
  useEffect(() => {
    setMenu(false);
  }, [router.asPath, setMenu]);

  const hasI18n = config.i18n.length > 0;
  const hasMenu = config.darkMode || hasI18n;

  return (
    <>
      {includePlaceholder && asPopover ? <div className="h-0 w-64 shrink-0 max-xl:hidden" /> : null}
      <div
        className={cn(
          "[transition:background-color_1.5s_ease] motion-reduce:transition-none",
          menu ? "fixed inset-0 z-10 bg-black/80 dark:bg-black/60" : "bg-transparent"
        )}
        onClick={() => setMenu(false)}
      />
      <aside
        className={cn(
          "nextra-sidebar-container flex flex-col",
          "motion-reduce:transform-none md:top-16 md:shrink-0",
          "transform-gpu transition-all ease-in-out",
          "print:hidden",
          showSidebar ? "md:w-64" : "md:w-20",
          asPopover ? "md:hidden" : "md:sticky md:self-start",
          menu
            ? "max-md:[transform:translate3d(0,0,0)]"
            : "max-md:[transform:translate3d(0,-100%,0)]"
        )}
        ref={containerRef}
      >
        <div className="px-4 pt-4 md:hidden">
          {renderComponent(config.search.component, {
            directories: flatDirectories,
          })}
        </div>
        <FocusedItemContext.Provider value={focused}>
          <OnFocuseItemContext.Provider
            value={item => {
              setFocused(item);
            }}
          >
            <div
              className={cn(
                "overflow-y-auto overflow-x-hidden",
                "grow p-4 md:h-[calc(100vh-var(--nextra-navbar-height)-var(--nextra-menu-height))]",
                showSidebar ? "nextra-scrollbar" : "no-scrollbar"
              )}
              ref={sidebarRef}
            >
              {/* without asPopover check <Collapse />'s inner.clientWidth on `layout: "raw"` will be 0 and element will not have width on initial loading */}
              {(!asPopover || !showSidebar) && (
                <Collapse isOpen={showSidebar} horizontal>
                  <Menu
                    className="max-md:hidden"
                    // The sidebar menu, shows only the docs directories.
                    directories={docsDirectories}
                    // When the viewport size is larger than `md`, hide the anchors in
                    // the sidebar when `floatTOC` is enabled.
                    anchors={config.toc.float ? [] : anchors}
                    onlyCurrentDocs
                  />
                </Collapse>
              )}
              <Menu
                className="md:hidden"
                // The mobile dropdown menu, shows all the directories.
                directories={fullDirectories}
                // Always show the anchor links on mobile (`md`).
                anchors={anchors}
              />
            </div>
          </OnFocuseItemContext.Provider>
        </FocusedItemContext.Provider>

        {hasMenu && (
          <div
            className={cn(
              "sticky bottom-0",
              "dark:bg-dark bg-white", // when banner is showed, sidebar links can be behind menu, set bg color as body bg color
              "mx-4 py-4 shadow-[0_-12px_16px_#fff]",
              "flex items-center gap-2",
              "dark:border-neutral-800 dark:shadow-[0_-12px_16px_#111]",
              "contrast-more:border-neutral-400 contrast-more:shadow-none contrast-more:dark:shadow-none",
              showSidebar
                ? cn(hasI18n && "justify-end", "border-t")
                : "flex-wrap justify-center py-4"
            )}
            data-toggle-animation={showToggleAnimation ? (showSidebar ? "show" : "hide") : "off"}
          >
            {hasI18n && (
              <LocaleSwitch
                options={config.i18n}
                lite={!showSidebar}
                className={cn("block sm:hidden", showSidebar ? "grow" : "max-md:grow")}
              />
            )}
            {config.darkMode && (
              <div
                className={cn(
                  "block sm:hidden",
                  showSidebar && !hasI18n ? "flex grow flex-col" : ""
                )}
              >
                {renderComponent(config.themeSwitch.component, {
                  lite: !showSidebar || hasI18n,
                })}
              </div>
            )}
            {config.sidebar.toggleButton && (
              <button
                title={showSidebar ? "Hide sidebar" : "Show sidebar"}
                className="dark:hover:bg-primary-100/5 h-7 rounded-md px-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 max-md:hidden"
                onClick={() => {
                  setSidebar(!showSidebar);
                  setToggleAnimation(true);
                }}
              >
                <ExpandIcon isOpen={showSidebar} />
              </button>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
