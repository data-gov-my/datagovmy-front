import { __exports as r } from "../../../_virtual/react-is.development.js";
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var A;
function re() {
  return A
    ? r
    : ((A = 1),
      process.env.NODE_ENV !== "production" &&
        (function () {
          var o = typeof Symbol == "function" && Symbol.for,
            _ = o ? Symbol.for("react.element") : 60103,
            T = o ? Symbol.for("react.portal") : 60106,
            t = o ? Symbol.for("react.fragment") : 60107,
            n = o ? Symbol.for("react.strict_mode") : 60108,
            s = o ? Symbol.for("react.profiler") : 60114,
            c = o ? Symbol.for("react.provider") : 60109,
            i = o ? Symbol.for("react.context") : 60110,
            v = o ? Symbol.for("react.async_mode") : 60111,
            f = o ? Symbol.for("react.concurrent_mode") : 60111,
            u = o ? Symbol.for("react.forward_ref") : 60112,
            E = o ? Symbol.for("react.suspense") : 60113,
            y = o ? Symbol.for("react.suspense_list") : 60120,
            d = o ? Symbol.for("react.memo") : 60115,
            l = o ? Symbol.for("react.lazy") : 60116,
            x = o ? Symbol.for("react.block") : 60121,
            M = o ? Symbol.for("react.fundamental") : 60117,
            b = o ? Symbol.for("react.responder") : 60118,
            p = o ? Symbol.for("react.scope") : 60119;
          function Y(e) {
            return (
              typeof e == "string" ||
              typeof e == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
              e === t ||
              e === f ||
              e === s ||
              e === n ||
              e === E ||
              e === y ||
              (typeof e == "object" &&
                e !== null &&
                (e.$$typeof === l ||
                  e.$$typeof === d ||
                  e.$$typeof === c ||
                  e.$$typeof === i ||
                  e.$$typeof === u ||
                  e.$$typeof === M ||
                  e.$$typeof === b ||
                  e.$$typeof === p ||
                  e.$$typeof === x))
            );
          }
          function a(e) {
            if (typeof e == "object" && e !== null) {
              var C = e.$$typeof;
              switch (C) {
                case _:
                  var m = e.type;
                  switch (m) {
                    case v:
                    case f:
                    case t:
                    case s:
                    case n:
                    case E:
                      return m;
                    default:
                      var P = m && m.$$typeof;
                      switch (P) {
                        case i:
                        case u:
                        case l:
                        case d:
                        case c:
                          return P;
                        default:
                          return C;
                      }
                  }
                case T:
                  return C;
              }
            }
          }
          var $ = v,
            O = f,
            F = i,
            N = c,
            I = _,
            L = u,
            h = t,
            w = l,
            D = d,
            g = T,
            z = s,
            U = n,
            V = E,
            R = !1;
          function q(e) {
            return (
              R ||
                ((R = !0),
                console.warn(
                  "The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API."
                )),
              S(e) || a(e) === v
            );
          }
          function S(e) {
            return a(e) === f;
          }
          function W(e) {
            return a(e) === i;
          }
          function k(e) {
            return a(e) === c;
          }
          function B(e) {
            return typeof e == "object" && e !== null && e.$$typeof === _;
          }
          function G(e) {
            return a(e) === u;
          }
          function K(e) {
            return a(e) === t;
          }
          function X(e) {
            return a(e) === l;
          }
          function Z(e) {
            return a(e) === d;
          }
          function H(e) {
            return a(e) === T;
          }
          function J(e) {
            return a(e) === s;
          }
          function Q(e) {
            return a(e) === n;
          }
          function j(e) {
            return a(e) === E;
          }
          (r.AsyncMode = $),
            (r.ConcurrentMode = O),
            (r.ContextConsumer = F),
            (r.ContextProvider = N),
            (r.Element = I),
            (r.ForwardRef = L),
            (r.Fragment = h),
            (r.Lazy = w),
            (r.Memo = D),
            (r.Portal = g),
            (r.Profiler = z),
            (r.StrictMode = U),
            (r.Suspense = V),
            (r.isAsyncMode = q),
            (r.isConcurrentMode = S),
            (r.isContextConsumer = W),
            (r.isContextProvider = k),
            (r.isElement = B),
            (r.isForwardRef = G),
            (r.isFragment = K),
            (r.isLazy = X),
            (r.isMemo = Z),
            (r.isPortal = H),
            (r.isProfiler = J),
            (r.isStrictMode = Q),
            (r.isSuspense = j),
            (r.isValidElementType = Y),
            (r.typeOf = a);
        })(),
      r);
}
export { re as __require };
