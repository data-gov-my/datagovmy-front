import { f as o } from "./function-bind-native.js";
var r = o,
  t = Function.prototype,
  n = t.call,
  a = r && t.bind.bind(n, n),
  c = r
    ? a
    : function (i) {
        return function () {
          return n.apply(i, arguments);
        };
      };
export { c as f };
