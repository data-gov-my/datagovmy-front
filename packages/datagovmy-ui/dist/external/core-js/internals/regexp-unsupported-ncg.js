import { f as u } from "./fails.js";
import { g as t } from "./global.js";
var r, a;
function s() {
  if (a) return r;
  a = 1;
  var p = u,
    g = t,
    o = g.RegExp;
  return (
    (r = p(function () {
      var e = o("(?<a>b)", "g");
      return e.exec("b").groups.a !== "b" || "b".replace(e, "$<a>c") !== "bc";
    })),
    r
  );
}
export { s as __require };
