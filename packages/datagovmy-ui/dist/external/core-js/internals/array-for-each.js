import { a as h } from "./array-iteration.js";
import { __require as n } from "./array-method-is-strict.js";
var r, a;
function s() {
  if (a) return r;
  a = 1;
  var e = h.forEach,
    t = n(),
    o = t("forEach");
  return (
    (r = o
      ? [].forEach
      : function (i) {
          return e(this, i, arguments.length > 1 ? arguments[1] : void 0);
        }),
    r
  );
}
export { s as __require };
