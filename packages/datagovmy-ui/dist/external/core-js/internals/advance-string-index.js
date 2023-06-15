import { s as u } from "./string-multibyte.js";
var r, n;
function d() {
  if (n) return r;
  n = 1;
  var t = u.charAt;
  return (
    (r = function (a, e, i) {
      return e + (i ? t(a, e).length : 1);
    }),
    r
  );
}
export { d as __require };
