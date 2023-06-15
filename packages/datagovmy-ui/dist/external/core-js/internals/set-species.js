import { g as c } from "./get-built-in.js";
import { d as f } from "./define-built-in-accessor.js";
import { w as l } from "./well-known-symbol.js";
import { d as S } from "./descriptors.js";
var e, i;
function I() {
  if (i) return e;
  i = 1;
  var o = c,
    n = f,
    s = l,
    u = S,
    t = s("species");
  return (
    (e = function (a) {
      var r = o(a);
      u &&
        r &&
        !r[t] &&
        n(r, t, {
          configurable: !0,
          get: function () {
            return this;
          },
        });
    }),
    e
  );
}
export { I as __require };
