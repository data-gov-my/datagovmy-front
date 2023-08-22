import { clx } from "../../lib/helpers";
import Image, { ImageProps } from "next/image";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";

interface FallbackProps {
  children?: ReactNode;
}
const Fallback: FunctionComponent<FallbackProps> = ({ children }) => {
  return (
    <div className="border-outline dark:border-outlineHover-dark h-5 w-8 rounded border bg-white">
      {children ?? (
        <div className="flex h-full items-center justify-center text-sm font-black text-black">
          ?
        </div>
      )}
    </div>
  );
};
interface ImageWithFallbackProps extends ImageProps {
  fallback?: ReactNode;
}

const ImageWithFallback: FunctionComponent<ImageWithFallbackProps> = ({
  fallback,
  alt,
  src,
  ...props
}) => {
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
