import { f as p } from "./fails.js";
import { g as s } from "./global.js";
var e, o;
function i() {
  if (o) return e;
  o = 1;
  var a = p,
    l = s,
    t = l.RegExp;
  return (
    (e = a(function () {
      var r = t(".", "s");
      return !(
        r.dotAll &&
        r.exec(`
`) &&
        r.flags === "s"
      );
    })),
    e
  );
}
export { i as __require };
