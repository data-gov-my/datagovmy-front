import { _ as s } from "./_Symbol.js";
import { i as t } from "./isArguments.js";
import { i as o } from "./isArray.js";
var a = s,
  e = t,
  m = o,
  i = a ? a.isConcatSpreadable : void 0;
function n(r) {
  return m(r) || e(r) || !!(i && r && r[i]);
}
var _ = n;
export { _ };
