import cn from "clsx";
import type { Heading } from "nextra";
import type { ReactElement } from "react";
import { useEffect, useMemo, useRef } from "react";
import scrollIntoView from "scroll-into-view-if-needed";
import { useActiveAnchor, useConfig } from "../contexts";
import { renderComponent } from "../utils";
import { Anchor } from "./anchor";

export type TOCProps = {
  headings: Heading[];
  filePath: string;
};

const linkClassName = cn(
  "text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100",
  "contrast-more:text-gray-800 contrast-more:dark:text-gray-50"
);

export function TOC({ headings, filePath }: TOCProps): ReactElement {
  const activeAnchor = useActiveAnchor();
  const config = useConfig();
  const tocRef = useRef<HTMLDivElement>(null);

  const items = useMemo(() => headings.filter(heading => heading.depth > 1), [headings]);

  const hasHeadings = items.length > 0;
  const hasMetaInfo = Boolean(
    config.feedback.content || config.editLink.component || config.toc.extraContent
  );

  const activeSlug = Object.entries(activeAnchor).find(([, { isActive }]) => isActive)?.[0];

  useEffect(() => {
    if (!activeSlug) return;
    const anchor = tocRef.current?.querySelector(`li > a[href="#${activeSlug}"]`);

    if (anchor) {
      scrollIntoView(anchor, {
        behavior: "smooth",
        block: "center",
        inline: "center",
        scrollMode: "always",
        boundary: tocRef.current,
      });
    }
  }, [activeSlug]);

  return (
    <div
      ref={tocRef}
      className={cn(
        "nextra-scrollbar sticky top-16 overflow-y-auto pr-4 pt-6 text-sm [hyphens:auto]",
        "max-h-[calc(100vh-var(--nextra-navbar-height)-env(safe-area-inset-bottom))] ltr:-mr-4 rtl:-ml-4"
      )}
    >
      {hasHeadings && (
        <>
          <p className="mb-4 font-semibold tracking-tight">{renderComponent(config.toc.title)}</p>
          <ul>
            {items.map(({ id, value, depth }) => (
              <li className="my-2 scroll-my-6 scroll-py-6" key={id}>
                <a
                  href={`#${id}`}
                  className={cn(
                    {
                      2: "font-semibold",
                      3: "ltr:pl-4 rtl:pr-4",
                      4: "ltr:pl-8 rtl:pr-8",
                      5: "ltr:pl-12 rtl:pr-12",
                      6: "ltr:pl-16 rtl:pr-16",
                    }[depth as Exclude<typeof depth, 1>],
                    "inline-block",
                    activeAnchor[id]?.isActive
                      ? "text-primary-600 contrast-more:!text-primary-600 subpixel-antialiased"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300",
                    "w-full break-words contrast-more:text-gray-900 contrast-more:underline contrast-more:dark:text-gray-50"
                  )}
                >
                  {config.toc.headingComponent?.({
                    id,
                    children: value,
                  }) ?? value}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      {hasMetaInfo && (
        <div
          className={cn(
            hasHeadings &&
              "dark:bg-dark mt-8 border-t bg-white pt-8 shadow-[0_-12px_16px_white] dark:shadow-[0_-12px_16px_#111]",
            "sticky bottom-0 flex flex-col items-start gap-2 pb-8 dark:border-neutral-800",
            "contrast-more:border-t contrast-more:border-neutral-400 contrast-more:shadow-none contrast-more:dark:border-neutral-400"
          )}
        >
          {config.feedback.content ? (
            <Anchor className={linkClassName} href={config.feedback.useLink()} newWindow>
              {renderComponent(config.feedback.content)}
            </Anchor>
          ) : null}

          {renderComponent(config.editLink.component, {
            filePath,
            className: linkClassName,
            children: renderComponent(config.editLink.text),
          })}

          {renderComponent(config.toc.extraContent)}
        </div>
      )}
    </div>
  );
}
