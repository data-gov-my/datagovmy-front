import throttle from "lodash/throttle";
import { FunctionComponent, ReactNode, createContext, useEffect, useRef, useState } from "react";

interface WindowContextProps {
  breakpoint: number;
  scroll: {
    x: number;
    y: number;
  };
}

interface WindowProviderProps {
  children: ReactNode;
}

export const WindowContext = createContext<WindowContextProps>({
  breakpoint: 1536,
  scroll: {
    x: 0,
    y: 0,
  },
});

export const WindowProvider: FunctionComponent<WindowProviderProps> = ({ children }) => {
  const [breakpoint, setBreakpoint] = useState<WindowContextProps["breakpoint"]>(1536);
  const [scroll, setScroll] = useState<WindowContextProps["scroll"]>({ x: 0, y: 0 });

  useEffect(() => {
    function handleResize() {
      setBreakpoint(window.innerWidth);
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

  return <WindowContext.Provider value={{ breakpoint, scroll }}>{children}</WindowContext.Provider>;
};
