import { t as F } from "./to-integer-or-infinity.js";
var n = F,
  r = Math.min,
  o = function (t) {
    return t > 0 ? r(n(t), 9007199254740991) : 0;
  };
export { o as t };
