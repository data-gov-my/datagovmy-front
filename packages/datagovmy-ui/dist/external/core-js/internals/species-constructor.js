import { a as l } from "./an-object.js";
import { __require as m } from "./a-constructor.js";
import { __require as p } from "./is-null-or-undefined.js";
import { w as v } from "./well-known-symbol.js";
var r, t;
function _() {
  if (t) return r;
  t = 1;
  var e = l,
    i = m(),
    u = p(),
    s = v,
    a = s("species");
  return (
    (r = function (c, f) {
      var o = e(c).constructor,
        n;
      return o === void 0 || u((n = e(o)[a])) ? f : i(n);
    }),
    r
  );
}
export { _ as __require };
