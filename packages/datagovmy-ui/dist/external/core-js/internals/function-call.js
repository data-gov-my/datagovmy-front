import { f as a } from "./function-bind-native.js";
var t = a,
  n = Function.prototype.call,
  o = t
    ? n.bind(n)
    : function () {
        return n.apply(n, arguments);
      };
export { o as f };
