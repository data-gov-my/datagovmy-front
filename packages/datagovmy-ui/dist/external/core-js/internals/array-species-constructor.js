import { __require as s } from "./is-array.js";
import { i as t } from "./is-constructor.js";
import { i as a } from "./is-object.js";
import { w as n } from "./well-known-symbol.js";
var o = s(),
  f = t,
  u = a,
  c = n,
  m = c("species"),
  i = Array,
  d = function (e) {
    var r;
    return (
      o(e) &&
        ((r = e.constructor),
        f(r) && (r === i || o(r.prototype))
          ? (r = void 0)
          : u(r) && ((r = r[m]), r === null && (r = void 0))),
      r === void 0 ? i : r
    );
  };
export { d as a };
