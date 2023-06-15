import t from "react";
import { useIsoMorphicEffect as n } from "./use-iso-morphic-effect.js";
import { useServerHandoffComplete as s } from "./use-server-handoff-complete.js";
import { env as o } from "../utils/env.js";
var r;
let i =
  (r = t.useId) != null
    ? r
    : function () {
        let l = s(),
          [e, u] = t.useState(l ? () => o.nextId() : null);
        return (
          n(() => {
            e === null && u(o.nextId());
          }, [e]),
          e != null ? "" + e : void 0
        );
      };
export { i as useId };
