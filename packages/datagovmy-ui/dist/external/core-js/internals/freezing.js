import { f as e } from "./fails.js";
var r = e,
  i = !r(function () {
    return Object.isExtensible(Object.preventExtensions({}));
  });
export { i as f };
