import { _ as o } from "./_Stack.js";
import { _ as p } from "./_assignMergeValue.js";
import { _ as g } from "./_baseFor.js";
import { _ as t } from "./_baseMergeDeep.js";
import { i as M } from "./isObject.js";
import { k as b } from "./keysIn.js";
import { _ as d } from "./_safeGet.js";
var v = o,
  D = p,
  F = g,
  G = t,
  I = M,
  O = b,
  S = d;
function m(e, r, n, f, a) {
  e !== r &&
    F(
      r,
      function (s, i) {
        if ((a || (a = new v()), I(s))) G(e, r, i, n, m, f, a);
        else {
          var _ = f ? f(S(e, i), s, i + "", e, r, a) : void 0;
          _ === void 0 && (_ = s), D(e, i, _);
        }
      },
      O
    );
}
var H = m;
export { H as _ };
