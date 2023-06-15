import { _ as m } from "./_baseGet.js";
import { _ as n } from "./_baseSet.js";
import { _ as b } from "./_castPath.js";
var f = m,
  c = n,
  P = b;
function l(a, r, _) {
  for (var t = -1, o = r.length, s = {}; ++t < o; ) {
    var e = r[t],
      i = f(a, e);
    _(i, e) && c(s, P(e, a), i);
  }
  return s;
}
var k = l;
export { k as _ };
