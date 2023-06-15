import { f as e } from "./fails.js";
import { i as f } from "./is-object.js";
import { c as i } from "./classof-raw.js";
import { a as t } from "./array-buffer-non-extensible.js";
var o = e,
  n = f,
  l = i,
  a = t,
  r = Object.isExtensible,
  E = o(function () {
    r(1);
  }),
  x =
    E || a
      ? function (s) {
          return !n(s) || (a && l(s) == "ArrayBuffer") ? !1 : r ? r(s) : !0;
        }
      : r;
export { x as o };
