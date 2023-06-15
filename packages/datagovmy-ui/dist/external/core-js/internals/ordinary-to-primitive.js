import { f as v } from "./function-call.js";
import { i as f } from "./is-callable.js";
import { i as n } from "./is-object.js";
var o = v,
  t = f,
  e = n,
  s = TypeError,
  g = function (r, l) {
    var a, i;
    if (
      (l === "string" && t((a = r.toString)) && !e((i = o(a, r)))) ||
      (t((a = r.valueOf)) && !e((i = o(a, r)))) ||
      (l !== "string" && t((a = r.toString)) && !e((i = o(a, r))))
    )
      return i;
    throw s("Can't convert object to primitive value");
  };
export { g as o };
