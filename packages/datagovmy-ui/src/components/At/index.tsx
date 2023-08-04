import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link, { LinkProps } from "next/link";
import { FunctionComponent, ReactNode } from "react";

interface AtProps extends LinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  scrollTop?: boolean;
  enableIcon?: boolean;
  external?: boolean;
}

const At: FunctionComponent<AtProps> = ({
  href,
  children,
  className,
  scrollTop = true,
  enableIcon = false,
  onClick,
  external,
  prefetch,
}) => {
  const content = (
    <>
      {enableIcon ? (
        <div className="group flex items-center gap-2">
          {children}
          <ChevronRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
        </div>
      ) : (
        children
      )}
    </>
  );
  return external ? (
    <a href={href} className={className} onClick={onClick} target="_blank">
      {content}
    </a>
  ) : (
    <Link
      href={href}
      scroll={scrollTop}
      className={className}
      onClick={onClick}
      prefetch={prefetch}
    >
      {content}
    </Link>
  );
};

export default At;
