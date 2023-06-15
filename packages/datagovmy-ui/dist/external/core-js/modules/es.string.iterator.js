import { s as g } from "../internals/string-multibyte.js";
import { t as f } from "../internals/to-string.js";
import { i as v } from "../internals/internal-state.js";
import { i as l } from "../internals/iterator-define.js";
import { c as m } from "../internals/create-iter-result-object.js";
var u = g.charAt,
  S = f,
  o = v,
  c = l,
  i = m,
  s = "String Iterator",
  I = o.set,
  d = o.getterFor(s);
c(
  String,
  "String",
  function (e) {
    I(this, {
      type: s,
      string: S(e),
      index: 0,
    });
  },
  function () {
    var t = d(this),
      n = t.string,
      a = t.index,
      r;
    return a >= n.length ? i(void 0, !0) : ((r = u(n, a)), (t.index += r.length), i(r, !1));
  }
);
