import { _ as e } from "./_trimmedEndIndex.js";
var a = e,
  m = /^\s+/;
function d(r) {
  return r && r.slice(0, a(r) + 1).replace(m, "");
}
var t = d;
export { t as _ };
