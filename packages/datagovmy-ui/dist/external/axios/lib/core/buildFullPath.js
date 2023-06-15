import { i as r } from "../helpers/isAbsoluteURL.js";
import { c as l } from "../helpers/combineURLs.js";
var t = r,
  a = l,
  n = function (o, i) {
    return o && !t(i) ? a(o, i) : i;
  };
export { n as b };
