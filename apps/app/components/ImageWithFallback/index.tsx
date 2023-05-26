import Image, { ImageProps } from "next/image";
import { FunctionComponent, ReactNode, useEffect, useState } from "react";

interface FallbackProps {
  children?: ReactNode;
}
const Fallback: FunctionComponent<FallbackProps> = ({ children }) => {
  return (
    <div className="border-outline dark:border-outlineHover-dark h-5 w-[30px] rounded border bg-white">
      {children ?? <div className="text-center font-black leading-4 text-black">?</div>}
    </div>
  );
};
interface ImageWithFallbackProps extends ImageProps {
  fallback: ReactNode;
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
