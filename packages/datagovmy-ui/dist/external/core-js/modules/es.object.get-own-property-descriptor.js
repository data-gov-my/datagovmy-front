import { _ as a } from "../internals/export.js";
import { f as p } from "../internals/fails.js";
import { t as i } from "../internals/to-indexed-object.js";
import "../internals/object-get-own-property-descriptor.js";
import { d as s } from "../internals/descriptors.js";
import { __exports as c } from "../../../_virtual/object-get-own-property-descriptor.js";
var f = a,
  m = p,
  n = i,
  r = c.f,
  t = s,
  O =
    !t ||
    m(function () {
      r(1);
    });
f(
  { target: "Object", stat: !0, forced: O, sham: !t },
  {
    getOwnPropertyDescriptor: function (e, o) {
      return r(n(e), o);
    },
  }
);
