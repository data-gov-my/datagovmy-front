import { s as a } from "./shared.js";
import { u as o } from "./uid.js";
var e = a,
  t = o,
  s = e("keys"),
  u = function (r) {
    return s[r] || (s[r] = t(r));
  };
export { u as s };
