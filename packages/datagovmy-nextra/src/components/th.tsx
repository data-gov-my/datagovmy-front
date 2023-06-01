import type { ComponentProps } from "react";

export const Th = ({ className = "", ...props }: ComponentProps<"th">) => (
  <th
    className={
      "m-0 border border-gray-300 px-4 py-2 font-semibold dark:border-gray-600 " + className
    }
    {...props}
  />
);
