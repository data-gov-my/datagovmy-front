import { createFactory as g, Component as O } from "react";
import { polyfill as b } from "../../../react-lifecycles-compat/react-lifecycles-compat.es.js";
var j = function (r) {
    return typeof r == "string" ? r : r ? r.displayName || r.name || "Component" : void 0;
  },
  h = function (r, t) {
    return function (n) {
      return (n[r] = t), n;
    };
  },
  P = function (r) {
    return h("displayName", r);
  },
  w = Object.prototype.hasOwnProperty;
function m(r, t) {
  return r === t ? r !== 0 || t !== 0 || 1 / r == 1 / t : r != r && t != t;
}
function N(r, t) {
  if (m(r, t)) return !0;
  if (typeof r != "object" || r === null || typeof t != "object" || t === null) return !1;
  var n = Object.keys(r),
    e = Object.keys(t);
  if (n.length !== e.length) return !1;
  for (var o = 0; o < n.length; o++) if (!w.call(t, n[o]) || !m(r[n[o]], t[n[o]])) return !1;
  return !0;
}
function f() {
  return (
    (f =
      Object.assign ||
      function (r) {
        for (var t = 1; t < arguments.length; t++) {
          var n = arguments[t];
          for (var e in n) Object.prototype.hasOwnProperty.call(n, e) && (r[e] = n[e]);
        }
        return r;
      }),
    f.apply(this, arguments)
  );
}
function D(r, t) {
  (r.prototype = Object.create(t.prototype)), (r.prototype.constructor = r), l(r, t);
}
function l(r, t) {
  return (
    (l =
      Object.setPrototypeOf ||
      function (n, e) {
        return (n.__proto__ = e), n;
      }),
    l(r, t)
  );
}
var d = function (r, t) {
    return t + "(" + j(r) + ")";
  },
  C = function () {
    for (var r = arguments.length, t = new Array(r), n = 0; n < r; n++) t[n] = arguments[n];
    return t.reduce(
      function (e, o) {
        return function () {
          return e(o.apply(void 0, arguments));
        };
      },
      function (e) {
        return e;
      }
    );
  },
  v = function (r, t) {
    for (var n = {}, e = 0; e < t.length; e++) {
      var o = t[e];
      r.hasOwnProperty(o) && (n[o] = r[o]);
    }
    return n;
  },
  k = function (r, t) {
    return function (n) {
      var e = g(n),
        o =
          typeof r == "function"
            ? r
            : function (a, p) {
                return !N(v(a, r), v(p, r));
              },
        i = (function (a) {
          function p() {
            for (var u, s = arguments.length, y = new Array(s), c = 0; c < s; c++)
              y[c] = arguments[c];
            return (
              ((u = a.call.apply(a, [this].concat(y)) || this).state = {
                computedProps: t(u.props),
                prevProps: u.props,
              }),
              u
            );
          }
          return (
            D(p, a),
            (p.getDerivedStateFromProps = function (u, s) {
              return o(s.prevProps, u) ? { computedProps: t(u), prevProps: u } : { prevProps: u };
            }),
            (p.prototype.render = function () {
              return e(f({}, this.props, this.state.computedProps));
            }),
            p
          );
        })(O);
      return b(i), process.env.NODE_ENV !== "production" ? P(d(n, "withPropsOnChange"))(i) : i;
    };
  },
  A = function (r) {
    return function (t) {
      var n = g(t),
        e = function (o) {
          return n(o);
        };
      return (
        (e.defaultProps = r), process.env.NODE_ENV !== "production" ? P(d(t, "defaultProps"))(e) : e
      );
    };
  },
  F = function (r) {
    return h("propTypes", r);
  };
export {
  C as compose,
  A as defaultProps,
  j as getDisplayName,
  P as setDisplayName,
  F as setPropTypes,
  h as setStatic,
  N as shallowEqual,
  k as withPropsOnChange,
  d as wrapDisplayName,
};
