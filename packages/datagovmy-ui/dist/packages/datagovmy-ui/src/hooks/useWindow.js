import { j as d } from "../../../../external/react/jsx-runtime.js";
import c from "../../../../external/lodash/throttle.js";
import { createContext as w, useState as t, useEffect as a } from "react";
const m = w({
    breakpoint: 1536,
    scroll: {
      x: 0,
      y: 0,
    },
  }),
  u = ({ children: r }) => {
    const [n, i] = t(1536),
      [s, l] = t({ x: 0, y: 0 });
    return (
      a(() => {
        function e() {
          i(window.innerWidth);
        }
        const o = c(() => {
          l({ x: window.scrollX, y: window.scrollY });
        }, 100);
        return (
          window.addEventListener("resize", e),
          window.addEventListener("scroll", o),
          () => {
            window.removeEventListener("resize", e), window.removeEventListener("scroll", o);
          }
        );
      }, []),
      /* @__PURE__ */ d.jsx(m.Provider, { value: { breakpoint: n, scroll: s }, children: r })
    );
  };
export { m as WindowContext, u as WindowProvider };
