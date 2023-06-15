import { d as f } from "./define-built-in.js";
var d = f,
  t = function (n, i, e) {
    for (var r in i) d(n, r, i[r], e);
    return n;
  };
export { t as d };
