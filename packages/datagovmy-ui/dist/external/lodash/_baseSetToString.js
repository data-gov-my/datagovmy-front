import { c as a } from "./constant.js";
import { _ as i } from "./_defineProperty.js";
import { i as n } from "./identity.js";
var o = a,
  t = i,
  s = n,
  f = t
    ? function (r, e) {
        return t(r, "toString", {
          configurable: !0,
          enumerable: !1,
          value: o(e),
          writable: !0,
        });
      }
    : s,
  _ = f;
export { _ };
