import { useState as n } from "react";
import { useLayoutEffect as c } from "../../react-use-layout-effect/dist/index.js";
function z(e) {
  const [h, r] = n(void 0);
  return (
    c(() => {
      if (e) {
        r({
          width: e.offsetWidth,
          height: e.offsetHeight,
        });
        const f = new ResizeObserver(i => {
          if (!Array.isArray(i) || !i.length) return;
          const b = i[0];
          let o, t;
          if ("borderBoxSize" in b) {
            const s = b.borderBoxSize,
              d = Array.isArray(s) ? s[0] : s;
            (o = d.inlineSize), (t = d.blockSize);
          } else (o = e.offsetWidth), (t = e.offsetHeight);
          r({
            width: o,
            height: t,
          });
        });
        return (
          f.observe(e, {
            box: "border-box",
          }),
          () => f.unobserve(e)
        );
      } else r(void 0);
    }, [e]),
    h
  );
}
export { z as useSize };
