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
import cn22 from "clsx";
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
        __spreadValues({ ref: forwardedRef, href, target: "_blank", rel: "noreferrer" }, props),
        {
          children: [
            children,
            /* @__PURE__ */ jsx3("span", {
              className: "sr-only",
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
          "nextra-banner-container sticky top-0 z-20 flex items-center md:relative",
          "h-[var(--nextra-banner-height)] [body.nextra-banner-hidden_&]:hidden",
          "bg-neutral-900 text-slate-50 dark:bg-[linear-gradient(1deg,#383838,#212121)] dark:text-white",
          "px-2 ltr:pl-10 rtl:pr-10 print:hidden"
        ),
        children: [
          /* @__PURE__ */ jsx5("div", {
            className: "w-full truncate px-4 text-center text-sm font-medium",
            children: renderComponent(banner.text),
          }),
          banner.dismissible &&
            /* @__PURE__ */ jsx5("button", {
              "type": "button",
              "aria-label": "Dismiss banner",
              "className": "h-8 w-8 opacity-80 hover:opacity-100",
              "onClick": () => {
                try {
                  localStorage.setItem(banner.key, "0");
                } catch (e) {}
                document.body.classList.add("nextra-banner-hidden");
              },
              "children": /* @__PURE__ */ jsx5(XIcon, { className: "mx-auto h-4 w-4" }),
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
      "nextra-bleed relative -mx-6 mt-6 md:-mx-8 2xl:-mx-24",
      full && [
        // 'md:mx:[calc(-50vw+50%+8rem)',
        "ltr:xl:ml-[calc(50%-50vw+16rem)] ltr:xl:mr-[calc(50%-50vw)]",
        "rtl:xl:ml-[calc(50%-50vw)] rtl:xl:mr-[calc(50%-50vw+16rem)]",
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
      "nextra-breadcrumb mt-1.5 flex items-center gap-1 overflow-hidden text-sm text-gray-500 contrast-more:text-current dark:text-gray-400",
    children: activePath.map((item, index) => {
      const isLink = !item.children || item.withIndexPage;
      const isActive = index === activePath.length - 1;
      return /* @__PURE__ */ jsxs3(
        Fragment2,
        {
          children: [
            index > 0 && /* @__PURE__ */ jsx7(ArrowRightIcon, { className: "w-3.5 shrink-0" }),
            /* @__PURE__ */ jsx7("div", {
              className: cn3(
                "whitespace-nowrap transition-colors",
                isActive
                  ? "font-medium text-gray-700 contrast-more:font-bold contrast-more:text-current dark:text-gray-100 contrast-more:dark:text-current"
                  : [
                      "min-w-[24px] overflow-hidden text-ellipsis",
                      isLink && "hover:text-gray-900 dark:hover:text-gray-100",
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
  cards: cn4("nextra-cards mt-4 gap-4 grid"),
  card: cn4(
    "nextra-card group flex flex-col justify-start overflow-hidden rounded-lg border border-gray-200",
    "text-current no-underline dark:shadow-none",
    "hover:shadow-gray-100 dark:hover:shadow-none shadow-gray-100",
    "active:shadow-sm active:shadow-gray-200",
    "transition-all duration-200 hover:border-gray-300"
  ),
  title: cn4("flex font-semibold items-start gap-2 p-4 text-gray-700 hover:text-gray-900"),
};
var arrowEl = /* @__PURE__ */ jsx8("span", {
  className: "transition-transform duration-75 group-hover:translate-x-[2px]",
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
              "bg-gray-100 shadow hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-50 dark:hover:border-neutral-500 dark:hover:bg-neutral-700"
            ),
          },
          props
        ),
        {
          children: [
            children,
            /* @__PURE__ */ jsxs4("span", {
              className: cn4(classes.title, "dark:text-gray-300 dark:hover:text-gray-100"),
              children: [
                icon,
                /* @__PURE__ */ jsxs4("span", {
                  className: "flex gap-1",
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
            "bg-transparent shadow-sm hover:bg-slate-50 hover:shadow-md dark:border-neutral-800 dark:hover:border-neutral-700 dark:hover:bg-neutral-900"
          ),
        },
        props
      ),
      {
        children: /* @__PURE__ */ jsxs4("span", {
          className: cn4(classes.title, "dark:text-neutral-200 dark:hover:text-neutral-50"),
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
    container.classList.toggle("duration-500", !isOpen);
    container.classList.toggle("duration-300", isOpen);
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
      "transform-gpu overflow-hidden transition-all ease-in-out motion-reduce:transition-none",
    style: initialOpen.current || horizontal ? void 0 : { height: 0 },
    children: /* @__PURE__ */ jsx9("div", {
      ref: innerRef,
      className: cn5(
        "transition-opacity duration-500 ease-in-out motion-reduce:transition-none",
        isOpen ? "opacity-100" : "opacity-0",
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
    className: "mt-6 select-none text-sm text-gray-800 dark:text-gray-300",
    children: /* @__PURE__ */ jsx10("div", {
      className: "inline-flex flex-col rounded-lg border px-4 py-2 dark:border-neutral-800",
      children,
    }),
  });
function Ident() {
  const indent = useIndent();
  return /* @__PURE__ */ jsx10(Fragment3, {
    children: [...Array(indent)].map((_, i) =>
      /* @__PURE__ */ jsx10("span", { className: "inline-block w-5" }, i)
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
    className: "flex list-none flex-col",
    children: [
      /* @__PURE__ */ jsxs5("a", {
        onClick: toggle,
        title: name,
        className: "inline-flex cursor-pointer items-center py-1 hover:opacity-60",
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
            className: "ml-1",
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
    className: cn6("flex list-none", active && "text-primary-600 contrast-more:underline"),
    children: /* @__PURE__ */ jsxs5("a", {
      className: "inline-flex cursor-default items-center py-1",
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
          className: "ml-1",
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
                className: "text-primary-600",
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
      "relative flex items-center text-gray-900 contrast-more:text-gray-800 dark:text-gray-300 contrast-more:dark:text-gray-300",
    children: [
      /* @__PURE__ */ jsx12(
        "input",
        __spreadValues(
          {
            ref: forwardedRef,
            spellCheck: false,
            className: cn7(
              className,
              "block w-full appearance-none rounded-lg px-3 py-2 transition-colors",
              "text-base leading-tight md:text-sm",
              "bg-black/[.05] dark:bg-gray-50/10",
              "dark:focus:bg-dark focus:bg-white",
              "placeholder:text-gray-500 dark:placeholder:text-gray-400",
              "contrast-more:border contrast-more:border-current"
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
    enter: "transition-opacity",
    enterFrom: "opacity-0",
    enterTo: "opacity-100",
    leave: "transition-opacity",
    leaveFrom: "opacity-100",
    leaveTo: "opacity-0",
    children: /* @__PURE__ */ jsx13("kbd", {
      className: cn8(
        "absolute my-1.5 select-none ltr:right-1.5 rtl:left-1.5",
        "h-5 rounded bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500",
        "dark:bg-dark/50 border dark:border-gray-100/20",
        "contrast-more:border-current contrast-more:text-current contrast-more:dark:border-current",
        "items-center gap-1 transition-opacity",
        value ? "z-20 flex cursor-pointer hover:opacity-70" : "pointer-events-none hidden sm:flex"
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
                    /* @__PURE__ */ jsx13("span", { className: "text-xs", children: "\u2318" }),
                    "K",
                  ],
                })
              : "CTRL K"),
    }),
  });
  return /* @__PURE__ */ jsxs8("div", {
    className: cn8("nextra-search relative md:w-64", className),
    children: [
      renderList &&
        /* @__PURE__ */ jsx13("div", {
          className: "fixed inset-0 z-10",
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
        leave: "transition-opacity duration-100",
        leaveFrom: "opacity-100",
        leaveTo: "opacity-0",
        children: /* @__PURE__ */ jsx13("ul", {
          className: cn8(
            "nextra-scrollbar",
            // Using bg-white as background-color when the browser didn't support backdrop-filter
            "border border-gray-200 bg-white text-gray-100 dark:border-neutral-800 dark:bg-neutral-900",
            "absolute top-full z-20 mt-2 overflow-auto overscroll-contain rounded-xl py-2.5 shadow-xl",
            "max-h-[min(calc(50vh-11rem-env(safe-area-inset-bottom)),400px)]",
            "md:max-h-[min(calc(100vh-5rem-env(safe-area-inset-bottom)),400px)]",
            "inset-x-0 rtl:md:right-auto",
            "contrast-more:border contrast-more:border-gray-900 contrast-more:dark:border-gray-50",
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
                  "flex select-none justify-center gap-2 p-8 text-center text-sm text-red-500",
                children: [
                  /* @__PURE__ */ jsx13(InformationCircleIcon, { className: "h-5 w-5" }),
                  renderString(config.search.error),
                ],
              })
            : loading
            ? /* @__PURE__ */ jsxs8("span", {
                className:
                  "flex select-none justify-center gap-2 p-8 text-center text-sm text-gray-400",
                children: [
                  /* @__PURE__ */ jsx13(SpinnerIcon, { className: "h-5 w-5 animate-spin" }),
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
                          "mx-2.5 break-words rounded-md",
                          "contrast-more:border",
                          i === active
                            ? "bg-primary-500/10 text-primary-600 contrast-more:border-primary-500"
                            : "text-gray-800 contrast-more:border-transparent dark:text-gray-300"
                        ),
                        children: /* @__PURE__ */ jsx13(Anchor, {
                          "className": "block scroll-m-12 px-2.5 py-2",
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
                "mx-2.5 mb-2 mt-6 select-none border-b border-black/10 px-2.5 pb-1.5 text-xs font-semibold uppercase text-gray-500 first:mt-0 dark:border-white/20 dark:text-gray-300",
                "contrast-more:border-gray-600 contrast-more:text-gray-900 contrast-more:dark:border-gray-50 contrast-more:dark:text-gray-50"
              ),
              children: result.doc.title,
            }),
          children: /* @__PURE__ */ jsxs9(Fragment8, {
            children: [
              /* @__PURE__ */ jsx14("div", {
                className: "text-base font-semibold leading-5",
                children: /* @__PURE__ */ jsx14(HighlightMatches, { match: search2, value: title }),
              }),
              content &&
                /* @__PURE__ */ jsx14("div", {
                  className:
                    "excerpt mt-1 text-sm leading-[1.35rem] text-gray-600 dark:text-gray-400 contrast-more:dark:text-gray-50",
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
    overlayClassName: "w-screen min-h-[100px] max-w-[min(calc(100vw-2rem),calc(100%+20rem))]",
    results,
  });
}

// src/components/footer.tsx
import Image from "next/image";
import { jsx as jsx15, jsxs as jsxs10 } from "react/jsx-runtime";
function Footer({ menu }) {
  const config = useConfig();
  return /* @__PURE__ */ jsx15("footer", {
    className:
      "bg-washed border-outline dark:border-washed-dark z-10 flex h-full w-full justify-center border-t pb-16 pt-12 dark:bg-black",
    children: /* @__PURE__ */ jsx15("div", {
      className:
        "md:px-4.5 dark:divide-washed-dark undefined h-full w-full max-w-screen-2xl divide-y px-3 lg:px-6",
      children: /* @__PURE__ */ jsxs10("div", {
        className: "flex w-full flex-col gap-6 text-sm md:flex-row md:justify-between md:gap-0",
        children: [
          /* @__PURE__ */ jsxs10("div", {
            className: "flex flex-row gap-4",
            children: [
              /* @__PURE__ */ jsx15("div", {
                className: "mt-1 w-12",
                children: /* @__PURE__ */ jsx15(Image, {
                  src: "/assets/jata_logo.png",
                  width: 48,
                  height: 36,
                  alt: "jata negara",
                }),
              }),
              /* @__PURE__ */ jsxs10("div", {
                children: [
                  /* @__PURE__ */ jsx15("div", {
                    className: "mb-2 uppercase",
                    children: /* @__PURE__ */ jsx15("p", {
                      className: "text-base font-bold",
                      children: "Government of Malaysia",
                    }),
                  }),
                  /* @__PURE__ */ jsx15("p", {
                    className: "text-dim",
                    children: "\xA9 2023 Public Sector Open Data",
                  }),
                ],
              }),
            ],
          }),
          /* @__PURE__ */ jsxs10("div", {
            className: "flex flex-row gap-8 md:gap-14",
            children: [
              /* @__PURE__ */ jsxs10("div", {
                className: "flex w-full flex-col gap-2 md:w-auto",
                children: [
                  /* @__PURE__ */ jsx15("p", { className: "font-bold", children: "Open Source" }),
                  /* @__PURE__ */ jsx15("a", {
                    className:
                      "text-dim cursor-pointer text-sm hover:text-black hover:underline dark:hover:text-white",
                    href: "https://github.com/data-gov-my/datagovmy-front",
                    target: "_blank",
                    children: "Frontend Repo: NextJS",
                  }),
                  /* @__PURE__ */ jsx15("a", {
                    className:
                      "text-dim cursor-pointer text-sm hover:text-black hover:underline dark:hover:text-white",
                    href: "https://github.com/data-gov-my/datagovmy-back",
                    target: "_blank",
                    children: "Backend Repo: Django",
                  }),
                  /* @__PURE__ */ jsx15("a", {
                    className:
                      "text-dim cursor-pointer text-sm hover:text-black hover:underline dark:hover:text-white",
                    href: "#",
                    target: "_blank",
                    children: "UI + UX Design: Figma",
                  }),
                ],
              }),
              /* @__PURE__ */ jsxs10("div", {
                className: "flex w-full flex-col gap-2 md:w-auto",
                children: [
                  /* @__PURE__ */ jsx15("p", { className: "font-bold", children: "Open Data" }),
                  /* @__PURE__ */ jsx15("a", {
                    className:
                      "text-dim cursor-pointer text-sm hover:text-black hover:underline dark:hover:text-white",
                    href: "#",
                    target: "_blank",
                    children: "Guiding Principles",
                  }),
                  /* @__PURE__ */ jsx15("a", {
                    className:
                      "text-dim cursor-pointer text-sm hover:text-black hover:underline dark:hover:text-white",
                    href: "/dashboard/car-popularity#",
                    children: "Terms of Use",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    }),
  });
}

// src/components/head.tsx
import { NextSeo } from "next-seo";
import { useTheme } from "next-themes";
import NextHead from "next/head";
import { useMounted as useMounted2 } from "nextra/hooks";
import { Fragment as Fragment9, jsx as jsx16, jsxs as jsxs11 } from "react/jsx-runtime";
function Head() {
  var _a;
  const config = useConfig();
  const { resolvedTheme } = useTheme();
  const mounted = useMounted2();
  const head = typeof config.head === "function" ? config.head({}) : config.head;
  const hue = config.primaryHue;
  const { dark: darkHue, light: lightHue } =
    typeof hue === "number" ? { dark: hue, light: hue } : hue;
  const frontMatter = config.frontMatter;
  return /* @__PURE__ */ jsxs11(Fragment9, {
    children: [
      /* @__PURE__ */ jsx16(
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
      /* @__PURE__ */ jsxs11(NextHead, {
        children: [
          config.faviconGlyph
            ? /* @__PURE__ */ jsx16("link", {
                rel: "icon",
                href: `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='.9em' font-size='90' text-anchor='middle'>${config.faviconGlyph}</text><style>text{font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";fill:black}@media(prefers-color-scheme:dark){text{fill:white}}</style></svg>`,
              })
            : null,
          mounted
            ? /* @__PURE__ */ jsx16("meta", {
                name: "theme-color",
                content: resolvedTheme === "dark" ? "#111" : "#fff",
              })
            : /* @__PURE__ */ jsxs11(Fragment9, {
                children: [
                  /* @__PURE__ */ jsx16("meta", {
                    name: "theme-color",
                    content: "#fff",
                    media: "(prefers-color-scheme: light)",
                  }),
                  /* @__PURE__ */ jsx16("meta", {
                    name: "theme-color",
                    content: "#111",
                    media: "(prefers-color-scheme: dark)",
                  }),
                ],
              }),
          /* @__PURE__ */ jsx16("meta", {
            name: "viewport",
            content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
          }),
          /* @__PURE__ */ jsx16("style", {
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

// src/components/locale-switch.tsx
import { addBasePath } from "next/dist/client/add-base-path";
import { useRouter as useRouter3 } from "next/router";
import { GlobeIcon } from "nextra/icons";

// src/components/select.tsx
import { Listbox, Transition as Transition2 } from "@headlessui/react";
import cn10 from "clsx";
import { useMounted as useMounted3 } from "nextra/hooks";
import { CheckIcon } from "nextra/icons";
import { createPortal } from "react-dom";
import { jsx as jsx17, jsxs as jsxs12 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx17(Listbox, {
    value: selected,
    onChange,
    children: ({ open }) =>
      /* @__PURE__ */ jsxs12(Listbox.Button, {
        ref: trigger,
        title,
        className: cn10(
          "h-7 rounded-md px-2 text-left text-xs font-medium text-gray-600 transition-colors dark:text-gray-400",
          open
            ? "dark:bg-primary-100/10 bg-gray-200 text-gray-900 dark:text-gray-50"
            : "dark:hover:bg-primary-100/5 hover:bg-gray-100 hover:text-gray-900 dark:hover:text-gray-50",
          className
        ),
        children: [
          selected.name,
          /* @__PURE__ */ jsx17(Portal, {
            children: /* @__PURE__ */ jsx17(Transition2, {
              ref: container,
              show: open,
              as: Listbox.Options,
              className:
                "z-20 max-h-64 overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/20",
              leave: "transition-opacity",
              leaveFrom: "opacity-100",
              leaveTo: "opacity-0",
              children: options.map(option =>
                /* @__PURE__ */ jsxs12(
                  Listbox.Option,
                  {
                    value: option,
                    className: ({ active }) =>
                      cn10(
                        active
                          ? "bg-primary-50 text-primary-600 dark:bg-primary-500/10"
                          : "text-gray-800 dark:text-gray-100",
                        "relative cursor-pointer whitespace-nowrap py-1.5",
                        "transition-colors ltr:pl-3 ltr:pr-9 rtl:pl-9 rtl:pr-3"
                      ),
                    children: [
                      option.name,
                      option.key === selected.key &&
                        /* @__PURE__ */ jsx17("span", {
                          className: "absolute inset-y-0 flex items-center ltr:right-3 rtl:left-3",
                          children: /* @__PURE__ */ jsx17(CheckIcon, {}),
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
  const mounted = useMounted3();
  if (!mounted) return null;
  return createPortal(props.children, document.body);
}

// src/components/locale-switch.tsx
import { jsx as jsx18, jsxs as jsxs13 } from "react/jsx-runtime";
function LocaleSwitch({ options, lite, className }) {
  const { locale, asPath } = useRouter3();
  const selected = options.find(l => locale === l.locale);
  return /* @__PURE__ */ jsx18(Select, {
    title: "Change language",
    className,
    onChange: option => {
      const date = new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3);
      document.cookie = `NEXT_LOCALE=${option.key}; expires=${date.toUTCString()}; path=/`;
      location.href = addBasePath(asPath);
    },
    selected: {
      key: (selected == null ? void 0 : selected.locale) || "",
      name: /* @__PURE__ */ jsxs13("span", {
        className: "flex items-center gap-2",
        children: [
          /* @__PURE__ */ jsx18(GlobeIcon, {}),
          /* @__PURE__ */ jsx18("span", {
            className: lite ? "hidden" : "",
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

// src/components/nav-links.tsx
import cn12 from "clsx";
import { ArrowRightIcon as ArrowRightIcon2 } from "nextra/icons";

// src/components/button.tsx
import cn11 from "clsx";
import { Fragment as Fragment10, jsx as jsx19 } from "react/jsx-runtime";
var Button = ({
  className = "",
  variant,
  title,
  type = "button",
  onClick,
  children,
  disabled = false,
}) => {
  const style = {
    base: "rounded-md px-3 py-1.5 font-medium transition flex items-center gap-2",
    default:
      "border border-outline hover:border-outlineHover active:bg-washed dark:active:border-outlineHover-dark bg-white text-black",
    primary: "from-primary hover:to-primary bg-gradient-to-t to-[#3E7AFF] text-white hover:shadow",
  };
  return /* @__PURE__ */ jsx19(Fragment10, {
    children: /* @__PURE__ */ jsx19("button", {
      title,
      onClick,
      disabled,
      type,
      className: cn11(style.base, style[variant], className),
      children,
    }),
  });
};
var button_default = Button;

// src/components/nav-links.tsx
import { jsx as jsx20, jsxs as jsxs14 } from "react/jsx-runtime";
var classes2 = {
  link: cn12(
    "flex max-w-[50%] items-center gap-1 py-4 text-base font-medium text-gray-600 transition-colors [word-break:break-word] hover:text-primary-600 dark:text-gray-300 text-sm"
  ),
  icon: cn12("inline h-4 shrink-0"),
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
      "mb-8 flex items-center border-t pt-8 dark:border-neutral-800",
      "contrast-more:border-neutral-400 dark:contrast-more:border-neutral-400",
      "print:hidden"
    ),
    children: [
      prev &&
        /* @__PURE__ */ jsx20(Anchor, {
          href: prev.route,
          title: prev.title,
          className: cn12(classes2.link, "ltr:pr-4 rtl:pl-4"),
          children: /* @__PURE__ */ jsxs14(button_default, {
            variant: "default",
            children: [
              /* @__PURE__ */ jsx20(ArrowRightIcon2, {
                className: cn12(classes2.icon, "ltr:rotate-180"),
              }),
              prev.title,
            ],
          }),
        }),
      next2 &&
        /* @__PURE__ */ jsx20(Anchor, {
          href: next2.route,
          title: next2.title,
          className: cn12(
            classes2.link,
            "ltr:ml-auto ltr:pl-4 ltr:text-right rtl:mr-auto rtl:pr-4 rtl:text-left"
          ),
          children: /* @__PURE__ */ jsxs14(button_default, {
            variant: "default",
            children: [
              next2.title,
              /* @__PURE__ */ jsx20(ArrowRightIcon2, {
                className: cn12(classes2.icon, "rtl:rotate-180"),
              }),
            ],
          }),
        }),
    ],
  });
};

// src/components/navbar.tsx
import { Menu, Transition as Transition3 } from "@headlessui/react";
import cn13 from "clsx";
import { useFSRoute } from "nextra/hooks";
import { ArrowRightIcon as ArrowRightIcon3, MenuIcon } from "nextra/icons";
import { jsx as jsx21, jsxs as jsxs15 } from "react/jsx-runtime";
var classes3 = {
  link: cn13("text-sm contrast-more:text-gray-700 contrast-more:dark:text-gray-100"),
  active: cn13("font-medium subpixel-antialiased"),
  inactive: cn13("text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"),
};
function NavbarMenu({ className, menu, children }) {
  const { items } = menu;
  const routes = Object.fromEntries((menu.children || []).map(route => [route.name, route]));
  return /* @__PURE__ */ jsx21("div", {
    className: "relative inline-block",
    children: /* @__PURE__ */ jsxs15(Menu, {
      children: [
        /* @__PURE__ */ jsx21(Menu.Button, {
          className: cn13(
            className,
            "-ml-2 hidden items-center whitespace-nowrap rounded p-2 md:inline-flex",
            classes3.inactive
          ),
          children,
        }),
        /* @__PURE__ */ jsx21(Transition3, {
          leave: "transition-opacity",
          leaveFrom: "opacity-100",
          leaveTo: "opacity-0",
          children: /* @__PURE__ */ jsx21(Menu.Items, {
            className:
              "absolute right-0 z-20 mt-1 max-h-64 min-w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/20",
            children: Object.entries(items || {}).map(([key, item]) => {
              var _a;
              return /* @__PURE__ */ jsx21(
                Menu.Item,
                {
                  children: /* @__PURE__ */ jsx21(Anchor, {
                    href:
                      item.href ||
                      ((_a = routes[key]) == null ? void 0 : _a.route) ||
                      menu.route + "/" + key,
                    className: cn13(
                      "relative hidden w-full select-none whitespace-nowrap text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 md:inline-block",
                      "py-1.5 transition-colors ltr:pl-3 ltr:pr-9 rtl:pl-9 rtl:pr-3"
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
    className: "nextra-nav-container sticky top-0 z-20 w-full bg-transparent print:hidden",
    children: [
      /* @__PURE__ */ jsx21("div", {
        className: cn13(
          "nextra-nav-container-blur",
          "dark:bg-dark pointer-events-none absolute z-[-1] h-full w-full bg-white",
          "shadow-[0_2px_4px_rgba(0,0,0,.02),0_1px_0_rgba(0,0,0,.06)] dark:shadow-[0_-1px_0_rgba(255,255,255,.1)_inset]",
          "contrast-more:shadow-[0_0_0_1px_#000] contrast-more:dark:shadow-[0_0_0_1px_#fff]"
        ),
      }),
      /* @__PURE__ */ jsxs15("nav", {
        className:
          "mx-auto flex h-[var(--nextra-navbar-height)] max-w-[90rem] items-center justify-between gap-2 pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]",
        children: [
          /* @__PURE__ */ jsxs15("div", {
            className: "flex gap-2",
            children: [
              config.logoLink
                ? /* @__PURE__ */ jsx21(Anchor, {
                    href: typeof config.logoLink === "string" ? config.logoLink : "/",
                    className: "flex items-center gap-2 hover:opacity-75 ltr:mr-auto",
                    children: renderComponent(config.logo),
                  })
                : /* @__PURE__ */ jsx21("div", {
                    className: "flex items-center gap-2 ltr:mr-auto rtl:ml-auto",
                    children: renderComponent(config.logo),
                  }),
              renderComponent(config.search.component, {
                directories: flatDirectories,
                className: "hidden md:inline-block min-w-[200px] ml-4 mr-auto",
              }),
            ],
          }),
          /* @__PURE__ */ jsxs15("div", {
            className: "flex items-center gap-2",
            children: [
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
                        "flex gap-1",
                        isActive2 ? classes3.active : classes3.inactive
                      ),
                      menu: menu2,
                      children: [
                        menu2.title,
                        /* @__PURE__ */ jsx21(ArrowRightIcon3, {
                          className: "h-[18px] min-w-[18px] rounded-sm p-0.5",
                          pathClassName: "origin-center transition-transform rotate-90",
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
                const isActive =
                  page.route === activeRoute || activeRoute.startsWith(page.route + "/");
                return /* @__PURE__ */ jsxs15(
                  Anchor,
                  {
                    href,
                    "className": cn13(
                      classes3.link,
                      "relative -ml-2 hidden whitespace-nowrap p-2 md:inline-block",
                      !isActive || page.newWindow ? classes3.inactive : classes3.active
                    ),
                    "newWindow": page.newWindow,
                    "aria-current": !page.newWindow && isActive,
                    "children": [
                      /* @__PURE__ */ jsx21("span", {
                        className: "absolute inset-x-0 text-center",
                        children: page.title,
                      }),
                      /* @__PURE__ */ jsx21("span", {
                        className: "invisible font-medium",
                        children: page.title,
                      }),
                    ],
                  },
                  href
                );
              }),
              config.chat.link
                ? /* @__PURE__ */ jsx21(Anchor, {
                    className: "p-2 text-current",
                    href: config.chat.link,
                    newWindow: true,
                    children: renderComponent(config.chat.icon),
                  })
                : null,
              renderComponent(config.navbar.extraContent),
              /* @__PURE__ */ jsx21("button", {
                "type": "button",
                "aria-label": "Menu",
                "className": "nextra-hamburger -mr-2 rounded p-2 active:bg-gray-400/20 md:hidden",
                "onClick": () => setMenu(!menu),
                "children": /* @__PURE__ */ jsx21(MenuIcon, { className: cn13({ open: menu }) }),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

// src/components/not-found.tsx
import { useRouter as useRouter4 } from "next/router";
import { useMounted as useMounted4 } from "nextra/hooks";
import { jsx as jsx22 } from "react/jsx-runtime";
function NotFoundPage() {
  const config = useConfig();
  const mounted = useMounted4();
  const { asPath } = useRouter4();
  const { content, labels } = config.notFound;
  if (!content) {
    return null;
  }
  return /* @__PURE__ */ jsx22("p", {
    className: "text-center",
    children: /* @__PURE__ */ jsx22(Anchor, {
      href: getGitIssueUrl({
        repository: config.docsRepositoryBase,
        title: `Found broken \`${mounted ? asPath : ""}\` link. Please fix!`,
        labels,
      }),
      newWindow: true,
      className:
        "text-primary-600 underline decoration-from-font [text-underline-position:from-font]",
      children: renderComponent(content),
    }),
  });
}

// src/components/server-side-error.tsx
import { useRouter as useRouter5 } from "next/router";
import { useMounted as useMounted5 } from "nextra/hooks";
import { jsx as jsx23 } from "react/jsx-runtime";
function ServerSideErrorPage() {
  const config = useConfig();
  const mounted = useMounted5();
  const { asPath } = useRouter5();
  const { content, labels } = config.serverSideError;
  if (!content) {
    return null;
  }
  return /* @__PURE__ */ jsx23("p", {
    className: "text-center",
    children: /* @__PURE__ */ jsx23(Anchor, {
      href: getGitIssueUrl({
        repository: config.docsRepositoryBase,
        title: `Got server-side error in \`${mounted ? asPath : ""}\` url. Please fix!`,
        labels,
      }),
      newWindow: true,
      className:
        "text-primary-600 underline decoration-from-font [text-underline-position:from-font]",
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
import { Fragment as Fragment11, jsx as jsx24, jsxs as jsxs16 } from "react/jsx-runtime";
var TreeState = /* @__PURE__ */ Object.create(null);
var FocusedItemContext = createContext6(null);
var OnFocuseItemContext = createContext6(null);
var FolderLevelContext = createContext6(0);
var Folder2 = memo3(function FolderInner(props) {
  const level = useContext6(FolderLevelContext);
  return /* @__PURE__ */ jsx24(FolderLevelContext.Provider, {
    value: level + 1,
    children: /* @__PURE__ */ jsx24(FolderImpl, __spreadValues({}, props)),
  });
});
var classes4 = {
  link: cn14(
    "flex rounded px-2 py-1.5 text-sm transition-colors [word-break:break-word]",
    "cursor-pointer [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none] contrast-more:border"
  ),
  inactive: cn14(
    "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
    "dark:text-neutral-400 dark:hover:bg-primary-100/5 dark:hover:text-gray-50",
    "contrast-more:text-gray-900 contrast-more:dark:text-gray-50",
    "contrast-more:border-transparent contrast-more:hover:border-gray-900 contrast-more:dark:hover:border-gray-50"
  ),
  active: cn14(
    "bg-primary-100 font-semibold text-primary-800 dark:bg-primary-400/10 dark:text-primary-600",
    "contrast-more:border-primary-500 contrast-more:dark:border-primary-500"
  ),
  list: cn14("flex flex-col gap-1"),
  border: cn14(
    "relative before:absolute before:inset-y-1",
    'before:w-px before:bg-gray-200 before:content-[""] dark:before:bg-neutral-800',
    "ltr:pl-3 ltr:before:left-0 rtl:pr-3 rtl:before:right-0"
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
          "items-center justify-between gap-2",
          !isLink && "w-full text-left",
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
          /* @__PURE__ */ jsx24(ArrowRightIcon4, {
            className:
              "h-[18px] min-w-[18px] rounded-sm p-0.5 hover:bg-gray-800/5 dark:hover:bg-gray-100/5",
            pathClassName: cn14(
              "origin-center transition-transform rtl:-rotate-180",
              open && "ltr:rotate-90 rtl:rotate-[-270deg]"
            ),
          }),
        ],
      }),
      /* @__PURE__ */ jsx24(Collapse, {
        className: "pt-1 ltr:pr-0 rtl:pl-0",
        isOpen: open,
        children: Array.isArray(item.children)
          ? /* @__PURE__ */ jsx24(Menu2, {
              className: cn14(classes4.border, "ltr:ml-3 rtl:mr-3"),
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
  return /* @__PURE__ */ jsx24("li", {
    className: cn14(
      "[word-break:break-word]",
      title
        ? "mb-2 mt-5 px-2 py-1.5 text-sm font-semibold text-gray-900 first:mt-0 dark:text-gray-100"
        : "my-4"
    ),
    children: title
      ? renderComponent(config.sidebar.titleComponent, {
          title,
          type: "separator",
          route: "",
        })
      : /* @__PURE__ */ jsx24("hr", {
          className: "dark:border-primary-100/10 mx-2 border-t border-gray-200",
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
    return /* @__PURE__ */ jsx24(Separator, { title: item.title });
  }
  return /* @__PURE__ */ jsxs16("li", {
    className: cn14(classes4.list, { active }),
    children: [
      /* @__PURE__ */ jsx24(Anchor, {
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
        /* @__PURE__ */ jsx24("ul", {
          className: cn14(classes4.list, classes4.border, "ltr:ml-3 rtl:mr-3"),
          children: anchors.map(({ id, value }) => {
            var _a;
            return /* @__PURE__ */ jsx24(
              "li",
              {
                children: /* @__PURE__ */ jsx24("a", {
                  href: `#${id}`,
                  className: cn14(
                    classes4.link,
                    'flex gap-2 before:opacity-25 before:content-["#"]',
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
  return /* @__PURE__ */ jsx24("ul", {
    className: cn14(classes4.list, className),
    children: directories.map(item =>
      !onlyCurrentDocs || item.isUnderCurrentDocsTree
        ? item.type === "menu" || (item.children && (item.children.length || !item.withIndexPage))
          ? /* @__PURE__ */ jsx24(Folder2, { item, anchors }, item.name)
          : /* @__PURE__ */ jsx24(File2, { item, anchors }, item.name)
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
      document.body.classList.add("overflow-hidden", "md:overflow-auto");
    } else {
      document.body.classList.remove("overflow-hidden", "md:overflow-auto");
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
  return /* @__PURE__ */ jsxs16(Fragment11, {
    children: [
      includePlaceholder && asPopover
        ? /* @__PURE__ */ jsx24("div", { className: "h-0 w-64 shrink-0 max-xl:hidden" })
        : null,
      /* @__PURE__ */ jsx24("div", {
        className: cn14(
          "[transition:background-color_1.5s_ease] motion-reduce:transition-none",
          menu ? "fixed inset-0 z-10 bg-black/80 dark:bg-black/60" : "bg-transparent"
        ),
        onClick: () => setMenu(false),
      }),
      /* @__PURE__ */ jsxs16("aside", {
        className: cn14(
          "nextra-sidebar-container flex flex-col",
          "motion-reduce:transform-none md:top-16 md:shrink-0",
          "transform-gpu transition-all ease-in-out",
          "print:hidden",
          showSidebar ? "md:w-64" : "md:w-20",
          asPopover ? "md:hidden" : "md:sticky md:self-start",
          menu
            ? "max-md:[transform:translate3d(0,0,0)]"
            : "max-md:[transform:translate3d(0,-100%,0)]"
        ),
        ref: containerRef,
        children: [
          /* @__PURE__ */ jsx24("div", {
            className: "px-4 pt-4 md:hidden",
            children: renderComponent(config.search.component, {
              directories: flatDirectories,
            }),
          }),
          /* @__PURE__ */ jsx24(FocusedItemContext.Provider, {
            value: focused,
            children: /* @__PURE__ */ jsx24(OnFocuseItemContext.Provider, {
              value: item => {
                setFocused(item);
              },
              children: /* @__PURE__ */ jsxs16("div", {
                className: cn14(
                  "overflow-y-auto overflow-x-hidden",
                  "grow p-4 md:h-[calc(100vh-var(--nextra-navbar-height)-var(--nextra-menu-height))]",
                  showSidebar ? "nextra-scrollbar" : "no-scrollbar"
                ),
                ref: sidebarRef,
                children: [
                  (!asPopover || !showSidebar) &&
                    /* @__PURE__ */ jsx24(Collapse, {
                      isOpen: showSidebar,
                      horizontal: true,
                      children: /* @__PURE__ */ jsx24(Menu2, {
                        className: "max-md:hidden",
                        directories: docsDirectories,
                        anchors: config.toc.float ? [] : anchors,
                        onlyCurrentDocs: true,
                      }),
                    }),
                  /* @__PURE__ */ jsx24(Menu2, {
                    className: "md:hidden",
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
                "sticky bottom-0",
                "dark:bg-dark bg-white",
                // when banner is showed, sidebar links can be behind menu, set bg color as body bg color
                "mx-4 py-4 shadow-[0_-12px_16px_#fff]",
                "flex items-center gap-2",
                "dark:border-neutral-800 dark:shadow-[0_-12px_16px_#111]",
                "contrast-more:border-neutral-400 contrast-more:shadow-none contrast-more:dark:shadow-none",
                showSidebar
                  ? cn14(hasI18n && "justify-end", "border-t")
                  : "flex-wrap justify-center py-4"
              ),
              "data-toggle-animation": showToggleAnimation
                ? showSidebar
                  ? "show"
                  : "hide"
                : "off",
              "children": [
                hasI18n &&
                  /* @__PURE__ */ jsx24(LocaleSwitch, {
                    options: config.i18n,
                    lite: !showSidebar,
                    className: cn14(showSidebar ? "grow" : "max-md:grow"),
                  }),
                config.darkMode &&
                  /* @__PURE__ */ jsx24("div", {
                    className: showSidebar && !hasI18n ? "flex grow flex-col" : "",
                    children: renderComponent(config.themeSwitch.component, {
                      lite: !showSidebar || hasI18n,
                    }),
                  }),
                config.sidebar.toggleButton &&
                  /* @__PURE__ */ jsx24("button", {
                    title: showSidebar ? "Hide sidebar" : "Show sidebar",
                    className:
                      "dark:hover:bg-primary-100/5 h-7 rounded-md px-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50 max-md:hidden",
                    onClick: () => {
                      setSidebar(!showSidebar);
                      setToggleAnimation(true);
                    },
                    children: /* @__PURE__ */ jsx24(ExpandIcon, { isOpen: showSidebar }),
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
import { jsx as jsx25 } from "react/jsx-runtime";
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
            "sr-only",
            "focus:not-sr-only focus:fixed focus:z-50 focus:m-3 focus:ml-4 focus:h-[calc(var(--nextra-navbar-height)-1.5rem)] focus:rounded-lg focus:border focus:px-3 focus:py-2 focus:align-middle focus:text-sm focus:font-bold",
            "focus:text-gray-900 focus:dark:text-gray-100",
            "focus:bg-white focus:dark:bg-neutral-900",
            "focus:border-neutral-400 focus:dark:border-neutral-800"
          )
        : ""
      : providedClassName;
  return /* @__PURE__ */ jsx25(
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
  return /* @__PURE__ */ jsx25(
    "div",
    __spreadProps(__spreadValues({}, props), { ref: forwardedRef, id: id || DEFAULT_ID })
  );
});
SkipNavContent.displayName = "SkipNavContent";

// src/components/steps.tsx
import cn16 from "clsx";
import { jsx as jsx26 } from "react/jsx-runtime";
function Steps(_a) {
  var _b = _a,
    { children, className } = _b,
    props = __objRest(_b, ["children", "className"]);
  return /* @__PURE__ */ jsx26(
    "div",
    __spreadProps(
      __spreadValues(
        {
          className: cn16(
            "nextra-steps mb-12 ml-4 border-l border-gray-200 pl-6",
            "[counter-reset:step] dark:border-neutral-800",
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
import { jsx as jsx27, jsxs as jsxs17 } from "react/jsx-runtime";
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
      /* @__PURE__ */ jsx27("div", {
        className: "nextra-scrollbar overflow-x-auto overflow-y-hidden overscroll-x-contain",
        children: /* @__PURE__ */ jsx27(HeadlessTab.List, {
          className:
            "mt-4 flex w-max min-w-full border-b border-gray-200 pb-px dark:border-neutral-800",
          children: items.map((item, index) => {
            const disabled = !!(
              item &&
              typeof item === "object" &&
              "disabled" in item &&
              item.disabled
            );
            return /* @__PURE__ */ jsx27(
              HeadlessTab,
              {
                disabled,
                className: ({ selected }) =>
                  cn17(
                    "mr-2 rounded-t p-2 font-medium leading-5 transition-colors",
                    "-mb-0.5 select-none border-b-2",
                    selected
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-600 hover:border-gray-200 hover:text-black dark:text-gray-200 dark:hover:border-neutral-800 dark:hover:text-white",
                    disabled && "pointer-events-none text-gray-400 dark:text-neutral-600"
                  ),
                children: renderTab(item),
              },
              index
            );
          }),
        }),
      }),
      /* @__PURE__ */ jsx27(HeadlessTab.Panels, { children }),
    ],
  });
}
function Tab(_a) {
  var _b = _a,
    { children } = _b,
    props = __objRest(_b, ["children"]);
  return /* @__PURE__ */ jsx27(
    HeadlessTab.Panel,
    __spreadProps(__spreadValues({}, props), { className: "rounded pt-6", children })
  );
}

// src/components/theme-switch.tsx
import { useTheme as useTheme2 } from "next-themes";
import { useMounted as useMounted6 } from "nextra/hooks";
import { MoonIcon, SunIcon } from "nextra/icons";
import { z } from "zod";
import { jsx as jsx28, jsxs as jsxs18 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx28(Select, {
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
        className: "flex items-center gap-2 capitalize",
        children: [
          /* @__PURE__ */ jsx28(IconToUse, {}),
          /* @__PURE__ */ jsx28("span", {
            className: lite ? "md:hidden" : "",
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
import { Fragment as Fragment12, jsx as jsx29, jsxs as jsxs19 } from "react/jsx-runtime";
var linkClassName = cn18(
  "text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
  "contrast-more:text-gray-800 contrast-more:dark:text-gray-50"
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
      "nextra-scrollbar sticky top-16 overflow-y-auto pr-4 pt-6 text-sm [hyphens:auto]",
      "max-h-[calc(100vh-var(--nextra-navbar-height)-env(safe-area-inset-bottom))] ltr:-mr-4 rtl:-ml-4"
    ),
    children: [
      hasHeadings &&
        /* @__PURE__ */ jsxs19(Fragment12, {
          children: [
            /* @__PURE__ */ jsx29("p", {
              className: "mb-4 font-semibold tracking-tight",
              children: renderComponent(config.toc.title),
            }),
            /* @__PURE__ */ jsx29("ul", {
              children: items.map(({ id, value, depth }) => {
                var _a2, _b, _c, _d;
                return /* @__PURE__ */ jsx29(
                  "li",
                  {
                    className: "my-2 scroll-my-6 scroll-py-6",
                    children: /* @__PURE__ */ jsx29("a", {
                      href: `#${id}`,
                      className: cn18(
                        {
                          2: "font-semibold",
                          3: "ltr:pl-4 rtl:pr-4",
                          4: "ltr:pl-8 rtl:pr-8",
                          5: "ltr:pl-12 rtl:pr-12",
                          6: "ltr:pl-16 rtl:pr-16",
                        }[depth],
                        "inline-block",
                        ((_a2 = activeAnchor[id]) == null ? void 0 : _a2.isActive)
                          ? "text-primary-600 contrast-more:!text-primary-600 subpixel-antialiased"
                          : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300",
                        "w-full break-words contrast-more:text-gray-900 contrast-more:underline contrast-more:dark:text-gray-50"
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
              "dark:bg-dark mt-8 border-t bg-white pt-8 shadow-[0_-12px_16px_white] dark:shadow-[0_-12px_16px_#111]",
            "sticky bottom-0 flex flex-col items-start gap-2 pb-8 dark:border-neutral-800",
            "contrast-more:border-t contrast-more:border-neutral-400 contrast-more:shadow-none contrast-more:dark:border-neutral-400"
          ),
          children: [
            config.feedback.content
              ? /* @__PURE__ */ jsx29(Anchor, {
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
import { jsx as jsx30 } from "react/jsx-runtime";
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
            children: /* @__PURE__ */ jsx30(HighlightMatches, { value: title, match: search }),
          }))
        : [],
    [search, directories]
  );
  return /* @__PURE__ */ jsx30(Search, {
    value: search,
    onChange: setSearch,
    className,
    overlayClassName: "w-full",
    results,
  });
}

// src/constants.tsx
import { Fragment as Fragment13, jsx as jsx31, jsxs as jsxs20 } from "react/jsx-runtime";
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
    icon: /* @__PURE__ */ jsxs20(Fragment13, {
      children: [
        /* @__PURE__ */ jsx31(DiscordIcon, {}),
        /* @__PURE__ */ jsx31("span", { className: "sr-only", children: "Discord" }),
      ],
    }),
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
      return /* @__PURE__ */ jsx31(Anchor, { className, href: editUrl, children });
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
    return /* @__PURE__ */ jsxs20(Fragment13, {
      children: [
        "Last updated on",
        " ",
        /* @__PURE__ */ jsx31("time", {
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
  head: /* @__PURE__ */ jsxs20(Fragment13, {
    children: [
      /* @__PURE__ */ jsx31("meta", { name: "msapplication-TileColor", content: "#fff" }),
      /* @__PURE__ */ jsx31("meta", { httpEquiv: "Content-Language", content: "en" }),
      /* @__PURE__ */ jsx31("meta", {
        name: "description",
        content: "Nextra: the next docs builder",
      }),
      /* @__PURE__ */ jsx31("meta", { name: "twitter:card", content: "summary_large_image" }),
      /* @__PURE__ */ jsx31("meta", { name: "twitter:site", content: "@shuding_" }),
      /* @__PURE__ */ jsx31("meta", {
        property: "og:title",
        content: "Nextra: the next docs builder",
      }),
      /* @__PURE__ */ jsx31("meta", {
        property: "og:description",
        content: "Nextra: the next docs builder",
      }),
      /* @__PURE__ */ jsx31("meta", { name: "apple-mobile-web-app-title", content: "Nextra" }),
    ],
  }),
  i18n: [],
  logo: /* @__PURE__ */ jsxs20(Fragment13, {
    children: [
      /* @__PURE__ */ jsx31("span", { className: "font-extrabold", children: "Nextra" }),
      /* @__PURE__ */ jsx31("span", {
        className: "ml-2 hidden font-normal text-gray-600 md:inline",
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
    icon: /* @__PURE__ */ jsxs20(Fragment13, {
      children: [
        /* @__PURE__ */ jsx31(GitHubIcon, {}),
        /* @__PURE__ */ jsx31("span", { className: "sr-only", children: "GitHub" }),
      ],
    }),
  },
  search: {
    component: function Search2({ className, directories }) {
      const config = useConfig();
      return config.flexsearch
        ? /* @__PURE__ */ jsx31(Flexsearch, { className })
        : /* @__PURE__ */ jsx31(MatchSorterSearch, { className, directories });
    },
    emptyResult: /* @__PURE__ */ jsx31("span", {
      className: "block select-none p-8 text-center text-sm text-gray-400",
      children: "No results found.",
    }),
    error: "Failed to load search index.",
    loading: function useLoading() {
      const { locale, defaultLocale = DEFAULT_LOCALE } = useRouter7();
      const text = (locale && LOADING_LOCALES[locale]) || LOADING_LOCALES[defaultLocale];
      return /* @__PURE__ */ jsxs20(Fragment13, { children: [text, "\u2026"] });
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
    titleComponent: ({ title }) => /* @__PURE__ */ jsx31(Fragment13, { children: title }),
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
import cn21 from "clsx";

// src/components/code.tsx
import cn19 from "clsx";
import { jsx as jsx32 } from "react/jsx-runtime";
var Code = _a => {
  var _b = _a,
    { children, className } = _b,
    props = __objRest(_b, ["children", "className"]);
  const hasLineNumbers = "data-line-numbers" in props;
  return /* @__PURE__ */ jsx32(
    "code",
    __spreadProps(
      __spreadValues(
        {
          className: cn19(
            "bg-outline break-words rounded-md border border-black border-opacity-[0.04] px-[.25em] py-0.5 text-[.9em]",
            "dark:border-white/10 dark:bg-white/10",
            hasLineNumbers && "[counter-reset:line]",
            className
          ),
          dir: "ltr",
        },
        props
      ),
      {
        children,
      }
    )
  );
};

// src/components/pre.tsx
import cn20 from "clsx";
import { useCallback as useCallback6, useRef as useRef7 } from "react";

// src/components/copy-to-clipboard.tsx
import { useCallback as useCallback5, useEffect as useEffect5, useState as useState8 } from "react";
import { CheckIcon as CheckIcon2, CopyIcon } from "nextra/icons";
import { jsx as jsx33 } from "react/jsx-runtime";
var CopyToClipboard = _a => {
  var _b = _a,
    { getValue } = _b,
    props = __objRest(_b, ["getValue"]);
  const [isCopied, setCopied] = useState8(false);
  useEffect5(() => {
    if (!isCopied) return;
    const timerId = setTimeout(() => {
      setCopied(false);
    }, 2e3);
    return () => {
      clearTimeout(timerId);
    };
  }, [isCopied]);
  const handleClick = useCallback5(
    () =>
      __async(void 0, null, function* () {
        setCopied(true);
        if (!(navigator == null ? void 0 : navigator.clipboard)) {
          console.error("Access to clipboard rejected!");
        }
        try {
          yield navigator.clipboard.writeText(getValue());
        } catch (e) {
          console.error("Failed to copy!");
        }
      }),
    [getValue]
  );
  const IconToUse = isCopied ? CheckIcon2 : CopyIcon;
  return /* @__PURE__ */ jsx33(
    button_default,
    __spreadProps(
      __spreadValues(
        { onClick: handleClick, variant: "default", title: "Copy code", tabIndex: 0 },
        props
      ),
      {
        children: /* @__PURE__ */ jsx33(IconToUse, {
          className: "nextra-copy-icon text-dim pointer-events-none h-4 w-4",
        }),
      }
    )
  );
};

// src/components/pre.tsx
import { jsx as jsx34, jsxs as jsxs21 } from "react/jsx-runtime";
var Pre = _a => {
  var _b = _a,
    { children, className, hasCopyCode, filename } = _b,
    props = __objRest(_b, ["children", "className", "hasCopyCode", "filename"]);
  const preRef = useRef7(null);
  const toggleWordWrap = useCallback6(() => {
    const htmlDataset = document.documentElement.dataset;
    const hasWordWrap = "nextraWordWrap" in htmlDataset;
    if (hasWordWrap) {
      delete htmlDataset.nextraWordWrap;
    } else {
      htmlDataset.nextraWordWrap = "";
    }
  }, []);
  return /* @__PURE__ */ jsxs21("div", {
    className: "nextra-code-block relative mt-6 first:mt-0",
    children: [
      filename &&
        /* @__PURE__ */ jsx34("div", {
          className:
            "bg-primary-700/5 dark:bg-primary-300/10 absolute top-0 z-[1] w-full truncate rounded-t-xl px-4 py-2 text-xs text-gray-700 dark:text-gray-200",
          children: filename,
        }),
      /* @__PURE__ */ jsx34(
        "pre",
        __spreadProps(
          __spreadValues(
            {
              className: cn20(
                "bg-primary-700/5 dark:bg-primary-300/10 mb-4 overflow-x-auto rounded-xl text-[.9em] font-medium subpixel-antialiased",
                "contrast-more:border-primary-900/20 contrast-more:dark:border-primary-100/40 contrast-more:border contrast-more:contrast-150",
                filename ? "pb-4 pt-12" : "py-4",
                className
              ),
              ref: preRef,
            },
            props
          ),
          {
            children,
          }
        )
      ),
      /* @__PURE__ */ jsxs21("div", {
        className: cn20(
          "opacity-0 transition focus-within:opacity-100 [div:hover>&]:opacity-100",
          "absolute right-0 m-[11px] flex gap-1",
          filename ? "top-8" : "top-0"
        ),
        children: [
          /* @__PURE__ */ jsx34(button_default, {
            onClick: toggleWordWrap,
            variant: "default",
            className: "md:hidden",
            title: "Toggle word wrap",
            children: "wrap?",
          }),
          hasCopyCode &&
            /* @__PURE__ */ jsx34(CopyToClipboard, {
              getValue: () => {
                var _a2, _b2;
                return (
                  ((_b2 = (_a2 = preRef.current) == null ? void 0 : _a2.querySelector("code")) ==
                  null
                    ? void 0
                    : _b2.textContent) || ""
                );
              },
            }),
        ],
      }),
    ],
  });
};

// src/components/table.tsx
import { jsx as jsx35 } from "react/jsx-runtime";
var Table = _a => {
  var _b = _a,
    { className = "" } = _b,
    props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx35(
    "table",
    __spreadValues({ className: "block overflow-x-scroll " + className }, props)
  );
};

// src/components/td.tsx
import { jsx as jsx36 } from "react/jsx-runtime";
var Td = _a => {
  var _b = _a,
    { className = "" } = _b,
    props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx36(
    "td",
    __spreadValues(
      {
        className: "m-0 border border-gray-300 px-4 py-2 dark:border-gray-600 " + className,
      },
      props
    )
  );
};

// src/components/tr.tsx
import { jsx as jsx37 } from "react/jsx-runtime";
var Tr = _a => {
  var _b = _a,
    { className = "" } = _b,
    props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx37(
    "tr",
    __spreadValues(
      {
        className:
          "m-0 border-t border-gray-300 p-0 dark:border-gray-600 even:bg-gray-100 even:dark:bg-gray-600/20 " +
          className,
      },
      props
    )
  );
};

// src/components/th.tsx
import { jsx as jsx38 } from "react/jsx-runtime";
var Th = _a => {
  var _b = _a,
    { className = "" } = _b,
    props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx38(
    "th",
    __spreadValues(
      {
        className:
          "m-0 border border-gray-300 px-4 py-2 font-semibold dark:border-gray-600 " + className,
      },
      props
    )
  );
};

// src/mdx-components.tsx
import {
  Children,
  cloneElement,
  useEffect as useEffect6,
  useRef as useRef8,
  useState as useState9,
} from "react";
import { jsx as jsx39, jsxs as jsxs22 } from "react/jsx-runtime";
function HeadingLink(_a) {
  var _b = _a,
    { tag: Tag, context, children, id } = _b,
    props = __objRest(_b, ["tag", "context", "children", "id"]);
  const setActiveAnchor = useSetActiveAnchor();
  const slugs2 = useSlugs();
  const observer = useIntersectionObserver();
  const obRef = useRef8(null);
  useEffect6(() => {
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
  return /* @__PURE__ */ jsxs22(
    Tag,
    __spreadProps(
      __spreadValues(
        {
          className: cn21(
            "font-semibold tracking-tight text-slate-900 dark:text-slate-100",
            {
              h2: "dark:border-primary-100/10 mt-10 border-b border-neutral-200/70 pb-1 text-3xl contrast-more:border-neutral-400 contrast-more:dark:border-neutral-400",
              h3: "mt-8 text-2xl",
              h4: "mt-8 text-xl",
              h5: "mt-8 text-lg",
              h6: "mt-8 text-base",
            }[Tag]
          ),
        },
        props
      ),
      {
        children: [
          children,
          /* @__PURE__ */ jsx39("span", { className: "absolute -mt-20", id, ref: obRef }),
          /* @__PURE__ */ jsx39("a", {
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
  const [openState, setOpen] = useState9(!!open);
  const [summary, restChildren] = findSummary(children);
  const [delayedOpenState, setDelayedOpenState] = useState9(openState);
  useEffect6(() => {
    if (openState) {
      setDelayedOpenState(true);
    } else {
      const timeout = setTimeout(() => setDelayedOpenState(openState), 500);
      return () => clearTimeout(timeout);
    }
  }, [openState]);
  return /* @__PURE__ */ jsxs22(
    "details",
    __spreadProps(
      __spreadValues(
        __spreadProps(
          __spreadValues(
            {
              className:
                "my-4 rounded border border-gray-200 bg-white p-2 shadow-sm first:mt-0 dark:border-neutral-800 dark:bg-neutral-900",
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
          /* @__PURE__ */ jsx39(DetailsProvider, { value: setOpen, children: summary }),
          /* @__PURE__ */ jsx39(Collapse, { isOpen: openState, children: restChildren }),
        ],
      }
    )
  );
};
var Summary = props => {
  const setOpen = useDetails();
  return /* @__PURE__ */ jsx39(
    "summary",
    __spreadProps(
      __spreadValues(
        {
          className: cn21(
            "flex cursor-pointer list-none items-center p-1 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800",
            "before:mr-1 before:inline-block before:transition-transform before:content-[''] dark:before:invert",
            "rtl:before:rotate-180 [[data-expanded]>&]:before:rotate-90"
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
  return /* @__PURE__ */ jsx39(
    Anchor,
    __spreadValues(
      {
        href,
        newWindow: EXTERNAL_HREF_REGEX.test(href),
        className: cn21(
          "text-primary-600 underline decoration-from-font [text-underline-position:from-font]",
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
  return /* @__PURE__ */ jsx39(
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
        /* @__PURE__ */ jsx39(
          "h1",
          __spreadValues(
            {
              className:
                "mt-2 text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100",
            },
            props
          )
        ),
      h2: props =>
        /* @__PURE__ */ jsx39(HeadingLink, __spreadValues({ tag: "h2", context }, props)),
      h3: props =>
        /* @__PURE__ */ jsx39(HeadingLink, __spreadValues({ tag: "h3", context }, props)),
      h4: props =>
        /* @__PURE__ */ jsx39(HeadingLink, __spreadValues({ tag: "h4", context }, props)),
      h5: props =>
        /* @__PURE__ */ jsx39(HeadingLink, __spreadValues({ tag: "h5", context }, props)),
      h6: props =>
        /* @__PURE__ */ jsx39(HeadingLink, __spreadValues({ tag: "h6", context }, props)),
      ul: props =>
        /* @__PURE__ */ jsx39(
          "ul",
          __spreadValues({ className: "mt-6 list-disc first:mt-0 ltr:ml-6 rtl:mr-6" }, props)
        ),
      ol: props =>
        /* @__PURE__ */ jsx39(
          "ol",
          __spreadValues({ className: "mt-6 list-decimal first:mt-0 ltr:ml-6 rtl:mr-6" }, props)
        ),
      li: props => /* @__PURE__ */ jsx39("li", __spreadValues({ className: "my-2" }, props)),
      blockquote: props =>
        /* @__PURE__ */ jsx39(
          "blockquote",
          __spreadValues(
            {
              className: cn21(
                "mt-6 border-gray-300 italic text-gray-700 dark:border-gray-700 dark:text-gray-400",
                "first:mt-0 ltr:border-l-2 ltr:pl-6 rtl:border-r-2 rtl:pr-6"
              ),
            },
            props
          )
        ),
      hr: props =>
        /* @__PURE__ */ jsx39(
          "hr",
          __spreadValues({ className: "my-8 dark:border-gray-900" }, props)
        ),
      a: Link,
      table: props =>
        /* @__PURE__ */ jsx39(
          Table,
          __spreadValues({ className: "nextra-scrollbar mt-6 p-0 first:mt-0" }, props)
        ),
      p: props =>
        /* @__PURE__ */ jsx39(
          "p",
          __spreadValues({ className: "mt-6 leading-7 first:mt-0" }, props)
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
import { Fragment as Fragment14, jsx as jsx40, jsxs as jsxs23 } from "react/jsx-runtime";
var classes5 = {
  toc: cn22("nextra-toc order-last hidden w-64 shrink-0 xl:block print:hidden"),
  main: cn22("w-full break-words"),
};
var Body = ({ themeContext, breadcrumb, timestamp, navigation, children }) => {
  var _a;
  const config = useConfig();
  const mounted = useMounted7();
  if (themeContext.layout === "raw") {
    return /* @__PURE__ */ jsx40("div", { className: classes5.main, children });
  }
  const date =
    themeContext.timestamp && config.gitTimestamp && timestamp ? new Date(timestamp) : null;
  const gitTimestampEl =
    // Because a user's time zone may be different from the server page
    mounted && date
      ? /* @__PURE__ */ jsx40("div", {
          className:
            "mb-8 mt-12 block text-xs text-gray-500 ltr:text-right rtl:text-left dark:text-gray-400",
          children: renderComponent(config.gitTimestamp, { timestamp: date }),
        })
      : /* @__PURE__ */ jsx40("div", { className: "mt-16" });
  const content = /* @__PURE__ */ jsxs23(Fragment14, {
    children: [children, gitTimestampEl, navigation],
  });
  const body =
    ((_a = config.main) == null ? void 0 : _a.call(config, { children: content })) || content;
  if (themeContext.layout === "full") {
    return /* @__PURE__ */ jsx40("article", {
      className: cn22(
        classes5.main,
        "nextra-content min-h-[calc(100vh-var(--nextra-navbar-height))] pl-[max(env(safe-area-inset-left),1.5rem)] pr-[max(env(safe-area-inset-right),1.5rem)]"
      ),
      children: body,
    });
  }
  return /* @__PURE__ */ jsx40("article", {
    className: cn22(
      classes5.main,
      "nextra-content flex min-h-[calc(100vh-var(--nextra-navbar-height))] min-w-0 justify-center pb-8 pr-[calc(env(safe-area-inset-right)-1.5rem)]",
      themeContext.typesetting === "article" && "nextra-body-typesetting-article"
    ),
    children: /* @__PURE__ */ jsxs23("main", {
      className: "w-full min-w-0 max-w-6xl px-6 pt-4 md:px-12",
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
        /* @__PURE__ */ jsx40("nav", {
          "className": classes5.toc,
          "aria-label": "table of contents",
        })
      : /* @__PURE__ */ jsx40("nav", {
          "className": cn22(classes5.toc, "px-4"),
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
    /* @__PURE__ */ jsxs23("div", {
      dir: direction,
      children: [
        /* @__PURE__ */ jsx40("script", {
          dangerouslySetInnerHTML: {
            __html: `document.documentElement.setAttribute('dir','${direction}')`,
          },
        }),
        /* @__PURE__ */ jsx40(Head, {}),
        /* @__PURE__ */ jsx40(Banner, {}),
        themeContext.navbar &&
          renderComponent(config.navbar.component, {
            flatDirectories,
            items: topLevelNavbarItems,
          }),
        /* @__PURE__ */ jsx40("div", {
          className: cn22("mx-auto flex", themeContext.layout !== "raw" && "max-w-[90rem]"),
          children: /* @__PURE__ */ jsxs23(ActiveAnchorProvider, {
            children: [
              /* @__PURE__ */ jsx40(Sidebar, {
                docsDirectories,
                flatDirectories,
                fullDirectories: directories,
                headings,
                asPopover: hideSidebar,
                includePlaceholder: themeContext.layout === "default",
              }),
              tocEl,
              /* @__PURE__ */ jsx40(SkipNavContent, {}),
              /* @__PURE__ */ jsx40(Body, {
                themeContext,
                breadcrumb:
                  activeType !== "page" && themeContext.breadcrumb
                    ? /* @__PURE__ */ jsx40(Breadcrumb, { activePath })
                    : null,
                timestamp,
                navigation:
                  activeType !== "page" && themeContext.pagination
                    ? /* @__PURE__ */ jsx40(NavLinks, {
                        flatDirectories: flatDocsDirectories,
                        currentIndex: activeIndex,
                      })
                    : null,
                children: /* @__PURE__ */ jsx40(MDXProvider, {
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
  return /* @__PURE__ */ jsx40(ConfigProvider, {
    value: context,
    children: /* @__PURE__ */ jsx40(
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
