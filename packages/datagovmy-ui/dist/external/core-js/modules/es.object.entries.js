import { __exports as e } from "../../../_virtual/es.object.entries.js";
import { _ as o } from "../internals/export.js";
import { __require as n } from "../internals/object-to-array.js";
var r;
function f() {
  if (r) return e;
  r = 1;
  var t = o,
    i = n().entries;
  return (
    t(
      { target: "Object", stat: !0 },
      {
        entries: function (s) {
          return i(s);
        },
      }
    ),
    e
  );
}
export { f as __require };
