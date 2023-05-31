import cn from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { forwardRef } from "react";

type InputProps = ComponentProps<"input"> & { suffix?: ReactNode };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, suffix, ...props }, forwardedRef) => (
    <div className="relative flex items-center text-gray-900 contrast-more:text-gray-800 dark:text-gray-300 contrast-more:dark:text-gray-300">
      <input
        ref={forwardedRef}
        spellCheck={false}
        className={cn(
          className,
          "block w-full appearance-none rounded-lg px-3 py-2 transition-colors",
          "text-base leading-tight md:text-sm",
          "bg-black/[.05] dark:bg-gray-50/10",
          "dark:focus:bg-dark focus:bg-white",
          "placeholder:text-gray-500 dark:placeholder:text-gray-400",
          "contrast-more:border contrast-more:border-current"
        )}
        {...props}
      />
      {suffix}
    </div>
  )
);

Input.displayName = "Input";
