import { d as e } from "./descriptors.js";
import { f as r } from "./fails.js";
import { d as t } from "./document-create-element.js";
var a = e,
  i = r,
  o = t,
  s =
    !a &&
    !i(function () {
      return (
        Object.defineProperty(o("div"), "a", {
          get: function () {
            return 7;
          },
        }).a != 7
      );
    });
export { s as i };
