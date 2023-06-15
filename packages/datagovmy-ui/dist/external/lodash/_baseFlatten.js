import { _ as s } from "./_arrayPush.js";
import { _ as F } from "./_isFlattenable.js";
var g = s,
  l = F;
function h(_, o, n, i, a) {
  var b = -1,
    m = _.length;
  for (n || (n = l), a || (a = []); ++b < m; ) {
    var f = _[b];
    o > 0 && n(f) ? (o > 1 ? h(f, o - 1, n, i, a) : g(a, f)) : i || (a[a.length] = f);
  }
  return a;
}
var e = h;
export { e as _ };
