import { f as n } from "./function-bind-native.js";
var o = n,
  a = Function.prototype,
  t = a.apply,
  p = a.call,
  e =
    (typeof Reflect == "object" && Reflect.apply) ||
    (o
      ? p.bind(t)
      : function () {
          return p.apply(t, arguments);
        });
export { e as f };
