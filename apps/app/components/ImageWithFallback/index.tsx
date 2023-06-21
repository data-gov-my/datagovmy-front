import { clx } from "@lib/helpers";
import Image, { ImageProps } from "next/image";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";

interface FallbackProps {
  children?: ReactNode;
  inline?: boolean;
}
const Fallback: FunctionComponent<FallbackProps> = ({ children, inline = false }) => {
  return (
    <div className="border-outline dark:border-outlineHover-dark h-4.5 inline-block w-[32px] rounded border bg-white">
      {children ?? <div className="text-center font-black leading-4 text-black">?</div>}
    </div>
  );
};
interface ImageWithFallbackProps extends ImageProps {
  fallback?: ReactNode;
}

const ImageWithFallback = ({ fallback, alt, src, ...props }: ImageWithFallbackProps) => {
  const [error, setError] = useState<React.SyntheticEvent<HTMLImageElement, Event> | null>(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return error ? (
    <Fallback>{fallback}</Fallback>
  ) : (
    <Image alt={alt} onError={setError} src={src} {...props} />
  );
};
export default ImageWithFallback;
