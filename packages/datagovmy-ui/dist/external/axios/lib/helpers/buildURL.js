import { u as l } from "../utils.js";
var f = l;
function d(o) {
  return encodeURIComponent(o)
    .replace(/%3A/gi, ":")
    .replace(/%24/g, "$")
    .replace(/%2C/gi, ",")
    .replace(/%20/g, "+")
    .replace(/%5B/gi, "[")
    .replace(/%5D/gi, "]");
}
var b = function (e, r, s) {
  if (!r) return e;
  var t;
  if (s) t = s(r);
  else if (f.isURLSearchParams(r)) t = r.toString();
  else {
    var u = [];
    f.forEach(r, function (n, c) {
      n === null ||
        typeof n > "u" ||
        (f.isArray(n) ? (c = c + "[]") : (n = [n]),
        f.forEach(n, function (i) {
          f.isDate(i) ? (i = i.toISOString()) : f.isObject(i) && (i = JSON.stringify(i)),
            u.push(d(c) + "=" + d(i));
        }));
    }),
      (t = u.join("&"));
  }
  if (t) {
    var g = e.indexOf("#");
    g !== -1 && (e = e.slice(0, g)), (e += (e.indexOf("?") === -1 ? "?" : "&") + t);
  }
  return e;
};
export { b };
