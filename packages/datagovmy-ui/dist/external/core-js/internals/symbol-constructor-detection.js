import { e as t } from "./engine-v8-version.js";
import { f as a } from "./fails.js";
import { g as s } from "./global.js";
var r = t,
  e = a,
  m = s,
  n = m.String,
  f =
    !!Object.getOwnPropertySymbols &&
    !e(function () {
      var o = Symbol();
      return (
        !n(o) ||
        !(Object(o) instanceof Symbol) || // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
        (!Symbol.sham && r && r < 41)
      );
    });
export { f as s };
