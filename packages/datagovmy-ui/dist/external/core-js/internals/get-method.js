import { a as d } from "./a-callable.js";
import { __require as l } from "./is-null-or-undefined.js";
var e, a;
function s() {
  if (a) return e;
  a = 1;
  var i = d,
    n = l();
  return (
    (e = function (t, u) {
      var r = t[u];
      return n(r) ? void 0 : i(r);
    }),
    e
  );
}
export { s as __require };
