import { f as x } from "./function-bind-context.js";
import { f as j } from "./function-uncurry-this.js";
import { i as L } from "./indexed-object.js";
import { t as R } from "./to-object.js";
import { l as g } from "./length-of-array-like.js";
import { a as C } from "./array-species-create.js";
var F = x,
  A = j,
  M = L,
  N = R,
  k = g,
  w = C,
  I = A([].push),
  e = function (r) {
    var v = r == 1,
      l = r == 2,
      p = r == 3,
      c = r == 4,
      s = r == 6,
      O = r == 7,
      S = r == 5 || s;
    return function (i, h, _, y) {
      for (
        var u = N(i),
          f = M(u),
          b = F(h, _),
          d = k(f),
          a = 0,
          m = y || w,
          n = v ? m(i, d) : l || O ? m(i, 0) : void 0,
          t,
          o;
        d > a;
        a++
      )
        if ((S || a in f) && ((t = f[a]), (o = b(t, a, u)), r))
          if (v) n[a] = o;
          else if (o)
            switch (r) {
              case 3:
                return !0;
              case 5:
                return t;
              case 6:
                return a;
              case 2:
                I(n, t);
            }
          else
            switch (r) {
              case 4:
                return !1;
              case 7:
                I(n, t);
            }
      return s ? -1 : p || c ? c : n;
    };
  },
  V = {
    // `Array.prototype.forEach` method
    // https://tc39.es/ecma262/#sec-array.prototype.foreach
    forEach: e(0),
    // `Array.prototype.map` method
    // https://tc39.es/ecma262/#sec-array.prototype.map
    map: e(1),
    // `Array.prototype.filter` method
    // https://tc39.es/ecma262/#sec-array.prototype.filter
    filter: e(2),
    // `Array.prototype.some` method
    // https://tc39.es/ecma262/#sec-array.prototype.some
    some: e(3),
    // `Array.prototype.every` method
    // https://tc39.es/ecma262/#sec-array.prototype.every
    every: e(4),
    // `Array.prototype.find` method
    // https://tc39.es/ecma262/#sec-array.prototype.find
    find: e(5),
    // `Array.prototype.findIndex` method
    // https://tc39.es/ecma262/#sec-array.prototype.findIndex
    findIndex: e(6),
    // `Array.prototype.filterReject` method
    // https://github.com/tc39/proposal-array-filtering
    filterReject: e(7),
  };
export { V as a };
