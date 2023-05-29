var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value })
    : (obj[key] = value);
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0) target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop)) target[prop] = source[prop];
    }
  return target;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = value => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = value => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = x =>
      x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/index.tsx
import { useRouter as useRouter8 } from "next/router";
import { useMemo as useMemo5 } from "react";
import "focus-visible";
import cn20 from "clsx";
import { useFSRoute as useFSRoute3, useMounted as useMounted7 } from "nextra/hooks";
import { MDXProvider } from "nextra/mdx";

// src/constants.tsx
import { useRouter as useRouter7 } from "next/router";
import { DiscordIcon, GitHubIcon } from "nextra/icons";
import { isValidElement } from "react";
import { z as z2 } from "zod";

// src/components/anchor.tsx
import NextLink from "next/link";
import next from "next/package.json";
import { forwardRef } from "react";

// src/contexts/active-anchor.tsx
import "intersection-observer";
import { createContext, useContext, useRef, useState } from "react";
import { jsx } from "react/jsx-runtime";
var ActiveAnchorContext = createContext({});
var SetActiveAnchorContext = createContext(v => v);
var IntersectionObserverContext = createContext(null);
var slugs = /* @__PURE__ */ new WeakMap();
var SlugsContext = createContext(slugs);
var useActiveAnchor = () => useContext(ActiveAnchorContext);
var useSetActiveAnchor = () => useContext(SetActiveAnchorContext);
var useIntersectionObserver = () => useContext(IntersectionObserverContext);
var useSlugs = () => useContext(SlugsContext);
var ActiveAnchorProvider = ({ children }) => {
  const [activeAnchor, setActiveAnchor] = useState({});
  const observerRef = useRef(null);
  if (IS_BROWSER && !observerRef.current) {
    observerRef.current = new IntersectionObserver(
      entries => {
        setActiveAnchor(f => {
          const ret = __spreadValues({}, f);
          for (const entry of entries) {
            if ((entry == null ? void 0 : entry.rootBounds) && slugs.has(entry.target)) {
              const [slug, index] = slugs.get(entry.target);
              const aboveHalfViewport =
                entry.boundingClientRect.y + entry.boundingClientRect.height <=
                entry.rootBounds.y + entry.rootBounds.height;
              const insideHalfViewport = entry.intersectionRatio > 0;
              ret[slug] = {
                index,
                aboveHalfViewport,
                insideHalfViewport,
              };
            }
          }
          let activeSlug = "";
          let smallestIndexInViewport = Infinity;
          let largestIndexAboveViewport = -1;
          for (const s in ret) {
            ret[s].isActive = false;
            if (ret[s].insideHalfViewport && ret[s].index < smallestIndexInViewport) {
              smallestIndexInViewport = ret[s].index;
              activeSlug = s;
            }
            if (
              smallestIndexInViewport === Infinity &&
              ret[s].aboveHalfViewport &&
              ret[s].index > largestIndexAboveViewport
            ) {
              largestIndexAboveViewport = ret[s].index;
              activeSlug = s;
            }
          }
          if (ret[activeSlug]) ret[activeSlug].isActive = true;
          return ret;
        });
      },
      {
        rootMargin: "0px 0px -50%",
        threshold: [0, 1],
      }
    );
  }
  return /* @__PURE__ */ jsx(ActiveAnchorContext.Provider, {
    value: activeAnchor,
    children: /* @__PURE__ */ jsx(SetActiveAnchorContext.Provider, {
      value: setActiveAnchor,
      children: /* @__PURE__ */ jsx(SlugsContext.Provider, {
        value: slugs,
        children: /* @__PURE__ */ jsx(IntersectionObserverContext.Provider, {
          value: observerRef.current,
          children,
        }),
      }),
    }),
  });
};

// src/contexts/config.tsx
import { ThemeProvider } from "next-themes";
import { metaSchema } from "nextra/normalize-pages";
import {
  createContext as createContext3,
  useContext as useContext3,
  useState as useState2,
} from "react";

// src/contexts/menu.ts
import { createContext as createContext2, useContext as useContext2 } from "react";
var MenuContext = createContext2({
  menu: false,
  setMenu: () => false,
});
var useMenu = () => useContext2(MenuContext);
var MenuProvider = MenuContext.Provider;

// src/contexts/config.tsx
import { jsx as jsx2 } from "react/jsx-runtime";
var ConfigContext = createContext3(
  __spreadValues(
    {
      title: "",
      frontMatter: {},
    },
    DEFAULT_THEME
  )
);
function useConfig() {
  return useContext3(ConfigContext);
}
var theme;
var isValidated = false;
function normalizeZodMessage(error) {
  return error.issues
    .flatMap(issue => {
      const themePath = issue.path.length > 0 && `Path: "${issue.path.join(".")}"`;
      const unionErrors = "unionErrors" in issue ? issue.unionErrors.map(normalizeZodMessage) : [];
      return [[issue.message, themePath].filter(Boolean).join(". "), ...unionErrors];
    })
    .join("\n");
}
function validateMeta(pageMap) {
  for (const pageMapItem of pageMap) {
    if (pageMapItem.kind === "Meta") {
      for (const [key, data] of Object.entries(pageMapItem.data)) {
        try {
          metaSchema.parse(data);
        } catch (error) {
          console.error(
            `[nextra-theme-docs] Error validating _meta.json file for "${key}" property.

${normalizeZodMessage(error)}`
          );
        }
      }
    } else if (pageMapItem.kind === "Folder") {
      validateMeta(pageMapItem.children);
    }
  }
}
var ConfigProvider = ({ children, value: { themeConfig, pageOpts } }) => {
  const [menu, setMenu] = useState2(false);
  theme ||
    (theme = __spreadValues(
      __spreadValues({}, DEFAULT_THEME),
      Object.fromEntries(
        Object.entries(themeConfig).map(([key, value]) => [
          key,
          value && typeof value === "object" && DEEP_OBJECT_KEYS.includes(key)
            ? // @ts-expect-error -- key has always object value
              __spreadValues(__spreadValues({}, DEFAULT_THEME[key]), value)
            : value,
        ])
      )
    ));
  if (process.env.NODE_ENV !== "production" && !isValidated) {
    try {
      themeSchema.parse(theme);
    } catch (error) {
      console.error(
        `[nextra-theme-docs] Error validating theme config file.

${normalizeZodMessage(error)}`
      );
    }
    validateMeta(pageOpts.pageMap);
    isValidated = true;
  }
  const extendedConfig = __spreadProps(
    __spreadValues(
      __spreadProps(__spreadValues({}, theme), {
        flexsearch: pageOpts.flexsearch,
      }),
      typeof pageOpts.newNextLinkBehavior === "boolean" && {
        newNextLinkBehavior: pageOpts.newNextLinkBehavior,
      }
    ),
    {
      title: pageOpts.title,
      frontMatter: pageOpts.frontMatter,
    }
  );
  const { nextThemes } = extendedConfig;
  return /* @__PURE__ */ jsx2(ThemeProvider, {
    attribute: "class",
    disableTransitionOnChange: true,
    defaultTheme: nextThemes.defaultTheme,
    storageKey: nextThemes.storageKey,
    forcedTheme: nextThemes.forcedTheme,
    children: /* @__PURE__ */ jsx2(ConfigContext.Provider, {
      value: extendedConfig,
      children: /* @__PURE__ */ jsx2(MenuProvider, { value: { menu, setMenu }, children }),
    }),
  });
};

// src/contexts/details.ts
import { createContext as createContext4, useContext as useContext4 } from "react";
var DetailsContext = createContext4(v => v);
var useDetails = () => useContext4(DetailsContext);
var DetailsProvider = DetailsContext.Provider;

// src/components/anchor.tsx
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var nextVersion = Number(next.version.split(".")[0]);
var Anchor = forwardRef(function (_a, forwardedRef) {
  var _b = _a,
    { href = "", children, newWindow } = _b,
    props = __objRest(_b, ["href", "children", "newWindow"]);
  const config = useConfig();
  if (newWindow) {
    return /* @__PURE__ */ jsxs(
      "a",
      __spreadProps(
        __spreadValues(
          {
            ref: forwardedRef,
            href,
            target: "_blank",
            rel: "noreferrer",
          },
          props
        ),
        {
          children: [
            children,
            /* @__PURE__ */ jsx3("span", {
              className: "nx-sr-only",
              children: " (opens in a new tab)",
            }),
          ],
        }
      )
    );
  }
  if (!href) {
    return /* @__PURE__ */ jsx3(
      "a",
      __spreadProps(__spreadValues({ ref: forwardedRef }, props), { children })
    );
  }
  if (nextVersion > 12 || config.newNextLinkBehavior) {
    return /* @__PURE__ */ jsx3(
      NextLink,
      __spreadProps(__spreadValues({ ref: forwardedRef, href }, props), { children })
    );
  }
  return /* @__PURE__ */ jsx3(NextLink, {
    href,
    passHref: true,
    children: /* @__PURE__ */ jsx3(
      "a",
      __spreadProps(__spreadValues({ ref: forwardedRef }, props), { children })
    ),
  });
});
Anchor.displayName = "Anchor";

// src/components/banner.tsx
import cn from "clsx";
import { XIcon } from "nextra/icons";

// src/utils/get-git-issue-url.ts
import gitUrlParse from "git-url-parse";
var getGitIssueUrl = ({ repository = "", title, labels }) => {
  const repo = gitUrlParse(repository);
  if (!repo) throw new Error("Invalid `docsRepositoryBase` URL!");
  if (repo.resource.includes("gitlab")) {
    return `${repo.protocol}://${repo.resource}/${repo.owner}/${
      repo.name
    }/-/issues/new?issue[title]=${encodeURIComponent(title)}`;
  }
  if (repo.resource.includes("github")) {
    return `${repo.protocol}://${repo.resource}/${repo.owner}/${
      repo.name
    }/issues/new?title=${encodeURIComponent(title)}&labels=${labels || ""}`;
  }
  return "#";
};

// src/utils/render.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function renderComponent(ComponentOrNode, props) {
  if (!ComponentOrNode) return null;
  if (typeof ComponentOrNode !== "function") return ComponentOrNode;
  return /* @__PURE__ */ jsx4(ComponentOrNode, __spreadValues({}, props));
}
function renderString(stringOrFunction, props = {}) {
  const result =
    typeof stringOrFunction === "function" ? stringOrFunction(props) : stringOrFunction;
  return result || "";
}

// src/utils/use-popper.ts
import { createPopper } from "@popperjs/core";
import { useCallback, useMemo, useRef as useRef2 } from "react";
function usePopper(options) {
  const reference = useRef2(null);
  const popper = useRef2(null);
  const cleanupCallback = useRef2();
  const instantiatePopper = useCallback(() => {
    var _a;
    if (!reference.current || !popper.current) return;
    (_a = cleanupCallback.current) == null ? void 0 : _a.call(cleanupCallback);
    cleanupCallback.current = createPopper(reference.current, popper.current, options).destroy;
  }, [reference, popper, cleanupCallback, options]);
  return useMemo(
    () => [
      referenceDomNode => {
        reference.current = referenceDomNode;
        instantiatePopper();
      },
      popperDomNode => {
        popper.current = popperDomNode;
        instantiatePopper();
      },
    ],
    [reference, popper, instantiatePopper]
  );
}

// src/utils/use-git-edit-url.ts
import gitUrlParse2 from "git-url-parse";
function useGitEditUrl(filePath = "") {
  const config = useConfig();
  const repo = gitUrlParse2(config.docsRepositoryBase || "");
  if (!repo) throw new Error("Invalid `docsRepositoryBase` URL!");
  return `${repo.href}/${filePath}`;
}

// src/components/banner.tsx
import { Fragment, jsx as jsx5, jsxs as jsxs2 } from "react/jsx-runtime";
function Banner() {
  const { banner } = useConfig();
  if (!banner.text) {
    return null;
  }
  const hideBannerScript = `try{if(localStorage.getItem(${JSON.stringify(
    banner.key
  )})==='0'){document.body.classList.add('nextra-banner-hidden')}}catch(e){}`;
  return /* @__PURE__ */ jsxs2(Fragment, {
    children: [
      /* @__PURE__ */ jsx5("script", { dangerouslySetInnerHTML: { __html: hideBannerScript } }),
      /* @__PURE__ */ jsxs2("div", {
        className: cn(
          "nextra-banner-container nx-sticky nx-top-0 nx-z-20 nx-flex nx-items-center md:nx-relative",
          "nx-h-[var(--nextra-banner-height)] [body.nextra-banner-hidden_&]:nx-hidden",
          "nx-text-slate-50 dark:nx-text-white nx-bg-neutral-900 dark:nx-bg-[linear-gradient(1deg,#383838,#212121)]",
          "nx-px-2 ltr:nx-pl-10 rtl:nx-pr-10 print:nx-hidden"
        ),
        children: [
          /* @__PURE__ */ jsx5("div", {
            className: "nx-w-full nx-truncate nx-px-4 nx-text-center nx-font-medium nx-text-sm",
            children: renderComponent(banner.text),
          }),
          banner.dismissible &&
            /* @__PURE__ */ jsx5("button", {
              "type": "button",
              "aria-label": "Dismiss banner",
              "className": "nx-w-8 nx-h-8 nx-opacity-80 hover:nx-opacity-100",
              "onClick": () => {
                try {
                  localStorage.setItem(banner.key, "0");
                } catch (e) {}
                document.body.classList.add("nextra-banner-hidden");
              },
              "children": /* @__PURE__ */ jsx5(XIcon, { className: "nx-mx-auto nx-h-4 nx-w-4" }),
            }),
        ],
      }),
    ],
  });
}

// src/components/bleed.tsx
import cn2 from "clsx";
import { jsx as jsx6 } from "react/jsx-runtime";
function Bleed({ full, children }) {
  return /* @__PURE__ */ jsx6("div", {
    className: cn2(
      "nextra-bleed nx-relative -nx-mx-6 nx-mt-6 md:-nx-mx-8 2xl:-nx-mx-24",
      full && [
        // 'md:mx:[calc(-50vw+50%+8rem)',
        "ltr:xl:nx-ml-[calc(50%-50vw+16rem)] ltr:xl:nx-mr-[calc(50%-50vw)]",
        "rtl:xl:nx-ml-[calc(50%-50vw)] rtl:xl:nx-mr-[calc(50%-50vw+16rem)]",
      ]
    ),
    children,
  });
}

// src/components/breadcrumb.tsx
import cn3 from "clsx";
import { ArrowRightIcon } from "nextra/icons";
import { Fragment as Fragment2 } from "react";
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
function Breadcrumb({ activePath }) {
  return /* @__PURE__ */ jsx7("div", {
    className:
      "nextra-breadcrumb nx-mt-1.5 nx-flex nx-items-center nx-gap-1 nx-overflow-hidden nx-text-sm nx-text-gray-500 dark:nx-text-gray-400 contrast-more:nx-text-current",
    children: activePath.map((item, index) => {
      const isLink = !item.children || item.withIndexPage;
      const isActive = index === activePath.length - 1;
      return /* @__PURE__ */ jsxs3(
        Fragment2,
        {
          children: [
            index > 0 &&
              /* @__PURE__ */ jsx7(ArrowRightIcon, { className: "nx-w-3.5 nx-shrink-0" }),
            /* @__PURE__ */ jsx7("div", {
              className: cn3(
                "nx-whitespace-nowrap nx-transition-colors",
                isActive
                  ? "nx-font-medium nx-text-gray-700 contrast-more:nx-font-bold contrast-more:nx-text-current dark:nx-text-gray-100 contrast-more:dark:nx-text-current"
                  : [
                      "nx-min-w-[24px] nx-overflow-hidden nx-text-ellipsis",
                      isLink && "hover:nx-text-gray-900 dark:hover:nx-text-gray-100",
                    ]
              ),
              title: item.title,
              children:
                isLink && !isActive
                  ? /* @__PURE__ */ jsx7(Anchor, { href: item.route, children: item.title })
                  : item.title,
            }),
          ],
        },
        item.route + item.name
      );
    }),
  });
}

// src/components/cards.tsx
import cn4 from "clsx";
import { jsx as jsx8, jsxs as jsxs4 } from "react/jsx-runtime";
var classes = {
  cards: cn4("nextra-cards nx-mt-4 nx-gap-4 nx-grid"),
  card: cn4(
    "nextra-card nx-group nx-flex nx-flex-col nx-justify-start nx-overflow-hidden nx-rounded-lg nx-border nx-border-gray-200",
    "nx-text-current nx-no-underline dark:nx-shadow-none",
    "hover:nx-shadow-gray-100 dark:hover:nx-shadow-none nx-shadow-gray-100",
    "active:nx-shadow-sm active:nx-shadow-gray-200",
    "nx-transition-all nx-duration-200 hover:nx-border-gray-300"
  ),
  title: cn4(
    "nx-flex nx-font-semibold nx-items-start nx-gap-2 nx-p-4 nx-text-gray-700 hover:nx-text-gray-900"
  ),
};
var arrowEl = /* @__PURE__ */ jsx8("span", {
  className: "nx-transition-transform nx-duration-75 group-hover:nx-translate-x-[2px]",
  children: "\u2192",
});
function Card(_a) {
  var _b = _a,
    { children, title, icon, image, arrow, href } = _b,
    props = __objRest(_b, ["children", "title", "icon", "image", "arrow", "href"]);
  const animatedArrow = arrow ? arrowEl : null;
  if (image) {
    return /* @__PURE__ */ jsxs4(
      Anchor,
      __spreadProps(
        __spreadValues(
          {
            href,
            className: cn4(
              classes.card,
              "nx-bg-gray-100 nx-shadow dark:nx-border-neutral-700 dark:nx-bg-neutral-800 dark:nx-text-gray-50 hover:nx-shadow-lg dark:hover:nx-border-neutral-500 dark:hover:nx-bg-neutral-700"
            ),
          },
          props
        ),
        {
          children: [
            children,
            /* @__PURE__ */ jsxs4("span", {
              className: cn4(classes.title, "dark:nx-text-gray-300 dark:hover:nx-text-gray-100"),
              children: [
                icon,
                /* @__PURE__ */ jsxs4("span", {
                  className: "nx-flex nx-gap-1",
                  children: [title, animatedArrow],
                }),
              ],
            }),
          ],
        }
      )
    );
  }
  return /* @__PURE__ */ jsx8(
    Anchor,
    __spreadProps(
      __spreadValues(
        {
          href,
          className: cn4(
            classes.card,
            "nx-bg-transparent nx-shadow-sm dark:nx-border-neutral-800 hover:nx-bg-slate-50 hover:nx-shadow-md dark:hover:nx-border-neutral-700 dark:hover:nx-bg-neutral-900"
          ),
        },
        props
      ),
      {
        children: /* @__PURE__ */ jsxs4("span", {
          className: cn4(classes.title, "dark:nx-text-neutral-200 dark:hover:nx-text-neutral-50"),
          children: [icon, title, animatedArrow],
        }),
      }
    )
  );
}
function Cards(_a) {
  var _b = _a,
    { children, num = 3, className, style } = _b,
    props = __objRest(_b, ["children", "num", "className", "style"]);
  return /* @__PURE__ */ jsx8(
    "div",
    __spreadProps(
      __spreadValues(
        {
          className: cn4(classes.cards, className),
        },
        props
      ),
      {
        style: __spreadProps(__spreadValues({}, style), {
          "--rows": num,
        }),
        children,
      }
    )
  );
}

// src/components/collapse.tsx
import cn5 from "clsx";
import { useEffect, useRef as useRef3 } from "react";
import { jsx as jsx9 } from "react/jsx-runtime";
function Collapse({ children, className, isOpen, horizontal = false }) {
  const containerRef = useRef3(null);
  const innerRef = useRef3(null);
  const animationRef = useRef3(0);
  const initialOpen = useRef3(isOpen);
  const initialRender = useRef3(true);
  useEffect(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    const animation = animationRef.current;
    if (animation) {
      clearTimeout(animation);
    }
    if (initialRender.current || !container || !inner) return;
    container.classList.toggle("nx-duration-500", !isOpen);
    container.classList.toggle("nx-duration-300", isOpen);
    if (horizontal) {
      inner.style.width = `${inner.clientWidth}px`;
      container.style.width = `${inner.clientWidth}px`;
    } else {
      container.style.height = `${inner.clientHeight}px`;
    }
    if (isOpen) {
      animationRef.current = window.setTimeout(() => {
        container.style.removeProperty("height");
      }, 300);
    } else {
      setTimeout(() => {
        if (horizontal) {
          container.style.width = "0px";
        } else {
          container.style.height = "0px";
        }
      }, 0);
    }
  }, [horizontal, isOpen]);
  useEffect(() => {
    initialRender.current = false;
  }, []);
  return /* @__PURE__ */ jsx9("div", {
    ref: containerRef,
    className:
      "nx-transform-gpu nx-overflow-hidden nx-transition-all nx-ease-in-out motion-reduce:nx-transition-none",
    style: initialOpen.current || horizontal ? void 0 : { height: 0 },
    children: /* @__PURE__ */ jsx9("div", {
      ref: innerRef,
      className: cn5(
        "nx-transition-opacity nx-duration-500 nx-ease-in-out motion-reduce:nx-transition-none",
        isOpen ? "nx-opacity-100" : "nx-opacity-0",
        className
      ),
      children,
    }),
  });
}

// src/components/file-tree.tsx
import cn6 from "clsx";
import {
  createContext as createContext5,
  memo,
  useCallback as useCallback2,
  useContext as useContext5,
  useState as useState3,
} from "react";
import { Fragment as Fragment3, jsx as jsx10, jsxs as jsxs5 } from "react/jsx-runtime";
var ctx = createContext5(0);
function useIndent() {
  return useContext5(ctx);
}
var Tree = ({ children }) =>
  /* @__PURE__ */ jsx10("div", {
    className: "nx-mt-6 nx-select-none nx-text-sm nx-text-gray-800 dark:nx-text-gray-300",
    children: /* @__PURE__ */ jsx10("div", {
      className:
        "nx-inline-flex nx-flex-col nx-rounded-lg nx-border nx-px-4 nx-py-2 dark:nx-border-neutral-800",
      children,
    }),
  });
function Ident() {
  const indent = useIndent();
  return /* @__PURE__ */ jsx10(Fragment3, {
    children: [...Array(indent)].map((_, i) =>
      /* @__PURE__ */ jsx10("span", { className: "nx-inline-block nx-w-5" }, i)
    ),
  });
}
var Folder = memo(({ label, name, open, children, defaultOpen = false, onToggle }) => {
  const indent = useIndent();
  const [isOpen, setIsOpen] = useState3(defaultOpen);
  const toggle = useCallback2(() => {
    onToggle == null ? void 0 : onToggle(!isOpen);
    setIsOpen(!isOpen);
  }, [isOpen, onToggle]);
  const isFolderOpen = open === void 0 ? isOpen : open;
  return /* @__PURE__ */ jsxs5("li", {
    className: "nx-flex nx-list-none nx-flex-col",
    children: [
      /* @__PURE__ */ jsxs5("a", {
        onClick: toggle,
        title: name,
        className: "nx-inline-flex nx-cursor-pointer nx-items-center nx-py-1 hover:nx-opacity-60",
        children: [
          /* @__PURE__ */ jsx10(Ident, {}),
          /* @__PURE__ */ jsx10("svg", {
            width: "1em",
            height: "1em",
            viewBox: "0 0 24 24",
            children: /* @__PURE__ */ jsx10("path", {
              fill: "none",
              stroke: "currentColor",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: "2",
              d: isFolderOpen
                ? "M5 19a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v1M5 19h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2Z"
                : "M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-6l-2-2H5a2 2 0 0 0-2 2Z",
            }),
          }),
          /* @__PURE__ */ jsx10("span", {
            className: "nx-ml-1",
            children: label != null ? label : name,
          }),
        ],
      }),
      isFolderOpen &&
        /* @__PURE__ */ jsx10("ul", {
          children: /* @__PURE__ */ jsx10(ctx.Provider, { value: indent + 1, children }),
        }),
    ],
  });
});
Folder.displayName = "Folder";
var File = memo(({ label, name, active }) =>
  /* @__PURE__ */ jsx10("li", {
    className: cn6(
      "nx-flex nx-list-none",
      active && "nx-text-primary-600 contrast-more:nx-underline"
    ),
    children: /* @__PURE__ */ jsxs5("a", {
      className: "nx-inline-flex nx-cursor-default nx-items-center nx-py-1",
      children: [
        /* @__PURE__ */ jsx10(Ident, {}),
        /* @__PURE__ */ jsx10("svg", {
          width: "1em",
          height: "1em",
          viewBox: "0 0 24 24",
          children: /* @__PURE__ */ jsx10("path", {
            fill: "none",
            stroke: "currentColor",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: "2",
            d: "M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2Z",
          }),
        }),
        /* @__PURE__ */ jsx10("span", {
          className: "nx-ml-1",
          children: label != null ? label : name,
        }),
      ],
    }),
  })
);
File.displayName = "File";
var FileTree = Object.assign(Tree, { Folder, File });

// src/components/flexsearch.tsx
import cn9 from "clsx";
import FlexSearch from "flexsearch";
import { useRouter as useRouter2 } from "next/router";
import { useCallback as useCallback4, useState as useState5 } from "react";

// src/components/highlight-matches.tsx
import { Fragment as Fragment4, memo as memo2 } from "react";
import { Fragment as Fragment5, jsx as jsx11, jsxs as jsxs6 } from "react/jsx-runtime";
var HighlightMatches = memo2(function HighlightMatches2({ value, match }) {
  const splitText = value ? value.split("") : [];
  const escapedSearch = match.trim().replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
  const regexp = RegExp("(" + escapedSearch.replaceAll(" ", "|") + ")", "ig");
  let result;
  let id = 0;
  let index = 0;
  const res = [];
  if (value) {
    while ((result = regexp.exec(value)) !== null) {
      res.push(
        /* @__PURE__ */ jsxs6(
          Fragment4,
          {
            children: [
              splitText.splice(0, result.index - index).join(""),
              /* @__PURE__ */ jsx11("span", {
                className: "nx-text-primary-600",
                children: splitText.splice(0, regexp.lastIndex - result.index).join(""),
              }),
            ],
          },
          id++
        )
      );
      index = regexp.lastIndex;
    }
  }
  return /* @__PURE__ */ jsxs6(Fragment5, { children: [res, splitText.join("")] });
});

// src/components/search.tsx
import { Transition } from "@headlessui/react";
import cn8 from "clsx";
import { useRouter } from "next/router";
import { useMounted } from "nextra/hooks";
import { InformationCircleIcon, SpinnerIcon } from "nextra/icons";
import {
  Fragment as Fragment6,
  useCallback as useCallback3,
  useEffect as useEffect2,
  useRef as useRef4,
  useState as useState4,
} from "react";

// src/components/input.tsx
import cn7 from "clsx";
import { forwardRef as forwardRef2 } from "react";
import { jsx as jsx12, jsxs as jsxs7 } from "react/jsx-runtime";
var Input = forwardRef2((_a, forwardedRef) => {
  var _b = _a,
    { className, suffix } = _b,
    props = __objRest(_b, ["className", "suffix"]);
  return /* @__PURE__ */ jsxs7("div", {
    className:
      "nx-relative nx-flex nx-items-center nx-text-gray-900 contrast-more:nx-text-gray-800 dark:nx-text-gray-300 contrast-more:dark:nx-text-gray-300",
    children: [
      /* @__PURE__ */ jsx12(
        "input",
        __spreadValues(
          {
            ref: forwardedRef,
            spellCheck: false,
            className: cn7(
              className,
              "nx-block nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors",
              "nx-text-base nx-leading-tight md:nx-text-sm",
              "nx-bg-black/[.05] dark:nx-bg-gray-50/10",
              "focus:nx-bg-white dark:focus:nx-bg-dark",
              "placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400",
              "contrast-more:nx-border contrast-more:nx-border-current"
            ),
          },
          props
        )
      ),
      suffix,
    ],
  });
});
Input.displayName = "Input";

// src/components/search.tsx
import { Fragment as Fragment7, jsx as jsx13, jsxs as jsxs8 } from "react/jsx-runtime";
var INPUTS = ["input", "select", "button", "textarea"];
function Search({
  className,
  overlayClassName,
  value,
  onChange,
  onActive,
  loading,
  error,
  results,
}) {
  const [show, setShow] = useState4(false);
  const config = useConfig();
  const [active, setActive] = useState4(0);
  const router = useRouter();
  const { setMenu } = useMenu();
  const input = useRef4(null);
  const ulRef = useRef4(null);
  const [focused, setFocused] = useState4(false);
  useEffect2(() => {
    setActive(0);
  }, [value]);
  useEffect2(() => {
    const down = e => {
      const activeElement = document.activeElement;
      const tagName = activeElement == null ? void 0 : activeElement.tagName.toLowerCase();
      if (
        !input.current ||
        !tagName ||
        INPUTS.includes(tagName) ||
        (activeElement == null ? void 0 : activeElement.isContentEditable)
      )
        return;
      if (e.key === "/" || (e.key === "k" && (e.metaKey /* for non-Mac */ || e.ctrlKey))) {
        e.preventDefault();
        input.current.focus();
      } else if (e.key === "Escape") {
        setShow(false);
        input.current.blur();
      }
    };
    window.addEventListener("keydown", down);
    return () => {
      window.removeEventListener("keydown", down);
    };
  }, []);
  const finishSearch = useCallback3(() => {
    var _a;
    (_a = input.current) == null ? void 0 : _a.blur();
    onChange("");
    setShow(false);
    setMenu(false);
  }, [onChange, setMenu]);
  const handleActive = useCallback3(e => {
    const { index } = e.currentTarget.dataset;
    setActive(Number(index));
  }, []);
  const handleKeyDown = useCallback3(
    function (e) {
      var _a, _b, _c;
      switch (e.key) {
        case "ArrowDown": {
          if (active + 1 < results.length) {
            const el =
              (_a = ulRef.current) == null
                ? void 0
                : _a.querySelector(`li:nth-of-type(${active + 2}) > a`);
            if (el) {
              e.preventDefault();
              handleActive({ currentTarget: el });
              el.focus();
            }
          }
          break;
        }
        case "ArrowUp": {
          if (active - 1 >= 0) {
            const el =
              (_b = ulRef.current) == null
                ? void 0
                : _b.querySelector(`li:nth-of-type(${active}) > a`);
            if (el) {
              e.preventDefault();
              handleActive({ currentTarget: el });
              el.focus();
            }
          }
          break;
        }
        case "Enter": {
          const result = results[active];
          if (result) {
            void router.push(result.route);
            finishSearch();
          }
          break;
        }
        case "Escape": {
          setShow(false);
          (_c = input.current) == null ? void 0 : _c.blur();
          break;
        }
      }
    },
    [active, results, router, finishSearch, handleActive]
  );
  const mounted = useMounted();
  const renderList = show && Boolean(value);
  const icon = /* @__PURE__ */ jsx13(Transition, {
    show: mounted && (!show || Boolean(value)),
    as: Fragment6,
    enter: "nx-transition-opacity",
    enterFrom: "nx-opacity-0",
    enterTo: "nx-opacity-100",
    leave: "nx-transition-opacity",
    leaveFrom: "nx-opacity-100",
    leaveTo: "nx-opacity-0",
    children: /* @__PURE__ */ jsx13("kbd", {
      className: cn8(
        "nx-absolute nx-my-1.5 nx-select-none ltr:nx-right-1.5 rtl:nx-left-1.5",
        "nx-h-5 nx-rounded nx-bg-white nx-px-1.5 nx-font-mono nx-text-[10px] nx-font-medium nx-text-gray-500",
        "nx-border dark:nx-border-gray-100/20 dark:nx-bg-dark/50",
        "contrast-more:nx-border-current contrast-more:nx-text-current contrast-more:dark:nx-border-current",
        "nx-items-center nx-gap-1 nx-transition-opacity",
        value
          ? "nx-z-20 nx-flex nx-cursor-pointer hover:nx-opacity-70"
          : "nx-pointer-events-none nx-hidden sm:nx-flex"
      ),
      title: value ? "Clear" : void 0,
      onClick: () => {
        onChange("");
      },
      children:
        value && focused
          ? "ESC"
          : mounted &&
            (navigator.userAgent.includes("Macintosh")
              ? /* @__PURE__ */ jsxs8(Fragment7, {
                  children: [
                    /* @__PURE__ */ jsx13("span", { className: "nx-text-xs", children: "\u2318" }),
                    "K",
                  ],
                })
              : "CTRL K"),
    }),
  });
  return /* @__PURE__ */ jsxs8("div", {
    className: cn8("nextra-search nx-relative md:nx-w-64", className),
    children: [
      renderList &&
        /* @__PURE__ */ jsx13("div", {
          className: "nx-fixed nx-inset-0 nx-z-10",
          onClick: () => setShow(false),
        }),
      /* @__PURE__ */ jsx13(Input, {
        ref: input,
        value,
        onChange: e => {
          const { value: value2 } = e.target;
          onChange(value2);
          setShow(Boolean(value2));
        },
        onFocus: () => {
          onActive == null ? void 0 : onActive(true);
          setFocused(true);
        },
        onBlur: () => {
          setFocused(false);
        },
        type: "search",
        placeholder: renderString(config.search.placeholder),
        onKeyDown: handleKeyDown,
        suffix: icon,
      }),
      /* @__PURE__ */ jsx13(Transition, {
        show: renderList,
        as: Transition.Child,
        leave: "nx-transition-opacity nx-duration-100",
        leaveFrom: "nx-opacity-100",
        leaveTo: "nx-opacity-0",
        children: /* @__PURE__ */ jsx13("ul", {
          className: cn8(
            "nextra-scrollbar",
            // Using bg-white as background-color when the browser didn't support backdrop-filter
            "nx-border nx-border-gray-200 nx-bg-white nx-text-gray-100 dark:nx-border-neutral-800 dark:nx-bg-neutral-900",
            "nx-absolute nx-top-full nx-z-20 nx-mt-2 nx-overflow-auto nx-overscroll-contain nx-rounded-xl nx-py-2.5 nx-shadow-xl",
            "nx-max-h-[min(calc(50vh-11rem-env(safe-area-inset-bottom)),400px)]",
            "md:nx-max-h-[min(calc(100vh-5rem-env(safe-area-inset-bottom)),400px)]",
            "nx-inset-x-0 ltr:md:nx-left-auto rtl:md:nx-right-auto",
            "contrast-more:nx-border contrast-more:nx-border-gray-900 contrast-more:dark:nx-border-gray-50",
            overlayClassName
          ),
          ref: ulRef,
          style: {
            transition: "max-height .2s ease",
            // don't work with tailwindcss
          },
          children: error
            ? /* @__PURE__ */ jsxs8("span", {
                className:
                  "nx-flex nx-select-none nx-justify-center nx-gap-2 nx-p-8 nx-text-center nx-text-sm nx-text-red-500",
                children: [
                  /* @__PURE__ */ jsx13(InformationCircleIcon, { className: "nx-h-5 nx-w-5" }),
                  renderString(config.search.error),
                ],
              })
            : loading
            ? /* @__PURE__ */ jsxs8("span", {
                className:
                  "nx-flex nx-select-none nx-justify-center nx-gap-2 nx-p-8 nx-text-center nx-text-sm nx-text-gray-400",
                children: [
                  /* @__PURE__ */ jsx13(SpinnerIcon, {
                    className: "nx-h-5 nx-w-5 nx-animate-spin",
                  }),
                  renderComponent(config.search.loading),
                ],
              })
            : results.length > 0
            ? results.map(({ route, prefix, children, id }, i) =>
                /* @__PURE__ */ jsxs8(
                  Fragment6,
                  {
                    children: [
                      prefix,
                      /* @__PURE__ */ jsx13("li", {
                        className: cn8(
                          "nx-mx-2.5 nx-break-words nx-rounded-md",
                          "contrast-more:nx-border",
                          i === active
                            ? "nx-bg-primary-500/10 nx-text-primary-600 contrast-more:nx-border-primary-500"
                            : "nx-text-gray-800 contrast-more:nx-border-transparent dark:nx-text-gray-300"
                        ),
                        children: /* @__PURE__ */ jsx13(Anchor, {
                          "className": "nx-block nx-scroll-m-12 nx-px-2.5 nx-py-2",
                          "href": route,
                          "data-index": i,
                          "onFocus": handleActive,
                          "onMouseMove": handleActive,
                          "onClick": finishSearch,
                          "onKeyDown": handleKeyDown,
                          children,
                        }),
                      }),
                    ],
                  },
                  id
                )
              )
            : renderComponent(config.search.emptyResult),
        }),
      }),
    ],
  });
}

// src/components/flexsearch.tsx
import { Fragment as Fragment8, jsx as jsx14, jsxs as jsxs9 } from "react/jsx-runtime";
var indexes = {};
var loadIndexesPromises = /* @__PURE__ */ new Map();
var loadIndexes = (basePath, locale) => {
  const key = basePath + "@" + locale;
  if (loadIndexesPromises.has(key)) {
    return loadIndexesPromises.get(key);
  }
  const promise = loadIndexesImpl(basePath, locale);
  loadIndexesPromises.set(key, promise);
  return promise;
};
var loadIndexesImpl = (basePath, locale) =>
  __async(void 0, null, function* () {
    const response = yield fetch(`${basePath}/_next/static/chunks/nextra-data-${locale}.json`);
    const data = yield response.json();
    const pageIndex = new FlexSearch.Document({
      cache: 100,
      tokenize: "full",
      document: {
        id: "id",
        index: "content",
        store: ["title"],
      },
      context: {
        resolution: 9,
        depth: 2,
        bidirectional: true,
      },
    });
    const sectionIndex = new FlexSearch.Document({
      cache: 100,
      tokenize: "full",
      document: {
        id: "id",
        index: "content",
        tag: "pageId",
        store: ["title", "content", "url", "display"],
      },
      context: {
        resolution: 9,
        depth: 2,
        bidirectional: true,
      },
    });
    let pageId = 0;
    for (const route in data) {
      let pageContent = "";
      ++pageId;
      for (const heading in data[route].data) {
        const [hash, text] = heading.split("#");
        const url = route + (hash ? "#" + hash : "");
        const title = text || data[route].title;
        const content = data[route].data[heading] || "";
        const paragraphs = content.split("\n").filter(Boolean);
        sectionIndex.add(
          __spreadValues(
            {
              id: url,
              url,
              title,
              pageId: `page_${pageId}`,
              content: title,
            },
            paragraphs[0] && { display: paragraphs[0] }
          )
        );
        for (let i = 0; i < paragraphs.length; i++) {
          sectionIndex.add({
            id: `${url}_${i}`,
            url,
            title,
            pageId: `page_${pageId}`,
            content: paragraphs[i],
          });
        }
        pageContent += ` ${title} ${content}`;
      }
      pageIndex.add({
        id: pageId,
        title: data[route].title,
        content: pageContent,
      });
    }
    indexes[locale] = [pageIndex, sectionIndex];
  });
function Flexsearch({ className }) {
  const { locale = DEFAULT_LOCALE, basePath } = useRouter2();
  const [loading, setLoading] = useState5(false);
  const [error, setError] = useState5(false);
  const [results, setResults] = useState5([]);
  const [search, setSearch] = useState5("");
  const doSearch = search2 => {
    var _a, _b;
    if (!search2) return;
    const [pageIndex, sectionIndex] = indexes[locale];
    const pageResults =
      ((_a = pageIndex.search(search2, 5, {
        enrich: true,
        suggest: true,
      })[0]) == null
        ? void 0
        : _a.result) || [];
    const results2 = [];
    const pageTitleMatches = {};
    for (let i = 0; i < pageResults.length; i++) {
      const result = pageResults[i];
      pageTitleMatches[i] = 0;
      const sectionResults =
        ((_b = sectionIndex.search(search2, 5, {
          enrich: true,
          suggest: true,
          tag: `page_${result.id}`,
        })[0]) == null
          ? void 0
          : _b.result) || [];
      let isFirstItemOfPage = true;
      const occurred = {};
      for (let j = 0; j < sectionResults.length; j++) {
        const { doc } = sectionResults[j];
        const isMatchingTitle = doc.display !== void 0;
        if (isMatchingTitle) {
          pageTitleMatches[i]++;
        }
        const { url, title } = doc;
        const content = doc.display || doc.content;
        if (occurred[url + "@" + content]) continue;
        occurred[url + "@" + content] = true;
        results2.push({
          _page_rk: i,
          _section_rk: j,
          route: url,
          prefix:
            isFirstItemOfPage &&
            /* @__PURE__ */ jsx14("div", {
              className: cn9(
                "nx-mx-2.5 nx-mb-2 nx-mt-6 nx-select-none nx-border-b nx-border-black/10 nx-px-2.5 nx-pb-1.5 nx-text-xs nx-font-semibold nx-uppercase nx-text-gray-500 first:nx-mt-0 dark:nx-border-white/20 dark:nx-text-gray-300",
                "contrast-more:nx-border-gray-600 contrast-more:nx-text-gray-900 contrast-more:dark:nx-border-gray-50 contrast-more:dark:nx-text-gray-50"
              ),
              children: result.doc.title,
            }),
          children: /* @__PURE__ */ jsxs9(Fragment8, {
            children: [
              /* @__PURE__ */ jsx14("div", {
                className: "nx-text-base nx-font-semibold nx-leading-5",
                children: /* @__PURE__ */ jsx14(HighlightMatches, { match: search2, value: title }),
              }),
              content &&
                /* @__PURE__ */ jsx14("div", {
                  className:
                    "excerpt nx-mt-1 nx-text-sm nx-leading-[1.35rem] nx-text-gray-600 dark:nx-text-gray-400 contrast-more:dark:nx-text-gray-50",
                  children: /* @__PURE__ */ jsx14(HighlightMatches, {
                    match: search2,
                    value: content,
                  }),
                }),
            ],
          }),
        });
        isFirstItemOfPage = false;
      }
    }
    setResults(
      results2
        .sort((a, b) => {
          if (a._page_rk === b._page_rk) {
            return a._section_rk - b._section_rk;
          }
          if (pageTitleMatches[a._page_rk] !== pageTitleMatches[b._page_rk]) {
            return pageTitleMatches[b._page_rk] - pageTitleMatches[a._page_rk];
          }
          return a._page_rk - b._page_rk;
        })
        .map(res => ({
          id: `${res._page_rk}_${res._section_rk}`,
          route: res.route,
          prefix: res.prefix,
          children: res.children,
        }))
    );
  };
  const preload = useCallback4(
    active =>
      __async(this, null, function* () {
        if (active && !indexes[locale]) {
          setLoading(true);
          try {
            yield loadIndexes(basePath, locale);
          } catch (e) {
            setError(true);
          }
          setLoading(false);
        }
      }),
    [locale, basePath]
  );
  const handleChange = value =>
    __async(this, null, function* () {
      setSearch(value);
      if (loading) {
        return;
      }
      if (!indexes[locale]) {
        setLoading(true);
        try {
          yield loadIndexes(basePath, locale);
        } catch (e) {
          setError(true);
        }
        setLoading(false);
      }
      doSearch(value);
    });
  return /* @__PURE__ */ jsx14(Search, {
    loading,
    error,
    value: search,
    onChange: handleChange,
    onActive: preload,
    className,
    overlayClassName:
      "nx-w-screen nx-min-h-[100px] nx-max-w-[min(calc(100vw-2rem),calc(100%+20rem))]",
    results,
  });
}

// src/components/footer.tsx
import cn11 from "clsx";

// src/components/locale-switch.tsx
import { addBasePath } from "next/dist/client/add-base-path";
import { useRouter as useRouter3 } from "next/router";
import { GlobeIcon } from "nextra/icons";

// src/components/select.tsx
import { Listbox, Transition as Transition2 } from "@headlessui/react";
import cn10 from "clsx";
import { useMounted as useMounted2 } from "nextra/hooks";
import { CheckIcon } from "nextra/icons";
import { createPortal } from "react-dom";
import { jsx as jsx15, jsxs as jsxs10 } from "react/jsx-runtime";
function Select({ options, selected, onChange, title, className }) {
  const [trigger, container] = usePopper({
    strategy: "fixed",
    placement: "top-start",
    modifiers: [
      { name: "offset", options: { offset: [0, 10] } },
      {
        name: "sameWidth",
        enabled: true,
        fn({ state }) {
          state.styles.popper.minWidth = `${state.rects.reference.width}px`;
        },
        phase: "beforeWrite",
        requires: ["computeStyles"],
      },
    ],
  });
  return /* @__PURE__ */ jsx15(Listbox, {
    value: selected,
    onChange,
    children: ({ open }) =>
      /* @__PURE__ */ jsxs10(Listbox.Button, {
        ref: trigger,
        title,
        className: cn10(
          "nx-h-7 nx-rounded-md nx-px-2 nx-text-left nx-text-xs nx-font-medium nx-text-gray-600 nx-transition-colors dark:nx-text-gray-400",
          open
            ? "nx-bg-gray-200 nx-text-gray-900 dark:nx-bg-primary-100/10 dark:nx-text-gray-50"
            : "hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50",
          className
        ),
        children: [
          selected.name,
          /* @__PURE__ */ jsx15(Portal, {
            children: /* @__PURE__ */ jsx15(Transition2, {
              ref: container,
              show: open,
              as: Listbox.Options,
              className:
                "nx-z-20 nx-max-h-64 nx-overflow-auto nx-rounded-md nx-ring-1 nx-ring-black/5 nx-bg-white nx-py-1 nx-text-sm nx-shadow-lg dark:nx-ring-white/20 dark:nx-bg-neutral-800",
              leave: "nx-transition-opacity",
              leaveFrom: "nx-opacity-100",
              leaveTo: "nx-opacity-0",
              children: options.map(option =>
                /* @__PURE__ */ jsxs10(
                  Listbox.Option,
                  {
                    value: option,
                    className: ({ active }) =>
                      cn10(
                        active
                          ? "nx-bg-primary-50 nx-text-primary-600 dark:nx-bg-primary-500/10"
                          : "nx-text-gray-800 dark:nx-text-gray-100",
                        "nx-relative nx-cursor-pointer nx-whitespace-nowrap nx-py-1.5",
                        "nx-transition-colors ltr:nx-pl-3 ltr:nx-pr-9 rtl:nx-pr-3 rtl:nx-pl-9"
                      ),
                    children: [
                      option.name,
                      option.key === selected.key &&
                        /* @__PURE__ */ jsx15("span", {
                          className:
                            "nx-absolute nx-inset-y-0 nx-flex nx-items-center ltr:nx-right-3 rtl:nx-left-3",
                          children: /* @__PURE__ */ jsx15(CheckIcon, {}),
                        }),
                    ],
                  },
                  option.key
                )
              ),
            }),
          }),
        ],
      }),
  });
}
function Portal(props) {
  const mounted = useMounted2();
  if (!mounted) return null;
  return createPortal(props.children, document.body);
}

// src/components/locale-switch.tsx
import { jsx as jsx16, jsxs as jsxs11 } from "react/jsx-runtime";
function LocaleSwitch({ options, lite, className }) {
  const { locale, asPath } = useRouter3();
  const selected = options.find(l => locale === l.locale);
  return /* @__PURE__ */ jsx16(Select, {
    title: "Change language",
    className,
    onChange: option => {
      const date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3);
      document.cookie = `NEXT_LOCALE=${option.key}; expires=${date.toUTCString()}; path=/`;
      location.href = addBasePath(asPath);
    },
    selected: {
      key: (selected == null ? void 0 : selected.locale) || "",
      name: /* @__PURE__ */ jsxs11("span", {
        className: "nx-flex nx-items-center nx-gap-2",
        children: [
          /* @__PURE__ */ jsx16(GlobeIcon, {}),
          /* @__PURE__ */ jsx16("span", {
            className: lite ? "nx-hidden" : "",
            children: selected == null ? void 0 : selected.text,
          }),
        ],
      }),
    },
    options: options.map(l => ({
      key: l.locale,
      name: l.text,
    })),
  });
}

// src/components/footer.tsx
import { jsx as jsx17, jsxs as jsxs12 } from "react/jsx-runtime";
function Footer({ menu }) {
  const config = useConfig();
  return /* @__PURE__ */ jsxs12("footer", {
    className:
      "nx-bg-gray-100 nx-pb-[env(safe-area-inset-bottom)] dark:nx-bg-neutral-900 print:nx-bg-transparent",
    children: [
      /* @__PURE__ */ jsxs12("div", {
        className: cn11(
          "nx-mx-auto nx-flex nx-max-w-[90rem] nx-gap-2 nx-py-2 nx-px-4",
          menu && (config.i18n.length > 0 || config.darkMode) ? "nx-flex" : "nx-hidden"
        ),
        children: [
          config.i18n.length > 0 && /* @__PURE__ */ jsx17(LocaleSwitch, { options: config.i18n }),
          config.darkMode && renderComponent(config.themeSwitch.component),
        ],
      }),
      /* @__PURE__ */ jsx17("hr", { className: "dark:nx-border-neutral-800" }),
      /* @__PURE__ */ jsx17("div", {
        className: cn11(
          "nx-mx-auto nx-flex nx-max-w-[90rem] nx-justify-center nx-py-12 nx-text-gray-600 dark:nx-text-gray-400 md:nx-justify-start",
          "nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]"
        ),
        children: renderComponent(config.footer.text),
      }),
    ],
  });
}

// src/components/head.tsx
import { NextSeo } from "next-seo";
import { useTheme } from "next-themes";
import NextHead from "next/head";
import { useMounted as useMounted3 } from "nextra/hooks";
import { Fragment as Fragment9, jsx as jsx18, jsxs as jsxs13 } from "react/jsx-runtime";
function Head() {
  var _a;
  const config = useConfig();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted3();
  const head = typeof config.head === "function" ? config.head({}) : config.head;
  const hue = config.primaryHue;
  const { dark: darkHue, light: lightHue } =
    typeof hue === "number" ? { dark: hue, light: hue } : hue;
  const frontMatter = config.frontMatter;
  return /* @__PURE__ */ jsxs13(Fragment9, {
    children: [
      /* @__PURE__ */ jsx18(
        NextSeo,
        __spreadValues(
          {
            title: config.title,
            description: frontMatter.description,
            canonical: frontMatter.canonical,
            openGraph: frontMatter.openGraph,
          },
          (_a = config.useNextSeoProps) == null ? void 0 : _a.call(config)
        )
      ),
      /* @__PURE__ */ jsxs13(NextHead, {
        children: [
          config.faviconGlyph
            ? /* @__PURE__ */ jsx18("link", {
                rel: "icon",
                href: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${config.faviconGlyph}</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`,
              })
            : null,
          mounted
            ? /* @__PURE__ */ jsx18("meta", {
                name: "theme-color",
                content: resolvedTheme === "dark" ? "#111" : "#fff",
              })
            : /* @__PURE__ */ jsxs13(Fragment9, {
                children: [
                  /* @__PURE__ */ jsx18("meta", {
                    name: "theme-color",
                    content: "#fff",
                    media: "(prefers-color-scheme: light)",
                  }),
                  /* @__PURE__ */ jsx18("meta", {
                    name: "theme-color",
                    content: "#111",
                    media: "(prefers-color-scheme: dark)",
                  }),
                ],
              }),
          /* @__PURE__ */ jsx18("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
          }),
          /* @__PURE__ */ jsx18("style", {
            children: `
        :root {
          --nextra-primary-hue: ${lightHue}deg;
          --nextra-navbar-height: 4rem;
          --nextra-menu-height: 3.75rem;
          --nextra-banner-height: 2.5rem;
        }
        
        .dark {
          --nextra-primary-hue: ${darkHue}deg;
        }
      `,
          }),
          head,
        ],
      }),
    ],
  });
}

// src/components/nav-links.tsx
import cn12 from "clsx";
import { ArrowRightIcon as ArrowRightIcon2 } from "nextra/icons";
import { jsx as jsx19, jsxs as jsxs14 } from "react/jsx-runtime";
var classes2 = {
  link: cn12(
    "nx-flex nx-max-w-[50%] nx-items-center nx-gap-1 nx-py-4 nx-text-base nx-font-medium nx-text-gray-600 nx-transition-colors [word-break:break-word] hover:nx-text-primary-600 dark:nx-text-gray-300 md:nx-text-lg"
  ),
  icon: cn12("nx-inline nx-h-5 nx-shrink-0"),
};
var NavLinks = ({ flatDirectories, currentIndex }) => {
  const config = useConfig();
  const nav = config.navigation;
  const navigation = typeof nav === "boolean" ? { prev: nav, next: nav } : nav;
  let prev = navigation.prev && flatDirectories[currentIndex - 1];
  let next2 = navigation.next && flatDirectories[currentIndex + 1];
  if (prev && !prev.isUnderCurrentDocsTree) prev = false;
  if (next2 && !next2.isUnderCurrentDocsTree) next2 = false;
  if (!prev && !next2) return null;
  return /* @__PURE__ */ jsxs14("div", {
    className: cn12(
      "nx-mb-8 nx-flex nx-items-center nx-border-t nx-pt-8 dark:nx-border-neutral-800",
      "contrast-more:nx-border-neutral-400 dark:contrast-more:nx-border-neutral-400",
      "print:nx-hidden"
    ),
    children: [
      prev &&
        /* @__PURE__ */ jsxs14(Anchor, {
          href: prev.route,
          title: prev.title,
          className: cn12(classes2.link, "ltr:nx-pr-4 rtl:nx-pl-4"),
          children: [
            /* @__PURE__ */ jsx19(ArrowRightIcon2, {
              className: cn12(classes2.icon, "ltr:nx-rotate-180"),
            }),
            prev.title,
          ],
        }),
      next2 &&
        /* @__PURE__ */ jsxs14(Anchor, {
          href: next2.route,
          title: next2.title,
          className: cn12(
            classes2.link,
            "ltr:nx-ml-auto ltr:nx-pl-4 ltr:nx-text-right rtl:nx-mr-auto rtl:nx-pr-4 rtl:nx-text-left"
          ),
          children: [
            next2.title,
            /* @__PURE__ */ jsx19(ArrowRightIcon2, {
              className: cn12(classes2.icon, "rtl:nx-rotate-180"),
            }),
          ],
        }),
    ],
  });
};

// src/components/navbar.tsx
import { Menu, Transition as Transition3 } from "@headlessui/react";
import cn13 from "clsx";
import { useFSRoute } from "nextra/hooks";
import { ArrowRightIcon as ArrowRightIcon3, MenuIcon } from "nextra/icons";
import { jsx as jsx20, jsxs as jsxs15 } from "react/jsx-runtime";
var classes3 = {
  link: cn13("nx-text-sm contrast-more:nx-text-gray-700 contrast-more:dark:nx-text-gray-100"),
  active: cn13("nx-font-medium nx-subpixel-antialiased"),
  inactive: cn13(
    "nx-text-gray-600 hover:nx-text-gray-800 dark:nx-text-gray-400 dark:hover:nx-text-gray-200"
  ),
};
function NavbarMenu({ className, menu, children }) {
  const { items } = menu;
  const routes = Object.fromEntries((menu.children || []).map(route => [route.name, route]));
  return /* @__PURE__ */ jsx20("div", {
    className: "nx-relative nx-inline-block",
    children: /* @__PURE__ */ jsxs15(Menu, {
      children: [
        /* @__PURE__ */ jsx20(Menu.Button, {
          className: cn13(
            className,
            "-nx-ml-2 nx-hidden nx-items-center nx-whitespace-nowrap nx-rounded nx-p-2 md:nx-inline-flex",
            classes3.inactive
          ),
          children,
        }),
        /* @__PURE__ */ jsx20(Transition3, {
          leave: "nx-transition-opacity",
          leaveFrom: "nx-opacity-100",
          leaveTo: "nx-opacity-0",
          children: /* @__PURE__ */ jsx20(Menu.Items, {
            className:
              "nx-absolute nx-right-0 nx-z-20 nx-mt-1 nx-max-h-64 nx-min-w-full nx-overflow-auto nx-rounded-md nx-ring-1 nx-ring-black/5 nx-bg-white nx-py-1 nx-text-sm nx-shadow-lg dark:nx-ring-white/20 dark:nx-bg-neutral-800",
            children: Object.entries(items || {}).map(([key, item]) => {
              var _a;
              return /* @__PURE__ */ jsx20(
                Menu.Item,
                {
                  children: /* @__PURE__ */ jsx20(Anchor, {
                    href:
                      item.href ||
                      ((_a = routes[key]) == null ? void 0 : _a.route) ||
                      menu.route + "/" + key,
                    className: cn13(
                      "nx-relative nx-hidden nx-w-full nx-select-none nx-whitespace-nowrap nx-text-gray-600 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-100 md:nx-inline-block",
                      "nx-py-1.5 nx-transition-colors ltr:nx-pl-3 ltr:nx-pr-9 rtl:nx-pr-3 rtl:nx-pl-9"
                    ),
                    newWindow: item.newWindow,
                    children: item.title || key,
                  }),
                },
                key
              );
            }),
          }),
        }),
      ],
    }),
  });
}
function Navbar({ flatDirectories, items }) {
  const config = useConfig();
  const activeRoute = useFSRoute();
  const { menu, setMenu } = useMenu();
  return /* @__PURE__ */ jsxs15("div", {
    className:
      "nextra-nav-container nx-sticky nx-top-0 nx-z-20 nx-w-full nx-bg-transparent print:nx-hidden",
    children: [
      /* @__PURE__ */ jsx20("div", {
        className: cn13(
          "nextra-nav-container-blur",
          "nx-pointer-events-none nx-absolute nx-z-[-1] nx-h-full nx-w-full nx-bg-white dark:nx-bg-dark",
          "nx-shadow-[0_2px_4px_rgba(0,0,0,.02),0_1px_0_rgba(0,0,0,.06)] dark:nx-shadow-[0_-1px_0_rgba(255,255,255,.1)_inset]",
          "contrast-more:nx-shadow-[0_0_0_1px_#000] contrast-more:dark:nx-shadow-[0_0_0_1px_#fff]"
        ),
      }),
      /* @__PURE__ */ jsxs15("nav", {
        className:
          "nx-mx-auto nx-flex nx-h-[var(--nextra-navbar-height)] nx-max-w-[90rem] nx-items-center nx-justify-end nx-gap-2 nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]",
        children: [
          config.logoLink
            ? /* @__PURE__ */ jsx20(Anchor, {
                href: typeof config.logoLink === "string" ? config.logoLink : "/",
                className:
                  "nx-flex nx-items-center hover:nx-opacity-75 ltr:nx-mr-auto rtl:nx-ml-auto",
                children: renderComponent(config.logo),
              })
            : /* @__PURE__ */ jsx20("div", {
                className: "nx-flex nx-items-center ltr:nx-mr-auto rtl:nx-ml-auto",
                children: renderComponent(config.logo),
              }),
          items.map(pageOrMenu => {
            if (pageOrMenu.display === "hidden") return null;
            if (pageOrMenu.type === "menu") {
              const menu2 = pageOrMenu;
              const isActive2 =
                menu2.route === activeRoute || activeRoute.startsWith(menu2.route + "/");
              return /* @__PURE__ */ jsxs15(
                NavbarMenu,
                {
                  className: cn13(
                    classes3.link,
                    "nx-flex nx-gap-1",
                    isActive2 ? classes3.active : classes3.inactive
                  ),
                  menu: menu2,
                  children: [
                    menu2.title,
                    /* @__PURE__ */ jsx20(ArrowRightIcon3, {
                      className: "nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5",
                      pathClassName: "nx-origin-center nx-transition-transform nx-rotate-90",
                    }),
                  ],
                },
                menu2.title
              );
            }
            const page = pageOrMenu;
            let href = page.href || page.route || "#";
            if (page.children) {
              href = (page.withIndexPage ? page.route : page.firstChildRoute) || href;
            }
            const isActive = page.route === activeRoute || activeRoute.startsWith(page.route + "/");
            return /* @__PURE__ */ jsxs15(
              Anchor,
              {
                href,
                "className": cn13(
                  classes3.link,
                  "nx-relative -nx-ml-2 nx-hidden nx-whitespace-nowrap nx-p-2 md:nx-inline-block",
                  !isActive || page.newWindow ? classes3.inactive : classes3.active
                ),
                "newWindow": page.newWindow,
                "aria-current": !page.newWindow && isActive,
                "children": [
                  /* @__PURE__ */ jsx20("span", {
                    className: "nx-absolute nx-inset-x-0 nx-text-center",
                    children: page.title,
                  }),
                  /* @__PURE__ */ jsx20("span", {
                    className: "nx-invisible nx-font-medium",
                    children: page.title,
                  }),
                ],
              },
              href
            );
          }),
          renderComponent(config.search.component, {
            directories: flatDirectories,
            className: "nx-hidden md:nx-inline-block mx-min-w-[200px]",
          }),
          config.project.link
            ? /* @__PURE__ */ jsx20(Anchor, {
                className: "nx-p-2 nx-text-current",
                href: config.project.link,
                newWindow: true,
                children: renderComponent(config.project.icon),
              })
            : null,
          config.chat.link
            ? /* @__PURE__ */ jsx20(Anchor, {
                className: "nx-p-2 nx-text-current",
                href: config.chat.link,
                newWindow: true,
                children: renderComponent(config.chat.icon),
              })
            : null,
          renderComponent(config.navbar.extraContent),
          /* @__PURE__ */ jsx20("button", {
            "type": "button",
            "aria-label": "Menu",
            "className":
              "nextra-hamburger -nx-mr-2 nx-rounded nx-p-2 active:nx-bg-gray-400/20 md:nx-hidden",
            "onClick": () => setMenu(!menu),
            "children": /* @__PURE__ */ jsx20(MenuIcon, { className: cn13({ open: menu }) }),
          }),
        ],
      }),
    ],
  });
}

// src/components/not-found.tsx
import { useRouter as useRouter4 } from "next/router";
import { useMounted as useMounted4 } from "nextra/hooks";
import { jsx as jsx21 } from "react/jsx-runtime";
function NotFoundPage() {
  const config = useConfig();
  const mounted = useMounted4();
  const { asPath } = useRouter4();
  const { content, labels } = config.notFound;
  if (!content) {
    return null;
  }
  return /* @__PURE__ */ jsx21("p", {
    className: "nx-text-center",
    children: /* @__PURE__ */ jsx21(Anchor, {
      href: getGitIssueUrl({
        repository: config.docsRepositoryBase,
        title: `Found broken \`${mounted ? asPath : ""}\` link. Please fix!`,
        labels,
      }),
      newWindow: true,
      className:
        "nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]",
      children: renderComponent(content),
    }),
  });
}

// src/components/server-side-error.tsx
import { useRouter as useRouter5 } from "next/router";
import { useMounted as useMounted5 } from "nextra/hooks";
import { jsx as jsx22 } from "react/jsx-runtime";
function ServerSideErrorPage() {
  const config = useConfig();
  const mounted = useMounted5();
  const { asPath } = useRouter5();
  const { content, labels } = config.serverSideError;
  if (!content) {
    return null;
  }
  return /* @__PURE__ */ jsx22("p", {
    className: "nx-text-center",
    children: /* @__PURE__ */ jsx22(Anchor, {
      href: getGitIssueUrl({
        repository: config.docsRepositoryBase,
        title: `Got server-side error in \`${mounted ? asPath : ""}\` url. Please fix!`,
        labels,
      }),
      newWindow: true,
      className:
        "nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]",
      children: renderComponent(content),
    }),
  });
}

// src/components/sidebar.tsx
import cn14 from "clsx";
import { useRouter as useRouter6 } from "next/router";
import { useFSRoute as useFSRoute2 } from "nextra/hooks";
import { ArrowRightIcon as ArrowRightIcon4, ExpandIcon } from "nextra/icons";
import {
  createContext as createContext6,
  memo as memo3,
  useContext as useContext6,
  useEffect as useEffect3,
  useMemo as useMemo2,
  useRef as useRef5,
  useState as useState6,
} from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import { Fragment as Fragment10, jsx as jsx23, jsxs as jsxs16 } from "react/jsx-runtime";
var TreeState = /* @__PURE__ */ Object.create(null);
var FocusedItemContext = createContext6(null);
var OnFocuseItemContext = createContext6(null);
var FolderLevelContext = createContext6(0);
var Folder2 = memo3(function FolderInner(props) {
  const level = useContext6(FolderLevelContext);
  return /* @__PURE__ */ jsx23(FolderLevelContext.Provider, {
    value: level + 1,
    children: /* @__PURE__ */ jsx23(FolderImpl, __spreadValues({}, props)),
  });
});
var classes4 = {
  link: cn14(
    "nx-flex nx-rounded nx-px-2 nx-py-1.5 nx-text-sm nx-transition-colors [word-break:break-word]",
    "nx-cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:nx-border"
  ),
  inactive: cn14(
    "nx-text-gray-500 hover:nx-bg-gray-100 hover:nx-text-gray-900",
    "dark:nx-text-neutral-400 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50",
    "contrast-more:nx-text-gray-900 contrast-more:dark:nx-text-gray-50",
    "contrast-more:nx-border-transparent contrast-more:hover:nx-border-gray-900 contrast-more:dark:hover:nx-border-gray-50"
  ),
  active: cn14(
    "nx-bg-primary-100 nx-font-semibold nx-text-primary-800 dark:nx-bg-primary-400/10 dark:nx-text-primary-600",
    "contrast-more:nx-border-primary-500 contrast-more:dark:nx-border-primary-500"
  ),
  list: cn14("nx-flex nx-flex-col nx-gap-1"),
  border: cn14(
    "nx-relative before:nx-absolute before:nx-inset-y-1",
    'before:nx-w-px before:nx-bg-gray-200 before:nx-content-[""] dark:before:nx-bg-neutral-800',
    "ltr:nx-pl-3 ltr:before:nx-left-0 rtl:nx-pr-3 rtl:before:nx-right-0"
  ),
};
function FolderImpl({ item, anchors }) {
  const routeOriginal = useFSRoute2();
  const [route] = routeOriginal.split("#");
  const active = [route, route + "/"].includes(item.route + "/");
  const activeRouteInside = active || route.startsWith(item.route + "/");
  const focusedRoute = useContext6(FocusedItemContext);
  const focusedRouteInside = !!(focusedRoute == null
    ? void 0
    : focusedRoute.startsWith(item.route + "/"));
  const level = useContext6(FolderLevelContext);
  const { setMenu } = useMenu();
  const config = useConfig();
  const { theme: theme2 } = item;
  const open =
    TreeState[item.route] === void 0
      ? active ||
        activeRouteInside ||
        focusedRouteInside ||
        (theme2 && "collapsed" in theme2
          ? !theme2.collapsed
          : level < config.sidebar.defaultMenuCollapseLevel)
      : TreeState[item.route] || focusedRouteInside;
  const rerender = useState6({})[1];
  useEffect3(() => {
    if (activeRouteInside || focusedRouteInside) {
      TreeState[item.route] = true;
    }
  }, [activeRouteInside, focusedRouteInside, item.route]);
  if (item.type === "menu") {
    const menu = item;
    const routes = Object.fromEntries((menu.children || []).map(route2 => [route2.name, route2]));
    item.children = Object.entries(menu.items || {}).map(([key, item2]) => {
      const route2 =
        routes[key] ||
        __spreadProps(
          __spreadValues(
            {
              name: key,
            },
            "locale" in menu && { locale: menu.locale }
          ),
          {
            route: menu.route + "/" + key,
          }
        );
      return __spreadValues(__spreadValues({}, route2), item2);
    });
  }
  const isLink = "withIndexPage" in item && item.withIndexPage;
  const ComponentToUse = isLink ? Anchor : "button";
  return /* @__PURE__ */ jsxs16("li", {
    className: cn14({ open, active }),
    children: [
      /* @__PURE__ */ jsxs16(ComponentToUse, {
        href: isLink ? item.route : void 0,
        className: cn14(
          "nx-items-center nx-justify-between nx-gap-2",
          !isLink && "nx-text-left nx-w-full",
          classes4.link,
          active ? classes4.active : classes4.inactive
        ),
        onClick: e => {
          const clickedToggleIcon = ["svg", "path"].includes(e.target.tagName.toLowerCase());
          if (clickedToggleIcon) {
            e.preventDefault();
          }
          if (isLink) {
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
        },
        children: [
          renderComponent(config.sidebar.titleComponent, {
            title: item.title,
            type: item.type,
            route: item.route,
          }),
          /* @__PURE__ */ jsx23(ArrowRightIcon4, {
            className:
              "nx-h-[18px] nx-min-w-[18px] nx-rounded-sm nx-p-0.5 hover:nx-bg-gray-800/5 dark:hover:nx-bg-gray-100/5",
            pathClassName: cn14(
              "nx-origin-center nx-transition-transform rtl:-nx-rotate-180",
              open && "ltr:nx-rotate-90 rtl:nx-rotate-[-270deg]"
            ),
          }),
        ],
      }),
      /* @__PURE__ */ jsx23(Collapse, {
        className: "ltr:nx-pr-0 rtl:nx-pl-0 nx-pt-1",
        isOpen: open,
        children: Array.isArray(item.children)
          ? /* @__PURE__ */ jsx23(Menu2, {
              className: cn14(classes4.border, "ltr:nx-ml-3 rtl:nx-mr-3"),
              directories: item.children,
              base: item.route,
              anchors,
            })
          : null,
      }),
    ],
  });
}
function Separator({ title }) {
  const config = useConfig();
  return /* @__PURE__ */ jsx23("li", {
    className: cn14(
      "[word-break:break-word]",
      title
        ? "nx-mt-5 nx-mb-2 nx-px-2 nx-py-1.5 nx-text-sm nx-font-semibold nx-text-gray-900 first:nx-mt-0 dark:nx-text-gray-100"
        : "nx-my-4"
    ),
    children: title
      ? renderComponent(config.sidebar.titleComponent, {
          title,
          type: "separator",
          route: "",
        })
      : /* @__PURE__ */ jsx23("hr", {
          className: "nx-mx-2 nx-border-t nx-border-gray-200 dark:nx-border-primary-100/10",
        }),
  });
}
function File2({ item, anchors }) {
  const route = useFSRoute2();
  const onFocus = useContext6(OnFocuseItemContext);
  const active = item.route && [route, route + "/"].includes(item.route + "/");
  const activeAnchor = useActiveAnchor();
  const { setMenu } = useMenu();
  const config = useConfig();
  if (item.type === "separator") {
    return /* @__PURE__ */ jsx23(Separator, { title: item.title });
  }
  return /* @__PURE__ */ jsxs16("li", {
    className: cn14(classes4.list, { active }),
    children: [
      /* @__PURE__ */ jsx23(Anchor, {
        href: item.href || item.route,
        newWindow: item.newWindow,
        className: cn14(classes4.link, active ? classes4.active : classes4.inactive),
        onClick: () => {
          setMenu(false);
        },
        onFocus: () => {
          onFocus == null ? void 0 : onFocus(item.route);
        },
        onBlur: () => {
          onFocus == null ? void 0 : onFocus(null);
        },
        children: renderComponent(config.sidebar.titleComponent, {
          title: item.title,
          type: item.type,
          route: item.route,
        }),
      }),
      active &&
        anchors.length > 0 &&
        /* @__PURE__ */ jsx23("ul", {
          className: cn14(classes4.list, classes4.border, "ltr:nx-ml-3 rtl:nx-mr-3"),
          children: anchors.map(({ id, value }) => {
            var _a;
            return /* @__PURE__ */ jsx23(
              "li",
              {
                children: /* @__PURE__ */ jsx23("a", {
                  href: `#${id}`,
                  className: cn14(
                    classes4.link,
                    'nx-flex nx-gap-2 before:nx-opacity-25 before:nx-content-["#"]',
                    ((_a = activeAnchor[id]) == null ? void 0 : _a.isActive)
                      ? classes4.active
                      : classes4.inactive
                  ),
                  onClick: () => {
                    setMenu(false);
                  },
                  children: value,
                }),
              },
              id
            );
          }),
        }),
    ],
  });
}
function Menu2({ directories, anchors, className, onlyCurrentDocs }) {
  return /* @__PURE__ */ jsx23("ul", {
    className: cn14(classes4.list, className),
    children: directories.map(item =>
      !onlyCurrentDocs || item.isUnderCurrentDocsTree
        ? item.type === "menu" || (item.children && (item.children.length || !item.withIndexPage))
          ? /* @__PURE__ */ jsx23(Folder2, { item, anchors }, item.name)
          : /* @__PURE__ */ jsx23(File2, { item, anchors }, item.name)
        : null
    ),
  });
}
function Sidebar({
  docsDirectories,
  flatDirectories,
  fullDirectories,
  asPopover = false,
  headings,
  includePlaceholder,
}) {
  const config = useConfig();
  const { menu, setMenu } = useMenu();
  const router = useRouter6();
  const [focused, setFocused] = useState6(null);
  const [showSidebar, setSidebar] = useState6(true);
  const [showToggleAnimation, setToggleAnimation] = useState6(false);
  const anchors = useMemo2(() => headings.filter(v => v.depth === 2), [headings]);
  const sidebarRef = useRef5(null);
  const containerRef = useRef5(null);
  useEffect3(() => {
    if (menu) {
      document.body.classList.add("nx-overflow-hidden", "md:nx-overflow-auto");
    } else {
      document.body.classList.remove("nx-overflow-hidden", "md:nx-overflow-auto");
    }
  }, [menu]);
  useEffect3(() => {
    var _a;
    const activeElement =
      (_a = sidebarRef.current) == null ? void 0 : _a.querySelector("li.active");
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
        setTimeout(scroll, 300);
      } else {
        scroll();
      }
    }
  }, [menu]);
  useEffect3(() => {
    setMenu(false);
  }, [router.asPath, setMenu]);
  const hasI18n = config.i18n.length > 0;
  const hasMenu = config.darkMode || hasI18n;
  return /* @__PURE__ */ jsxs16(Fragment10, {
    children: [
      includePlaceholder && asPopover
        ? /* @__PURE__ */ jsx23("div", { className: "max-xl:nx-hidden nx-h-0 nx-w-64 nx-shrink-0" })
        : null,
      /* @__PURE__ */ jsx23("div", {
        className: cn14(
          "motion-reduce:nx-transition-none [transition:background-color_1.5s_ease]",
          menu
            ? "nx-fixed nx-inset-0 nx-z-10 nx-bg-black/80 dark:nx-bg-black/60"
            : "nx-bg-transparent"
        ),
        onClick: () => setMenu(false),
      }),
      /* @__PURE__ */ jsxs16("aside", {
        className: cn14(
          "nextra-sidebar-container nx-flex nx-flex-col",
          "md:nx-top-16 md:nx-shrink-0 motion-reduce:nx-transform-none",
          "nx-transform-gpu nx-transition-all nx-ease-in-out",
          "print:nx-hidden",
          showSidebar ? "md:nx-w-64" : "md:nx-w-20",
          asPopover ? "md:nx-hidden" : "md:nx-sticky md:nx-self-start",
          menu
            ? "max-md:[transform:translate3d(0,0,0)]"
            : "max-md:[transform:translate3d(0,-100%,0)]"
        ),
        ref: containerRef,
        children: [
          /* @__PURE__ */ jsx23("div", {
            className: "nx-px-4 nx-pt-4 md:nx-hidden",
            children: renderComponent(config.search.component, {
              directories: flatDirectories,
            }),
          }),
          /* @__PURE__ */ jsx23(FocusedItemContext.Provider, {
            value: focused,
            children: /* @__PURE__ */ jsx23(OnFocuseItemContext.Provider, {
              value: item => {
                setFocused(item);
              },
              children: /* @__PURE__ */ jsxs16("div", {
                className: cn14(
                  "nx-overflow-y-auto nx-overflow-x-hidden",
                  "nx-p-4 nx-grow md:nx-h-[calc(100vh-var(--nextra-navbar-height)-var(--nextra-menu-height))]",
                  showSidebar ? "nextra-scrollbar" : "no-scrollbar"
                ),
                ref: sidebarRef,
                children: [
                  (!asPopover || !showSidebar) &&
                    /* @__PURE__ */ jsx23(Collapse, {
                      isOpen: showSidebar,
                      horizontal: true,
                      children: /* @__PURE__ */ jsx23(Menu2, {
                        className: "max-md:nx-hidden",
                        directories: docsDirectories,
                        anchors: config.toc.float ? [] : anchors,
                        onlyCurrentDocs: true,
                      }),
                    }),
                  /* @__PURE__ */ jsx23(Menu2, {
                    className: "md:nx-hidden",
                    directories: fullDirectories,
                    anchors,
                  }),
                ],
              }),
            }),
          }),
          hasMenu &&
            /* @__PURE__ */ jsxs16("div", {
              "className": cn14(
                "nx-sticky nx-bottom-0",
                "nx-bg-white dark:nx-bg-dark",
                // when banner is showed, sidebar links can be behind menu, set bg color as body bg color
                "nx-mx-4 nx-py-4 nx-shadow-[0_-12px_16px_#fff]",
                "nx-flex nx-items-center nx-gap-2",
                "dark:nx-border-neutral-800 dark:nx-shadow-[0_-12px_16px_#111]",
                "contrast-more:nx-border-neutral-400 contrast-more:nx-shadow-none contrast-more:dark:nx-shadow-none",
                showSidebar
                  ? cn14(hasI18n && "nx-justify-end", "nx-border-t")
                  : "nx-py-4 nx-flex-wrap nx-justify-center"
              ),
              "data-toggle-animation": showToggleAnimation
                ? showSidebar
                  ? "show"
                  : "hide"
                : "off",
              "children": [
                hasI18n &&
                  /* @__PURE__ */ jsx23(LocaleSwitch, {
                    options: config.i18n,
                    lite: !showSidebar,
                    className: cn14(showSidebar ? "nx-grow" : "max-md:nx-grow"),
                  }),
                config.darkMode &&
                  /* @__PURE__ */ jsx23("div", {
                    className: showSidebar && !hasI18n ? "nx-grow nx-flex nx-flex-col" : "",
                    children: renderComponent(config.themeSwitch.component, {
                      lite: !showSidebar || hasI18n,
                    }),
                  }),
                config.sidebar.toggleButton &&
                  /* @__PURE__ */ jsx23("button", {
                    title: showSidebar ? "Hide sidebar" : "Show sidebar",
                    className:
                      "max-md:nx-hidden nx-h-7 nx-rounded-md nx-transition-colors nx-text-gray-600 dark:nx-text-gray-400 nx-px-2 hover:nx-bg-gray-100 hover:nx-text-gray-900 dark:hover:nx-bg-primary-100/5 dark:hover:nx-text-gray-50",
                    onClick: () => {
                      setSidebar(!showSidebar);
                      setToggleAnimation(true);
                    },
                    children: /* @__PURE__ */ jsx23(ExpandIcon, { isOpen: showSidebar }),
                  }),
              ],
            }),
        ],
      }),
    ],
  });
}

// src/components/skip-nav.tsx
import cn15 from "clsx";
import { forwardRef as forwardRef3 } from "react";
import { jsx as jsx24 } from "react/jsx-runtime";
var DEFAULT_ID = "reach-skip-nav";
var DEFAULT_LABEL = "Skip to content";
var SkipNavLink = forwardRef3(function (_a, forwardedRef) {
  var _b = _a,
    { className: providedClassName, id, label = DEFAULT_LABEL, styled } = _b,
    props = __objRest(_b, ["className", "id", "label", "styled"]);
  const className =
    providedClassName === void 0
      ? styled
        ? cn15(
            "nx-sr-only",
            "focus:nx-not-sr-only focus:nx-fixed focus:nx-z-50 focus:nx-m-3 focus:nx-ml-4 focus:nx-h-[calc(var(--nextra-navbar-height)-1.5rem)] focus:nx-rounded-lg focus:nx-border focus:nx-px-3 focus:nx-py-2 focus:nx-align-middle focus:nx-text-sm focus:nx-font-bold",
            "focus:nx-text-gray-900 focus:dark:nx-text-gray-100",
            "focus:nx-bg-white focus:dark:nx-bg-neutral-900",
            "focus:nx-border-neutral-400 focus:dark:nx-border-neutral-800"
          )
        : ""
      : providedClassName;
  return /* @__PURE__ */ jsx24(
    "a",
    __spreadProps(__spreadValues({}, props), {
      "ref": forwardedRef,
      "href": `#${id || DEFAULT_ID}`,
      className,
      "data-reach-skip-link": "",
      "children": label,
    })
  );
});
SkipNavLink.displayName = "SkipNavLink";
var SkipNavContent = forwardRef3(function (_a, forwardedRef) {
  var _b = _a,
    { id } = _b,
    props = __objRest(_b, ["id"]);
  return /* @__PURE__ */ jsx24(
    "div",
    __spreadProps(__spreadValues({}, props), { ref: forwardedRef, id: id || DEFAULT_ID })
  );
});
SkipNavContent.displayName = "SkipNavContent";

// src/components/steps.tsx
import cn16 from "clsx";
import { jsx as jsx25 } from "react/jsx-runtime";
function Steps(_a) {
  var _b = _a,
    { children, className } = _b,
    props = __objRest(_b, ["children", "className"]);
  return /* @__PURE__ */ jsx25(
    "div",
    __spreadProps(
      __spreadValues(
        {
          className: cn16(
            "nextra-steps nx-ml-4 nx-mb-12 nx-border-l nx-border-gray-200 nx-pl-6",
            "dark:nx-border-neutral-800 [counter-reset:step]",
            className
          ),
        },
        props
      ),
      {
        children,
      }
    )
  );
}

// src/components/tabs.tsx
import { Tab as HeadlessTab } from "@headlessui/react";
import cn17 from "clsx";
import { jsx as jsx26, jsxs as jsxs17 } from "react/jsx-runtime";
function isTabItem(item) {
  if (item && typeof item === "object" && "label" in item) return true;
  return false;
}
var renderTab = item => {
  if (isTabItem(item)) {
    return item.label;
  }
  return item;
};
function Tabs({ items, selectedIndex, defaultIndex, onChange, children }) {
  return /* @__PURE__ */ jsxs17(HeadlessTab.Group, {
    selectedIndex,
    defaultIndex,
    onChange,
    children: [
      /* @__PURE__ */ jsx26("div", {
        className:
          "nextra-scrollbar nx-overflow-x-auto nx-overflow-y-hidden nx-overscroll-x-contain",
        children: /* @__PURE__ */ jsx26(HeadlessTab.List, {
          className:
            "nx-mt-4 nx-flex nx-w-max nx-min-w-full nx-border-b nx-border-gray-200 nx-pb-px dark:nx-border-neutral-800",
          children: items.map((item, index) => {
            const disabled = !!(
              item &&
              typeof item === "object" &&
              "disabled" in item &&
              item.disabled
            );
            return /* @__PURE__ */ jsx26(
              HeadlessTab,
              {
                disabled,
                className: ({ selected }) =>
                  cn17(
                    "nx-mr-2 nx-rounded-t nx-p-2 nx-font-medium nx-leading-5 nx-transition-colors",
                    "-nx-mb-0.5 nx-select-none nx-border-b-2",
                    selected
                      ? "nx-border-primary-500 nx-text-primary-600"
                      : "nx-border-transparent nx-text-gray-600 hover:nx-border-gray-200 hover:nx-text-black dark:nx-text-gray-200 dark:hover:nx-border-neutral-800 dark:hover:nx-text-white",
                    disabled && "nx-pointer-events-none nx-text-gray-400 dark:nx-text-neutral-600"
                  ),
                children: renderTab(item),
              },
              index
            );
          }),
        }),
      }),
      /* @__PURE__ */ jsx26(HeadlessTab.Panels, { children }),
    ],
  });
}
function Tab(_a) {
  var _b = _a,
    { children } = _b,
    props = __objRest(_b, ["children"]);
  return /* @__PURE__ */ jsx26(
    HeadlessTab.Panel,
    __spreadProps(__spreadValues({}, props), { className: "nx-rounded nx-pt-6", children })
  );
}

// src/components/theme-switch.tsx
import { useTheme as useTheme2 } from "next-themes";
import { useMounted as useMounted6 } from "nextra/hooks";
import { MoonIcon, SunIcon } from "nextra/icons";
import { z } from "zod";
import { jsx as jsx27, jsxs as jsxs18 } from "react/jsx-runtime";
var themeOptionsSchema = z.strictObject({
  light: z.string(),
  dark: z.string(),
  system: z.string(),
});
function ThemeSwitch({ lite, className }) {
  const { setTheme, resolvedTheme, theme: theme2 = "" } = useTheme2();
  const mounted = useMounted6();
  const config = useConfig().themeSwitch;
  const IconToUse = mounted && resolvedTheme === "dark" ? MoonIcon : SunIcon;
  const options = typeof config.useOptions === "function" ? config.useOptions() : config.useOptions;
  return /* @__PURE__ */ jsx27(Select, {
    className,
    title: "Change theme",
    options: [
      { key: "light", name: options.light },
      { key: "dark", name: options.dark },
      { key: "system", name: options.system },
    ],
    onChange: option => {
      setTheme(option.key);
    },
    selected: {
      key: theme2,
      name: /* @__PURE__ */ jsxs18("div", {
        className: "nx-flex nx-items-center nx-gap-2 nx-capitalize",
        children: [
          /* @__PURE__ */ jsx27(IconToUse, {}),
          /* @__PURE__ */ jsx27("span", {
            className: lite ? "md:nx-hidden" : "",
            children: mounted ? options[theme2] : options.light,
          }),
        ],
      }),
    },
  });
}

// src/components/toc.tsx
import cn18 from "clsx";
import { useEffect as useEffect4, useMemo as useMemo3, useRef as useRef6 } from "react";
import scrollIntoView2 from "scroll-into-view-if-needed";
import { Fragment as Fragment11, jsx as jsx28, jsxs as jsxs19 } from "react/jsx-runtime";
var linkClassName = cn18(
  "nx-text-xs nx-font-medium nx-text-gray-500 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-100",
  "contrast-more:nx-text-gray-800 contrast-more:dark:nx-text-gray-50"
);
function TOC({ headings, filePath }) {
  var _a;
  const activeAnchor = useActiveAnchor();
  const config = useConfig();
  const tocRef = useRef6(null);
  const items = useMemo3(() => headings.filter(heading => heading.depth > 1), [headings]);
  const hasHeadings = items.length > 0;
  const hasMetaInfo = Boolean(
    config.feedback.content || config.editLink.component || config.toc.extraContent
  );
  const activeSlug =
    (_a = Object.entries(activeAnchor).find(([, { isActive }]) => isActive)) == null
      ? void 0
      : _a[0];
  useEffect4(() => {
    var _a2;
    if (!activeSlug) return;
    const anchor =
      (_a2 = tocRef.current) == null ? void 0 : _a2.querySelector(`li > a[href="#${activeSlug}"]`);
    if (anchor) {
      scrollIntoView2(anchor, {
        behavior: "smooth",
        block: "center",
        inline: "center",
        scrollMode: "always",
        boundary: tocRef.current,
      });
    }
  }, [activeSlug]);
  return /* @__PURE__ */ jsxs19("div", {
    ref: tocRef,
    className: cn18(
      "nextra-scrollbar nx-sticky nx-top-16 nx-overflow-y-auto nx-pr-4 nx-pt-6 nx-text-sm [hyphens:auto]",
      "nx-max-h-[calc(100vh-var(--nextra-navbar-height)-env(safe-area-inset-bottom))] ltr:-nx-mr-4 rtl:-nx-ml-4"
    ),
    children: [
      hasHeadings &&
        /* @__PURE__ */ jsxs19(Fragment11, {
          children: [
            /* @__PURE__ */ jsx28("p", {
              className: "nx-mb-4 nx-font-semibold nx-tracking-tight",
              children: renderComponent(config.toc.title),
            }),
            /* @__PURE__ */ jsx28("ul", {
              children: items.map(({ id, value, depth }) => {
                var _a2, _b, _c, _d;
                return /* @__PURE__ */ jsx28(
                  "li",
                  {
                    className: "nx-my-2 nx-scroll-my-6 nx-scroll-py-6",
                    children: /* @__PURE__ */ jsx28("a", {
                      href: `#${id}`,
                      className: cn18(
                        {
                          2: "nx-font-semibold",
                          3: "ltr:nx-pl-4 rtl:nx-pr-4",
                          4: "ltr:nx-pl-8 rtl:nx-pr-8",
                          5: "ltr:nx-pl-12 rtl:nx-pr-12",
                          6: "ltr:nx-pl-16 rtl:nx-pr-16",
                        }[depth],
                        "nx-inline-block",
                        ((_a2 = activeAnchor[id]) == null ? void 0 : _a2.isActive)
                          ? "nx-text-primary-600 nx-subpixel-antialiased contrast-more:!nx-text-primary-600"
                          : "nx-text-gray-500 hover:nx-text-gray-900 dark:nx-text-gray-400 dark:hover:nx-text-gray-300",
                        "contrast-more:nx-text-gray-900 contrast-more:nx-underline contrast-more:dark:nx-text-gray-50 nx-w-full nx-break-words"
                      ),
                      children:
                        (_d =
                          (_c = (_b = config.toc).headingComponent) == null
                            ? void 0
                            : _c.call(_b, {
                                id,
                                children: value,
                              })) != null
                          ? _d
                          : value,
                    }),
                  },
                  id
                );
              }),
            }),
          ],
        }),
      hasMetaInfo &&
        /* @__PURE__ */ jsxs19("div", {
          className: cn18(
            hasHeadings &&
              "nx-mt-8 nx-border-t nx-bg-white nx-pt-8 nx-shadow-[0_-12px_16px_white] dark:nx-bg-dark dark:nx-shadow-[0_-12px_16px_#111]",
            "nx-sticky nx-bottom-0 nx-flex nx-flex-col nx-items-start nx-gap-2 nx-pb-8 dark:nx-border-neutral-800",
            "contrast-more:nx-border-t contrast-more:nx-border-neutral-400 contrast-more:nx-shadow-none contrast-more:dark:nx-border-neutral-400"
          ),
          children: [
            config.feedback.content
              ? /* @__PURE__ */ jsx28(Anchor, {
                  className: linkClassName,
                  href: config.feedback.useLink(),
                  newWindow: true,
                  children: renderComponent(config.feedback.content),
                })
              : null,
            renderComponent(config.editLink.component, {
              filePath,
              className: linkClassName,
              children: renderComponent(config.editLink.text),
            }),
            renderComponent(config.toc.extraContent),
          ],
        }),
    ],
  });
}

// src/components/match-sorter-search.tsx
import { matchSorter } from "match-sorter";
import { useMemo as useMemo4, useState as useState7 } from "react";
import { jsx as jsx29 } from "react/jsx-runtime";
function MatchSorterSearch({ className, directories }) {
  const [search, setSearch] = useState7("");
  const results = useMemo4(
    () =>
      // Will need to scrape all the headers from each page and search through them here
      // (similar to what we already do to render the hash links in sidebar)
      // We could also try to search the entire string text from each page
      search
        ? matchSorter(directories, search, { keys: ["title"] }).map(({ route, title }) => ({
            id: route + title,
            route,
            children: /* @__PURE__ */ jsx29(HighlightMatches, { value: title, match: search }),
          }))
        : [],
    [search, directories]
  );
  return /* @__PURE__ */ jsx29(Search, {
    value: search,
    onChange: setSearch,
    className,
    overlayClassName: "nx-w-full",
    results,
  });
}

// src/constants.tsx
import { Fragment as Fragment12, jsx as jsx30, jsxs as jsxs20 } from "react/jsx-runtime";
var DEFAULT_LOCALE = "en-US";
var IS_BROWSER = typeof window !== "undefined";
function isReactNode(value) {
  return value == null || isString(value) || isFunction(value) || isValidElement(value);
}
function isFunction(value) {
  return typeof value === "function";
}
function isString(value) {
  return typeof value === "string";
}
var i18nSchema = z2.array(
  z2.strictObject({
    direction: z2.enum(["ltr", "rtl"]).optional(),
    locale: z2.string(),
    text: z2.string(),
  })
);
var reactNode = [isReactNode, { message: "Must be React.ReactNode or React.FC" }];
var fc = [isFunction, { message: "Must be React.FC" }];
var themeSchema = z2.strictObject({
  banner: z2.strictObject({
    dismissible: z2.boolean(),
    key: z2.string(),
    text: z2.custom(...reactNode).optional(),
  }),
  chat: z2.strictObject({
    icon: z2.custom(...reactNode),
    link: z2.string().startsWith("https://").optional(),
  }),
  components: z2.record(z2.custom(...fc)).optional(),
  darkMode: z2.boolean(),
  direction: z2.enum(["ltr", "rtl"]),
  docsRepositoryBase: z2.string().startsWith("https://"),
  editLink: z2.strictObject({
    component: z2.custom(...fc),
    text: z2.custom(...reactNode),
  }),
  faviconGlyph: z2.string().optional(),
  feedback: z2.strictObject({
    content: z2.custom(...reactNode),
    labels: z2.string(),
    useLink: z2.function().returns(z2.string()),
  }),
  footer: z2.strictObject({
    component: z2.custom(...reactNode),
    text: z2.custom(...reactNode),
  }),
  gitTimestamp: z2.custom(...reactNode),
  head: z2.custom(...reactNode),
  i18n: i18nSchema,
  logo: z2.custom(...reactNode),
  logoLink: z2.boolean().or(z2.string()),
  main: z2.custom(...fc).optional(),
  navbar: z2.strictObject({
    component: z2.custom(...reactNode),
    extraContent: z2.custom(...reactNode).optional(),
  }),
  navigation: z2.boolean().or(
    z2.strictObject({
      next: z2.boolean(),
      prev: z2.boolean(),
    })
  ),
  nextThemes: z2.strictObject({
    defaultTheme: z2.string(),
    forcedTheme: z2.string().optional(),
    storageKey: z2.string(),
  }),
  notFound: z2.strictObject({
    content: z2.custom(...reactNode),
    labels: z2.string(),
  }),
  primaryHue: z2.number().or(
    z2.strictObject({
      dark: z2.number(),
      light: z2.number(),
    })
  ),
  project: z2.strictObject({
    icon: z2.custom(...reactNode),
    link: z2.string().startsWith("https://").optional(),
  }),
  search: z2.strictObject({
    component: z2.custom(...reactNode),
    emptyResult: z2.custom(...reactNode),
    error: z2.string().or(z2.function().returns(z2.string())),
    loading: z2.custom(...reactNode),
    // Can't be React component
    placeholder: z2.string().or(z2.function().returns(z2.string())),
  }),
  serverSideError: z2.strictObject({
    content: z2.custom(...reactNode),
    labels: z2.string(),
  }),
  sidebar: z2.strictObject({
    defaultMenuCollapseLevel: z2.number().min(1).int(),
    titleComponent: z2.custom(...reactNode),
    toggleButton: z2.boolean(),
  }),
  themeSwitch: z2.strictObject({
    component: z2.custom(...reactNode),
    useOptions: themeOptionsSchema.or(z2.function().returns(themeOptionsSchema)),
  }),
  toc: z2.strictObject({
    component: z2.custom(...reactNode),
    extraContent: z2.custom(...reactNode),
    float: z2.boolean(),
    headingComponent: z2.custom(...fc).optional(),
    title: z2.custom(...reactNode),
  }),
  useNextSeoProps: z2.custom(isFunction),
});
var publicThemeSchema = themeSchema.deepPartial().extend({
  // to have `locale` and `text` as required properties
  i18n: i18nSchema.optional(),
});
var LOADING_LOCALES = {
  "en-US": "Loading",
  "fr": "\u0421hargement",
  "ru": "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430",
  "zh-CN": "\u6B63\u5728\u52A0\u8F7D",
};
var PLACEHOLDER_LOCALES = {
  "en-US": "Search documentation",
  "fr": "Rechercher documents",
  "ru": "\u041F\u043E\u0438\u0441\u043A \u0434\u043E\u043A\u0443\u043C\u0435\u043D\u0442\u0430\u0446\u0438\u0438",
  "zh-CN": "\u641C\u7D22\u6587\u6863",
};
var DEFAULT_THEME = {
  banner: {
    dismissible: true,
    key: "nextra-banner",
  },
  chat: {
    icon: /* @__PURE__ */ jsxs20(Fragment12, {
      children: [
        /* @__PURE__ */ jsx30(DiscordIcon, {}),
        /* @__PURE__ */ jsx30("span", { className: "nx-sr-only", children: "Discord" }),
      ],
    }),
  },
  darkMode: true,
  direction: "ltr",
  docsRepositoryBase: "https://github.com/shuding/nextra",
  editLink: {
    component: function EditLink({ className, filePath, children }) {
      const editUrl = useGitEditUrl(filePath);
      if (!editUrl) {
        return null;
      }
      return /* @__PURE__ */ jsx30(Anchor, { className, href: editUrl, children });
    },
    text: "Edit this page",
  },
  feedback: {
    content: "Question? Give us feedback \u2192",
    labels: "feedback",
    useLink() {
      const config = useConfig();
      return getGitIssueUrl({
        labels: config.feedback.labels,
        repository: config.docsRepositoryBase,
        title: `Feedback for \u201C${config.title}\u201D`,
      });
    },
  },
  footer: {
    component: Footer,
    text: `MIT ${/* @__PURE__ */ new Date().getFullYear()} \xA9 Nextra.`,
  },
  gitTimestamp: function GitTimestamp({ timestamp }) {
    const { locale = DEFAULT_LOCALE } = useRouter7();
    return /* @__PURE__ */ jsxs20(Fragment12, {
      children: [
        "Last updated on",
        " ",
        /* @__PURE__ */ jsx30("time", {
          dateTime: timestamp.toISOString(),
          children: timestamp.toLocaleDateString(locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
        }),
      ],
    });
  },
  head: /* @__PURE__ */ jsxs20(Fragment12, {
    children: [
      /* @__PURE__ */ jsx30("meta", { name: "msapplication-TileColor", content: "#fff" }),
      /* @__PURE__ */ jsx30("meta", { httpEquiv: "Content-Language", content: "en" }),
      /* @__PURE__ */ jsx30("meta", {
        name: "description",
        content: "Nextra: the next docs builder",
      }),
      /* @__PURE__ */ jsx30("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx30("meta", { name: "twitter:site", content: "@shuding_" }),
      /* @__PURE__ */ jsx30("meta", {
        property: "og:title",
        content: "Nextra: the next docs builder",
      }),
      /* @__PURE__ */ jsx30("meta", {
        property: "og:description",
        content: "Nextra: the next docs builder",
      }),
      /* @__PURE__ */ jsx30("meta", { name: "apple-mobile-web-app-title", content: "Nextra" }),
    ],
  }),
  i18n: [],
  logo: /* @__PURE__ */ jsxs20(Fragment12, {
    children: [
      /* @__PURE__ */ jsx30("span", { className: "nx-font-extrabold", children: "Nextra" }),
      /* @__PURE__ */ jsx30("span", {
        className: "nx-ml-2 nx-hidden nx-font-normal nx-text-gray-600 md:nx-inline",
        children: "The Next Docs Builder",
      }),
    ],
  }),
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
    content: "Submit an issue about broken link \u2192",
    labels: "bug",
  },
  primaryHue: {
    dark: 204,
    light: 212,
  },
  project: {
    icon: /* @__PURE__ */ jsxs20(Fragment12, {
      children: [
        /* @__PURE__ */ jsx30(GitHubIcon, {}),
        /* @__PURE__ */ jsx30("span", { className: "nx-sr-only", children: "GitHub" }),
      ],
    }),
  },
  search: {
    component: function Search2({ className, directories }) {
      const config = useConfig();
      return config.flexsearch
        ? /* @__PURE__ */ jsx30(Flexsearch, { className })
        : /* @__PURE__ */ jsx30(MatchSorterSearch, { className, directories });
    },
    emptyResult: /* @__PURE__ */ jsx30("span", {
      className: "nx-block nx-select-none nx-p-8 nx-text-center nx-text-sm nx-text-gray-400",
      children: "No results found.",
    }),
    error: "Failed to load search index.",
    loading: function useLoading() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter7();
      const text = (locale && LOADING_LOCALES[locale]) || LOADING_LOCALES[defaultLocale];
      return /* @__PURE__ */ jsxs20(Fragment12, { children: [text, "\u2026"] });
    },
    placeholder: function usePlaceholder() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter7();
      const text = (locale && PLACEHOLDER_LOCALES[locale]) || PLACEHOLDER_LOCALES[defaultLocale];
      return `${text}\u2026`;
    },
  },
  serverSideError: {
    content: "Submit an issue about error in url \u2192",
    labels: "bug",
  },
  sidebar: {
    defaultMenuCollapseLevel: 2,
    titleComponent: ({ title }) => /* @__PURE__ */ jsx30(Fragment12, { children: title }),
    toggleButton: false,
  },
  themeSwitch: {
    component: ThemeSwitch,
    useOptions() {
      const { locale } = useRouter7();
      if (locale === "zh-CN") {
        return {
          dark: "\u6DF1\u8272\u4E3B\u9898",
          light: "\u6D45\u8272\u4E3B\u9898",
          system: "\u7CFB\u7EDF\u9ED8\u8BA4",
        };
      }
      return { dark: "Dark", light: "Light", system: "System" };
    },
  },
  toc: {
    component: TOC,
    float: true,
    title: "On This Page",
  },
  useNextSeoProps: () => ({ titleTemplate: "%s \u2013 Nextra" }),
};
var DEEP_OBJECT_KEYS = Object.entries(DEFAULT_THEME)
  .map(([key, value]) => {
    const isObject =
      value && typeof value === "object" && !Array.isArray(value) && !isValidElement(value);
    if (isObject) {
      return key;
    }
  })
  .filter(Boolean);

// src/polyfill.ts
if (IS_BROWSER) {
  let resizeTimer;
  const addResizingClass = () => {
    document.body.classList.add("resizing");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove("resizing");
    }, 200);
  };
  window.addEventListener("resize", addResizingClass);
}

// src/index.tsx
import { normalizePages } from "nextra/normalize-pages";

// src/mdx-components.tsx
import cn19 from "clsx";
import { Code, Pre, Table, Td, Th, Tr } from "nextra/components";
import {
  Children,
  cloneElement,
  useEffect as useEffect5,
  useRef as useRef7,
  useState as useState8,
} from "react";
import { jsx as jsx31, jsxs as jsxs21 } from "react/jsx-runtime";
function HeadingLink(_a) {
  var _b = _a,
    { tag: Tag, context, children, id } = _b,
    props = __objRest(_b, ["tag", "context", "children", "id"]);
  const setActiveAnchor = useSetActiveAnchor();
  const slugs2 = useSlugs();
  const observer = useIntersectionObserver();
  const obRef = useRef7(null);
  useEffect5(() => {
    if (!id) return;
    const heading = obRef.current;
    if (!heading) return;
    slugs2.set(heading, [id, (context.index += 1)]);
    observer == null ? void 0 : observer.observe(heading);
    return () => {
      observer == null ? void 0 : observer.disconnect();
      slugs2.delete(heading);
      setActiveAnchor(f => {
        const ret = __spreadValues({}, f);
        delete ret[id];
        return ret;
      });
    };
  }, [id, context, slugs2, observer, setActiveAnchor]);
  return /* @__PURE__ */ jsxs21(
    Tag,
    __spreadProps(
      __spreadValues(
        {
          className: cn19(
            "nx-font-semibold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100",
            {
              h2: "nx-mt-10 nx-border-b nx-pb-1 nx-text-3xl nx-border-neutral-200/70 contrast-more:nx-border-neutral-400 dark:nx-border-primary-100/10 contrast-more:dark:nx-border-neutral-400",
              h3: "nx-mt-8 nx-text-2xl",
              h4: "nx-mt-8 nx-text-xl",
              h5: "nx-mt-8 nx-text-lg",
              h6: "nx-mt-8 nx-text-base",
            }[Tag]
          ),
        },
        props
      ),
      {
        children: [
          children,
          /* @__PURE__ */ jsx31("span", { className: "nx-absolute -nx-mt-20", id, ref: obRef }),
          /* @__PURE__ */ jsx31("a", {
            "href": `#${id}`,
            "className": "subheading-anchor",
            "aria-label": "Permalink for this section",
          }),
        ],
      }
    )
  );
}
var findSummary = children => {
  let summary = null;
  const restChildren = [];
  Children.forEach(children, (child, index) => {
    var _a;
    if (child && child.type === Summary) {
      summary || (summary = child);
      return;
    }
    let c = child;
    if (
      !summary &&
      child &&
      typeof child === "object" &&
      child.type !== Details &&
      "props" in child &&
      child.props
    ) {
      const result = findSummary(child.props.children);
      summary = result[0];
      c = cloneElement(
        child,
        __spreadProps(__spreadValues({}, child.props), {
          children: ((_a = result[1]) == null ? void 0 : _a.length) ? result[1] : void 0,
          key: index,
        })
      );
    }
    restChildren.push(c);
  });
  return [summary, restChildren];
};
var Details = _a => {
  var _b = _a,
    { children, open } = _b,
    props = __objRest(_b, ["children", "open"]);
  const [openState, setOpen] = useState8(!!open);
  const [summary, restChildren] = findSummary(children);
  const [delayedOpenState, setDelayedOpenState] = useState8(openState);
  useEffect5(() => {
    if (openState) {
      setDelayedOpenState(true);
    } else {
      const timeout = setTimeout(() => setDelayedOpenState(openState), 500);
      return () => clearTimeout(timeout);
    }
  }, [openState]);
  return /* @__PURE__ */ jsxs21(
    "details",
    __spreadProps(
      __spreadValues(
        __spreadProps(
          __spreadValues(
            {
              className:
                "nx-my-4 nx-rounded nx-border nx-border-gray-200 nx-bg-white nx-p-2 nx-shadow-sm first:nx-mt-0 dark:nx-border-neutral-800 dark:nx-bg-neutral-900",
            },
            props
          ),
          {
            open: delayedOpenState,
          }
        ),
        openState && { "data-expanded": true }
      ),
      {
        children: [
          /* @__PURE__ */ jsx31(DetailsProvider, { value: setOpen, children: summary }),
          /* @__PURE__ */ jsx31(Collapse, { isOpen: openState, children: restChildren }),
        ],
      }
    )
  );
};
var Summary = props => {
  const setOpen = useDetails();
  return /* @__PURE__ */ jsx31(
    "summary",
    __spreadProps(
      __spreadValues(
        {
          className: cn19(
            "nx-flex nx-items-center nx-cursor-pointer nx-list-none nx-p-1 nx-transition-colors hover:nx-bg-gray-100 dark:hover:nx-bg-neutral-800",
            "before:nx-mr-1 before:nx-inline-block before:nx-transition-transform before:nx-content-[''] dark:before:nx-invert",
            "rtl:before:nx-rotate-180 [[data-expanded]>&]:before:nx-rotate-90"
          ),
        },
        props
      ),
      {
        onClick: e => {
          e.preventDefault();
          setOpen(v => !v);
        },
      }
    )
  );
};
var EXTERNAL_HREF_REGEX = /https?:\/\//;
var Link = _a => {
  var _b = _a,
    { href = "", className } = _b,
    props = __objRest(_b, ["href", "className"]);
  return /* @__PURE__ */ jsx31(
    Anchor,
    __spreadValues(
      {
        href,
        newWindow: EXTERNAL_HREF_REGEX.test(href),
        className: cn19(
          "nx-text-primary-600 nx-underline nx-decoration-from-font [text-underline-position:from-font]",
          className
        ),
      },
      props
    )
  );
};
var A = _a => {
  var _b = _a,
    { href = "" } = _b,
    props = __objRest(_b, ["href"]);
  return /* @__PURE__ */ jsx31(
    Anchor,
    __spreadValues({ href, newWindow: EXTERNAL_HREF_REGEX.test(href) }, props)
  );
};
var getComponents = ({ isRawLayout, components }) => {
  if (isRawLayout) {
    return { a: A };
  }
  const context = { index: 0 };
  return __spreadValues(
    {
      h1: props =>
        /* @__PURE__ */ jsx31(
          "h1",
          __spreadValues(
            {
              className:
                "nx-mt-2 nx-text-4xl nx-font-bold nx-tracking-tight nx-text-slate-900 dark:nx-text-slate-100",
            },
            props
          )
        ),
      h2: props =>
        /* @__PURE__ */ jsx31(HeadingLink, __spreadValues({ tag: "h2", context }, props)),
      h3: props =>
        /* @__PURE__ */ jsx31(HeadingLink, __spreadValues({ tag: "h3", context }, props)),
      h4: props =>
        /* @__PURE__ */ jsx31(HeadingLink, __spreadValues({ tag: "h4", context }, props)),
      h5: props =>
        /* @__PURE__ */ jsx31(HeadingLink, __spreadValues({ tag: "h5", context }, props)),
      h6: props =>
        /* @__PURE__ */ jsx31(HeadingLink, __spreadValues({ tag: "h6", context }, props)),
      ul: props =>
        /* @__PURE__ */ jsx31(
          "ul",
          __spreadValues(
            { className: "nx-mt-6 nx-list-disc first:nx-mt-0 ltr:nx-ml-6 rtl:nx-mr-6" },
            props
          )
        ),
      ol: props =>
        /* @__PURE__ */ jsx31(
          "ol",
          __spreadValues(
            { className: "nx-mt-6 nx-list-decimal first:nx-mt-0 ltr:nx-ml-6 rtl:nx-mr-6" },
            props
          )
        ),
      li: props => /* @__PURE__ */ jsx31("li", __spreadValues({ className: "nx-my-2" }, props)),
      blockquote: props =>
        /* @__PURE__ */ jsx31(
          "blockquote",
          __spreadValues(
            {
              className: cn19(
                "nx-mt-6 nx-border-gray-300 nx-italic nx-text-gray-700 dark:nx-border-gray-700 dark:nx-text-gray-400",
                "first:nx-mt-0 ltr:nx-border-l-2 ltr:nx-pl-6 rtl:nx-border-r-2 rtl:nx-pr-6"
              ),
            },
            props
          )
        ),
      hr: props =>
        /* @__PURE__ */ jsx31(
          "hr",
          __spreadValues({ className: "nx-my-8 dark:nx-border-gray-900" }, props)
        ),
      a: Link,
      table: props =>
        /* @__PURE__ */ jsx31(
          Table,
          __spreadValues({ className: "nextra-scrollbar nx-mt-6 nx-p-0 first:nx-mt-0" }, props)
        ),
      p: props =>
        /* @__PURE__ */ jsx31(
          "p",
          __spreadValues({ className: "nx-mt-6 nx-leading-7 first:nx-mt-0" }, props)
        ),
      tr: Tr,
      th: Th,
      td: Td,
      details: Details,
      summary: Summary,
      pre: Pre,
      code: Code,
    },
    components
  );
};

// src/index.tsx
import { useMDXComponents } from "nextra/mdx";
import { Callout } from "nextra/components";
import { useTheme as useTheme3 } from "next-themes";
import { Fragment as Fragment13, jsx as jsx32, jsxs as jsxs22 } from "react/jsx-runtime";
var classes5 = {
  toc: cn20("nextra-toc nx-order-last nx-hidden nx-w-64 nx-shrink-0 xl:nx-block print:nx-hidden"),
  main: cn20("nx-w-full nx-break-words"),
};
var Body = ({ themeContext, breadcrumb, timestamp, navigation, children }) => {
  var _a;
  const config = useConfig();
  const mounted = useMounted7();
  if (themeContext.layout === "raw") {
    return /* @__PURE__ */ jsx32("div", { className: classes5.main, children });
  }
  const date =
    themeContext.timestamp && config.gitTimestamp && timestamp ? new Date(timestamp) : null;
  const gitTimestampEl =
    // Because a user's time zone may be different from the server page
    mounted && date
      ? /* @__PURE__ */ jsx32("div", {
          className:
            "nx-mt-12 nx-mb-8 nx-block nx-text-xs nx-text-gray-500 ltr:nx-text-right rtl:nx-text-left dark:nx-text-gray-400",
          children: renderComponent(config.gitTimestamp, { timestamp: date }),
        })
      : /* @__PURE__ */ jsx32("div", { className: "nx-mt-16" });
  const content = /* @__PURE__ */ jsxs22(Fragment13, {
    children: [children, gitTimestampEl, navigation],
  });
  const body =
    ((_a = config.main) == null ? void 0 : _a.call(config, { children: content })) || content;
  if (themeContext.layout === "full") {
    return /* @__PURE__ */ jsx32("article", {
      className: cn20(
        classes5.main,
        "nextra-content nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-pl-[max(env(safe-area-inset-left),1.5rem)] nx-pr-[max(env(safe-area-inset-right),1.5rem)]"
      ),
      children: body,
    });
  }
  return /* @__PURE__ */ jsx32("article", {
    className: cn20(
      classes5.main,
      "nextra-content nx-flex nx-min-h-[calc(100vh-var(--nextra-navbar-height))] nx-min-w-0 nx-justify-center nx-pb-8 nx-pr-[calc(env(safe-area-inset-right)-1.5rem)]",
      themeContext.typesetting === "article" && "nextra-body-typesetting-article"
    ),
    children: /* @__PURE__ */ jsxs22("main", {
      className: "nx-w-full nx-min-w-0 nx-max-w-6xl nx-px-6 nx-pt-4 md:nx-px-12",
      children: [breadcrumb, body],
    }),
  });
};
var InnerLayout = ({ filePath, pageMap, frontMatter, headings, timestamp, children }) => {
  const config = useConfig();
  const { locale = DEFAULT_LOCALE, defaultLocale } = useRouter8();
  const fsPath = useFSRoute3();
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
  } = useMemo5(
    () =>
      normalizePages({
        list: pageMap,
        locale,
        defaultLocale,
        route: fsPath,
      }),
    [pageMap, locale, defaultLocale, fsPath]
  );
  const themeContext = __spreadValues(__spreadValues({}, activeThemeContext), frontMatter);
  const hideSidebar =
    !themeContext.sidebar || themeContext.layout === "raw" || activeType === "page";
  const tocEl =
    activeType === "page" || !themeContext.toc || themeContext.layout !== "default"
      ? themeContext.layout !== "full" &&
        themeContext.layout !== "raw" &&
        /* @__PURE__ */ jsx32("nav", {
          "className": classes5.toc,
          "aria-label": "table of contents",
        })
      : /* @__PURE__ */ jsx32("nav", {
          "className": cn20(classes5.toc, "nx-px-4"),
          "aria-label": "table of contents",
          "children": renderComponent(config.toc.component, {
            headings: config.toc.float ? headings : [],
            filePath,
          }),
        });
  const localeConfig = config.i18n.find(l => l.locale === locale);
  const isRTL = localeConfig ? localeConfig.direction === "rtl" : config.direction === "rtl";
  const direction = isRTL ? "rtl" : "ltr";
  return (
    // This makes sure that selectors like `[dir=ltr] .nextra-container` work
    // before hydration as Tailwind expects the `dir` attribute to exist on the
    // `html` element.
    /* @__PURE__ */ jsxs22("div", {
      dir: direction,
      children: [
        /* @__PURE__ */ jsx32("script", {
          dangerouslySetInnerHTML: {
            __html: `document.documentElement.setAttribute('dir','${direction}')`,
          },
        }),
        /* @__PURE__ */ jsx32(Head, {}),
        /* @__PURE__ */ jsx32(Banner, {}),
        themeContext.navbar &&
          renderComponent(config.navbar.component, {
            flatDirectories,
            items: topLevelNavbarItems,
          }),
        /* @__PURE__ */ jsx32("div", {
          className: cn20(
            "nx-mx-auto nx-flex",
            themeContext.layout !== "raw" && "nx-max-w-[90rem]"
          ),
          children: /* @__PURE__ */ jsxs22(ActiveAnchorProvider, {
            children: [
              /* @__PURE__ */ jsx32(Sidebar, {
                docsDirectories,
                flatDirectories,
                fullDirectories: directories,
                headings,
                asPopover: hideSidebar,
                includePlaceholder: themeContext.layout === "default",
              }),
              tocEl,
              /* @__PURE__ */ jsx32(SkipNavContent, {}),
              /* @__PURE__ */ jsx32(Body, {
                themeContext,
                breadcrumb:
                  activeType !== "page" && themeContext.breadcrumb
                    ? /* @__PURE__ */ jsx32(Breadcrumb, { activePath })
                    : null,
                timestamp,
                navigation:
                  activeType !== "page" && themeContext.pagination
                    ? /* @__PURE__ */ jsx32(NavLinks, {
                        flatDirectories: flatDocsDirectories,
                        currentIndex: activeIndex,
                      })
                    : null,
                children: /* @__PURE__ */ jsx32(MDXProvider, {
                  components: getComponents({
                    isRawLayout: themeContext.layout === "raw",
                    components: config.components,
                  }),
                  children,
                }),
              }),
            ],
          }),
        }),
        themeContext.footer && renderComponent(config.footer.component, { menu: hideSidebar }),
      ],
    })
  );
};
function Layout(_a) {
  var _b = _a,
    { children } = _b,
    context = __objRest(_b, ["children"]);
  return /* @__PURE__ */ jsx32(ConfigProvider, {
    value: context,
    children: /* @__PURE__ */ jsx32(
      InnerLayout,
      __spreadProps(__spreadValues({}, context.pageOpts), { children })
    ),
  });
}
export {
  Bleed,
  Callout,
  Card,
  Cards,
  Collapse,
  FileTree,
  Link,
  Navbar,
  NotFoundPage,
  ServerSideErrorPage,
  SkipNavContent,
  SkipNavLink,
  Steps,
  Tab,
  Tabs,
  ThemeSwitch,
  Layout as default,
  useConfig,
  useMDXComponents,
  useTheme3 as useTheme,
};
