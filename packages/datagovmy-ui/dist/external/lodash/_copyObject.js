import { _ as d } from "./_assignValue.js";
import { _ as l } from "./_baseAssignValue.js";
var h = d,
  m = l;
function p(s, r, a, f) {
  var v = !a;
  a || (a = {});
  for (var g = -1, _ = r.length; ++g < _; ) {
    var i = r[g],
      n = f ? f(a[i], s[i], i, a, s) : void 0;
    n === void 0 && (n = s[i]), v ? m(a, i, n) : h(a, i, n);
  }
  return a;
}
var A = p;
export { A as _ };
