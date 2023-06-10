import cn from "clsx";
import { XIcon } from "nextra/icons";
import type { ReactElement } from "react";
import { useConfig } from "../contexts";
import { renderComponent } from "../utils";

export function Banner(): ReactElement | null {
  const { banner } = useConfig();
  if (!banner.text) {
    return null;
  }
  const hideBannerScript = `try{if(localStorage.getItem(${JSON.stringify(
    banner.key
  )})==='0'){document.body.classList.add('nextra-banner-hidden')}}catch(e){}`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: hideBannerScript }} />
      <div
        className={cn(
          "nextra-banner-container sticky top-0 z-20 flex items-center md:relative",
          "h-[var(--nextra-banner-height)] [body.nextra-banner-hidden_&]:hidden",
          "bg-neutral-900 text-slate-50 dark:bg-[linear-gradient(1deg,#383838,#212121)] dark:text-white",
          "px-2 ltr:pl-10 rtl:pr-10 print:hidden"
        )}
      >
        <div className="w-full truncate px-4 text-center text-sm font-medium">
          {renderComponent(banner.text)}
        </div>
        {banner.dismissible && (
          <button
            type="button"
            aria-label="Dismiss banner"
            className="h-8 w-8 opacity-80 hover:opacity-100"
            onClick={() => {
              try {
                localStorage.setItem(banner.key, "0");
              } catch {
                /* ignore */
              }
              document.body.classList.add("nextra-banner-hidden");
            }}
          >
            <XIcon className="mx-auto h-4 w-4" />
          </button>
        )}
      </div>
    </>
  );
}
