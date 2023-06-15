import { j as e } from "../../../../../../external/react/jsx-runtime.js";
import { useContext as T, useRef as z, useState as E } from "react";
import { toDate as s, clx as v } from "../../../../../../helpers.js";
import {
  Root as y,
  Track as w,
  Range as j,
  Thumb as p,
} from "../../../../../../external/@radix-ui/react-slider/dist/index.js";
import { useTranslation as S } from "../../../hooks/useTranslation.js";
import { useWatch as k } from "../../../hooks/useWatch.js";
import { SliderContext as I } from "./context.js";
import R from "../../../../../../external/@heroicons/react/20/solid/esm/PauseIcon.js";
import V from "../../../../../../external/@heroicons/react/20/solid/esm/PlayIcon.js";
const L = ({
    className: m = "pt-10",
    type: c,
    onChange: u,
    step: N,
    value: o,
    data: r = C,
    period: g = "auto",
    parseAsDate: n = !0,
    enablePlayer: A = !0,
  }) => {
    const { i18n: l } = S(),
      { play: h, setPlaying: b } = T(I),
      i = z(null),
      [$, d] = E(o),
      f = {
        auto: "dd MMM yyyy",
        day: "dd MMM yyyy",
        month: "MMM yyyy",
        quarter: "qQ yyyy",
        year: "yyyy",
      };
    if (
      (k(() => {
        c !== "single" && (i.current && a(), u([0, r.length - 1]));
      }, [r]),
      k(() => {
        c !== "single" && d(o);
      }, [o]),
      c === "single")
    )
      return /* @__PURE__ */ e.jsxs(y, {
        className: "group relative flex h-5 w-auto touch-none select-none items-center pt-10",
        defaultValue: [o],
        max: r.length - 1,
        step: N,
        onValueCommit: t => u(t),
        children: [
          /* @__PURE__ */ e.jsx("p", {
            className: "text-dim w-fit pr-2 text-sm",
            children: n ? s(r[0], "yyyy", l.language) : r[0],
          }),
          /* @__PURE__ */ e.jsxs("div", {
            className: "group relative flex h-5 grow touch-none select-none items-center",
            children: [
              /* @__PURE__ */ e.jsx(w, {
                className:
                  "dark:bg-washed-dark relative z-0 h-2 grow rounded-full bg-[#E2E8F0] px-3",
                children: /* @__PURE__ */ e.jsx(j, {
                  className:
                    "group-focus-within:bg-primary group-hover:bg-primary dark:group-focus-within:bg-primary dark:group-hover:bg-primary absolute z-0 h-full rounded-xl bg-[#A1A1AA]",
                }),
              }),
              /* @__PURE__ */ e.jsx(p, {
                className:
                  "group-focus-within:border-primary group-focus-within:ring-primary group-hover:border-primary group-hover:ring-primary mx-3 block h-5 w-5 cursor-pointer rounded-full border-2 border-[#A1A1AA] bg-white shadow-xl group-focus-within:ring-4 group-hover:ring-4",
                children: /* @__PURE__ */ e.jsx(x, {
                  children: n ? s(r[o], f[g], l.language) : r[o],
                }),
              }),
            ],
          }),
          /* @__PURE__ */ e.jsx("p", {
            className: "text-dim w-fit pl-2 text-sm",
            children: n ? s(r[r.length - 1], "yyyy", l.language) : r[r.length - 1],
          }),
        ],
      });
    const M = () => {
        b(!0);
        let t = o[1] >= r.length - 1 ? o[0] : o[1];
        i.current = setInterval(() => {
          t >= r.length - 1 ? a() : u([o[0], ++t]);
        }, 150);
      },
      a = () => {
        b(!1), i.current && clearInterval(i.current), (i.current = null);
      },
      P = () => {
        i.current ? a() : M();
      };
    return /* @__PURE__ */ e.jsxs("div", {
      className: v("flex w-full items-center", m),
      children: [
        A &&
          /* @__PURE__ */ e.jsx("button", {
            "type": "button",
            "aria-label": "Play",
            "title": "Play",
            "className": "w-fit px-2",
            "onClick": P,
            "children": h
              ? /* @__PURE__ */ e.jsx(R, { className: "h-4 w-4 text-black dark:text-white" })
              : /* @__PURE__ */ e.jsx(V, { className: "h-4 w-4 text-black dark:text-white" }),
          }),
        /* @__PURE__ */ e.jsxs(y, {
          className: "group relative flex h-5 w-full touch-none select-none items-center ",
          value: $,
          min: 0,
          max: r.length - 1,
          onValueChange: t => {
            i.current && a(), d(t);
          },
          onValueCommit: t => {
            i.current && a(), u(t);
          },
          minStepsBetweenThumbs: 1,
          children: [
            /* @__PURE__ */ e.jsx("p", {
              className: "text-dim w-fit text-sm",
              children: n ? s(r[0], "yyyy", l.language) : r[0],
            }),
            /* @__PURE__ */ e.jsxs("div", {
              className: "group relative flex h-5 grow touch-none select-none items-center",
              children: [
                /* @__PURE__ */ e.jsx(w, {
                  className:
                    "dark:bg-washed-dark relative z-0 mx-3 h-2 grow rounded-full bg-[#E2E8F0]",
                  children: /* @__PURE__ */ e.jsx(j, {
                    className:
                      "group-focus-within:bg-primary group-hover:bg-primary dark:group-focus-within:bg-primary dark:group-hover:bg-primary absolute z-0 h-full rounded-xl bg-[#A1A1AA]",
                  }),
                }),
                /* @__PURE__ */ e.jsx(p, {
                  className:
                    "group-focus-within:border-primary group-focus-within:ring-primary group-hover:border-primary group-hover:ring-primary ml-3 block h-5 w-5 cursor-pointer rounded-full border-2 border-[#A1A1AA] bg-white shadow-xl group-focus-within:ring-4 group-hover:ring-4",
                  children: /* @__PURE__ */ e.jsx(x, {
                    play: h,
                    children: n ? s(r[o[0]], f[g], l.language) : r[o[0]],
                  }),
                }),
                /* @__PURE__ */ e.jsx(p, {
                  className:
                    "group-focus-within:border-primary group-focus-within:ring-primary group-hover:border-primary group-hover:ring-primary mr-3 block h-5 w-5 cursor-pointer rounded-full border-2 border-[#A1A1AA] bg-white shadow-xl group-focus-within:ring-4 group-hover:ring-4",
                  children: /* @__PURE__ */ e.jsx(x, {
                    play: h,
                    children: n ? s(r[o[1]], f[g], l.language) : r[o[1]],
                  }),
                }),
              ],
            }),
            /* @__PURE__ */ e.jsx("p", {
              className: "text-dim w-fit text-sm",
              children: n ? s(r[r.length - 1], "yyyy", l.language) : r[r.length - 1],
            }),
          ],
        }),
      ],
    });
  },
  x = ({ play: m, children: c }) =>
    /* @__PURE__ */ e.jsx("div", {
      className: "relative inline-block w-fit overflow-visible",
      children: /* @__PURE__ */ e.jsx("div", {
        className: v(
          "absolute -top-14 left-3 z-20 inline-block w-max max-w-[200px] -translate-x-1/2 transform rounded bg-black px-1.5 py-1 text-sm font-normal text-white transition-all before:absolute before:left-[38%] before:top-[26px] before:h-0 before:w-0 before:border-8 before:border-transparent before:border-t-black group-focus-within:visible group-hover:visible dark:bg-white dark:text-black dark:before:border-t-white",
          !m && "invisible"
        ),
        children: c,
      }),
    }),
  C = [16586208e5, 16587072e5, 16594848e5, 16595712e5];
export { L as default };
