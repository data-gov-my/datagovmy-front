import { useEffect as r, useLayoutEffect as s } from "react";
import { env as t } from "../utils/env.js";
let i = (e, o) => {
  t.isServer ? r(e, o) : s(e, o);
};
export { i as useIsoMorphicEffect };
