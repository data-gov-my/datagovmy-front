import { d as r } from "./descriptors.js";
import { f as t } from "./fails.js";
var e = r,
  o = t,
  i =
    e &&
    o(function () {
      return (
        Object.defineProperty(function () {}, "prototype", {
          value: 42,
          writable: !1,
        }).prototype != 42
      );
    });
export { i as v };
