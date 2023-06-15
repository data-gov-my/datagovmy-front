import { w as n } from "./well-known-symbol.js";
var e, t;
function s() {
  if (t) return e;
  t = 1;
  var c = n,
    a = c("match");
  return (
    (e = function (o) {
      var r = /./;
      try {
        "/./"[o](r);
      } catch {
        try {
          return (r[a] = !1), "/./"[o](r);
        } catch {}
      }
      return !1;
    }),
    e
  );
}
export { s as __require };
