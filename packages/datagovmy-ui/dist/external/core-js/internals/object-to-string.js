import { __require as i } from "./to-string-tag-support.js";
import { c as n } from "./classof.js";
var r, t;
function s() {
  if (t) return r;
  t = 1;
  var e = i(),
    o = n;
  return (
    (r = e
      ? {}.toString
      : function () {
          return "[object " + o(this) + "]";
        }),
    r
  );
}
export { s as __require };
