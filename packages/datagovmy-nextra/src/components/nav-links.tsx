import cn from "clsx";
import { ArrowRightIcon } from "nextra/icons";
import type { Item } from "nextra/normalize-pages";
import type { ReactElement } from "react";
import { useConfig } from "../contexts";
import type { DocsThemeConfig } from "../index";
import { Anchor } from "./anchor";
import Button from "./button";

interface NavLinkProps {
  currentIndex: number;
  flatDirectories: Item[];
}

const classes = {
  link: cn(
    "flex max-w-[50%] items-center gap-1 py-4 text-base font-medium text-gray-600 transition-colors [word-break:break-word] hover:text-primary-600 dark:text-gray-300 text-sm"
  ),
  icon: cn("inline h-4 shrink-0"),
};

export const NavLinks = ({ flatDirectories, currentIndex }: NavLinkProps): ReactElement | null => {
  const config = useConfig();
  const nav = config.navigation;
  const navigation: Exclude<DocsThemeConfig["navigation"], boolean> =
    typeof nav === "boolean" ? { prev: nav, next: nav } : nav;
  let prev = navigation.prev && flatDirectories[currentIndex - 1];
  let next = navigation.next && flatDirectories[currentIndex + 1];

  if (prev && !prev.isUnderCurrentDocsTree) prev = false;
  if (next && !next.isUnderCurrentDocsTree) next = false;

  if (!prev && !next) return null;

  return (
    <div
      className={cn(
        "mb-8 flex items-center border-t pt-8 dark:border-neutral-800",
        "contrast-more:border-neutral-400 dark:contrast-more:border-neutral-400",
        "print:hidden"
      )}
    >
      {prev && (
        <Anchor
          href={prev.route}
          title={prev.title}
          className={cn(classes.link, "ltr:pr-4 rtl:pl-4")}
        >
          <Button variant="default">
            <ArrowRightIcon className={cn(classes.icon, "ltr:rotate-180")} />
            {prev.title}
          </Button>
        </Anchor>
      )}
      {next && (
        <Anchor
          href={next.route}
          title={next.title}
          className={cn(
            classes.link,
            "ltr:ml-auto ltr:pl-4 ltr:text-right rtl:mr-auto rtl:pr-4 rtl:text-left"
          )}
        >
          <Button variant="default">
            {next.title}
            <ArrowRightIcon className={cn(classes.icon, "rtl:rotate-180")} />
          </Button>
        </Anchor>
      )}
    </div>
  );
};
