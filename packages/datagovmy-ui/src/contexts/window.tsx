import throttle from "lodash/throttle";
import { FunctionComponent, ReactNode, createContext, useEffect, useState } from "react";

interface WindowContextProps {
  size: {
    width: number;
    height: number;
  };
  scroll: {
    x: number;
    y: number;
  };
}

interface WindowProviderProps {
  children: ReactNode;
}

export const WindowContext = createContext<WindowContextProps>({
  size: {
    width: 1536,
    height: 1000,
  },
  scroll: {
    x: 0,
    y: 0,
  },
});

/**
 * Note: Re-renders Table on Scroll
 */
export const WindowProvider: FunctionComponent<WindowProviderProps> = ({ children }) => {
  const [size, setSize] = useState<WindowContextProps["size"]>({ width: 1536, height: 0 });
  const [scroll, setScroll] = useState<WindowContextProps["scroll"]>({ x: 0, y: 0 });

  useEffect(() => {
    function handleResize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    const handleScroll = throttle(() => {
      setScroll({ x: window.scrollX, y: window.scrollY });
    }, 100);

    handleResize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <WindowContext.Provider value={{ size, scroll }}>{children}</WindowContext.Provider>;
};
