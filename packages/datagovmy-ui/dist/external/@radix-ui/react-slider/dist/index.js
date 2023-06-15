import D from "../../../@babel/runtime/helpers/esm/extends.js";
import {
  forwardRef as E,
  useState as k,
  useRef as P,
  createElement as $,
  useMemo as de,
  useEffect as j,
} from "react";
import { clamp as q } from "../../number/dist/index.js";
import { composeEventHandlers as R } from "../../primitive/dist/index.js";
import { useComposedRefs as K } from "../../react-compose-refs/dist/index.js";
import { createContextScope as le } from "../../react-context/dist/index.js";
import { useControllableState as fe } from "../../react-use-controllable-state/dist/index.js";
import { useDirection as ue } from "../../react-direction/dist/index.js";
import { usePrevious as me } from "../../react-use-previous/dist/index.js";
import { useSize as $e } from "../../react-use-size/dist/index.js";
import { Primitive as H } from "../../react-primitive/dist/index.js";
import { createCollection as pe } from "../../react-collection/dist/index.js";
const J = ["PageUp", "PageDown"],
  Q = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"],
  Z = {
    "from-left": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
    "from-right": ["Home", "PageDown", "ArrowDown", "ArrowRight"],
    "from-bottom": ["Home", "PageDown", "ArrowDown", "ArrowLeft"],
    "from-top": ["Home", "PageDown", "ArrowUp", "ArrowLeft"],
  },
  A = "Slider",
  [L, Se, ve] = pe(A),
  [ee, We] = le(A, [ve]),
  [he, z] = ee(A),
  be = /* @__PURE__ */ E((e, t) => {
    const {
        name: o,
        min: a = 0,
        max: i = 100,
        step: n = 1,
        orientation: c = "horizontal",
        disabled: s = !1,
        minStepsBetweenThumbs: f = 0,
        defaultValue: m = [a],
        value: S,
        onValueChange: r = () => {},
        onValueCommit: d = () => {},
        inverted: x = !1,
        ...h
      } = e,
      [p, v] = k(null),
      w = K(t, u => v(u)),
      C = P(/* @__PURE__ */ new Set()),
      l = P(0),
      y = c === "horizontal",
      V = p ? !!p.closest("form") : !0,
      N = y ? ge : xe,
      [b = [], re] = fe({
        prop: S,
        defaultProp: m,
        onChange: u => {
          var g;
          (g = [...C.current][l.current]) === null || g === void 0 || g.focus(), r(u);
        },
      }),
      U = P(b);
    function ie(u) {
      const g = Re(b, u);
      I(u, g);
    }
    function se(u) {
      I(u, l.current);
    }
    function ce() {
      const u = U.current[l.current];
      b[l.current] !== u && d(b);
    }
    function I(
      u,
      g,
      { commit: B } = {
        commit: !1,
      }
    ) {
      const Y = Te(n),
        O = Ae(Math.round((u - a) / n) * n + a, Y),
        T = q(O, [a, i]);
      re((M = []) => {
        const _ = Ce(M, T, g);
        if (Ie(_, f * n)) {
          l.current = _.indexOf(T);
          const X = String(_) !== String(M);
          return X && B && d(_), X ? _ : M;
        } else return M;
      });
    }
    return /* @__PURE__ */ $(
      he,
      {
        scope: e.__scopeSlider,
        disabled: s,
        min: a,
        max: i,
        valueIndexToChangeRef: l,
        thumbs: C.current,
        values: b,
        orientation: c,
      },
      /* @__PURE__ */ $(
        L.Provider,
        {
          scope: e.__scopeSlider,
        },
        /* @__PURE__ */ $(
          L.Slot,
          {
            scope: e.__scopeSlider,
          },
          /* @__PURE__ */ $(
            N,
            D(
              {
                "aria-disabled": s,
                "data-disabled": s ? "" : void 0,
              },
              h,
              {
                ref: w,
                onPointerDown: R(h.onPointerDown, () => {
                  s || (U.current = b);
                }),
                min: a,
                max: i,
                inverted: x,
                onSlideStart: s ? void 0 : ie,
                onSlideMove: s ? void 0 : se,
                onSlideEnd: s ? void 0 : ce,
                onHomeKeyDown: () =>
                  !s &&
                  I(a, 0, {
                    commit: !0,
                  }),
                onEndKeyDown: () =>
                  !s &&
                  I(i, b.length - 1, {
                    commit: !0,
                  }),
                onStepKeyDown: ({ event: u, direction: g }) => {
                  if (!s) {
                    const O = J.includes(u.key) || (u.shiftKey && Q.includes(u.key)) ? 10 : 1,
                      T = l.current,
                      M = b[T],
                      _ = n * O * g;
                    I(M + _, T, {
                      commit: !0,
                    });
                  }
                },
              }
            )
          )
        )
      ),
      V &&
        b.map((u, g) =>
          /* @__PURE__ */ $(_e, {
            key: g,
            name: o ? o + (b.length > 1 ? "[]" : "") : void 0,
            value: u,
          })
        )
    );
  }),
  [te, ne] = ee(A, {
    startEdge: "left",
    endEdge: "right",
    size: "width",
    direction: 1,
  }),
  ge = /* @__PURE__ */ E((e, t) => {
    const {
        min: o,
        max: a,
        dir: i,
        inverted: n,
        onSlideStart: c,
        onSlideMove: s,
        onSlideEnd: f,
        onStepKeyDown: m,
        ...S
      } = e,
      [r, d] = k(null),
      x = K(t, l => d(l)),
      h = P(),
      p = ue(i),
      v = p === "ltr",
      w = (v && !n) || (!v && n);
    function C(l) {
      const y = h.current || r.getBoundingClientRect(),
        V = [0, y.width],
        b = F(V, w ? [o, a] : [a, o]);
      return (h.current = y), b(l - y.left);
    }
    return /* @__PURE__ */ $(
      te,
      {
        scope: e.__scopeSlider,
        startEdge: w ? "left" : "right",
        endEdge: w ? "right" : "left",
        direction: w ? 1 : -1,
        size: "width",
      },
      /* @__PURE__ */ $(
        oe,
        D(
          {
            "dir": p,
            "data-orientation": "horizontal",
          },
          S,
          {
            ref: x,
            style: {
              ...S.style,
              ["--radix-slider-thumb-transform"]: "translateX(-50%)",
            },
            onSlideStart: l => {
              const y = C(l.clientX);
              c == null || c(y);
            },
            onSlideMove: l => {
              const y = C(l.clientX);
              s == null || s(y);
            },
            onSlideEnd: () => {
              (h.current = void 0), f == null || f();
            },
            onStepKeyDown: l => {
              const V = Z[w ? "from-left" : "from-right"].includes(l.key);
              m == null ||
                m({
                  event: l,
                  direction: V ? -1 : 1,
                });
            },
          }
        )
      )
    );
  }),
  xe = /* @__PURE__ */ E((e, t) => {
    const {
        min: o,
        max: a,
        inverted: i,
        onSlideStart: n,
        onSlideMove: c,
        onSlideEnd: s,
        onStepKeyDown: f,
        ...m
      } = e,
      S = P(null),
      r = K(t, S),
      d = P(),
      x = !i;
    function h(p) {
      const v = d.current || S.current.getBoundingClientRect(),
        w = [0, v.height],
        l = F(w, x ? [a, o] : [o, a]);
      return (d.current = v), l(p - v.top);
    }
    return /* @__PURE__ */ $(
      te,
      {
        scope: e.__scopeSlider,
        startEdge: x ? "bottom" : "top",
        endEdge: x ? "top" : "bottom",
        size: "height",
        direction: x ? 1 : -1,
      },
      /* @__PURE__ */ $(
        oe,
        D(
          {
            "data-orientation": "vertical",
          },
          m,
          {
            ref: r,
            style: {
              ...m.style,
              ["--radix-slider-thumb-transform"]: "translateY(50%)",
            },
            onSlideStart: p => {
              const v = h(p.clientY);
              n == null || n(v);
            },
            onSlideMove: p => {
              const v = h(p.clientY);
              c == null || c(v);
            },
            onSlideEnd: () => {
              (d.current = void 0), s == null || s();
            },
            onStepKeyDown: p => {
              const w = Z[x ? "from-bottom" : "from-top"].includes(p.key);
              f == null ||
                f({
                  event: p,
                  direction: w ? -1 : 1,
                });
            },
          }
        )
      )
    );
  }),
  oe = /* @__PURE__ */ E((e, t) => {
    const {
        __scopeSlider: o,
        onSlideStart: a,
        onSlideMove: i,
        onSlideEnd: n,
        onHomeKeyDown: c,
        onEndKeyDown: s,
        onStepKeyDown: f,
        ...m
      } = e,
      S = z(A, o);
    return /* @__PURE__ */ $(
      H.span,
      D({}, m, {
        ref: t,
        onKeyDown: R(e.onKeyDown, r => {
          r.key === "Home"
            ? (c(r), r.preventDefault())
            : r.key === "End"
            ? (s(r), r.preventDefault())
            : J.concat(Q).includes(r.key) && (f(r), r.preventDefault());
        }),
        onPointerDown: R(e.onPointerDown, r => {
          const d = r.target;
          d.setPointerCapture(r.pointerId), r.preventDefault(), S.thumbs.has(d) ? d.focus() : a(r);
        }),
        onPointerMove: R(e.onPointerMove, r => {
          r.target.hasPointerCapture(r.pointerId) && i(r);
        }),
        onPointerUp: R(e.onPointerUp, r => {
          const d = r.target;
          d.hasPointerCapture(r.pointerId) && (d.releasePointerCapture(r.pointerId), n(r));
        }),
      })
    );
  }),
  we = "SliderTrack",
  ye = /* @__PURE__ */ E((e, t) => {
    const { __scopeSlider: o, ...a } = e,
      i = z(we, o);
    return /* @__PURE__ */ $(
      H.span,
      D(
        {
          "data-disabled": i.disabled ? "" : void 0,
          "data-orientation": i.orientation,
        },
        a,
        {
          ref: t,
        }
      )
    );
  }),
  G = "SliderRange",
  De = /* @__PURE__ */ E((e, t) => {
    const { __scopeSlider: o, ...a } = e,
      i = z(G, o),
      n = ne(G, o),
      c = P(null),
      s = K(t, c),
      f = i.values.length,
      m = i.values.map(d => ae(d, i.min, i.max)),
      S = f > 1 ? Math.min(...m) : 0,
      r = 100 - Math.max(...m);
    return /* @__PURE__ */ $(
      H.span,
      D(
        {
          "data-orientation": i.orientation,
          "data-disabled": i.disabled ? "" : void 0,
        },
        a,
        {
          ref: s,
          style: {
            ...e.style,
            [n.startEdge]: S + "%",
            [n.endEdge]: r + "%",
          },
        }
      )
    );
  }),
  W = "SliderThumb",
  Pe = /* @__PURE__ */ E((e, t) => {
    const o = Se(e.__scopeSlider),
      [a, i] = k(null),
      n = K(t, s => i(s)),
      c = de(() => (a ? o().findIndex(s => s.ref.current === a) : -1), [o, a]);
    return /* @__PURE__ */ $(
      Ee,
      D({}, e, {
        ref: n,
        index: c,
      })
    );
  }),
  Ee = /* @__PURE__ */ E((e, t) => {
    const { __scopeSlider: o, index: a, ...i } = e,
      n = z(W, o),
      c = ne(W, o),
      [s, f] = k(null),
      m = K(t, v => f(v)),
      S = $e(s),
      r = n.values[a],
      d = r === void 0 ? 0 : ae(r, n.min, n.max),
      x = Me(a, n.values.length),
      h = S == null ? void 0 : S[c.size],
      p = h ? Ke(h, d, c.direction) : 0;
    return (
      j(() => {
        if (s)
          return (
            n.thumbs.add(s),
            () => {
              n.thumbs.delete(s);
            }
          );
      }, [s, n.thumbs]),
      /* @__PURE__ */ $(
        "span",
        {
          style: {
            transform: "var(--radix-slider-thumb-transform)",
            position: "absolute",
            [c.startEdge]: `calc(${d}% + ${p}px)`,
          },
        },
        /* @__PURE__ */ $(
          L.ItemSlot,
          {
            scope: e.__scopeSlider,
          },
          /* @__PURE__ */ $(
            H.span,
            D(
              {
                "role": "slider",
                "aria-label": e["aria-label"] || x,
                "aria-valuemin": n.min,
                "aria-valuenow": r,
                "aria-valuemax": n.max,
                "aria-orientation": n.orientation,
                "data-orientation": n.orientation,
                "data-disabled": n.disabled ? "" : void 0,
                "tabIndex": n.disabled ? void 0 : 0,
              },
              i,
              {
                ref: m,
                style:
                  r === void 0
                    ? {
                        display: "none",
                      }
                    : e.style,
                onFocus: R(e.onFocus, () => {
                  n.valueIndexToChangeRef.current = a;
                }),
              }
            )
          )
        )
      )
    );
  }),
  _e = e => {
    const { value: t, ...o } = e,
      a = P(null),
      i = me(t);
    return (
      j(() => {
        const n = a.current,
          c = window.HTMLInputElement.prototype,
          f = Object.getOwnPropertyDescriptor(c, "value").set;
        if (i !== t && f) {
          const m = new Event("input", {
            bubbles: !0,
          });
          f.call(n, t), n.dispatchEvent(m);
        }
      }, [i, t]),
      /* @__PURE__ */ $(
        "input",
        D(
          {
            style: {
              display: "none",
            },
          },
          o,
          {
            ref: a,
            defaultValue: t,
          }
        )
      )
    );
  };
function Ce(e = [], t, o) {
  const a = [...e];
  return (a[o] = t), a.sort((i, n) => i - n);
}
function ae(e, t, o) {
  const n = (100 / (o - t)) * (e - t);
  return q(n, [0, 100]);
}
function Me(e, t) {
  return t > 2 ? `Value ${e + 1} of ${t}` : t === 2 ? ["Minimum", "Maximum"][e] : void 0;
}
function Re(e, t) {
  if (e.length === 1) return 0;
  const o = e.map(i => Math.abs(i - t)),
    a = Math.min(...o);
  return o.indexOf(a);
}
function Ke(e, t, o) {
  const a = e / 2,
    n = F([0, 50], [0, a]);
  return (a - n(t) * o) * o;
}
function Ve(e) {
  return e.slice(0, -1).map((t, o) => e[o + 1] - t);
}
function Ie(e, t) {
  if (t > 0) {
    const o = Ve(e);
    return Math.min(...o) >= t;
  }
  return !0;
}
function F(e, t) {
  return o => {
    if (e[0] === e[1] || t[0] === t[1]) return t[0];
    const a = (t[1] - t[0]) / (e[1] - e[0]);
    return t[0] + a * (o - e[0]);
  };
}
function Te(e) {
  return (String(e).split(".")[1] || "").length;
}
function Ae(e, t) {
  const o = Math.pow(10, t);
  return Math.round(e * o) / o;
}
const je = be,
  qe = ye,
  Je = De,
  Qe = Pe;
export {
  Je as Range,
  je as Root,
  be as Slider,
  De as SliderRange,
  Pe as SliderThumb,
  ye as SliderTrack,
  Qe as Thumb,
  qe as Track,
  We as createSliderScope,
};
