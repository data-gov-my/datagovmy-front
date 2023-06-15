import { __require as e } from "./is-null-or-undefined.js";
var o = e(),
  n = TypeError,
  a = function (r) {
    if (o(r)) throw n("Can't call method on " + r);
    return r;
  };
export { a as r };
