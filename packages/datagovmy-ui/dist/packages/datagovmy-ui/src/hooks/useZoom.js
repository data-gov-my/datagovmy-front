import { useState as s, useEffect as X, useCallback as z } from "react";
const M = (D, h) => {
  const [c, b] = s(),
    [y, B] = s({ w: 0, h: 0 }),
    [f, d] = s(),
    [v, m] = s(!1),
    [e, x] = s({
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    });
  let u = 0,
    r = 0,
    l = 0,
    w = 0;
  X(() => {
    var t;
    if (D && h.current && h.current !== null) {
      const n = h.current.querySelector("svg");
      if (n !== null) {
        (t = h.current) == null || t.addEventListener("touchmove", i => i.preventDefault());
        const o = n.getBoundingClientRect();
        b(n),
          B({
            w: o.width,
            h: o.height,
          }),
          x({
            x: 0,
            y: 0,
            w: o.width,
            h: o.height,
          });
      }
    }
  }, [h.current]);
  const p = t => {
      t && t.preventDefault();
      let n = e.w,
        o = e.h;
      (l += n * 0.1),
        (w += o * 0.1),
        (u = (l * n) / (2 * e.w)),
        (r = (w * o) / (2 * e.h)),
        h.current &&
          (c == null || c.setAttribute("viewBox", `${e.x + u} ${e.y + r} ${e.w - l} ${e.h - w}`)),
        x(i => ({
          ...i,
          x: i.x + u,
          y: i.y + r,
          w: i.w - l,
          h: i.h - w,
        }));
    },
    a = t => {
      t && t.preventDefault();
      let n = e.w,
        o = e.h;
      (l += n * -0.05),
        (w += o * -0.05),
        (u = (l * n) / (2 * e.w)),
        (r = (w * o) / (2 * e.h)),
        h.current &&
          (c == null || c.setAttribute("viewBox", `${e.x + u} ${e.y + r} ${e.w - l} ${e.h - w}`)),
        x(i => ({
          ...i,
          x: i.x + u,
          y: i.y + r,
          w: i.w - l,
          h: i.h - w,
        }));
    },
    g = t => {
      $(t) || (Math.sign(t.deltaY) < 0 ? p() : a(), A());
    },
    A = z(() => {
      x(t => ({
        ...t,
        x: t.x + u,
        y: t.y + r,
      }));
    }, []),
    Y = t => {
      t.preventDefault(),
        h.current &&
          (x({
            x: 0,
            y: 0,
            w: y.w,
            h: y.h,
          }),
          c == null || c.setAttribute("viewBox", `0 0 ${y.w} ${y.h}`));
    },
    E = t => {
      if (v) {
        if (v && !$(t)) (u += t.movementX), (r += t.movementY);
        else if (v && $(t)) {
          const n = t.touches[0];
          f &&
            x(o => ({
              ...o,
              x: o.x - (n.clientX - f.clientX),
              y: o.y - (n.clientY - f.clientY),
            })),
            d(n);
        }
        c == null || c.setAttribute("viewBox", `${e.x - u} ${e.y - r} ${e.w} ${e.h}`);
      }
    },
    S = t => {
      m(!0);
    },
    T = t => {
      m(!1),
        x(n => ({
          ...n,
          x: n.x - u,
          y: n.y - r,
        })),
        d(void 0);
    };
  function $(t) {
    return t.touches !== void 0;
  }
  return {
    onWheel: g,
    onMove: E,
    onDown: S,
    onUp: T,
    onReset: Y,
    zoomIn: p,
    zoomOut: a,
  };
};
export { M as useZoom };
