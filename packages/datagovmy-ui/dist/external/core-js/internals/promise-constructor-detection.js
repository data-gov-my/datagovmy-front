import { g as I } from "./global.js";
import { __require as N } from "./promise-native-constructor.js";
import { i as T } from "./is-callable.js";
import { i as P } from "./is-forced.js";
import { i as q } from "./inspect-source.js";
import { w as g } from "./well-known-symbol.js";
import { __require as w } from "./engine-is-browser.js";
import { __require as V } from "./engine-is-deno.js";
import { e as b } from "./engine-v8-version.js";
var t, S;
function G() {
  if (S) return t;
  S = 1;
  var m = I,
    r = N(),
    v = T,
    E = P,
    _ = q,
    f = g,
    C = w(),
    R = V(),
    e = b;
  r && r.prototype;
  var O = f("species"),
    o = !1,
    n = v(m.PromiseRejectionEvent),
    l = E("Promise", function () {
      var a = _(r),
        s = a !== String(r);
      if (!s && e === 66) return !0;
      if (!e || e < 51 || !/native code/.test(a)) {
        var u = new r(function (i) {
            i(1);
          }),
          c = function (i) {
            i(
              function () {},
              function () {}
            );
          },
          p = (u.constructor = {});
        if (((p[O] = c), (o = u.then(function () {}) instanceof c), !o)) return !0;
      }
      return !s && (C || R) && !n;
    });
  return (
    (t = {
      CONSTRUCTOR: l,
      REJECTION_EVENT: n,
      SUBCLASSING: o,
    }),
    t
  );
}
export { G as __require };
