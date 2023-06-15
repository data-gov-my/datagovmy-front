import { m as n } from "./math-trunc.js";
var a = n,
  m = function (t) {
    var r = +t;
    return r !== r || r === 0 ? 0 : a(r);
  };
export { m as t };
