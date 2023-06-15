import { __module as L } from "../../../_virtual/TransitionMotion.js";
import { m as ut } from "./mapToZero.js";
import { s as ft } from "./stripStyle.js";
import { s as ct } from "./stepper.js";
import { m as vt } from "./mergeDiff.js";
import { p as pt } from "../../performance-now/lib/performance-now.js";
import { r as mt } from "../../raf/index.js";
import { s as dt } from "./shouldStopAnimation.js";
import yt from "react";
import { p as ht } from "../../prop-types/index.js";
(function (H, R) {
  R.__esModule = !0;
  var k =
      Object.assign ||
      function (i) {
        for (var r = 1; r < arguments.length; r++) {
          var n = arguments[r];
          for (var t in n) Object.prototype.hasOwnProperty.call(n, t) && (i[t] = n[t]);
        }
        return i;
      },
    J = (function () {
      function i(r, n) {
        for (var t = 0; t < n.length; t++) {
          var e = n[t];
          (e.enumerable = e.enumerable || !1),
            (e.configurable = !0),
            "value" in e && (e.writable = !0),
            Object.defineProperty(r, e.key, e);
        }
      }
      return function (r, n, t) {
        return n && i(r.prototype, n), t && i(r, t), r;
      };
    })();
  function D(i) {
    return i && i.__esModule ? i : { default: i };
  }
  function K(i, r) {
    if (!(i instanceof r)) throw new TypeError("Cannot call a class as a function");
  }
  function Q(i, r) {
    if (typeof r != "function" && r !== null)
      throw new TypeError("Super expression must either be null or a function, not " + typeof r);
    (i.prototype = Object.create(r && r.prototype, {
      constructor: { value: i, enumerable: !1, writable: !0, configurable: !0 },
    })),
      r && (Object.setPrototypeOf ? Object.setPrototypeOf(i, r) : (i.__proto__ = r));
  }
  var X = ut,
    N = D(X),
    Y = ft,
    q = D(Y),
    $ = ct,
    Z = D($),
    C = vt,
    V = D(C),
    tt = pt,
    x = D(tt),
    et = mt,
    F = D(et),
    rt = dt,
    M = D(rt),
    at = yt,
    j = D(at),
    nt = ht,
    s = D(nt),
    w = 1e3 / 60;
  function U(i, r, n) {
    var t = r;
    return t == null
      ? i.map(function (e, o) {
          return {
            key: e.key,
            data: e.data,
            style: n[o],
          };
        })
      : i.map(function (e, o) {
          for (var u = 0; u < t.length; u++)
            if (t[u].key === e.key)
              return {
                key: t[u].key,
                data: t[u].data,
                style: n[o],
              };
          return { key: e.key, data: e.data, style: n[o] };
        });
  }
  function it(i, r, n, t) {
    if (t.length !== r.length) return !1;
    for (var e = 0; e < t.length; e++) if (t[e].key !== r[e].key) return !1;
    for (var e = 0; e < t.length; e++) if (!M.default(i[e], r[e].style, n[e])) return !1;
    return !0;
  }
  function W(i, r, n, t, e, o, u, S, E) {
    for (
      var f = V.default(t, e, function (T, g) {
          var I = r(g);
          return I == null
            ? (n({ key: g.key, data: g.data }), null)
            : M.default(o[T], I, u[T])
            ? (n({ key: g.key, data: g.data }), null)
            : { key: g.key, data: g.data, style: I };
        }),
        p = [],
        a = [],
        d = [],
        m = [],
        l = 0;
      l < f.length;
      l++
    ) {
      for (var y = f[l], h = null, v = 0; v < t.length; v++)
        if (t[v].key === y.key) {
          h = v;
          break;
        }
      if (h == null) {
        var A = i(y);
        (p[l] = A), (d[l] = A);
        var c = N.default(y.style);
        (a[l] = c), (m[l] = c);
      } else (p[l] = o[h]), (d[l] = S[h]), (a[l] = u[h]), (m[l] = E[h]);
    }
    return [f, p, a, d, m];
  }
  var lt = (function (i) {
    Q(r, i),
      J(r, null, [
        {
          key: "propTypes",
          value: {
            defaultStyles: s.default.arrayOf(
              s.default.shape({
                key: s.default.string.isRequired,
                data: s.default.any,
                style: s.default.objectOf(s.default.number).isRequired,
              })
            ),
            styles: s.default.oneOfType([
              s.default.func,
              s.default.arrayOf(
                s.default.shape({
                  key: s.default.string.isRequired,
                  data: s.default.any,
                  style: s.default.objectOf(
                    s.default.oneOfType([s.default.number, s.default.object])
                  ).isRequired,
                })
              ),
            ]).isRequired,
            children: s.default.func.isRequired,
            willEnter: s.default.func,
            willLeave: s.default.func,
            didLeave: s.default.func,
          },
          enumerable: !0,
        },
        {
          key: "defaultProps",
          value: {
            willEnter: function (t) {
              return q.default(t.style);
            },
            // recall: returning null makes the current unmounting TransitionStyle
            // disappear immediately
            willLeave: function () {
              return null;
            },
            didLeave: function () {},
          },
          enumerable: !0,
        },
      ]);
    function r(n) {
      var t = this;
      K(this, r),
        i.call(this, n),
        (this.unmounting = !1),
        (this.animationID = null),
        (this.prevTime = 0),
        (this.accumulatedTime = 0),
        (this.unreadPropStyles = null),
        (this.clearUnreadPropStyle = function (e) {
          for (
            var o = W(
                t.props.willEnter,
                t.props.willLeave,
                t.props.didLeave,
                t.state.mergedPropsStyles,
                e,
                t.state.currentStyles,
                t.state.currentVelocities,
                t.state.lastIdealStyles,
                t.state.lastIdealVelocities
              ),
              u = o[0],
              S = o[1],
              E = o[2],
              f = o[3],
              p = o[4],
              a = 0;
            a < e.length;
            a++
          ) {
            var d = e[a].style,
              m = !1;
            for (var l in d)
              if (Object.prototype.hasOwnProperty.call(d, l)) {
                var y = d[l];
                typeof y == "number" &&
                  (m ||
                    ((m = !0),
                    (S[a] = k({}, S[a])),
                    (E[a] = k({}, E[a])),
                    (f[a] = k({}, f[a])),
                    (p[a] = k({}, p[a])),
                    (u[a] = {
                      key: u[a].key,
                      data: u[a].data,
                      style: k({}, u[a].style),
                    })),
                  (S[a][l] = y),
                  (E[a][l] = 0),
                  (f[a][l] = y),
                  (p[a][l] = 0),
                  (u[a].style[l] = y));
              }
          }
          t.setState({
            currentStyles: S,
            currentVelocities: E,
            mergedPropsStyles: u,
            lastIdealStyles: f,
            lastIdealVelocities: p,
          });
        }),
        (this.startAnimationIfNecessary = function () {
          t.unmounting ||
            (t.animationID = F.default(function (e) {
              if (!t.unmounting) {
                var o = t.props.styles,
                  u =
                    typeof o == "function"
                      ? o(U(t.state.mergedPropsStyles, t.unreadPropStyles, t.state.lastIdealStyles))
                      : o;
                if (
                  it(t.state.currentStyles, u, t.state.currentVelocities, t.state.mergedPropsStyles)
                ) {
                  (t.animationID = null), (t.accumulatedTime = 0);
                  return;
                }
                var S = e || x.default(),
                  E = S - t.prevTime;
                if (
                  ((t.prevTime = S),
                  (t.accumulatedTime = t.accumulatedTime + E),
                  t.accumulatedTime > w * 10 && (t.accumulatedTime = 0),
                  t.accumulatedTime === 0)
                ) {
                  (t.animationID = null), t.startAnimationIfNecessary();
                  return;
                }
                for (
                  var f = (t.accumulatedTime - Math.floor(t.accumulatedTime / w) * w) / w,
                    p = Math.floor(t.accumulatedTime / w),
                    a = W(
                      t.props.willEnter,
                      t.props.willLeave,
                      t.props.didLeave,
                      t.state.mergedPropsStyles,
                      u,
                      t.state.currentStyles,
                      t.state.currentVelocities,
                      t.state.lastIdealStyles,
                      t.state.lastIdealVelocities
                    ),
                    d = a[0],
                    m = a[1],
                    l = a[2],
                    y = a[3],
                    h = a[4],
                    v = 0;
                  v < d.length;
                  v++
                ) {
                  var A = d[v].style,
                    c = {},
                    T = {},
                    g = {},
                    I = {};
                  for (var _ in A)
                    if (Object.prototype.hasOwnProperty.call(A, _)) {
                      var b = A[_];
                      if (typeof b == "number") (c[_] = b), (T[_] = 0), (g[_] = b), (I[_] = 0);
                      else {
                        for (var O = y[v][_], P = h[v][_], z = 0; z < p; z++) {
                          var B = Z.default(
                            w / 1e3,
                            O,
                            P,
                            b.val,
                            b.stiffness,
                            b.damping,
                            b.precision
                          );
                          (O = B[0]), (P = B[1]);
                        }
                        var G = Z.default(
                            w / 1e3,
                            O,
                            P,
                            b.val,
                            b.stiffness,
                            b.damping,
                            b.precision
                          ),
                          ot = G[0],
                          st = G[1];
                        (c[_] = O + (ot - O) * f),
                          (T[_] = P + (st - P) * f),
                          (g[_] = O),
                          (I[_] = P);
                      }
                    }
                  (y[v] = g), (h[v] = I), (m[v] = c), (l[v] = T);
                }
                (t.animationID = null),
                  (t.accumulatedTime -= p * w),
                  t.setState({
                    currentStyles: m,
                    currentVelocities: l,
                    lastIdealStyles: y,
                    lastIdealVelocities: h,
                    mergedPropsStyles: d,
                  }),
                  (t.unreadPropStyles = null),
                  t.startAnimationIfNecessary();
              }
            }));
        }),
        (this.state = this.defaultState());
    }
    return (
      (r.prototype.defaultState = function () {
        var t = this.props,
          e = t.defaultStyles,
          o = t.styles,
          u = t.willEnter,
          S = t.willLeave,
          E = t.didLeave,
          f = typeof o == "function" ? o(e) : o,
          p = void 0;
        e == null
          ? (p = f)
          : (p = e.map(function (c) {
              for (var T = 0; T < f.length; T++) if (f[T].key === c.key) return f[T];
              return c;
            }));
        var a =
            e == null
              ? f.map(function (c) {
                  return q.default(c.style);
                })
              : e.map(function (c) {
                  return q.default(c.style);
                }),
          d =
            e == null
              ? f.map(function (c) {
                  return N.default(c.style);
                })
              : e.map(function (c) {
                  return N.default(c.style);
                }),
          m = W(
            // Because this is an old-style createReactClass component, Flow doesn't
            // understand that the willEnter and willLeave props have default values
            // and will always be present.
            u,
            S,
            E,
            p,
            f,
            a,
            d,
            a,
            // oldLastIdealStyles really
            d
          ),
          l = m[0],
          y = m[1],
          h = m[2],
          v = m[3],
          A = m[4];
        return {
          currentStyles: y,
          currentVelocities: h,
          lastIdealStyles: v,
          lastIdealVelocities: A,
          mergedPropsStyles: l,
        };
      }),
      (r.prototype.componentDidMount = function () {
        (this.prevTime = x.default()), this.startAnimationIfNecessary();
      }),
      (r.prototype.componentWillReceiveProps = function (t) {
        this.unreadPropStyles && this.clearUnreadPropStyle(this.unreadPropStyles);
        var e = t.styles;
        typeof e == "function"
          ? (this.unreadPropStyles = e(
              U(this.state.mergedPropsStyles, this.unreadPropStyles, this.state.lastIdealStyles)
            ))
          : (this.unreadPropStyles = e),
          this.animationID == null &&
            ((this.prevTime = x.default()), this.startAnimationIfNecessary());
      }),
      (r.prototype.componentWillUnmount = function () {
        (this.unmounting = !0),
          this.animationID != null &&
            (F.default.cancel(this.animationID), (this.animationID = null));
      }),
      (r.prototype.render = function () {
        var t = U(this.state.mergedPropsStyles, this.unreadPropStyles, this.state.currentStyles),
          e = this.props.children(t);
        return e && j.default.Children.only(e);
      }),
      r
    );
  })(j.default.Component);
  (R.default = lt), (H.exports = R.default);
})(L, L.exports);
var Ot = L.exports;
export { Ot as T };
