import { env as n } from "./env.js";
function t(e) {
  return n.isServer
    ? null
    : e instanceof Node
    ? e.ownerDocument
    : e != null && e.hasOwnProperty("current") && e.current instanceof Node
    ? e.current.ownerDocument
    : document;
}
export { t as getOwnerDocument };
