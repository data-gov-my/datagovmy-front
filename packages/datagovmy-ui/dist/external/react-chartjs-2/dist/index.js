import C, { forwardRef as y, useRef as p, useEffect as l } from "react";
import {
  Chart as E,
  LineController as I,
  BarController as K,
  BubbleController as L,
  ScatterController as T,
} from "../../chart.js/dist/chart.js";
const v = "label";
function h(t, e) {
  typeof t == "function" ? t(e) : t && (t.current = e);
}
function A(t, e) {
  Object.assign(t.options, e);
}
function w(t, e) {
  t.labels = e;
}
function R(t, e) {
  let a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : v;
  const c = [];
  t.datasets = e.map(n => {
    const s = t.datasets.find(i => i[a] === n[a]);
    return !s || !n.data || c.includes(s)
      ? {
          ...n,
        }
      : (c.push(s), Object.assign(s, n), s);
  });
}
function D(t) {
  let e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : v;
  const a = {
    labels: [],
    datasets: [],
  };
  return w(a, t.labels), R(a, t.datasets, e), a;
}
function F(t, e) {
  return t.getElementsAtEventForMode(
    e.nativeEvent,
    "nearest",
    {
      intersect: !0,
    },
    !1
  );
}
function M(t, e) {
  let {
    height: a = 150,
    width: c = 300,
    redraw: n = !1,
    datasetIdKey: s,
    type: i,
    data: o,
    options: u,
    plugins: O = [],
    fallbackContent: j,
    updateMode: m,
    ...B
  } = t;
  const f = p(null),
    r = p(),
    b = () => {
      f.current &&
        ((r.current = new E(f.current, {
          type: i,
          data: D(o, s),
          options: u && {
            ...u,
          },
          plugins: O,
        })),
        h(e, r.current));
    },
    g = () => {
      h(e, null), r.current && (r.current.destroy(), (r.current = null));
    };
  return (
    l(() => {
      !n && r.current && u && A(r.current, u);
    }, [n, u]),
    l(() => {
      !n && r.current && w(r.current.config.data, o.labels);
    }, [n, o.labels]),
    l(() => {
      !n && r.current && o.datasets && R(r.current.config.data, o.datasets, s);
    }, [n, o.datasets]),
    l(() => {
      r.current && (n ? (g(), setTimeout(b)) : r.current.update(m));
    }, [n, u, o.labels, o.datasets, m]),
    l(() => {
      r.current && (g(), setTimeout(b));
    }, [i]),
    l(() => (b(), () => g()), []),
    /* @__PURE__ */ C.createElement(
      "canvas",
      Object.assign(
        {
          ref: f,
          role: "img",
          height: a,
          width: c,
        },
        B
      ),
      j
    )
  );
}
const S = /* @__PURE__ */ y(M);
function d(t, e) {
  return (
    E.register(e),
    /* @__PURE__ */ y((a, c) =>
      /* @__PURE__ */ C.createElement(
        S,
        Object.assign({}, a, {
          ref: c,
          type: t,
        })
      )
    )
  );
}
const $ = /* @__PURE__ */ d("line", I),
  q = /* @__PURE__ */ d("bar", K),
  z = /* @__PURE__ */ d("bubble", L),
  G = /* @__PURE__ */ d("scatter", T);
export { q as Bar, z as Bubble, S as Chart, $ as Line, G as Scatter, F as getElementAtEvent };
