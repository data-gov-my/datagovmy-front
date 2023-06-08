import { FunctionComponent, ReactNode } from "react";

type ContainerProps = {
  background?: string;
  className?: string;
  children: ReactNode;
};

const Container: FunctionComponent<ContainerProps> = ({ background, className, children }) => {
  return (
    <div className={`flex h-full w-full justify-center ${background ?? ""}`}>
      <div className={`h-full w-full max-w-screen-2xl px-3 md:px-4.5 lg:px-6 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default Container;
