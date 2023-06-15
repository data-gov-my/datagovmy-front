import { _ as s } from "./_coreJsData.js";
var a = s,
  e = (function () {
    var r = /[^.]+$/.exec((a && a.keys && a.keys.IE_PROTO) || "");
    return r ? "Symbol(src)_1." + r : "";
  })();
function o(r) {
  return !!e && e in r;
}
var c = o;
export { c as _ };
