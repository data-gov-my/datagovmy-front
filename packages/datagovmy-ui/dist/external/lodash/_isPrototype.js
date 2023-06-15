var p = Object.prototype;
function e(o) {
  var t = o && o.constructor,
    r = (typeof t == "function" && t.prototype) || p;
  return o === r;
}
var c = e;
export { c as _ };
