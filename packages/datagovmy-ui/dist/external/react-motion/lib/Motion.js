import { __module as P } from "../../../_virtual/Motion.js";
import { m as $ } from "./mapToZero.js";
import { s as C } from "./stripStyle.js";
import { s as L } from "./stepper.js";
import { p as V } from "../../performance-now/lib/performance-now.js";
import { r as k } from "../../raf/index.js";
import { s as tt } from "./shouldStopAnimation.js";
import et from "react";
import { p as rt } from "../../prop-types/index.js";
(function (E, b) {
  b.__esModule = !0;
  var T =
      Object.assign ||
      function (r) {
        for (var e = 1; e < arguments.length; e++) {
          var a = arguments[e];
          for (var t in a) Object.prototype.hasOwnProperty.call(a, t) && (r[t] = a[t]);
        }
        return r;
      },
    j = (function () {
      function r(e, a) {
        for (var t = 0; t < a.length; t++) {
          var n = a[t];
          (n.enumerable = n.enumerable || !1),
            (n.configurable = !0),
            "value" in n && (n.writable = !0),
            Object.defineProperty(e, n.key, n);
        }
      }
      return function (e, a, t) {
        return a && r(e.prototype, a), t && r(e, t), e;
      };
    })();
  function p(r) {
    return r && r.__esModule ? r : { default: r };
  }
  function N(r, e) {
    if (!(r instanceof e)) throw new TypeError("Cannot call a class as a function");
  }
  function R(r, e) {
    if (typeof e != "function" && e !== null)
      throw new TypeError("Super expression must either be null or a function, not " + typeof e);
    (r.prototype = Object.create(e && e.prototype, {
      constructor: { value: r, enumerable: !1, writable: !0, configurable: !0 },
    })),
      e && (Object.setPrototypeOf ? Object.setPrototypeOf(r, e) : (r.__proto__ = e));
  }
  var U = $,
    W = p(U),
    q = C,
    Z = p(q),
    F = L,
    D = p(F),
    z = V,
    I = p(z),
    B = k,
    g = p(B),
    G = tt,
    H = p(G),
    J = et,
    x = p(J),
    K = rt,
    m = p(K),
    s = 1e3 / 60,
    Q = (function (r) {
      R(e, r),
        j(e, null, [
          {
            key: "propTypes",
            value: {
              // TOOD: warn against putting a config in here
              defaultStyle: m.default.objectOf(m.default.number),
              style: m.default.objectOf(m.default.oneOfType([m.default.number, m.default.object]))
                .isRequired,
              children: m.default.func.isRequired,
              onRest: m.default.func,
            },
            enumerable: !0,
          },
        ]);
      function e(a) {
        var t = this;
        N(this, e),
          r.call(this, a),
          (this.wasAnimating = !1),
          (this.animationID = null),
          (this.prevTime = 0),
          (this.accumulatedTime = 0),
          (this.unreadPropStyle = null),
          (this.clearUnreadPropStyle = function (n) {
            var u = !1,
              i = t.state,
              c = i.currentStyle,
              d = i.currentVelocity,
              h = i.lastIdealStyle,
              v = i.lastIdealVelocity;
            for (var f in n)
              if (Object.prototype.hasOwnProperty.call(n, f)) {
                var y = n[f];
                typeof y == "number" &&
                  (u || ((u = !0), (c = T({}, c)), (d = T({}, d)), (h = T({}, h)), (v = T({}, v))),
                  (c[f] = y),
                  (d[f] = 0),
                  (h[f] = y),
                  (v[f] = 0));
              }
            u &&
              t.setState({
                currentStyle: c,
                currentVelocity: d,
                lastIdealStyle: h,
                lastIdealVelocity: v,
              });
          }),
          (this.startAnimationIfNecessary = function () {
            t.animationID = g.default(function (n) {
              var u = t.props.style;
              if (H.default(t.state.currentStyle, u, t.state.currentVelocity)) {
                t.wasAnimating && t.props.onRest && t.props.onRest(),
                  (t.animationID = null),
                  (t.wasAnimating = !1),
                  (t.accumulatedTime = 0);
                return;
              }
              t.wasAnimating = !0;
              var i = n || I.default(),
                c = i - t.prevTime;
              if (
                ((t.prevTime = i),
                (t.accumulatedTime = t.accumulatedTime + c),
                t.accumulatedTime > s * 10 && (t.accumulatedTime = 0),
                t.accumulatedTime === 0)
              ) {
                (t.animationID = null), t.startAnimationIfNecessary();
                return;
              }
              var d = (t.accumulatedTime - Math.floor(t.accumulatedTime / s) * s) / s,
                h = Math.floor(t.accumulatedTime / s),
                v = {},
                f = {},
                y = {},
                O = {};
              for (var o in u)
                if (Object.prototype.hasOwnProperty.call(u, o)) {
                  var l = u[o];
                  if (typeof l == "number") (y[o] = l), (O[o] = 0), (v[o] = l), (f[o] = 0);
                  else {
                    for (
                      var _ = t.state.lastIdealStyle[o], S = t.state.lastIdealVelocity[o], A = 0;
                      A < h;
                      A++
                    ) {
                      var M = D.default(s / 1e3, _, S, l.val, l.stiffness, l.damping, l.precision);
                      (_ = M[0]), (S = M[1]);
                    }
                    var w = D.default(s / 1e3, _, S, l.val, l.stiffness, l.damping, l.precision),
                      X = w[0],
                      Y = w[1];
                    (y[o] = _ + (X - _) * d), (O[o] = S + (Y - S) * d), (v[o] = _), (f[o] = S);
                  }
                }
              (t.animationID = null),
                (t.accumulatedTime -= h * s),
                t.setState({
                  currentStyle: y,
                  currentVelocity: O,
                  lastIdealStyle: v,
                  lastIdealVelocity: f,
                }),
                (t.unreadPropStyle = null),
                t.startAnimationIfNecessary();
            });
          }),
          (this.state = this.defaultState());
      }
      return (
        (e.prototype.defaultState = function () {
          var t = this.props,
            n = t.defaultStyle,
            u = t.style,
            i = n || Z.default(u),
            c = W.default(i);
          return {
            currentStyle: i,
            currentVelocity: c,
            lastIdealStyle: i,
            lastIdealVelocity: c,
          };
        }),
        (e.prototype.componentDidMount = function () {
          (this.prevTime = I.default()), this.startAnimationIfNecessary();
        }),
        (e.prototype.componentWillReceiveProps = function (t) {
          this.unreadPropStyle != null && this.clearUnreadPropStyle(this.unreadPropStyle),
            (this.unreadPropStyle = t.style),
            this.animationID == null &&
              ((this.prevTime = I.default()), this.startAnimationIfNecessary());
        }),
        (e.prototype.componentWillUnmount = function () {
          this.animationID != null &&
            (g.default.cancel(this.animationID), (this.animationID = null));
        }),
        (e.prototype.render = function () {
          var t = this.props.children(this.state.currentStyle);
          return t && x.default.Children.only(t);
        }),
        e
      );
    })(x.default.Component);
  (b.default = Q), (E.exports = b.default);
})(P, P.exports);
var mt = P.exports;
export { mt as M };
