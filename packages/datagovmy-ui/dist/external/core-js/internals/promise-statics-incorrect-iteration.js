import { __require as c } from "./promise-native-constructor.js";
import { c as a } from "./check-correctness-of-iteration.js";
import { __require as s } from "./promise-constructor-detection.js";
var r, e;
function C() {
  if (e) return r;
  e = 1;
  var t = c(),
    o = a,
    i = s().CONSTRUCTOR;
  return (
    (r =
      i ||
      !o(function (n) {
        t.all(n).then(void 0, function () {});
      })),
    r
  );
}
export { C as __require };
