import cn from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { forwardRef } from "react";

type TextareaProps = ComponentProps<"textarea"> & { suffix?: ReactNode };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, suffix, ...props }, forwardedRef) => (
    <div className="relative flex w-full items-center text-gray-900 contrast-more:text-gray-800 dark:text-gray-300 contrast-more:dark:text-gray-300">
      <textarea
        ref={forwardedRef}
        spellCheck={false}
        className={cn(
          "block w-full appearance-none rounded-lg px-3 py-2 transition-colors",
          "text-base leading-tight md:text-sm",
          "dark:border-outlineHover-dark dark:bg-background-dark bg-black/[.05]",
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
