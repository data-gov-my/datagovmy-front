import { __exports as i } from "../../../_virtual/es.promise.catch.js";
import { _ as p } from "../internals/export.js";
import { __require as _ } from "../internals/promise-constructor-detection.js";
import { __require as f } from "../internals/promise-native-constructor.js";
import { g as v } from "../internals/get-built-in.js";
import { i as l } from "../internals/is-callable.js";
import { d as C } from "../internals/define-built-in.js";
var o;
function N() {
  if (o) return i;
  o = 1;
  var a = p,
    s = _().CONSTRUCTOR,
    r = f(),
    u = v,
    m = l,
    c = C,
    e = r && r.prototype;
  if (
    (a(
      { target: "Promise", proto: !0, forced: s, real: !0 },
      {
        catch: function (n) {
          return this.then(void 0, n);
        },
      }
    ),
    m(r))
  ) {
    var t = u("Promise").prototype.catch;
    e.catch !== t && c(e, "catch", t, { unsafe: !0 });
  }
  return i;
}
export { N as __require };
