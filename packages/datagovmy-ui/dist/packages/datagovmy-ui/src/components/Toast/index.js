import { j as o } from "../../../../../external/react/jsx-runtime.js";
import { useTheme as r } from "../../../../../external/next-themes/dist/index.module.js";
import { Toaster as a, toast as e } from "../../../../../external/sonner/dist/index.js";
const i = s => {
    const { theme: t } = r();
    return /* @__PURE__ */ o.jsx(a, { theme: t, position: "top-center", richColors: !0, ...s });
  },
  p = {
    success: (s, t) =>
      e.success(s, { icon: /* @__PURE__ */ o.jsx(o.Fragment, {}), description: t }),
    error: (s, t) => e.error(s, { icon: /* @__PURE__ */ o.jsx(o.Fragment, {}), description: t }),
    message: (s, t) =>
      e.message(s, { icon: /* @__PURE__ */ o.jsx(o.Fragment, {}), description: t }),
  };
export { i as default, p as toast };
