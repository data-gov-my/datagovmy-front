import { f as n } from "./function-uncurry-this.js";
var i = n,
  t = 0,
  o = Math.random(),
  a = i((1).toString),
  f = function (r) {
    return "Symbol(" + (r === void 0 ? "" : r) + ")_" + a(++t + o, 36);
  };
export { f as u };
