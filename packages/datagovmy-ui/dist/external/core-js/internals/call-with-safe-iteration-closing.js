import { a as c } from "./an-object.js";
import { i as f } from "./iterator-close.js";
var t, e;
function u() {
  if (e) return t;
  e = 1;
  var i = c,
    o = f;
  return (
    (t = function (n, a, r, l) {
      try {
        return l ? a(i(r)[0], r[1]) : a(r);
      } catch (s) {
        o(n, "throw", s);
      }
    }),
    t
  );
}
export { u as __require };
