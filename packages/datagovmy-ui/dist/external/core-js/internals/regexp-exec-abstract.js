import { f as s } from "./function-call.js";
import { a as m } from "./an-object.js";
import { i as u } from "./is-callable.js";
import { c as v } from "./classof-raw.js";
import { __require as E } from "./regexp-exec.js";
var a, t;
function A() {
  if (t) return a;
  t = 1;
  var c = s,
    p = m,
    x = u,
    f = v,
    l = E(),
    n = TypeError;
  return (
    (a = function (r, i) {
      var o = r.exec;
      if (x(o)) {
        var e = c(o, r, i);
        return e !== null && p(e), e;
      }
      if (f(r) === "RegExp") return c(l, r, i);
      throw n("RegExp#exec called on incompatible receiver");
    }),
    a
  );
}
export { A as __require };
