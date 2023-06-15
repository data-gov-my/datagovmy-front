import { a as e } from "./array-species-constructor.js";
var o = e,
  s = function (a, r) {
    return new (o(a))(r === 0 ? 0 : r);
  };
export { s as a };
