import { u as b } from "../utils.js";
var i = b;
function A(h, f) {
  f = f || new FormData();
  var s = [];
  function e(r) {
    return r === null
      ? ""
      : i.isDate(r)
      ? r.toISOString()
      : i.isArrayBuffer(r) || i.isTypedArray(r)
      ? typeof Blob == "function"
        ? new Blob([r])
        : Buffer.from(r)
      : r;
  }
  function c(r, t) {
    if (i.isPlainObject(r) || i.isArray(r)) {
      if (s.indexOf(r) !== -1) throw Error("Circular reference detected in " + t);
      s.push(r),
        i.forEach(r, function (n, o) {
          if (!i.isUndefined(n)) {
            var u = t ? t + "." + o : o,
              d;
            if (n && !t && typeof n == "object") {
              if (i.endsWith(o, "{}")) n = JSON.stringify(n);
              else if (i.endsWith(o, "[]") && (d = i.toArray(n))) {
                d.forEach(function (p) {
                  !i.isUndefined(p) && f.append(u, e(p));
                });
                return;
              }
            }
            c(n, u);
          }
        }),
        s.pop();
    } else f.append(t, e(r));
  }
  return c(h), f;
}
var w = A;
export { w as t };
