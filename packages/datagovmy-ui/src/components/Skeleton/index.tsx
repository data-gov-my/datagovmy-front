import { clx } from "../../lib/helpers";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clx(
        "relative h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800",
        "after:absolute after:inset-0",
        "after:content-['']",
        "after:-translate-x-full",
        "after:animate-[shimmer_2s_infinite]",
        "after:bg-gradient-to-r",
        "from-[#F4F4F5] from-0% via-[#D4D4D8] via-50% to-[#F4F4F5] to-100% dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-800/50",
        className
      )}
      {...props}
    />
  );
}

export default Skeleton;
