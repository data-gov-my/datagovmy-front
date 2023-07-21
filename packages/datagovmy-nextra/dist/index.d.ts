import { Heading, FrontMatter, PageOpts, NextraThemeLayoutProps } from "nextra";
import * as react from "react";
import { ReactElement, ReactNode, FC, ComponentProps } from "react";
import { NextSeoProps } from "next-seo";
import { Item, PageItem, MenuItem } from "nextra/normalize-pages";
import { z } from "zod";
export { useMDXComponents } from "nextra/mdx";
export { Callout } from "nextra/components";
export { useTheme } from "next-themes";
import * as react_jsx_runtime from "react/jsx-runtime";
import { Tab as Tab$1 } from "@headlessui/react";

type NavBarProps = {
  flatDirectories: Item[];
  items: (PageItem | MenuItem)[];
};
declare function Navbar({ flatDirectories, items }: NavBarProps): ReactElement;

type TOCProps = {
  headings: Heading[];
  filePath: string;
};

declare const themeSchema: z.ZodObject<
  {
    banner: z.ZodObject<
      {
        dismissible: z.ZodBoolean;
        key: z.ZodString;
        text: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
      },
      "strict",
      z.ZodTypeAny,
      {
        dismissible: boolean;
        key: string;
        text?: ReactNode | FC;
      },
      {
        dismissible: boolean;
        key: string;
        text?: ReactNode | FC;
      }
    >;
    chat: z.ZodObject<
      {
        icon: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
        link: z.ZodOptional<z.ZodString>;
      },
      "strict",
      z.ZodTypeAny,
      {
        icon?: ReactNode | FC;
        link?: string | undefined;
      },
      {
        icon?: ReactNode | FC;
        link?: string | undefined;
      }
    >;
    components: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<FC, z.ZodTypeDef, FC>>>;
    darkMode: z.ZodBoolean;
    direction: z.ZodEnum<["ltr", "rtl"]>;
    docsRepositoryBase: z.ZodString;
    editLink: z.ZodObject<
      {
        component: z.ZodType<
          FC<{
            children: ReactNode;
            className?: string | undefined;
            filePath?: string | undefined;
          }>,
          z.ZodTypeDef,
          FC<{
            children: ReactNode;
            className?: string | undefined;
            filePath?: string | undefined;
          }>
        >;
        text: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
      },
      "strict",
      z.ZodTypeAny,
      {
        text: (...args: unknown[]) => string;
        component: FC<{
          children: ReactNode;
          className?: string | undefined;
          filePath?: string | undefined;
        }>;
      },
      {
        text: (...args: unknown[]) => string;
        component: FC<{
          children: ReactNode;
          className?: string | undefined;
          filePath?: string | undefined;
        }>;
      }
    >;
    faviconGlyph: z.ZodOptional<z.ZodString>;
    feedback: z.ZodObject<
      {
        content: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
        labels: z.ZodString;
        useLink: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
      },
      "strict",
      z.ZodTypeAny,
      {
        content: (...args: unknown[]) => string;
        labels: string;
        useLink: (...args: unknown[]) => string;
      },
      {
        content: (...args: unknown[]) => string;
        labels: string;
        useLink: (...args: unknown[]) => string;
      }
    >;
    footer: z.ZodObject<
      {
        component: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
        govMy: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
        dtsa: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
        openSource: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
        fe: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
        be: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
        uiux: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
        openData: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
        guide: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
        tos: z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>;
      },
      "strict",
      z.ZodTypeAny,
      {
        govMy: (...args: unknown[]) => string;
        dtsa: (...args: unknown[]) => string;
        openSource: (...args: unknown[]) => string;
        fe: (...args: unknown[]) => string;
        be: (...args: unknown[]) => string;
        uiux: (...args: unknown[]) => string;
        openData: (...args: unknown[]) => string;
        guide: (...args: unknown[]) => string;
        tos: (...args: unknown[]) => string;
        component?: ReactNode | FC;
      },
      {
        govMy: (...args: unknown[]) => string;
        dtsa: (...args: unknown[]) => string;
        openSource: (...args: unknown[]) => string;
        fe: (...args: unknown[]) => string;
        be: (...args: unknown[]) => string;
        uiux: (...args: unknown[]) => string;
        openData: (...args: unknown[]) => string;
        guide: (...args: unknown[]) => string;
        tos: (...args: unknown[]) => string;
        component?: ReactNode | FC;
      }
    >;
    gitTimestamp: z.ZodType<
      | ReactNode
      | FC<{
          timestamp: Date;
        }>,
      z.ZodTypeDef,
      | ReactNode
      | FC<{
          timestamp: Date;
        }>
    >;
    head: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
    i18n: z.ZodArray<
      z.ZodObject<
        {
          direction: z.ZodOptional<z.ZodEnum<["ltr", "rtl"]>>;
          locale: z.ZodString;
          text: z.ZodString;
        },
        "strict",
        z.ZodTypeAny,
        {
          text: string;
          locale: string;
          direction?: "ltr" | "rtl" | undefined;
        },
        {
          text: string;
          locale: string;
          direction?: "ltr" | "rtl" | undefined;
        }
      >,
      "many"
    >;
    logo: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
    logoLink: z.ZodUnion<[z.ZodBoolean, z.ZodString]>;
    main: z.ZodOptional<
      z.ZodType<
        FC<{
          children: ReactNode;
        }>,
        z.ZodTypeDef,
        FC<{
          children: ReactNode;
        }>
      >
    >;
    navbar: z.ZodObject<
      {
        component: z.ZodType<
          ReactNode | FC<NavBarProps>,
          z.ZodTypeDef,
          ReactNode | FC<NavBarProps>
        >;
        extraContent: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
      },
      "strict",
      z.ZodTypeAny,
      {
        component?: ReactNode | FC<NavBarProps>;
        extraContent?: ReactNode | FC;
      },
      {
        component?: ReactNode | FC<NavBarProps>;
        extraContent?: ReactNode | FC;
      }
    >;
    navigation: z.ZodUnion<
      [
        z.ZodBoolean,
        z.ZodObject<
          {
            next: z.ZodBoolean;
            prev: z.ZodBoolean;
          },
          "strict",
          z.ZodTypeAny,
          {
            next: boolean;
            prev: boolean;
          },
          {
            next: boolean;
            prev: boolean;
          }
        >
      ]
    >;
    nextThemes: z.ZodObject<
      {
        defaultTheme: z.ZodString;
        forcedTheme: z.ZodOptional<z.ZodString>;
        storageKey: z.ZodString;
      },
      "strict",
      z.ZodTypeAny,
      {
        defaultTheme: string;
        storageKey: string;
        forcedTheme?: string | undefined;
      },
      {
        defaultTheme: string;
        storageKey: string;
        forcedTheme?: string | undefined;
      }
    >;
    notFound: z.ZodObject<
      {
        content: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
        labels: z.ZodString;
      },
      "strict",
      z.ZodTypeAny,
      {
        labels: string;
        content?: ReactNode | FC;
      },
      {
        labels: string;
        content?: ReactNode | FC;
      }
    >;
    primaryHue: z.ZodUnion<
      [
        z.ZodNumber,
        z.ZodObject<
          {
            dark: z.ZodNumber;
            light: z.ZodNumber;
          },
          "strict",
          z.ZodTypeAny,
          {
            dark: number;
            light: number;
          },
          {
            dark: number;
            light: number;
          }
        >
      ]
    >;
    project: z.ZodObject<
      {
        icon: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
        link: z.ZodOptional<z.ZodString>;
      },
      "strict",
      z.ZodTypeAny,
      {
        icon?: ReactNode | FC;
        link?: string | undefined;
      },
      {
        icon?: ReactNode | FC;
        link?: string | undefined;
      }
    >;
    search: z.ZodObject<
      {
        component: z.ZodType<
          | ReactNode
          | FC<{
              className?: string | undefined;
              directories: Item[];
            }>,
          z.ZodTypeDef,
          | ReactNode
          | FC<{
              className?: string | undefined;
              directories: Item[];
            }>
        >;
        emptyResult: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
        error: z.ZodUnion<[z.ZodString, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>]>;
        loading: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
        placeholder: z.ZodUnion<
          [z.ZodString, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>]
        >;
      },
      "strict",
      z.ZodTypeAny,
      {
        error: (string | ((...args: unknown[]) => string)) &
          (string | ((...args: unknown[]) => string) | undefined);
        placeholder: (string | ((...args: unknown[]) => string)) &
          (string | ((...args: unknown[]) => string) | undefined);
        component?:
          | ReactNode
          | FC<{
              className?: string | undefined;
              directories: Item[];
            }>;
        emptyResult?: ReactNode | FC;
        loading?: ReactNode | FC;
      },
      {
        error: (string | ((...args: unknown[]) => string)) &
          (string | ((...args: unknown[]) => string) | undefined);
        placeholder: (string | ((...args: unknown[]) => string)) &
          (string | ((...args: unknown[]) => string) | undefined);
        component?:
          | ReactNode
          | FC<{
              className?: string | undefined;
              directories: Item[];
            }>;
        emptyResult?: ReactNode | FC;
        loading?: ReactNode | FC;
      }
    >;
    serverSideError: z.ZodObject<
      {
        content: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
        labels: z.ZodString;
      },
      "strict",
      z.ZodTypeAny,
      {
        labels: string;
        content?: ReactNode | FC;
      },
      {
        labels: string;
        content?: ReactNode | FC;
      }
    >;
    sidebar: z.ZodObject<
      {
        defaultMenuCollapseLevel: z.ZodNumber;
        titleComponent: z.ZodType<
          | ReactNode
          | FC<{
              title: string;
              type: string;
              route: string;
            }>,
          z.ZodTypeDef,
          | ReactNode
          | FC<{
              title: string;
              type: string;
              route: string;
            }>
        >;
        toggleButton: z.ZodBoolean;
      },
      "strict",
      z.ZodTypeAny,
      {
        defaultMenuCollapseLevel: number;
        toggleButton: boolean;
        titleComponent?:
          | ReactNode
          | FC<{
              title: string;
              type: string;
              route: string;
            }>;
      },
      {
        defaultMenuCollapseLevel: number;
        toggleButton: boolean;
        titleComponent?:
          | ReactNode
          | FC<{
              title: string;
              type: string;
              route: string;
            }>;
      }
    >;
    themeSwitch: z.ZodObject<
      {
        component: z.ZodType<
          | ReactNode
          | FC<{
              lite?: boolean | undefined;
              className?: string | undefined;
            }>,
          z.ZodTypeDef,
          | ReactNode
          | FC<{
              lite?: boolean | undefined;
              className?: string | undefined;
            }>
        >;
        useOptions: z.ZodUnion<
          [
            z.ZodObject<
              {
                light: z.ZodString;
                dark: z.ZodString;
                system: z.ZodString;
              },
              "strict",
              z.ZodTypeAny,
              {
                dark: string;
                light: string;
                system: string;
              },
              {
                dark: string;
                light: string;
                system: string;
              }
            >,
            z.ZodFunction<
              z.ZodTuple<[], z.ZodUnknown>,
              z.ZodObject<
                {
                  light: z.ZodString;
                  dark: z.ZodString;
                  system: z.ZodString;
                },
                "strict",
                z.ZodTypeAny,
                {
                  dark: string;
                  light: string;
                  system: string;
                },
                {
                  dark: string;
                  light: string;
                  system: string;
                }
              >
            >
          ]
        >;
      },
      "strict",
      z.ZodTypeAny,
      {
        useOptions: (
          | {
              dark: string;
              light: string;
              system: string;
            }
          | ((...args: unknown[]) => {
              dark: string;
              light: string;
              system: string;
            })
        ) &
          (
            | {
                dark: string;
                light: string;
                system: string;
              }
            | ((...args: unknown[]) => {
                dark: string;
                light: string;
                system: string;
              })
            | undefined
          );
        component?:
          | ReactNode
          | FC<{
              lite?: boolean | undefined;
              className?: string | undefined;
            }>;
      },
      {
        useOptions: (
          | {
              dark: string;
              light: string;
              system: string;
            }
          | ((...args: unknown[]) => {
              dark: string;
              light: string;
              system: string;
            })
        ) &
          (
            | {
                dark: string;
                light: string;
                system: string;
              }
            | ((...args: unknown[]) => {
                dark: string;
                light: string;
                system: string;
              })
            | undefined
          );
        component?:
          | ReactNode
          | FC<{
              lite?: boolean | undefined;
              className?: string | undefined;
            }>;
      }
    >;
    toc: z.ZodObject<
      {
        component: z.ZodType<ReactNode | FC<TOCProps>, z.ZodTypeDef, ReactNode | FC<TOCProps>>;
        extraContent: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
        float: z.ZodBoolean;
        headingComponent: z.ZodOptional<
          z.ZodType<
            FC<{
              id: string;
              children: string;
            }>,
            z.ZodTypeDef,
            FC<{
              id: string;
              children: string;
            }>
          >
        >;
        title: z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>;
      },
      "strict",
      z.ZodTypeAny,
      {
        float: boolean;
        component?: ReactNode | FC<TOCProps>;
        extraContent?: ReactNode | FC;
        headingComponent?:
          | FC<{
              id: string;
              children: string;
            }>
          | undefined;
        title?: ReactNode | FC;
      },
      {
        float: boolean;
        component?: ReactNode | FC<TOCProps>;
        extraContent?: ReactNode | FC;
        headingComponent?:
          | FC<{
              id: string;
              children: string;
            }>
          | undefined;
        title?: ReactNode | FC;
      }
    >;
    useNextSeoProps: z.ZodType<() => NextSeoProps | void, z.ZodTypeDef, () => NextSeoProps | void>;
  },
  "strict",
  z.ZodTypeAny,
  {
    navigation: (
      | boolean
      | {
          next: boolean;
          prev: boolean;
        }
    ) &
      (
        | boolean
        | {
            next: boolean;
            prev: boolean;
          }
        | undefined
      );
    banner: {
      dismissible: boolean;
      key: string;
      text?: ReactNode | FC;
    };
    chat: {
      icon?: ReactNode | FC;
      link?: string | undefined;
    };
    darkMode: boolean;
    direction: "ltr" | "rtl";
    docsRepositoryBase: string;
    editLink: {
      text: (...args: unknown[]) => string;
      component: FC<{
        children: ReactNode;
        className?: string | undefined;
        filePath?: string | undefined;
      }>;
    };
    feedback: {
      content: (...args: unknown[]) => string;
      labels: string;
      useLink: (...args: unknown[]) => string;
    };
    footer: {
      govMy: (...args: unknown[]) => string;
      dtsa: (...args: unknown[]) => string;
      openSource: (...args: unknown[]) => string;
      fe: (...args: unknown[]) => string;
      be: (...args: unknown[]) => string;
      uiux: (...args: unknown[]) => string;
      openData: (...args: unknown[]) => string;
      guide: (...args: unknown[]) => string;
      tos: (...args: unknown[]) => string;
      component?: ReactNode | FC;
    };
    i18n: {
      text: string;
      locale: string;
      direction?: "ltr" | "rtl" | undefined;
    }[];
    logoLink: string | boolean;
    navbar: {
      component?: ReactNode | FC<NavBarProps>;
      extraContent?: ReactNode | FC;
    };
    nextThemes: {
      defaultTheme: string;
      storageKey: string;
      forcedTheme?: string | undefined;
    };
    notFound: {
      labels: string;
      content?: ReactNode | FC;
    };
    primaryHue: (
      | number
      | {
          dark: number;
          light: number;
        }
    ) &
      (
        | number
        | {
            dark: number;
            light: number;
          }
        | undefined
      );
    project: {
      icon?: ReactNode | FC;
      link?: string | undefined;
    };
    search: {
      error: (string | ((...args: unknown[]) => string)) &
        (string | ((...args: unknown[]) => string) | undefined);
      placeholder: (string | ((...args: unknown[]) => string)) &
        (string | ((...args: unknown[]) => string) | undefined);
      component?:
        | ReactNode
        | FC<{
            className?: string | undefined;
            directories: Item[];
          }>;
      emptyResult?: ReactNode | FC;
      loading?: ReactNode | FC;
    };
    serverSideError: {
      labels: string;
      content?: ReactNode | FC;
    };
    sidebar: {
      defaultMenuCollapseLevel: number;
      toggleButton: boolean;
      titleComponent?:
        | ReactNode
        | FC<{
            title: string;
            type: string;
            route: string;
          }>;
    };
    themeSwitch: {
      useOptions: (
        | {
            dark: string;
            light: string;
            system: string;
          }
        | ((...args: unknown[]) => {
            dark: string;
            light: string;
            system: string;
          })
      ) &
        (
          | {
              dark: string;
              light: string;
              system: string;
            }
          | ((...args: unknown[]) => {
              dark: string;
              light: string;
              system: string;
            })
          | undefined
        );
      component?:
        | ReactNode
        | FC<{
            lite?: boolean | undefined;
            className?: string | undefined;
          }>;
    };
    toc: {
      float: boolean;
      component?: ReactNode | FC<TOCProps>;
      extraContent?: ReactNode | FC;
      headingComponent?:
        | FC<{
            id: string;
            children: string;
          }>
        | undefined;
      title?: ReactNode | FC;
    };
    useNextSeoProps: () => NextSeoProps | void;
    components?: Record<string, FC> | undefined;
    faviconGlyph?: string | undefined;
    gitTimestamp?:
      | ReactNode
      | FC<{
          timestamp: Date;
        }>;
    head?: ReactNode | FC;
    logo?: ReactNode | FC;
    main?:
      | FC<{
          children: ReactNode;
        }>
      | undefined;
  },
  {
    navigation: (
      | boolean
      | {
          next: boolean;
          prev: boolean;
        }
    ) &
      (
        | boolean
        | {
            next: boolean;
            prev: boolean;
          }
        | undefined
      );
    banner: {
      dismissible: boolean;
      key: string;
      text?: ReactNode | FC;
    };
    chat: {
      icon?: ReactNode | FC;
      link?: string | undefined;
    };
    darkMode: boolean;
    direction: "ltr" | "rtl";
    docsRepositoryBase: string;
    editLink: {
      text: (...args: unknown[]) => string;
      component: FC<{
        children: ReactNode;
        className?: string | undefined;
        filePath?: string | undefined;
      }>;
    };
    feedback: {
      content: (...args: unknown[]) => string;
      labels: string;
      useLink: (...args: unknown[]) => string;
    };
    footer: {
      govMy: (...args: unknown[]) => string;
      dtsa: (...args: unknown[]) => string;
      openSource: (...args: unknown[]) => string;
      fe: (...args: unknown[]) => string;
      be: (...args: unknown[]) => string;
      uiux: (...args: unknown[]) => string;
      openData: (...args: unknown[]) => string;
      guide: (...args: unknown[]) => string;
      tos: (...args: unknown[]) => string;
      component?: ReactNode | FC;
    };
    i18n: {
      text: string;
      locale: string;
      direction?: "ltr" | "rtl" | undefined;
    }[];
    logoLink: string | boolean;
    navbar: {
      component?: ReactNode | FC<NavBarProps>;
      extraContent?: ReactNode | FC;
    };
    nextThemes: {
      defaultTheme: string;
      storageKey: string;
      forcedTheme?: string | undefined;
    };
    notFound: {
      labels: string;
      content?: ReactNode | FC;
    };
    primaryHue: (
      | number
      | {
          dark: number;
          light: number;
        }
    ) &
      (
        | number
        | {
            dark: number;
            light: number;
          }
        | undefined
      );
    project: {
      icon?: ReactNode | FC;
      link?: string | undefined;
    };
    search: {
      error: (string | ((...args: unknown[]) => string)) &
        (string | ((...args: unknown[]) => string) | undefined);
      placeholder: (string | ((...args: unknown[]) => string)) &
        (string | ((...args: unknown[]) => string) | undefined);
      component?:
        | ReactNode
        | FC<{
            className?: string | undefined;
            directories: Item[];
          }>;
      emptyResult?: ReactNode | FC;
      loading?: ReactNode | FC;
    };
    serverSideError: {
      labels: string;
      content?: ReactNode | FC;
    };
    sidebar: {
      defaultMenuCollapseLevel: number;
      toggleButton: boolean;
      titleComponent?:
        | ReactNode
        | FC<{
            title: string;
            type: string;
            route: string;
          }>;
    };
    themeSwitch: {
      useOptions: (
        | {
            dark: string;
            light: string;
            system: string;
          }
        | ((...args: unknown[]) => {
            dark: string;
            light: string;
            system: string;
          })
      ) &
        (
          | {
              dark: string;
              light: string;
              system: string;
            }
          | ((...args: unknown[]) => {
              dark: string;
              light: string;
              system: string;
            })
          | undefined
        );
      component?:
        | ReactNode
        | FC<{
            lite?: boolean | undefined;
            className?: string | undefined;
          }>;
    };
    toc: {
      float: boolean;
      component?: ReactNode | FC<TOCProps>;
      extraContent?: ReactNode | FC;
      headingComponent?:
        | FC<{
            id: string;
            children: string;
          }>
        | undefined;
      title?: ReactNode | FC;
    };
    useNextSeoProps: () => NextSeoProps | void;
    components?: Record<string, FC> | undefined;
    faviconGlyph?: string | undefined;
    gitTimestamp?:
      | ReactNode
      | FC<{
          timestamp: Date;
        }>;
    head?: ReactNode | FC;
    logo?: ReactNode | FC;
    main?:
      | FC<{
          children: ReactNode;
        }>
      | undefined;
  }
>;
declare const publicThemeSchema: z.ZodObject<
  {
    navigation: z.ZodOptional<
      z.ZodUnion<
        [
          z.ZodBoolean,
          z.ZodObject<
            {
              next: z.ZodBoolean;
              prev: z.ZodBoolean;
            },
            "strict",
            z.ZodTypeAny,
            {
              next: boolean;
              prev: boolean;
            },
            {
              next: boolean;
              prev: boolean;
            }
          >
        ]
      >
    >;
    banner: z.ZodOptional<
      z.ZodObject<
        {
          dismissible: z.ZodOptional<z.ZodBoolean>;
          key: z.ZodOptional<z.ZodString>;
          text: z.ZodOptional<
            z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>
          >;
        },
        "strict",
        z.ZodTypeAny,
        {
          dismissible?: boolean | undefined;
          key?: string | undefined;
          text?: ReactNode | FC;
        },
        {
          dismissible?: boolean | undefined;
          key?: string | undefined;
          text?: ReactNode | FC;
        }
      >
    >;
    chat: z.ZodOptional<
      z.ZodObject<
        {
          icon: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
          link: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        },
        "strict",
        z.ZodTypeAny,
        {
          icon?: ReactNode | FC;
          link?: string | undefined;
        },
        {
          icon?: ReactNode | FC;
          link?: string | undefined;
        }
      >
    >;
    components: z.ZodOptional<
      z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodType<FC, z.ZodTypeDef, FC>>>
    >;
    darkMode: z.ZodOptional<z.ZodBoolean>;
    direction: z.ZodOptional<z.ZodEnum<["ltr", "rtl"]>>;
    docsRepositoryBase: z.ZodOptional<z.ZodString>;
    editLink: z.ZodOptional<
      z.ZodObject<
        {
          component: z.ZodOptional<
            z.ZodType<
              FC<{
                children: ReactNode;
                className?: string | undefined;
                filePath?: string | undefined;
              }>,
              z.ZodTypeDef,
              FC<{
                children: ReactNode;
                className?: string | undefined;
                filePath?: string | undefined;
              }>
            >
          >;
          text: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
        },
        "strict",
        z.ZodTypeAny,
        {
          component?:
            | FC<{
                children: ReactNode;
                className?: string | undefined;
                filePath?: string | undefined;
              }>
            | undefined;
          text?: ((...args: unknown[]) => string) | undefined;
        },
        {
          component?:
            | FC<{
                children: ReactNode;
                className?: string | undefined;
                filePath?: string | undefined;
              }>
            | undefined;
          text?: ((...args: unknown[]) => string) | undefined;
        }
      >
    >;
    faviconGlyph: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    feedback: z.ZodOptional<
      z.ZodObject<
        {
          content: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
          labels: z.ZodOptional<z.ZodString>;
          useLink: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
        },
        "strict",
        z.ZodTypeAny,
        {
          content?: ((...args: unknown[]) => string) | undefined;
          labels?: string | undefined;
          useLink?: ((...args: unknown[]) => string) | undefined;
        },
        {
          content?: ((...args: unknown[]) => string) | undefined;
          labels?: string | undefined;
          useLink?: ((...args: unknown[]) => string) | undefined;
        }
      >
    >;
    footer: z.ZodOptional<
      z.ZodObject<
        {
          component: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
          govMy: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
          dtsa: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
          openSource: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
          fe: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
          be: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
          uiux: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
          openData: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
          guide: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
          tos: z.ZodOptional<z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>>;
        },
        "strict",
        z.ZodTypeAny,
        {
          component?: ReactNode | FC;
          govMy?: ((...args: unknown[]) => string) | undefined;
          dtsa?: ((...args: unknown[]) => string) | undefined;
          openSource?: ((...args: unknown[]) => string) | undefined;
          fe?: ((...args: unknown[]) => string) | undefined;
          be?: ((...args: unknown[]) => string) | undefined;
          uiux?: ((...args: unknown[]) => string) | undefined;
          openData?: ((...args: unknown[]) => string) | undefined;
          guide?: ((...args: unknown[]) => string) | undefined;
          tos?: ((...args: unknown[]) => string) | undefined;
        },
        {
          component?: ReactNode | FC;
          govMy?: ((...args: unknown[]) => string) | undefined;
          dtsa?: ((...args: unknown[]) => string) | undefined;
          openSource?: ((...args: unknown[]) => string) | undefined;
          fe?: ((...args: unknown[]) => string) | undefined;
          be?: ((...args: unknown[]) => string) | undefined;
          uiux?: ((...args: unknown[]) => string) | undefined;
          openData?: ((...args: unknown[]) => string) | undefined;
          guide?: ((...args: unknown[]) => string) | undefined;
          tos?: ((...args: unknown[]) => string) | undefined;
        }
      >
    >;
    gitTimestamp: z.ZodOptional<
      z.ZodType<
        | ReactNode
        | FC<{
            timestamp: Date;
          }>,
        z.ZodTypeDef,
        | ReactNode
        | FC<{
            timestamp: Date;
          }>
      >
    >;
    head: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
    logo: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
    logoLink: z.ZodOptional<z.ZodUnion<[z.ZodBoolean, z.ZodString]>>;
    main: z.ZodOptional<
      z.ZodOptional<
        z.ZodType<
          FC<{
            children: ReactNode;
          }>,
          z.ZodTypeDef,
          FC<{
            children: ReactNode;
          }>
        >
      >
    >;
    navbar: z.ZodOptional<
      z.ZodObject<
        {
          component: z.ZodOptional<
            z.ZodType<ReactNode | FC<NavBarProps>, z.ZodTypeDef, ReactNode | FC<NavBarProps>>
          >;
          extraContent: z.ZodOptional<
            z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>
          >;
        },
        "strict",
        z.ZodTypeAny,
        {
          component?: ReactNode | FC<NavBarProps>;
          extraContent?: ReactNode | FC;
        },
        {
          component?: ReactNode | FC<NavBarProps>;
          extraContent?: ReactNode | FC;
        }
      >
    >;
    nextThemes: z.ZodOptional<
      z.ZodObject<
        {
          defaultTheme: z.ZodOptional<z.ZodString>;
          forcedTheme: z.ZodOptional<z.ZodOptional<z.ZodString>>;
          storageKey: z.ZodOptional<z.ZodString>;
        },
        "strict",
        z.ZodTypeAny,
        {
          defaultTheme?: string | undefined;
          forcedTheme?: string | undefined;
          storageKey?: string | undefined;
        },
        {
          defaultTheme?: string | undefined;
          forcedTheme?: string | undefined;
          storageKey?: string | undefined;
        }
      >
    >;
    notFound: z.ZodOptional<
      z.ZodObject<
        {
          content: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
          labels: z.ZodOptional<z.ZodString>;
        },
        "strict",
        z.ZodTypeAny,
        {
          content?: ReactNode | FC;
          labels?: string | undefined;
        },
        {
          content?: ReactNode | FC;
          labels?: string | undefined;
        }
      >
    >;
    primaryHue: z.ZodOptional<
      z.ZodUnion<
        [
          z.ZodNumber,
          z.ZodObject<
            {
              dark: z.ZodNumber;
              light: z.ZodNumber;
            },
            "strict",
            z.ZodTypeAny,
            {
              dark: number;
              light: number;
            },
            {
              dark: number;
              light: number;
            }
          >
        ]
      >
    >;
    project: z.ZodOptional<
      z.ZodObject<
        {
          icon: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
          link: z.ZodOptional<z.ZodOptional<z.ZodString>>;
        },
        "strict",
        z.ZodTypeAny,
        {
          icon?: ReactNode | FC;
          link?: string | undefined;
        },
        {
          icon?: ReactNode | FC;
          link?: string | undefined;
        }
      >
    >;
    search: z.ZodOptional<
      z.ZodObject<
        {
          component: z.ZodOptional<
            z.ZodType<
              | ReactNode
              | FC<{
                  className?: string | undefined;
                  directories: Item[];
                }>,
              z.ZodTypeDef,
              | ReactNode
              | FC<{
                  className?: string | undefined;
                  directories: Item[];
                }>
            >
          >;
          emptyResult: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
          error: z.ZodOptional<
            z.ZodUnion<[z.ZodString, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>]>
          >;
          loading: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
          placeholder: z.ZodOptional<
            z.ZodUnion<[z.ZodString, z.ZodFunction<z.ZodTuple<[], z.ZodUnknown>, z.ZodString>]>
          >;
        },
        "strict",
        z.ZodTypeAny,
        {
          component?:
            | ReactNode
            | FC<{
                className?: string | undefined;
                directories: Item[];
              }>;
          emptyResult?: ReactNode | FC;
          error?: string | ((...args: unknown[]) => string) | undefined;
          loading?: ReactNode | FC;
          placeholder?: string | ((...args: unknown[]) => string) | undefined;
        },
        {
          component?:
            | ReactNode
            | FC<{
                className?: string | undefined;
                directories: Item[];
              }>;
          emptyResult?: ReactNode | FC;
          error?: string | ((...args: unknown[]) => string) | undefined;
          loading?: ReactNode | FC;
          placeholder?: string | ((...args: unknown[]) => string) | undefined;
        }
      >
    >;
    serverSideError: z.ZodOptional<
      z.ZodObject<
        {
          content: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
          labels: z.ZodOptional<z.ZodString>;
        },
        "strict",
        z.ZodTypeAny,
        {
          content?: ReactNode | FC;
          labels?: string | undefined;
        },
        {
          content?: ReactNode | FC;
          labels?: string | undefined;
        }
      >
    >;
    sidebar: z.ZodOptional<
      z.ZodObject<
        {
          defaultMenuCollapseLevel: z.ZodOptional<z.ZodNumber>;
          titleComponent: z.ZodOptional<
            z.ZodType<
              | ReactNode
              | FC<{
                  title: string;
                  type: string;
                  route: string;
                }>,
              z.ZodTypeDef,
              | ReactNode
              | FC<{
                  title: string;
                  type: string;
                  route: string;
                }>
            >
          >;
          toggleButton: z.ZodOptional<z.ZodBoolean>;
        },
        "strict",
        z.ZodTypeAny,
        {
          defaultMenuCollapseLevel?: number | undefined;
          titleComponent?:
            | ReactNode
            | FC<{
                title: string;
                type: string;
                route: string;
              }>;
          toggleButton?: boolean | undefined;
        },
        {
          defaultMenuCollapseLevel?: number | undefined;
          titleComponent?:
            | ReactNode
            | FC<{
                title: string;
                type: string;
                route: string;
              }>;
          toggleButton?: boolean | undefined;
        }
      >
    >;
    themeSwitch: z.ZodOptional<
      z.ZodObject<
        {
          component: z.ZodOptional<
            z.ZodType<
              | ReactNode
              | FC<{
                  lite?: boolean | undefined;
                  className?: string | undefined;
                }>,
              z.ZodTypeDef,
              | ReactNode
              | FC<{
                  lite?: boolean | undefined;
                  className?: string | undefined;
                }>
            >
          >;
          useOptions: z.ZodOptional<
            z.ZodUnion<
              [
                z.ZodObject<
                  {
                    light: z.ZodString;
                    dark: z.ZodString;
                    system: z.ZodString;
                  },
                  "strict",
                  z.ZodTypeAny,
                  {
                    dark: string;
                    light: string;
                    system: string;
                  },
                  {
                    dark: string;
                    light: string;
                    system: string;
                  }
                >,
                z.ZodFunction<
                  z.ZodTuple<[], z.ZodUnknown>,
                  z.ZodObject<
                    {
                      light: z.ZodString;
                      dark: z.ZodString;
                      system: z.ZodString;
                    },
                    "strict",
                    z.ZodTypeAny,
                    {
                      dark: string;
                      light: string;
                      system: string;
                    },
                    {
                      dark: string;
                      light: string;
                      system: string;
                    }
                  >
                >
              ]
            >
          >;
        },
        "strict",
        z.ZodTypeAny,
        {
          component?:
            | ReactNode
            | FC<{
                lite?: boolean | undefined;
                className?: string | undefined;
              }>;
          useOptions?:
            | {
                dark: string;
                light: string;
                system: string;
              }
            | ((...args: unknown[]) => {
                dark: string;
                light: string;
                system: string;
              })
            | undefined;
        },
        {
          component?:
            | ReactNode
            | FC<{
                lite?: boolean | undefined;
                className?: string | undefined;
              }>;
          useOptions?:
            | {
                dark: string;
                light: string;
                system: string;
              }
            | ((...args: unknown[]) => {
                dark: string;
                light: string;
                system: string;
              })
            | undefined;
        }
      >
    >;
    toc: z.ZodOptional<
      z.ZodObject<
        {
          component: z.ZodOptional<
            z.ZodType<ReactNode | FC<TOCProps>, z.ZodTypeDef, ReactNode | FC<TOCProps>>
          >;
          extraContent: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
          float: z.ZodOptional<z.ZodBoolean>;
          headingComponent: z.ZodOptional<
            z.ZodOptional<
              z.ZodType<
                FC<{
                  id: string;
                  children: string;
                }>,
                z.ZodTypeDef,
                FC<{
                  id: string;
                  children: string;
                }>
              >
            >
          >;
          title: z.ZodOptional<z.ZodType<ReactNode | FC, z.ZodTypeDef, ReactNode | FC>>;
        },
        "strict",
        z.ZodTypeAny,
        {
          component?: ReactNode | FC<TOCProps>;
          extraContent?: ReactNode | FC;
          float?: boolean | undefined;
          headingComponent?:
            | FC<{
                id: string;
                children: string;
              }>
            | undefined;
          title?: ReactNode | FC;
        },
        {
          component?: ReactNode | FC<TOCProps>;
          extraContent?: ReactNode | FC;
          float?: boolean | undefined;
          headingComponent?:
            | FC<{
                id: string;
                children: string;
              }>
            | undefined;
          title?: ReactNode | FC;
        }
      >
    >;
    useNextSeoProps: z.ZodOptional<
      z.ZodType<() => NextSeoProps | void, z.ZodTypeDef, () => NextSeoProps | void>
    >;
    i18n: z.ZodOptional<
      z.ZodArray<
        z.ZodObject<
          {
            direction: z.ZodOptional<z.ZodEnum<["ltr", "rtl"]>>;
            locale: z.ZodString;
            text: z.ZodString;
          },
          "strict",
          z.ZodTypeAny,
          {
            text: string;
            locale: string;
            direction?: "ltr" | "rtl" | undefined;
          },
          {
            text: string;
            locale: string;
            direction?: "ltr" | "rtl" | undefined;
          }
        >,
        "many"
      >
    >;
  },
  "strict",
  z.ZodTypeAny,
  {
    navigation?:
      | boolean
      | {
          next: boolean;
          prev: boolean;
        }
      | undefined;
    banner?:
      | {
          dismissible?: boolean | undefined;
          key?: string | undefined;
          text?: ReactNode | FC;
        }
      | undefined;
    chat?:
      | {
          icon?: ReactNode | FC;
          link?: string | undefined;
        }
      | undefined;
    components?: Record<string, FC> | undefined;
    darkMode?: boolean | undefined;
    direction?: "ltr" | "rtl" | undefined;
    docsRepositoryBase?: string | undefined;
    editLink?:
      | {
          component?:
            | FC<{
                children: ReactNode;
                className?: string | undefined;
                filePath?: string | undefined;
              }>
            | undefined;
          text?: ((...args: unknown[]) => string) | undefined;
        }
      | undefined;
    faviconGlyph?: string | undefined;
    feedback?:
      | {
          content?: ((...args: unknown[]) => string) | undefined;
          labels?: string | undefined;
          useLink?: ((...args: unknown[]) => string) | undefined;
        }
      | undefined;
    footer?:
      | {
          component?: ReactNode | FC;
          govMy?: ((...args: unknown[]) => string) | undefined;
          dtsa?: ((...args: unknown[]) => string) | undefined;
          openSource?: ((...args: unknown[]) => string) | undefined;
          fe?: ((...args: unknown[]) => string) | undefined;
          be?: ((...args: unknown[]) => string) | undefined;
          uiux?: ((...args: unknown[]) => string) | undefined;
          openData?: ((...args: unknown[]) => string) | undefined;
          guide?: ((...args: unknown[]) => string) | undefined;
          tos?: ((...args: unknown[]) => string) | undefined;
        }
      | undefined;
    gitTimestamp?:
      | ReactNode
      | FC<{
          timestamp: Date;
        }>;
    head?: ReactNode | FC;
    logo?: ReactNode | FC;
    logoLink?: string | boolean | undefined;
    main?:
      | FC<{
          children: ReactNode;
        }>
      | undefined;
    navbar?:
      | {
          component?: ReactNode | FC<NavBarProps>;
          extraContent?: ReactNode | FC;
        }
      | undefined;
    nextThemes?:
      | {
          defaultTheme?: string | undefined;
          forcedTheme?: string | undefined;
          storageKey?: string | undefined;
        }
      | undefined;
    notFound?:
      | {
          content?: ReactNode | FC;
          labels?: string | undefined;
        }
      | undefined;
    primaryHue?:
      | number
      | {
          dark: number;
          light: number;
        }
      | undefined;
    project?:
      | {
          icon?: ReactNode | FC;
          link?: string | undefined;
        }
      | undefined;
    search?:
      | {
          component?:
            | ReactNode
            | FC<{
                className?: string | undefined;
                directories: Item[];
              }>;
          emptyResult?: ReactNode | FC;
          error?: string | ((...args: unknown[]) => string) | undefined;
          loading?: ReactNode | FC;
          placeholder?: string | ((...args: unknown[]) => string) | undefined;
        }
      | undefined;
    serverSideError?:
      | {
          content?: ReactNode | FC;
          labels?: string | undefined;
        }
      | undefined;
    sidebar?:
      | {
          defaultMenuCollapseLevel?: number | undefined;
          titleComponent?:
            | ReactNode
            | FC<{
                title: string;
                type: string;
                route: string;
              }>;
          toggleButton?: boolean | undefined;
        }
      | undefined;
    themeSwitch?:
      | {
          component?:
            | ReactNode
            | FC<{
                lite?: boolean | undefined;
                className?: string | undefined;
              }>;
          useOptions?:
            | {
                dark: string;
                light: string;
                system: string;
              }
            | ((...args: unknown[]) => {
                dark: string;
                light: string;
                system: string;
              })
            | undefined;
        }
      | undefined;
    toc?:
      | {
          component?: ReactNode | FC<TOCProps>;
          extraContent?: ReactNode | FC;
          float?: boolean | undefined;
          headingComponent?:
            | FC<{
                id: string;
                children: string;
              }>
            | undefined;
          title?: ReactNode | FC;
        }
      | undefined;
    useNextSeoProps?: (() => NextSeoProps | void) | undefined;
    i18n?:
      | {
          text: string;
          locale: string;
          direction?: "ltr" | "rtl" | undefined;
        }[]
      | undefined;
  },
  {
    navigation?:
      | boolean
      | {
          next: boolean;
          prev: boolean;
        }
      | undefined;
    banner?:
      | {
          dismissible?: boolean | undefined;
          key?: string | undefined;
          text?: ReactNode | FC;
        }
      | undefined;
    chat?:
      | {
          icon?: ReactNode | FC;
          link?: string | undefined;
        }
      | undefined;
    components?: Record<string, FC> | undefined;
    darkMode?: boolean | undefined;
    direction?: "ltr" | "rtl" | undefined;
    docsRepositoryBase?: string | undefined;
    editLink?:
      | {
          component?:
            | FC<{
                children: ReactNode;
                className?: string | undefined;
                filePath?: string | undefined;
              }>
            | undefined;
          text?: ((...args: unknown[]) => string) | undefined;
        }
      | undefined;
    faviconGlyph?: string | undefined;
    feedback?:
      | {
          content?: ((...args: unknown[]) => string) | undefined;
          labels?: string | undefined;
          useLink?: ((...args: unknown[]) => string) | undefined;
        }
      | undefined;
    footer?:
      | {
          component?: ReactNode | FC;
          govMy?: ((...args: unknown[]) => string) | undefined;
          dtsa?: ((...args: unknown[]) => string) | undefined;
          openSource?: ((...args: unknown[]) => string) | undefined;
          fe?: ((...args: unknown[]) => string) | undefined;
          be?: ((...args: unknown[]) => string) | undefined;
          uiux?: ((...args: unknown[]) => string) | undefined;
          openData?: ((...args: unknown[]) => string) | undefined;
          guide?: ((...args: unknown[]) => string) | undefined;
          tos?: ((...args: unknown[]) => string) | undefined;
        }
      | undefined;
    gitTimestamp?:
      | ReactNode
      | FC<{
          timestamp: Date;
        }>;
    head?: ReactNode | FC;
    logo?: ReactNode | FC;
    logoLink?: string | boolean | undefined;
    main?:
      | FC<{
          children: ReactNode;
        }>
      | undefined;
    navbar?:
      | {
          component?: ReactNode | FC<NavBarProps>;
          extraContent?: ReactNode | FC;
        }
      | undefined;
    nextThemes?:
      | {
          defaultTheme?: string | undefined;
          forcedTheme?: string | undefined;
          storageKey?: string | undefined;
        }
      | undefined;
    notFound?:
      | {
          content?: ReactNode | FC;
          labels?: string | undefined;
        }
      | undefined;
    primaryHue?:
      | number
      | {
          dark: number;
          light: number;
        }
      | undefined;
    project?:
      | {
          icon?: ReactNode | FC;
          link?: string | undefined;
        }
      | undefined;
    search?:
      | {
          component?:
            | ReactNode
            | FC<{
                className?: string | undefined;
                directories: Item[];
              }>;
          emptyResult?: ReactNode | FC;
          error?: string | ((...args: unknown[]) => string) | undefined;
          loading?: ReactNode | FC;
          placeholder?: string | ((...args: unknown[]) => string) | undefined;
        }
      | undefined;
    serverSideError?:
      | {
          content?: ReactNode | FC;
          labels?: string | undefined;
        }
      | undefined;
    sidebar?:
      | {
          defaultMenuCollapseLevel?: number | undefined;
          titleComponent?:
            | ReactNode
            | FC<{
                title: string;
                type: string;
                route: string;
              }>;
          toggleButton?: boolean | undefined;
        }
      | undefined;
    themeSwitch?:
      | {
          component?:
            | ReactNode
            | FC<{
                lite?: boolean | undefined;
                className?: string | undefined;
              }>;
          useOptions?:
            | {
                dark: string;
                light: string;
                system: string;
              }
            | ((...args: unknown[]) => {
                dark: string;
                light: string;
                system: string;
              })
            | undefined;
        }
      | undefined;
    toc?:
      | {
          component?: ReactNode | FC<TOCProps>;
          extraContent?: ReactNode | FC;
          float?: boolean | undefined;
          headingComponent?:
            | FC<{
                id: string;
                children: string;
              }>
            | undefined;
          title?: ReactNode | FC;
        }
      | undefined;
    useNextSeoProps?: (() => NextSeoProps | void) | undefined;
    i18n?:
      | {
          text: string;
          locale: string;
          direction?: "ltr" | "rtl" | undefined;
        }[]
      | undefined;
  }
>;
type DocsThemeConfig = z.infer<typeof themeSchema>;
type PartialDocsThemeConfig = z.infer<typeof publicThemeSchema>;

type Config<FrontMatterType = FrontMatter> = DocsThemeConfig &
  Pick<PageOpts<FrontMatterType>, "flexsearch" | "newNextLinkBehavior" | "title" | "frontMatter">;
declare function useConfig<FrontMatterType = FrontMatter>(): Config<FrontMatterType>;

type AnchorProps = Omit<ComponentProps<"a">, "ref"> & {
  newWindow?: boolean;
};

declare const Link: ({ href, className, ...props }: AnchorProps) => react_jsx_runtime.JSX.Element;

declare function Bleed({ full, children }: { full: boolean; children: ReactNode }): ReactElement;

declare function Card({
  children,
  title,
  icon,
  image,
  arrow,
  href,
  ...props
}: {
  children: ReactNode;
  title: string;
  icon: ReactNode;
  image?: boolean;
  arrow?: boolean;
  href: string;
}): react_jsx_runtime.JSX.Element;
declare function Cards({
  children,
  num,
  className,
  style,
  ...props
}: {
  num?: number;
} & ComponentProps<"div">): react_jsx_runtime.JSX.Element;

declare function Collapse({
  children,
  className,
  isOpen,
  horizontal,
}: {
  children: ReactNode;
  className?: string;
  isOpen: boolean;
  horizontal?: boolean;
}): ReactElement;

interface FolderProps {
  name: string;
  label?: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  children: ReactNode;
}
interface FileProps {
  name: string;
  label?: ReactElement;
  active?: boolean;
}
declare const FileTree: (({ children }: { children: ReactNode }) => ReactElement) & {
  Folder: react.NamedExoticComponent<FolderProps>;
  File: react.NamedExoticComponent<FileProps>;
};

declare function NotFoundPage(): ReactElement | null;

declare function ServerSideErrorPage(): ReactElement | null;

declare const SkipNavLink: react.ForwardRefExoticComponent<
  Omit<
    react.DetailedHTMLProps<react.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>,
    "children" | "ref" | "href"
  > & {
    label?: string | undefined;
    styled?: boolean | undefined;
  } & react.RefAttributes<HTMLAnchorElement>
>;
type SkipNavContentProps = Omit<ComponentProps<"div">, "ref" | "children">;
declare const SkipNavContent: react.ForwardRefExoticComponent<
  SkipNavContentProps & react.RefAttributes<HTMLDivElement>
>;

declare function Steps({ children, className, ...props }: ComponentProps<"div">): ReactElement;

type TabItem = {
  label: ReactElement;
  disabled?: boolean;
};
declare function Tabs({
  items,
  selectedIndex,
  defaultIndex,
  onChange,
  children,
}: {
  items: ReactNode[] | ReadonlyArray<ReactNode> | TabItem[];
  selectedIndex?: number;
  defaultIndex?: number;
  onChange?: (index: number) => void;
  children: ReactNode;
}): ReactElement;
declare function Tab({ children, ...props }: Parameters<typeof Tab$1.Panel>[0]): ReactElement;

type ThemeSwitchProps = {
  lite?: boolean;
  className?: string;
};
declare function ThemeSwitch({ lite, className }: ThemeSwitchProps): ReactElement;

declare function Layout({ children, ...context }: NextraThemeLayoutProps): ReactElement;

export {
  Bleed,
  Card,
  Cards,
  Collapse,
  PartialDocsThemeConfig as DocsThemeConfig,
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
};
