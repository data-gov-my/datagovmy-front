import { f as c } from "./fails.js";
import { g as o } from "./global.js";
var n, i;
function S() {
  if (i) return n;
  i = 1;
  var e = c,
    l = o,
    a = l.RegExp,
    t = e(function () {
      var r = a("a", "y");
      return (r.lastIndex = 2), r.exec("abcd") != null;
    }),
    u =
      t ||
      e(function () {
        return !a("a", "y").sticky;
      }),
    s =
      t ||
      e(function () {
        var r = a("^r", "gy");
        return (r.lastIndex = 2), r.exec("str") != null;
      });
  return (
    (n = {
      BROKEN_CARET: s,
      MISSED_STICKY: u,
      UNSUPPORTED_Y: t,
    }),
    n
  );
}
export { S as __require };
