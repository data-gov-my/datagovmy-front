import { ChevronRightIcon } from "@heroicons/react/20/solid";
import Link, { LinkProps } from "next/link";
import { FunctionComponent, HTMLAttributeAnchorTarget, ReactNode } from "react";

interface AtProps extends LinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  scrollTop?: boolean;
  enableIcon?: boolean;
  external?: boolean;
  target?: HTMLAttributeAnchorTarget;
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
  target,
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
    <a href={href} className={className} onClick={onClick} target={target ?? "_blank"}>
      {content}
    </a>
  ) : (
    <Link
      href={href}
      scroll={scrollTop}
      className={className}
      onClick={onClick}
      prefetch={prefetch}
      target={target}
    >
      {content}
    </Link>
  );
};

export default At;
