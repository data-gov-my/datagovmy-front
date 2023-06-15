import { _ as e } from "../internals/export.js";
import { s as m } from "../internals/symbol-constructor-detection.js";
import { f as s } from "../internals/fails.js";
import "../internals/object-get-own-property-symbols.js";
import { t as a } from "../internals/to-object.js";
import { __exports as f } from "../../../_virtual/object-get-own-property-symbols.js";
var p = e,
  n = m,
  i = s,
  t = f,
  y = a,
  b =
    !n ||
    i(function () {
      t.f(1);
    });
p(
  { target: "Object", stat: !0, forced: b },
  {
    getOwnPropertySymbols: function (o) {
      var r = t.f;
      return r ? r(y(o)) : [];
    },
  }
);
