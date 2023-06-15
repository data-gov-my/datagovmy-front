import { __exports as a } from "../../../_virtual/new-promise-capability.js";
import { a as f } from "./a-callable.js";
var t;
function c() {
  if (t) return a;
  t = 1;
  var o = f,
    n = TypeError,
    s = function (r) {
      var e, i;
      (this.promise = new r(function (u, l) {
        if (e !== void 0 || i !== void 0) throw n("Bad Promise constructor");
        (e = u), (i = l);
      })),
        (this.resolve = o(e)),
        (this.reject = o(i));
    };
  return (
    (a.f = function (r) {
      return new s(r);
    }),
    a
  );
}
export { c as __require };
