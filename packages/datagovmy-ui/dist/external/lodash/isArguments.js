import { _ as s } from "./_baseIsArguments.js";
import { i as a } from "./isObjectLike.js";
var e = s,
  o = a,
  t = Object.prototype,
  n = t.hasOwnProperty,
  i = t.propertyIsEnumerable,
  m = e(
    (function () {
      return arguments;
    })()
  )
    ? e
    : function (r) {
        return o(r) && n.call(r, "callee") && !i.call(r, "callee");
      },
  u = m;
export { u as i };
