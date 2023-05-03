import { FunctionComponent, ReactNode, createContext, useEffect, useState } from "react";

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
  const [scroll, setScroll] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleResize() {
      setBreakpoint(window.innerWidth);
    }
    function handleScroll() {
      setScroll({ x: window.scrollX, y: window.scrollY });
    }

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    handleResize();
    handleScroll();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return <WindowContext.Provider value={{ breakpoint, scroll }}>{children}</WindowContext.Provider>;
};
