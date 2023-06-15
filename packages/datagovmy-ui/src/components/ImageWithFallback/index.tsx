import { clx } from "src/lib/helpers";
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
        "border-outline dark:border-outlineHover-dark h-5 w-[30px] rounded border bg-white",
        inline ? "mr-2 inline-block" : "absolute"
      )}
    >
      {children ?? <div className="text-center font-black leading-4 text-black">?</div>}
    </div>
  );
};
interface ImageWithFallbackProps extends ImageProps {
  fallback?: ReactNode;
  inline?: boolean;
}

const ImageWithFallback = ({ fallback, alt, src, inline, ...props }: ImageWithFallbackProps) => {
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
