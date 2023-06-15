import { g as x } from "./global.js";
import { f as F } from "./function-apply.js";
import { f as P } from "./function-bind-context.js";
import { i as R } from "./is-callable.js";
import { h as B } from "./has-own-property.js";
import { f as G } from "./fails.js";
import { h as H } from "./html.js";
import { a as V } from "./array-slice.js";
import { d as Y } from "./document-create-element.js";
import { __require as j } from "./validate-arguments-length.js";
import { __require as z } from "./engine-is-ios.js";
import { __require as J } from "./engine-is-node.js";
var p, S;
function oe() {
  if (S) return p;
  S = 1;
  var r = x,
    b = F,
    y = P,
    g = R,
    A = B,
    d = G,
    h = H,
    M = V,
    _ = Y,
    T = j(),
    $ = z(),
    w = J(),
    o = r.setImmediate,
    s = r.clearImmediate,
    D = r.process,
    f = r.Dispatch,
    L = r.Function,
    q = r.MessageChannel,
    O = r.String,
    m = 0,
    n = {},
    E = "onreadystatechange",
    i,
    a,
    l,
    u;
  d(function () {
    i = r.location;
  });
  var c = function (e) {
      if (A(n, e)) {
        var t = n[e];
        delete n[e], t();
      }
    },
    v = function (e) {
      return function () {
        c(e);
      };
    },
    I = function (e) {
      c(e.data);
    },
    C = function (e) {
      r.postMessage(O(e), i.protocol + "//" + i.host);
    };
  return (
    (!o || !s) &&
      ((o = function (t) {
        T(arguments.length, 1);
        var k = g(t) ? t : L(t),
          N = M(arguments, 1);
        return (
          (n[++m] = function () {
            b(k, void 0, N);
          }),
          a(m),
          m
        );
      }),
      (s = function (t) {
        delete n[t];
      }),
      w
        ? (a = function (e) {
            D.nextTick(v(e));
          })
        : f && f.now
        ? (a = function (e) {
            f.now(v(e));
          })
        : q && !$
        ? ((l = new q()), (u = l.port2), (l.port1.onmessage = I), (a = y(u.postMessage, u)))
        : r.addEventListener &&
          g(r.postMessage) &&
          !r.importScripts &&
          i &&
          i.protocol !== "file:" &&
          !d(C)
        ? ((a = C), r.addEventListener("message", I, !1))
        : E in _("script")
        ? (a = function (e) {
            h.appendChild(_("script"))[E] = function () {
              h.removeChild(this), c(e);
            };
          })
        : (a = function (e) {
            setTimeout(v(e), 0);
          })),
    (p = {
      set: o,
      clear: s,
    }),
    p
  );
}
export { oe as __require };
