import { f as s } from "./function-uncurry-this.js";
import { f as t } from "./fails.js";
import { c as i } from "./classof-raw.js";
var n = s,
  o = t,
  f = i,
  a = Object,
  c = n("".split),
  l = o(function () {
    return !a("z").propertyIsEnumerable(0);
  })
    ? function (r) {
        return f(r) == "String" ? c(r, "") : a(r);
      }
    : a;
export { l as i };
