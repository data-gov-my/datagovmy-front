import throttle from "lodash/throttle";
import { FunctionComponent, ReactNode, createContext, useEffect, useState } from "react";

interface WindowContextProps {
  windowWidth: number;
  scroll: {
    x: number;
    y: number;
  };
}

interface WindowProviderProps {
  children: ReactNode;
}

export const WindowContext = createContext<WindowContextProps>({
  windowWidth: 1536,
  scroll: {
    x: 0,
    y: 0,
  },
});

/**
 * Note: Re-renders Table on Scroll
 */
export const WindowProvider: FunctionComponent<WindowProviderProps> = ({ children }) => {
  const [windowWidth, setWindowWidth] = useState<WindowContextProps["windowWidth"]>(1536);
  const [scroll, setScroll] = useState<WindowContextProps["scroll"]>({ x: 0, y: 0 });

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    const handleScroll = throttle(() => {
      setScroll({ x: window.scrollX, y: window.scrollY });
    }, 100);

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <WindowContext.Provider value={{ windowWidth, scroll }}>{children}</WindowContext.Provider>
  );
};
