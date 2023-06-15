import { A as t } from "../core/AxiosError.js";
import { u as l } from "../utils.js";
var e, a;
function c() {
  if (a) return e;
  a = 1;
  var r = t,
    n = l;
  function i(o) {
    r.call(this, o ?? "canceled", r.ERR_CANCELED), (this.name = "CanceledError");
  }
  return (
    n.inherits(i, r, {
      __CANCEL__: !0,
    }),
    (e = i),
    e
  );
}
export { c as __require };
