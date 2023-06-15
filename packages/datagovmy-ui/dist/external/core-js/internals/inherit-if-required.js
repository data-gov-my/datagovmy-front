import { i as p } from "./is-callable.js";
import { i as s } from "./is-object.js";
import { o as f } from "./object-set-prototype-of.js";
var c = p,
  l = s,
  a = f,
  v = function (o, i, e) {
    var t, r;
    return (
      // it can work only with native `setPrototypeOf`
      a && // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
        c((t = i.constructor)) &&
        t !== e &&
        l((r = t.prototype)) &&
        r !== e.prototype &&
        a(o, r),
      o
    );
  };
export { v as i };
