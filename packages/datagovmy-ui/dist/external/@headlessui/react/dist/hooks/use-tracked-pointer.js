import { useRef as u } from "react";
function n(e) {
  return [e.screenX, e.screenY];
}
function o() {
  let e = u([-1, -1]);
  return {
    wasMoved(r) {
      let t = n(r);
      return e.current[0] === t[0] && e.current[1] === t[1] ? !1 : ((e.current = t), !0);
    },
    update(r) {
      e.current = n(r);
    },
  };
}
export { o as useTrackedPointer };
