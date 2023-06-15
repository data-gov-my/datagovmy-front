import { FunctionComponent, ReactNode } from "react";
import Link, { LinkProps } from "next/link";

interface AtProps extends LinkProps {
  href: string;
  className?: string;
  children: ReactNode;
  scrollTop?: boolean;
}

const At: FunctionComponent<AtProps> = ({ href, children, className, scrollTop = true }) => {
  return (
    <Link href={href} scroll={scrollTop} className={className}>
      {children}
    </Link>
  );
};

export default At;
