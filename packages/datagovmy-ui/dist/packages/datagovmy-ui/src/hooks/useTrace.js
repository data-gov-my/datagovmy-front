import { useRef as f, useEffect as g } from "react";
const b = (u, e, s = "debug") => {
  const c = f(e);
  g(() => {
    const n = Object.entries(e).reduce(
      (t, [r, o]) => (
        c.current[r] !== o &&
          (t[r] = {
            old: c.current[r],
            new: o,
          }),
        t
      ),
      {}
    );
    Object.keys(n).length > 0 && console[s](`[${u}] Changed props:`, n), (c.current = e);
  });
};
export { b as useTrace };
