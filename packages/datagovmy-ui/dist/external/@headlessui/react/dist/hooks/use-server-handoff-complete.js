import { useState as r, useEffect as t } from "react";
import { env as f } from "../utils/env.js";
function a() {
  let [e, o] = r(f.isHandoffComplete);
  return (
    e && f.isHandoffComplete === !1 && o(!1),
    t(() => {
      e !== !0 && o(!0);
    }, [e]),
    t(() => f.handoff(), []),
    e
  );
}
export { a as useServerHandoffComplete };
