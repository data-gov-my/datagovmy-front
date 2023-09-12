import { clx } from "../../lib/helpers";
import type { ComponentProps, ReactNode } from "react";
import { forwardRef } from "react";

type TextareaProps = ComponentProps<"textarea"> & { suffix?: ReactNode };

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, suffix, ...props }, forwardedRef) => (
    <div className="relative flex w-full items-center text-black contrast-more:text-gray-800 dark:text-gray-300 contrast-more:dark:text-gray-300">
      <textarea
        ref={forwardedRef}
        spellCheck={false}
        className={clx(
          "block w-full appearance-none rounded-lg px-3 py-3 transition-colors",
          "text-base leading-tight md:text-sm",
          "dark:border-outlineHover-dark dark:bg-background-dark ",
          "dark:focus:bg-dark focus:bg-white",
          "placeholder:text-gray-500 dark:placeholder:text-gray-400",
          "contrast-more:border contrast-more:border-current",
          className
        )}
        {...props}
      />
      {suffix}
    </div>
  )
);

Textarea.displayName = "Textarea";

export default Textarea;
