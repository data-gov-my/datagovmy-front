import { _ as i } from "./_memoizeCapped.js";
var m = i,
  s =
    /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
  c = /\\(\\)?/g,
  h = m(function (a) {
    var r = [];
    return (
      a.charCodeAt(0) === 46 && r.push(""),
      a.replace(s, function (e, p, o, t) {
        r.push(o ? t.replace(c, "$1") : p || e);
      }),
      r
    );
  }),
  u = h;
export { u as _ };
