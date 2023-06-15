import { f } from "./function-call.js";
import { a as h } from "./an-object.js";
import { __require as c } from "./get-method.js";
var m = f,
  n = h,
  s = c(),
  l = function (o, e, t) {
    var r, i;
    n(o);
    try {
      if (((r = s(o, "return")), !r)) {
        if (e === "throw") throw t;
        return t;
      }
      r = m(r, o);
    } catch (a) {
      (i = !0), (r = a);
    }
    if (e === "throw") throw t;
    if (i) throw r;
    return n(r), t;
  };
export { l as i };
