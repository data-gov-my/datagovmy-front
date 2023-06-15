import { i as u } from "./is-constructor.js";
import { t as e } from "./try-to-string.js";
var o, t;
function f() {
  if (t) return o;
  t = 1;
  var i = u,
    n = e,
    s = TypeError;
  return (
    (o = function (r) {
      if (i(r)) return r;
      throw s(n(r) + " is not a constructor");
    }),
    o
  );
}
export { f as __require };
