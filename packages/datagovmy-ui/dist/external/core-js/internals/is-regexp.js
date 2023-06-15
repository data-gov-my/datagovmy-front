import { i as f } from "./is-object.js";
import { c as m } from "./classof-raw.js";
import { w as p } from "./well-known-symbol.js";
var e, o;
function v() {
  if (o) return e;
  o = 1;
  var s = f,
    i = m,
    n = p,
    t = n("match");
  return (
    (e = function (r) {
      var a;
      return s(r) && ((a = r[t]) !== void 0 ? !!a : i(r) == "RegExp");
    }),
    e
  );
}
export { v as __require };
