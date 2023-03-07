import { FunctionComponent, ReactNode } from "react";
import Link, { LinkProps } from "next/link";
import { ChevronRightIcon } from "@heroicons/react/20/solid";

interface AtProps extends LinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  scrollTop?: boolean;
  enableIcon?: boolean;
}

const At: FunctionComponent<AtProps> = ({
  href,
  children,
  className,
  scrollTop = true,
  enableIcon = false,
}) => {
  return (
    <Link href={href} scroll={scrollTop} className={className}>
      {enableIcon ? (
        <div className="group flex items-center gap-2">
          {children}
          <ChevronRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </div>
      ) : (
        children
      )}
    </Link>
  );
};

export default At;
