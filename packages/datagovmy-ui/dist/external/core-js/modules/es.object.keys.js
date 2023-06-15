import { __exports as e } from "../../../_virtual/es.object.keys.js";
import { _ as f } from "../internals/export.js";
import { t as c } from "../internals/to-object.js";
import { o as m } from "../internals/object-keys.js";
import { f as n } from "../internals/fails.js";
var t;
function k() {
  if (t) return e;
  t = 1;
  var o = f,
    s = c,
    r = m,
    a = n,
    i = a(function () {
      r(1);
    });
  return (
    o(
      { target: "Object", stat: !0, forced: i },
      {
        keys: function (_) {
          return r(s(_));
        },
      }
    ),
    e
  );
}
export { k as __require };
