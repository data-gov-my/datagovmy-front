import { __require as p } from "./is-regexp.js";
var e, o;
function n() {
  if (o) return e;
  o = 1;
  var t = p(),
    i = TypeError;
  return (
    (e = function (r) {
      if (t(r)) throw i("The method doesn't accept regular expressions");
      return r;
    }),
    e
  );
}
export { n as __require };
