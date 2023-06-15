import { a as u } from "./an-object.js";
import { i as v } from "./is-object.js";
import { __require as p } from "./new-promise-capability.js";
var i, a;
function b() {
  if (a) return i;
  a = 1;
  var s = u,
    t = v,
    m = p();
  return (
    (i = function (e, r) {
      if ((s(e), t(r) && r.constructor === e)) return r;
      var o = m.f(e),
        n = o.resolve;
      return n(r), o.promise;
    }),
    i
  );
}
export { b as __require };
