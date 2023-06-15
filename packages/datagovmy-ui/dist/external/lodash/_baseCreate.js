import { i as n } from "./isObject.js";
var i = n,
  t = Object.create,
  c = (function () {
    function e() {}
    return function (r) {
      if (!i(r)) return {};
      if (t) return t(r);
      e.prototype = r;
      var a = new e();
      return (e.prototype = void 0), a;
    };
  })(),
  o = c;
export { o as _ };
