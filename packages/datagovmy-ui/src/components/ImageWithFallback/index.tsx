import { clx } from "../../lib/helpers";
import Image, { ImageProps } from "next/image";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";

interface FallbackProps {
  children?: ReactNode;
  inline?: boolean;
}
const Fallback: FunctionComponent<FallbackProps> = ({ children, inline = false }) => {
  return (
    <div
      className={clx(
        "border-outline dark:border-outlineHover-dark h-5 w-8 rounded border bg-white",
        inline && "mr-2 inline-block"
      )}
    >
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
  inline?: boolean;
}

const ImageWithFallback: FunctionComponent<ImageWithFallbackProps> = ({
  fallback,
  alt,
  src,
  inline,
  ...props
}) => {
  const [error, setError] = useState<React.SyntheticEvent<HTMLImageElement, Event> | null>(null);

  useEffect(() => {
    setError(null);
  }, [src]);

  return error ? (
    <Fallback inline={inline}>{fallback}</Fallback>
  ) : (
    <Image alt={alt} onError={setError} src={src} {...props} />
  );
};
export default ImageWithFallback;
