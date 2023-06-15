import e from "react";
import pt from "react-dom";
function mt(a, { insertAt: o } = {}) {
  if (!a || typeof document > "u") return;
  let n = document.head || document.getElementsByTagName("head")[0],
    t = document.createElement("style");
  (t.type = "text/css"),
    o === "top" && n.firstChild ? n.insertBefore(t, n.firstChild) : n.appendChild(t),
    t.styleSheet ? (t.styleSheet.cssText = a) : t.appendChild(document.createTextNode(a));
}
mt(`[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1: hsl(0, 0%, 99%);--gray2: hsl(0, 0%, 97.3%);--gray3: hsl(0, 0%, 95.1%);--gray4: hsl(0, 0%, 93%);--gray5: hsl(0, 0%, 90.9%);--gray6: hsl(0, 0%, 88.7%);--gray7: hsl(0, 0%, 85.8%);--gray8: hsl(0, 0%, 78%);--gray9: hsl(0, 0%, 56.1%);--gray10: hsl(0, 0%, 52.3%);--gray11: hsl(0, 0%, 43.5%);--gray12: hsl(0, 0%, 9%);--border-radius: 6px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:none;z-index:999999999}[data-sonner-toaster][data-x-position=right]{right:max(var(--offset),env(safe-area-inset-right))}[data-sonner-toaster][data-x-position=left]{left:max(var(--offset),env(safe-area-inset-left))}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translate(-50%)}[data-sonner-toaster][data-y-position=top]{top:max(var(--offset),env(safe-area-inset-top))}[data-sonner-toaster][data-y-position=bottom]{bottom:max(var(--offset),env(safe-area-inset-bottom))}[data-sonner-toast]{--y: translateY(100%);--lift-amount: calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;will-change:transform,opacity,height;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:none}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px #0000001a;width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px #0000001a,0 0 0 2px #0003}[data-sonner-toast][data-y-position=top]{top:0;--y: translateY(-100%);--lift: 1;--lift-amount: calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y: translateY(100%);--lift: -1;--lift-amount: calc(var(--lift) * var(--gap))}[data-sonner-toast] [data-description]{font-weight:400;line-height:1.4;color:inherit}[data-sonner-toast] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:-3px;margin-right:4px}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast] [data-icon]>*{flex-shrink:0}[data-sonner-toast] [data-icon] svg{margin-left:-1px}[data-sonner-toast] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:auto;border:none;cursor:pointer;outline:none;transition:opacity .4s,box-shadow .2s}[data-sonner-toast] [data-button]:focus-visible{box-shadow:0 0 0 2px #0006}[data-sonner-toast] [data-button]:first-of-type{margin-left:auto}[data-sonner-toast] [data-cancel]{color:var(--color);background:var(--border-color)}[data-sonner-toast] [data-close-button]{position:absolute;left:0;top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;background:var(--gray1);color:var(--gray12);border:1px solid var(--gray4);transform:translate(-35%,-35%);border-radius:50%;opacity:0;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast]:hover [data-close-button]{opacity:1}[data-sonner-toast]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]:before{content:"";position:absolute;left:0;right:0;height:100%}[data-sonner-toast][data-y-position=top][data-swiping=true]:before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]:before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]:before{content:"";position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast]:after{content:"";position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y: translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale: var(--toasts-before) * .05 + 1;--y: translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y: translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y: translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y: translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y: translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]:before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount, 0px));transition:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation:swipe-out .2s ease-out forwards}@keyframes swipe-out{0%{transform:translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount)));opacity:1}to{transform:translateY(calc(var(--lift) * var(--offset) + var(--swipe-amount) + var(--lift) * -100%));opacity:0}}@media (max-width: 600px){[data-sonner-toaster]{position:fixed;--mobile-offset: 16px;right:var(--mobile-offset);left:var(--mobile-offset);width:100%}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - 32px)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset)}[data-sonner-toaster][data-y-position=bottom]{bottom:20px}[data-sonner-toaster][data-y-position=top]{top:20px}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset);right:var(--mobile-offset);transform:none}}[data-sonner-toaster][data-theme=light]{--normal-bg: #fff;--normal-border: var(--gray3);--normal-text: var(--gray12);--success-bg: hsl(143, 85%, 96%);--success-border: hsl(145, 92%, 91%);--success-text: hsl(140, 100%, 27%);--error-bg: hsl(359, 100%, 97%);--error-border: hsl(359, 100%, 94%);--error-text: hsl(360, 100%, 45%)}[data-sonner-toaster][data-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg: #000;--normal-border: hsl(0, 0%, 20%);--normal-text: var(--gray1)}[data-sonner-toaster][data-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg: #fff;--normal-border: var(--gray3);--normal-text: var(--gray12)}[data-sonner-toaster][data-theme=dark]{--normal-bg: #000;--normal-border: hsl(0, 0%, 20%);--normal-text: var(--gray1);--success-bg: hsl(150, 100%, 6%);--success-border: hsl(147, 100%, 12%);--success-text: hsl(150, 86%, 65%);--error-bg: hsl(358, 76%, 10%);--error-border: hsl(357, 89%, 16%);--error-text: hsl(358, 100%, 81%)}[data-rich-colors=true] [data-sonner-toast][data-type=success],[data-rich-colors=true] [data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true] [data-sonner-toast][data-type=error],[data-rich-colors=true] [data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size: 16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:nth-child(1){animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}to{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}to{opacity:.15}}@media (prefers-reduced-motion){[data-sonner-toast],[data-sonner-toast]>*,.sonner-loading-bar{transition:none!important;animation:none!important}}
`);
var ft = a => {
    switch (a) {
      case "success":
        return bt;
      case "error":
        return vt;
    }
  },
  ht = Array(12).fill(0),
  gt = ({ visible: a }) =>
    e.createElement(
      "div",
      { "className": "sonner-loading-wrapper", "data-visible": a },
      e.createElement(
        "div",
        { className: "sonner-spinner" },
        ht.map((o, n) =>
          e.createElement("div", { className: "sonner-loading-bar", key: `spinner-bar-${n}` })
        )
      )
    ),
  bt = e.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    e.createElement("path", {
      fillRule: "evenodd",
      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
      clipRule: "evenodd",
    })
  ),
  vt = e.createElement(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      height: "20",
      width: "20",
    },
    e.createElement("path", {
      fillRule: "evenodd",
      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
      clipRule: "evenodd",
    })
  ),
  J = 0,
  yt = class {
    constructor() {
      (this.subscribe = a => (
        this.subscribers.push(a),
        () => {
          let o = this.subscribers.indexOf(a);
          this.subscribers.splice(o, 1);
        }
      )),
        (this.publish = a => {
          this.subscribers.forEach(o => o(a)), (this.toasts = [...this.toasts, a]);
        }),
        (this.create = a => {
          var o;
          let { message: n, ...t } = a,
            m =
              typeof (a == null ? void 0 : a.id) == "number" ||
              ((o = a.id) == null ? void 0 : o.length) > 0
                ? a.id
                : J++;
          return (
            this.toasts.find(u => u.id === m)
              ? this.toasts.map(u =>
                  u.id === m ? (this.publish({ ...u, ...a, id: m }), { ...u, ...a }) : u
                )
              : this.publish({ title: n, ...t, id: m }),
            m
          );
        }),
        (this.dismiss = a => (
          a ||
            this.toasts.forEach(o => {
              this.subscribers.forEach(n => n({ id: o.id, dismiss: !0 }));
            }),
          this.subscribers.forEach(o => o({ id: a, dismiss: !0 })),
          a
        )),
        (this.message = (a, o) => this.create({ ...o, message: a })),
        (this.error = (a, o) => this.create({ ...o, message: a, type: "error" })),
        (this.success = (a, o) => this.create({ ...o, type: "success", message: a })),
        (this.promise = (a, o) => this.create({ ...o, promise: a })),
        (this.custom = (a, o) => {
          let n = (o == null ? void 0 : o.id) || J++;
          this.publish({ jsx: a(n), id: n, ...o });
        }),
        (this.subscribers = []),
        (this.toasts = []);
    }
  },
  v = new yt(),
  xt = (a, o) => {
    let n = (o == null ? void 0 : o.id) || J++;
    return v.publish({ title: a, ...o, id: n }), n;
  },
  wt = xt,
  Rt = Object.assign(wt, {
    success: v.success,
    error: v.error,
    custom: v.custom,
    message: v.message,
    promise: v.promise,
    dismiss: v.dismiss,
  }),
  Et = 3,
  kt = "32px",
  Ct = 4e3,
  Nt = 356,
  ot = 14,
  St = 20,
  zt = 200,
  rt = a => !!a.promise,
  Tt = a => {
    var o;
    let {
        invert: n,
        toast: t,
        interacting: m,
        setHeights: u,
        visibleToasts: L,
        heights: y,
        index: f,
        toasts: U,
        expanded: z,
        removeToast: j,
        closeButton: O,
        style: F,
        className: g = "",
        descriptionClassName: x = "",
        duration: C,
        position: M,
        expandByDefault: T,
      } = a,
      [Y, b] = e.useState(!1),
      [I, P] = e.useState(!1),
      [H, D] = e.useState(!1),
      [w, K] = e.useState(!1),
      [p, l] = e.useState(null),
      [d, c] = e.useState(0),
      [N, R] = e.useState(0),
      [V, Q] = e.useState(null),
      E = e.useRef(null),
      st = f === 0,
      nt = f + 1 <= L,
      Z = t.type,
      it = t.className || "",
      lt = t.descriptionClassName || "",
      $ = e.useMemo(() => y.findIndex(r => r.toastId === t.id) || 0, [y, t.id]),
      X = e.useMemo(() => t.duration || C || Ct, [t.duration, C]),
      _ = e.useRef(0),
      S = e.useRef(0),
      W = e.useRef(X),
      tt = e.useRef(0),
      A = e.useRef(null),
      [et, dt] = M.split("-"),
      at = e.useMemo(() => y.reduce((r, s, i) => (i >= $ ? r : r + s.height), 0), [y, $]),
      ct = t.invert || n,
      q = p === "loading";
    (S.current = e.useMemo(() => $ * ot + at, [$, at])),
      e.useEffect(() => {
        b(!0);
      }, []),
      e.useLayoutEffect(() => {
        if (!Y) return;
        let r = E.current,
          s = r.style.height;
        r.style.height = "auto";
        let i = r.getBoundingClientRect().height;
        (r.style.height = s), R(i);
        let h = y.find(B => B.toastId === t.id);
        u(
          h
            ? B => B.map(G => (G.toastId === t.id ? { ...G, height: i } : G))
            : B => [{ toastId: t.id, height: i }, ...B]
        );
      }, [t.title, t.description]),
      e.useEffect(() => {
        if (rt(t)) {
          l("loading");
          let r = s => {
            s.then(i => {
              t.success && typeof t.success == "function" && Q(t.success(i)), l("success");
            }).catch(i => {
              l("error"), t.error && typeof t.error == "function" && Q(t.error(i));
            });
          };
          t.promise instanceof Promise
            ? r(t.promise)
            : typeof t.promise == "function" && r(t.promise());
        }
      }, [t]);
    let k = e.useCallback(() => {
      P(!0),
        c(S.current),
        u(r => r.filter(s => s.toastId !== t.id)),
        setTimeout(() => {
          j(t);
        }, zt);
    }, [t, j, u, S]);
    e.useEffect(() => {
      if ((t.promise && p === "loading") || t.duration === 1 / 0) return;
      let r;
      return (
        z || m
          ? (() => {
              if (tt.current < _.current) {
                let s = /* @__PURE__ */ new Date().getTime() - _.current;
                W.current = W.current - s;
              }
              tt.current = /* @__PURE__ */ new Date().getTime();
            })()
          : ((_.current = /* @__PURE__ */ new Date().getTime()),
            (r = setTimeout(() => {
              var s;
              (s = t.onAutoClose) == null || s.call(t, t), k();
            }, W.current))),
        () => clearTimeout(r)
      );
    }, [z, m, T, t, X, k, t.promise, p]),
      e.useEffect(() => {
        let r = E.current;
        if (r) {
          let s = r.getBoundingClientRect().height;
          return (
            R(s),
            u(i => [{ toastId: t.id, height: s }, ...i]),
            () => u(i => i.filter(h => h.toastId !== t.id))
          );
        }
      }, [u, t.id]),
      e.useEffect(() => {
        t.delete && k();
      }, [t.delete]);
    let ut = e.useMemo(() => {
      if (!rt(t)) return null;
      switch (p) {
        case "loading":
          return t.loading;
        case "success":
          return typeof t.success == "function" ? V : t.success;
        case "error":
          return typeof t.error == "function" ? V : t.error;
        default:
          return t.loading;
      }
    }, [p, V]);
    return e.createElement(
      "li",
      {
        "aria-live": t.important ? "assertive" : "polite",
        "aria-atomic": "true",
        "role": "status",
        "tabIndex": 0,
        "ref": E,
        "className": g + " " + it,
        "data-sonner-toast": "",
        "data-styled": !t.jsx,
        "data-mounted": Y,
        "data-promise": !!t.promise,
        "data-removed": I,
        "data-visible": nt,
        "data-y-position": et,
        "data-x-position": dt,
        "data-index": f,
        "data-front": st,
        "data-swiping": H,
        "data-type": p !== "loading" && p ? p : Z,
        "data-invert": ct,
        "data-swipe-out": w,
        "data-expanded": !!(z || (T && Y)),
        "style": {
          "--index": f,
          "--toasts-before": f,
          "--z-index": U.length - f,
          "--offset": `${I ? d : S.current}px`,
          "--initial-height": T ? "auto" : `${N}px`,
          ...F,
          ...t.style,
        },
        "onPointerDown": r => {
          q ||
            (c(S.current),
            r.target.setPointerCapture(r.pointerId),
            r.target.tagName !== "BUTTON" && (D(!0), (A.current = r.clientY)));
        },
        "onPointerUp": () => {
          var r, s, i;
          if (w) return;
          let h = Number(
            ((r = E.current) == null
              ? void 0
              : r.style.getPropertyValue("--swipe-amount").replace("px", "")) || 0
          );
          if (Math.abs(h) >= St) {
            c(S.current), (s = t.onDismiss) == null || s.call(t, t), k(), K(!0);
            return;
          }
          (i = E.current) == null || i.style.setProperty("--swipe-amount", "0px"),
            (A.current = null),
            D(!1);
        },
        "onPointerMove": r => {
          var s, i;
          if (!A.current) return;
          let h = r.clientY - A.current;
          if (!(et === "top" ? h < 0 : h > 0)) {
            (s = E.current) == null || s.style.setProperty("--swipe-amount", "0px");
            return;
          }
          (i = E.current) == null || i.style.setProperty("--swipe-amount", `${h}px`);
        },
      },
      O && !t.jsx
        ? e.createElement(
            "button",
            {
              "aria-label": "Close toast",
              "data-disabled": q,
              "data-close-button": !0,
              "onClick": q
                ? void 0
                : () => {
                    var r;
                    k(), (r = t.onDismiss) == null || r.call(t, t);
                  },
            },
            e.createElement(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "12",
                height: "12",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "1.5",
                strokeLinecap: "round",
                strokeLinejoin: "round",
              },
              e.createElement("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              e.createElement("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            )
          )
        : null,
      t.jsx || e.isValidElement(t.title)
        ? t.jsx || t.title
        : e.createElement(
            e.Fragment,
            null,
            Z || t.icon || t.promise
              ? e.createElement(
                  "div",
                  { "data-icon": "" },
                  t.promise ? e.createElement(gt, { visible: p === "loading" }) : null,
                  t.icon || ft(p ?? t.type)
                )
              : null,
            e.createElement(
              "div",
              { "data-content": "" },
              e.createElement(
                "div",
                { "data-title": "" },
                e.createElement(e.Fragment, null, (o = t.title) != null ? o : ut)
              ),
              t.description
                ? e.createElement(
                    "div",
                    { "data-description": "", "className": x + lt },
                    t.description
                  )
                : null
            ),
            t.cancel
              ? e.createElement(
                  "button",
                  {
                    "data-button": !0,
                    "data-cancel": !0,
                    "onClick": () => {
                      var r;
                      k(), (r = t.cancel) != null && r.onClick && t.cancel.onClick();
                    },
                  },
                  t.cancel.label
                )
              : null,
            t.action
              ? e.createElement(
                  "button",
                  {
                    "data-button": "",
                    "onClick": () => {
                      var r;
                      k(), (r = t.action) == null || r.onClick();
                    },
                  },
                  t.action.label
                )
              : null
          )
    );
  },
  Bt = a => {
    var o;
    let {
        invert: n,
        position: t = "bottom-right",
        hotkey: m = ["altKey", "KeyT"],
        expand: u,
        closeButton: L,
        className: y,
        offset: f,
        theme: U = "light",
        richColors: z,
        duration: j,
        style: O,
        visibleToasts: F = Et,
        toastOptions: g,
      } = a,
      [x, C] = e.useState([]),
      [M, T] = e.useState([]),
      [Y, b] = e.useState(!1),
      [I, P] = e.useState(!1),
      [H, D] = t.split("-"),
      w = e.useRef(null),
      K = m.join("+").replace(/Key/g, "").replace(/Digit/g, ""),
      p = e.useCallback(l => C(d => d.filter(({ id: c }) => c !== l.id)), []);
    return (
      e.useEffect(
        () =>
          v.subscribe(l => {
            if (l.dismiss) {
              C(d => d.map(c => (c.id === l.id ? { ...c, delete: !0 } : c)));
              return;
            }
            setTimeout(() => {
              pt.flushSync(() => {
                C(d => {
                  let c = d.findIndex(N => N.id === l.id);
                  return c !== -1
                    ? [...d.slice(0, c), { ...d[c], ...l }, ...d.slice(c + 1)]
                    : [l, ...d];
                });
              });
            });
          }),
        []
      ),
      e.useEffect(() => {
        x.length <= 1 && b(!1);
      }, [x]),
      e.useEffect(() => {
        let l = d => {
          var c, N;
          m.every(R => d[R] || d.code === R) && (b(!0), (c = w.current) == null || c.focus()),
            d.code === "Escape" &&
              (document.activeElement === w.current ||
                ((N = w.current) != null && N.contains(document.activeElement))) &&
              b(!1);
        };
        return (
          document.addEventListener("keydown", l), () => document.removeEventListener("keydown", l)
        );
      }, [m]),
      x.length
        ? e.createElement(
            "section",
            { "aria-label": `Notifications ${K}`, "tabIndex": -1 },
            e.createElement(
              "ol",
              {
                "tabIndex": -1,
                "ref": w,
                "className": y,
                "data-sonner-toaster": !0,
                "data-theme": U,
                "data-rich-colors": z,
                "data-y-position": H,
                "data-x-position": D,
                "style": {
                  "--front-toast-height": `${(o = M[0]) == null ? void 0 : o.height}px`,
                  "--offset": typeof f == "number" ? `${f}px` : f || kt,
                  "--width": `${Nt}px`,
                  "--gap": `${ot}px`,
                  ...O,
                },
                "onMouseEnter": () => b(!0),
                "onMouseMove": () => b(!0),
                "onMouseLeave": () => {
                  I || b(!1);
                },
                "onPointerDown": () => {
                  P(!0);
                },
                "onPointerUp": () => P(!1),
              },
              x.map((l, d) =>
                e.createElement(Tt, {
                  key: l.id,
                  index: d,
                  toast: l,
                  duration: j,
                  className: g == null ? void 0 : g.className,
                  descriptionClassName: g == null ? void 0 : g.descriptionClassName,
                  invert: n,
                  visibleToasts: F,
                  closeButton: L,
                  interacting: I,
                  position: t,
                  style: g == null ? void 0 : g.style,
                  removeToast: p,
                  toasts: x,
                  heights: M,
                  setHeights: T,
                  expandByDefault: u,
                  expanded: Y,
                })
              )
            )
          )
        : null
    );
  };
export { Bt as Toaster, Rt as toast };
