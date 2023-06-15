import { _ as t } from "../internals/export.js";
import { a } from "../internals/array-iteration.js";
import { a as e } from "../internals/array-method-has-species-support.js";
var o = t,
  i = a.filter,
  f = e,
  p = f("filter");
o(
  { target: "Array", proto: !0, forced: !p },
  {
    filter: function (r) {
      return i(this, r, arguments.length > 1 ? arguments[1] : void 0);
    },
  }
);
