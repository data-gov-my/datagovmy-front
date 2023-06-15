import { __module as M } from "../../../_virtual/StaggeredMotion.js";
import { m as et } from "./mapToZero.js";
import { s as at } from "./stripStyle.js";
import { s as nt } from "./stepper.js";
import { p as ot } from "../../performance-now/lib/performance-now.js";
import { r as it } from "../../raf/index.js";
import { s as st } from "./shouldStopAnimation.js";
import lt from "react";
import { p as ft } from "../../prop-types/index.js";
(function (Z, O) {
  O.__esModule = !0;
  var b =
      Object.assign ||
      function (e) {
        for (var r = 1; r < arguments.length; r++) {
          var a = arguments[r];
          for (var t in a) Object.prototype.hasOwnProperty.call(a, t) && (e[t] = a[t]);
        }
        return e;
      },
    F = (function () {
      function e(r, a) {
        for (var t = 0; t < a.length; t++) {
          var i = a[t];
          (i.enumerable = i.enumerable || !1),
            (i.configurable = !0),
            "value" in i && (i.writable = !0),
            Object.defineProperty(r, i.key, i);
        }
      }
      return function (r, a, t) {
        return a && e(r.prototype, a), t && e(r, t), r;
      };
    })();
  function m(e) {
    return e && e.__esModule ? e : { default: e };
  }
  function z(e, r) {
    if (!(e instanceof r)) throw new TypeError("Cannot call a class as a function");
  }
  function B(e, r) {
    if (typeof r != "function" && r !== null)
      throw new TypeError("Super expression must either be null or a function, not " + typeof r);
    (e.prototype = Object.create(r && r.prototype, {
      constructor: { value: e, enumerable: !1, writable: !0, configurable: !0 },
    })),
      r && (Object.setPrototypeOf ? Object.setPrototypeOf(e, r) : (e.__proto__ = r));
  }
  var G = et,
    H = m(G),
    J = at,
    K = m(J),
    Q = nt,
    N = m(Q),
    X = ot,
    D = m(X),
    Y = it,
    j = m(Y),
    $ = st,
    w = m($),
    C = lt,
    R = m(C),
    L = ft,
    g = m(L),
    v = 1e3 / 60;
  function k(e, r, a) {
    for (var t = 0; t < e.length; t++) if (!w.default(e[t], r[t], a[t])) return !1;
    return !0;
  }
  var V = (function (e) {
    B(r, e),
      F(r, null, [
        {
          key: "propTypes",
          value: {
            // TOOD: warn against putting a config in here
            defaultStyles: g.default.arrayOf(g.default.objectOf(g.default.number)),
            styles: g.default.func.isRequired,
            children: g.default.func.isRequired,
          },
          enumerable: !0,
        },
      ]);
    function r(a) {
      var t = this;
      z(this, r),
        e.call(this, a),
        (this.animationID = null),
        (this.prevTime = 0),
        (this.accumulatedTime = 0),
        (this.unreadPropStyles = null),
        (this.clearUnreadPropStyle = function (i) {
          for (
            var u = t.state,
              l = u.currentStyles,
              c = u.currentVelocities,
              p = u.lastIdealStyles,
              d = u.lastIdealVelocities,
              y = !1,
              n = 0;
            n < i.length;
            n++
          ) {
            var _ = i[n],
              I = !1;
            for (var o in _)
              if (Object.prototype.hasOwnProperty.call(_, o)) {
                var h = _[o];
                typeof h == "number" &&
                  (I ||
                    ((I = !0),
                    (y = !0),
                    (l[n] = b({}, l[n])),
                    (c[n] = b({}, c[n])),
                    (p[n] = b({}, p[n])),
                    (d[n] = b({}, d[n]))),
                  (l[n][o] = h),
                  (c[n][o] = 0),
                  (p[n][o] = h),
                  (d[n][o] = 0));
              }
          }
          y &&
            t.setState({
              currentStyles: l,
              currentVelocities: c,
              lastIdealStyles: p,
              lastIdealVelocities: d,
            });
        }),
        (this.startAnimationIfNecessary = function () {
          t.animationID = j.default(function (i) {
            var u = t.props.styles(t.state.lastIdealStyles);
            if (k(t.state.currentStyles, u, t.state.currentVelocities)) {
              (t.animationID = null), (t.accumulatedTime = 0);
              return;
            }
            var l = i || D.default(),
              c = l - t.prevTime;
            if (
              ((t.prevTime = l),
              (t.accumulatedTime = t.accumulatedTime + c),
              t.accumulatedTime > v * 10 && (t.accumulatedTime = 0),
              t.accumulatedTime === 0)
            ) {
              (t.animationID = null), t.startAnimationIfNecessary();
              return;
            }
            for (
              var p = (t.accumulatedTime - Math.floor(t.accumulatedTime / v) * v) / v,
                d = Math.floor(t.accumulatedTime / v),
                y = [],
                n = [],
                _ = [],
                I = [],
                o = 0;
              o < u.length;
              o++
            ) {
              var h = u[o],
                x = {},
                P = {},
                A = {},
                E = {};
              for (var s in h)
                if (Object.prototype.hasOwnProperty.call(h, s)) {
                  var f = h[s];
                  if (typeof f == "number") (x[s] = f), (P[s] = 0), (A[s] = f), (E[s] = 0);
                  else {
                    for (
                      var S = t.state.lastIdealStyles[o][s],
                        T = t.state.lastIdealVelocities[o][s],
                        U = 0;
                      U < d;
                      U++
                    ) {
                      var W = N.default(v / 1e3, S, T, f.val, f.stiffness, f.damping, f.precision);
                      (S = W[0]), (T = W[1]);
                    }
                    var q = N.default(v / 1e3, S, T, f.val, f.stiffness, f.damping, f.precision),
                      tt = q[0],
                      rt = q[1];
                    (x[s] = S + (tt - S) * p), (P[s] = T + (rt - T) * p), (A[s] = S), (E[s] = T);
                  }
                }
              (_[o] = x), (I[o] = P), (y[o] = A), (n[o] = E);
            }
            (t.animationID = null),
              (t.accumulatedTime -= d * v),
              t.setState({
                currentStyles: _,
                currentVelocities: I,
                lastIdealStyles: y,
                lastIdealVelocities: n,
              }),
              (t.unreadPropStyles = null),
              t.startAnimationIfNecessary();
          });
        }),
        (this.state = this.defaultState());
    }
    return (
      (r.prototype.defaultState = function () {
        var t = this.props,
          i = t.defaultStyles,
          u = t.styles,
          l = i || u().map(K.default),
          c = l.map(function (p) {
            return H.default(p);
          });
        return {
          currentStyles: l,
          currentVelocities: c,
          lastIdealStyles: l,
          lastIdealVelocities: c,
        };
      }),
      (r.prototype.componentDidMount = function () {
        (this.prevTime = D.default()), this.startAnimationIfNecessary();
      }),
      (r.prototype.componentWillReceiveProps = function (t) {
        this.unreadPropStyles != null && this.clearUnreadPropStyle(this.unreadPropStyles),
          (this.unreadPropStyles = t.styles(this.state.lastIdealStyles)),
          this.animationID == null &&
            ((this.prevTime = D.default()), this.startAnimationIfNecessary());
      }),
      (r.prototype.componentWillUnmount = function () {
        this.animationID != null && (j.default.cancel(this.animationID), (this.animationID = null));
      }),
      (r.prototype.render = function () {
        var t = this.props.children(this.state.currentStyles);
        return t && R.default.Children.only(t);
      }),
      r
    );
  })(R.default.Component);
  (O.default = V), (Z.exports = O.default);
})(M, M.exports);
var Tt = M.exports;
export { Tt as S };
