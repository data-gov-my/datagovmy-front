import {
  Globals as q,
  createStringInterpolator as ie,
  useMemoOne as se,
  createInterpolator as ne,
  isEqual as E,
  is as a,
  getFluidValue as x,
  toArray as R,
  each as S,
  frameLoop as gt,
  callFluidObservers as it,
  FluidValue as oe,
  deprecateInterpolate as ae,
  useForceUpdate as re,
  usePrev as bt,
  useLayoutEffect as ue,
  useOnce as ce,
  hasFluidValue as U,
  addFluidObserver as nt,
  removeFluidObserver as Ut,
  eachProp as $,
  flush as et,
  flushCalls as K,
  noop as St,
  deprecateDirectCall as he,
  isAnimatedString as Nt,
  getFluidObservers as At,
} from "../../shared/dist/react-spring-shared.esm.js";
import * as Qt from "react";
import { useContext as Dt, useMemo as tt, useRef as wt } from "react";
import {
  getAnimatedType as ct,
  setAnimated as kt,
  getAnimated as j,
  getPayload as _t,
  AnimatedValue as de,
  AnimatedString as Ct,
} from "../../animated/dist/react-spring-animated.esm.js";
import { raf as T } from "../../shared/node_modules/@react-spring/rafz/dist/react-spring-rafz.esm.js";
function A() {
  return (
    (A =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var i = arguments[t];
          for (var s in i) Object.prototype.hasOwnProperty.call(i, s) && (e[s] = i[s]);
        }
        return e;
      }),
    A.apply(this, arguments)
  );
}
function N(e, ...t) {
  return a.fun(e) ? e(...t) : e;
}
const J = (e, t) => e === !0 || !!(t && e && (a.fun(e) ? e(t) : R(e).includes(t))),
  zt = (e, t) => (a.obj(e) ? t && e[t] : e),
  $t = (e, t) => (e.default === !0 ? e[t] : e.default ? e.default[t] : void 0),
  le = e => e,
  yt = (e, t = le) => {
    let i = fe;
    e.default && e.default !== !0 && ((e = e.default), (i = Object.keys(e)));
    const s = {};
    for (const n of i) {
      const o = t(e[n], n);
      a.und(o) || (s[n] = o);
    }
    return s;
  },
  fe = ["config", "onProps", "onStart", "onChange", "onPause", "onResume", "onRest"],
  me = {
    config: 1,
    from: 1,
    to: 1,
    ref: 1,
    loop: 1,
    reset: 1,
    pause: 1,
    cancel: 1,
    reverse: 1,
    immediate: 1,
    default: 1,
    delay: 1,
    onProps: 1,
    onStart: 1,
    onChange: 1,
    onPause: 1,
    onResume: 1,
    onRest: 1,
    onResolve: 1,
    items: 1,
    trail: 1,
    sort: 1,
    expires: 1,
    initial: 1,
    enter: 1,
    update: 1,
    leave: 1,
    children: 1,
    onDestroyed: 1,
    keys: 1,
    callId: 1,
    parentId: 1,
  };
function pe(e) {
  const t = {};
  let i = 0;
  if (
    ($(e, (s, n) => {
      me[n] || ((t[n] = s), i++);
    }),
    i)
  )
    return t;
}
function Bt(e) {
  const t = pe(e);
  if (t) {
    const i = {
      to: t,
    };
    return $(e, (s, n) => n in t || (i[n] = s)), i;
  }
  return A({}, e);
}
function W(e) {
  return (
    (e = x(e)),
    a.arr(e)
      ? e.map(W)
      : Nt(e)
      ? q.createStringInterpolator({
          range: [0, 1],
          output: [e, e],
        })(1)
      : e
  );
}
function ge(e) {
  for (const t in e) return !0;
  return !1;
}
function ht(e) {
  return a.fun(e) || (a.arr(e) && a.obj(e[0]));
}
function _e(e, t) {
  var i;
  (i = e.ref) == null || i.delete(e), t == null || t.delete(e);
}
function ye(e, t) {
  if (t && e.ref !== t) {
    var i;
    (i = e.ref) == null || i.delete(e), t.add(e), (e.ref = t);
  }
}
const ve = {
    default: {
      tension: 170,
      friction: 26,
    },
    gentle: {
      tension: 120,
      friction: 14,
    },
    wobbly: {
      tension: 180,
      friction: 12,
    },
    stiff: {
      tension: 210,
      friction: 20,
    },
    slow: {
      tension: 280,
      friction: 60,
    },
    molasses: {
      tension: 280,
      friction: 120,
    },
  },
  Pe = e => e,
  dt = A({}, ve.default, {
    mass: 1,
    damping: 1,
    easing: Pe,
    clamp: !1,
  });
class be {
  constructor() {
    (this.tension = void 0),
      (this.friction = void 0),
      (this.frequency = void 0),
      (this.damping = void 0),
      (this.mass = void 0),
      (this.velocity = 0),
      (this.restVelocity = void 0),
      (this.precision = void 0),
      (this.progress = void 0),
      (this.duration = void 0),
      (this.easing = void 0),
      (this.clamp = void 0),
      (this.bounce = void 0),
      (this.decay = void 0),
      (this.round = void 0),
      Object.assign(this, dt);
  }
}
function Se(e, t, i) {
  i && ((i = A({}, i)), It(i, t), (t = A({}, i, t))), It(e, t), Object.assign(e, t);
  for (const h in dt) e[h] == null && (e[h] = dt[h]);
  let { mass: s, frequency: n, damping: o } = e;
  return (
    a.und(n) ||
      (n < 0.01 && (n = 0.01),
      o < 0 && (o = 0),
      (e.tension = Math.pow((2 * Math.PI) / n, 2) * s),
      (e.friction = (4 * Math.PI * o * s) / n)),
    e
  );
}
function It(e, t) {
  if (!a.und(t.decay)) e.duration = void 0;
  else {
    const i = !a.und(t.tension) || !a.und(t.friction);
    (i || !a.und(t.frequency) || !a.und(t.damping) || !a.und(t.mass)) &&
      ((e.duration = void 0), (e.decay = void 0)),
      i && (e.frequency = void 0);
  }
}
const Rt = [];
class Ae {
  constructor() {
    (this.changed = !1),
      (this.values = Rt),
      (this.toValues = null),
      (this.fromValues = Rt),
      (this.to = void 0),
      (this.from = void 0),
      (this.config = new be()),
      (this.immediate = !1);
  }
}
function Lt(e, { key: t, props: i, defaultProps: s, state: n, actions: o }) {
  return new Promise((h, g) => {
    var r;
    let l,
      u,
      f = J((r = i.cancel) != null ? r : s == null ? void 0 : s.cancel, t);
    if (f) y();
    else {
      a.und(i.pause) || (n.paused = J(i.pause, t));
      let m = s == null ? void 0 : s.pause;
      m !== !0 && (m = n.paused || J(m, t)),
        (l = N(i.delay || 0, t)),
        m ? (n.resumeQueue.add(b), o.pause()) : (o.resume(), b());
    }
    function v() {
      n.resumeQueue.add(b), n.timeouts.delete(u), u.cancel(), (l = u.time - T.now());
    }
    function b() {
      l > 0 && !q.skipAnimation
        ? ((u = T.setTimeout(y, l)), n.pauseQueue.add(v), n.timeouts.add(u))
        : y();
    }
    function y() {
      n.pauseQueue.delete(v), n.timeouts.delete(u), e <= (n.cancelId || 0) && (f = !0);
      try {
        o.start(
          A({}, i, {
            callId: e,
            cancel: f,
          }),
          h
        );
      } catch (m) {
        g(m);
      }
    }
  });
}
const vt = (e, t) =>
    t.length == 1
      ? t[0]
      : t.some(i => i.cancelled)
      ? z(e.get())
      : t.every(i => i.noop)
      ? Gt(e.get())
      : V(
          e.get(),
          t.every(i => i.finished)
        ),
  Gt = e => ({
    value: e,
    noop: !0,
    finished: !0,
    cancelled: !1,
  }),
  V = (e, t, i = !1) => ({
    value: e,
    finished: t,
    cancelled: i,
  }),
  z = e => ({
    value: e,
    cancelled: !0,
    finished: !1,
  });
function Ht(e, t, i, s) {
  const { callId: n, parentId: o, onRest: h } = t,
    { asyncTo: g, promise: r } = i;
  return !o && e === g && !t.reset
    ? r
    : (i.promise = (async () => {
        (i.asyncId = n), (i.asyncTo = e);
        const l = yt(t, (c, p) => (p === "onRest" ? void 0 : c));
        let u, f;
        const v = new Promise((c, p) => ((u = c), (f = p))),
          b = c => {
            const p = (n <= (i.cancelId || 0) && z(s)) || (n !== i.asyncId && V(s, !1));
            if (p) throw ((c.result = p), f(c), c);
          },
          y = (c, p) => {
            const _ = new Vt(),
              d = new Tt();
            return (async () => {
              if (q.skipAnimation) throw (Y(i), (d.result = V(s, !1)), f(d), d);
              b(_);
              const P = a.obj(c)
                ? A({}, c)
                : A({}, p, {
                    to: c,
                  });
              (P.parentId = n),
                $(l, (C, D) => {
                  a.und(P[D]) && (P[D] = C);
                });
              const w = await s.start(P);
              return (
                b(_),
                i.paused &&
                  (await new Promise(C => {
                    i.resumeQueue.add(C);
                  })),
                w
              );
            })();
          };
        let m;
        if (q.skipAnimation) return Y(i), V(s, !1);
        try {
          let c;
          a.arr(e)
            ? (c = (async p => {
                for (const _ of p) await y(_);
              })(e))
            : (c = Promise.resolve(e(y, s.stop.bind(s)))),
            await Promise.all([c.then(u), v]),
            (m = V(s.get(), !0, !1));
        } catch (c) {
          if (c instanceof Vt) m = c.result;
          else if (c instanceof Tt) m = c.result;
          else throw c;
        } finally {
          n == i.asyncId &&
            ((i.asyncId = o), (i.asyncTo = o ? g : void 0), (i.promise = o ? r : void 0));
        }
        return (
          a.fun(h) &&
            T.batchedUpdates(() => {
              h(m, s, s.item);
            }),
          m
        );
      })());
}
function Y(e, t) {
  et(e.timeouts, i => i.cancel()),
    e.pauseQueue.clear(),
    e.resumeQueue.clear(),
    (e.asyncId = e.asyncTo = e.promise = void 0),
    t && (e.cancelId = t);
}
class Vt extends Error {
  constructor() {
    super(
      "An async animation has been interrupted. You see this error because you forgot to use `await` or `.catch(...)` on its returned promise."
    ),
      (this.result = void 0);
  }
}
class Tt extends Error {
  constructor() {
    super("SkipAnimationSignal"), (this.result = void 0);
  }
}
const lt = e => e instanceof Pt;
let we = 1;
class Pt extends oe {
  constructor(...t) {
    super(...t), (this.id = we++), (this.key = void 0), (this._priority = 0);
  }
  get priority() {
    return this._priority;
  }
  set priority(t) {
    this._priority != t && ((this._priority = t), this._onPriorityChange(t));
  }
  get() {
    const t = j(this);
    return t && t.getValue();
  }
  to(...t) {
    return q.to(this, t);
  }
  interpolate(...t) {
    return ae(), q.to(this, t);
  }
  toJSON() {
    return this.get();
  }
  observerAdded(t) {
    t == 1 && this._attach();
  }
  observerRemoved(t) {
    t == 0 && this._detach();
  }
  _attach() {}
  _detach() {}
  _onChange(t, i = !1) {
    it(this, {
      type: "change",
      parent: this,
      value: t,
      idle: i,
    });
  }
  _onPriorityChange(t) {
    this.idle || gt.sort(this),
      it(this, {
        type: "priority",
        parent: this,
        priority: t,
      });
  }
}
const Q = Symbol.for("SpringPhase"),
  Kt = 1,
  ft = 2,
  mt = 4,
  rt = e => (e[Q] & Kt) > 0,
  M = e => (e[Q] & ft) > 0,
  L = e => (e[Q] & mt) > 0,
  Ft = (e, t) => (t ? (e[Q] |= ft | Kt) : (e[Q] &= ~ft)),
  xt = (e, t) => (t ? (e[Q] |= mt) : (e[Q] &= ~mt));
class Ce extends Pt {
  constructor(t, i) {
    if (
      (super(),
      (this.key = void 0),
      (this.animation = new Ae()),
      (this.queue = void 0),
      (this.defaultProps = {}),
      (this._state = {
        paused: !1,
        pauseQueue: /* @__PURE__ */ new Set(),
        resumeQueue: /* @__PURE__ */ new Set(),
        timeouts: /* @__PURE__ */ new Set(),
      }),
      (this._pendingCalls = /* @__PURE__ */ new Set()),
      (this._lastCallId = 0),
      (this._lastToId = 0),
      (this._memoizedDuration = 0),
      !a.und(t) || !a.und(i))
    ) {
      const s = a.obj(t)
        ? A({}, t)
        : A({}, i, {
            from: t,
          });
      a.und(s.default) && (s.default = !0), this.start(s);
    }
  }
  get idle() {
    return !(M(this) || this._state.asyncTo) || L(this);
  }
  get goal() {
    return x(this.animation.to);
  }
  get velocity() {
    const t = j(this);
    return t instanceof de ? t.lastVelocity || 0 : t.getPayload().map(i => i.lastVelocity || 0);
  }
  get hasAnimated() {
    return rt(this);
  }
  get isAnimating() {
    return M(this);
  }
  get isPaused() {
    return L(this);
  }
  advance(t) {
    let i = !0,
      s = !1;
    const n = this.animation;
    let { config: o, toValues: h } = n;
    const g = _t(n.to);
    !g && U(n.to) && (h = R(x(n.to))),
      n.values.forEach((u, f) => {
        if (u.done) return;
        const v = u.constructor == Ct ? 1 : g ? g[f].lastPosition : h[f];
        let b = n.immediate,
          y = v;
        if (!b) {
          if (((y = u.lastPosition), o.tension <= 0)) {
            u.done = !0;
            return;
          }
          let m = (u.elapsedTime += t);
          const c = n.fromValues[f],
            p = u.v0 != null ? u.v0 : (u.v0 = a.arr(o.velocity) ? o.velocity[f] : o.velocity);
          let _;
          if (a.und(o.duration))
            if (o.decay) {
              const d = o.decay === !0 ? 0.998 : o.decay,
                P = Math.exp(-(1 - d) * m);
              (y = c + (p / (1 - d)) * (1 - P)),
                (b = Math.abs(u.lastPosition - y) < 0.1),
                (_ = p * P);
            } else {
              _ = u.lastVelocity == null ? p : u.lastVelocity;
              const d = o.precision || (c == v ? 5e-3 : Math.min(1, Math.abs(v - c) * 1e-3)),
                P = o.restVelocity || d / 10,
                w = o.clamp ? 0 : o.bounce,
                C = !a.und(w),
                D = c == v ? u.v0 > 0 : c < v;
              let O,
                Z = !1;
              const I = 1,
                B = Math.ceil(t / I);
              for (
                let F = 0;
                F < B && ((O = Math.abs(_) > P), !(!O && ((b = Math.abs(v - y) <= d), b)));
                ++F
              ) {
                C && ((Z = y == v || y > v == D), Z && ((_ = -_ * w), (y = v)));
                const k = -o.tension * 1e-6 * (y - v),
                  at = -o.friction * 1e-3 * _,
                  ee = (k + at) / o.mass;
                (_ = _ + ee * I), (y = y + _ * I);
              }
            }
          else {
            let d = 1;
            o.duration > 0 &&
              (this._memoizedDuration !== o.duration &&
                ((this._memoizedDuration = o.duration),
                u.durationProgress > 0 &&
                  ((u.elapsedTime = o.duration * u.durationProgress), (m = u.elapsedTime += t))),
              (d = (o.progress || 0) + m / this._memoizedDuration),
              (d = d > 1 ? 1 : d < 0 ? 0 : d),
              (u.durationProgress = d)),
              (y = c + o.easing(d) * (v - c)),
              (_ = (y - u.lastPosition) / t),
              (b = d == 1);
          }
          (u.lastVelocity = _),
            Number.isNaN(y) && (console.warn("Got NaN while animating:", this), (b = !0));
        }
        g && !g[f].done && (b = !1),
          b ? (u.done = !0) : (i = !1),
          u.setValue(y, o.round) && (s = !0);
      });
    const r = j(this),
      l = r.getValue();
    if (i) {
      const u = x(n.to);
      (l !== u || s) && !o.decay
        ? (r.setValue(u), this._onChange(u))
        : s && o.decay && this._onChange(l),
        this._stop();
    } else s && this._onChange(l);
  }
  set(t) {
    return (
      T.batchedUpdates(() => {
        this._stop(), this._focus(t), this._set(t);
      }),
      this
    );
  }
  pause() {
    this._update({
      pause: !0,
    });
  }
  resume() {
    this._update({
      pause: !1,
    });
  }
  finish() {
    if (M(this)) {
      const { to: t, config: i } = this.animation;
      T.batchedUpdates(() => {
        this._onStart(), i.decay || this._set(t, !1), this._stop();
      });
    }
    return this;
  }
  update(t) {
    return (this.queue || (this.queue = [])).push(t), this;
  }
  start(t, i) {
    let s;
    return (
      a.und(t)
        ? ((s = this.queue || []), (this.queue = []))
        : (s = [
            a.obj(t)
              ? t
              : A({}, i, {
                  to: t,
                }),
          ]),
      Promise.all(s.map(n => this._update(n))).then(n => vt(this, n))
    );
  }
  stop(t) {
    const { to: i } = this.animation;
    return (
      this._focus(this.get()),
      Y(this._state, t && this._lastCallId),
      T.batchedUpdates(() => this._stop(i, t)),
      this
    );
  }
  reset() {
    this._update({
      reset: !0,
    });
  }
  eventObserved(t) {
    t.type == "change" ? this._start() : t.type == "priority" && (this.priority = t.priority + 1);
  }
  _prepareNode(t) {
    const i = this.key || "";
    let { to: s, from: n } = t;
    (s = a.obj(s) ? s[i] : s),
      (s == null || ht(s)) && (s = void 0),
      (n = a.obj(n) ? n[i] : n),
      n == null && (n = void 0);
    const o = {
      to: s,
      from: n,
    };
    return (
      rt(this) ||
        (t.reverse && ([s, n] = [n, s]),
        (n = x(n)),
        a.und(n) ? j(this) || this._set(s) : this._set(n)),
      o
    );
  }
  _update(t, i) {
    let s = A({}, t);
    const { key: n, defaultProps: o } = this;
    s.default &&
      Object.assign(
        o,
        yt(s, (r, l) => (/^on/.test(l) ? zt(r, n) : r))
      ),
      Et(this, s, "onProps"),
      H(this, "onProps", s, this);
    const h = this._prepareNode(s);
    if (Object.isFrozen(this))
      throw Error(
        "Cannot animate a `SpringValue` object that is frozen. Did you forget to pass your component to `animated(...)` before animating its props?"
      );
    const g = this._state;
    return Lt(++this._lastCallId, {
      key: n,
      props: s,
      defaultProps: o,
      state: g,
      actions: {
        pause: () => {
          L(this) ||
            (xt(this, !0),
            K(g.pauseQueue),
            H(this, "onPause", V(this, G(this, this.animation.to)), this));
        },
        resume: () => {
          L(this) &&
            (xt(this, !1),
            M(this) && this._resume(),
            K(g.resumeQueue),
            H(this, "onResume", V(this, G(this, this.animation.to)), this));
        },
        start: this._merge.bind(this, h),
      },
    }).then(r => {
      if (s.loop && r.finished && !(i && r.noop)) {
        const l = Jt(s);
        if (l) return this._update(l, !0);
      }
      return r;
    });
  }
  _merge(t, i, s) {
    if (i.cancel) return this.stop(!0), s(z(this));
    const n = !a.und(t.to),
      o = !a.und(t.from);
    if (n || o)
      if (i.callId > this._lastToId) this._lastToId = i.callId;
      else return s(z(this));
    const { key: h, defaultProps: g, animation: r } = this,
      { to: l, from: u } = r;
    let { to: f = l, from: v = u } = t;
    o && !n && (!i.default || a.und(f)) && (f = v), i.reverse && ([f, v] = [v, f]);
    const b = !E(v, u);
    b && (r.from = v), (v = x(v));
    const y = !E(f, l);
    y && this._focus(f);
    const m = ht(i.to),
      { config: c } = r,
      { decay: p, velocity: _ } = c;
    (n || o) && (c.velocity = 0),
      i.config && !m && Se(c, N(i.config, h), i.config !== g.config ? N(g.config, h) : void 0);
    let d = j(this);
    if (!d || a.und(f)) return s(V(this, !0));
    const P = a.und(i.reset) ? o && !i.default : !a.und(v) && J(i.reset, h),
      w = P ? v : this.get(),
      C = W(f),
      D = a.num(C) || a.arr(C) || Nt(C),
      O = !m && (!D || J(g.immediate || i.immediate, h));
    if (y) {
      const F = ct(f);
      if (F !== d.constructor)
        if (O) d = this._set(C);
        else
          throw Error(
            `Cannot animate between ${d.constructor.name} and ${F.name}, as the "to" prop suggests`
          );
    }
    const Z = d.constructor;
    let I = U(f),
      B = !1;
    if (!I) {
      const F = P || (!rt(this) && b);
      (y || F) && ((B = E(W(w), C)), (I = !B)),
        ((!E(r.immediate, O) && !O) || !E(c.decay, p) || !E(c.velocity, _)) && (I = !0);
    }
    if (
      (B && M(this) && (r.changed && !P ? (I = !0) : I || this._stop(l)),
      !m &&
        ((I || U(l)) &&
          ((r.values = d.getPayload()), (r.toValues = U(f) ? null : Z == Ct ? [1] : R(C))),
        r.immediate != O && ((r.immediate = O), !O && !P && this._set(l)),
        I))
    ) {
      const { onRest: F } = r;
      S(Re, at => Et(this, i, at));
      const k = V(this, G(this, l));
      K(this._pendingCalls, k),
        this._pendingCalls.add(s),
        r.changed &&
          T.batchedUpdates(() => {
            (r.changed = !P),
              F == null || F(k, this),
              P ? N(g.onRest, k) : r.onStart == null || r.onStart(k, this);
          });
    }
    P && this._set(w),
      m
        ? s(Ht(i.to, i, this._state, this))
        : I
        ? this._start()
        : M(this) && !y
        ? this._pendingCalls.add(s)
        : s(Gt(w));
  }
  _focus(t) {
    const i = this.animation;
    t !== i.to && (At(this) && this._detach(), (i.to = t), At(this) && this._attach());
  }
  _attach() {
    let t = 0;
    const { to: i } = this.animation;
    U(i) && (nt(i, this), lt(i) && (t = i.priority + 1)), (this.priority = t);
  }
  _detach() {
    const { to: t } = this.animation;
    U(t) && Ut(t, this);
  }
  _set(t, i = !0) {
    const s = x(t);
    if (!a.und(s)) {
      const n = j(this);
      if (!n || !E(s, n.getValue())) {
        const o = ct(s);
        !n || n.constructor != o ? kt(this, o.create(s)) : n.setValue(s),
          n &&
            T.batchedUpdates(() => {
              this._onChange(s, i);
            });
      }
    }
    return j(this);
  }
  _onStart() {
    const t = this.animation;
    t.changed || ((t.changed = !0), H(this, "onStart", V(this, G(this, t.to)), this));
  }
  _onChange(t, i) {
    i || (this._onStart(), N(this.animation.onChange, t, this)),
      N(this.defaultProps.onChange, t, this),
      super._onChange(t, i);
  }
  _start() {
    const t = this.animation;
    j(this).reset(x(t.to)),
      t.immediate || (t.fromValues = t.values.map(i => i.lastPosition)),
      M(this) || (Ft(this, !0), L(this) || this._resume());
  }
  _resume() {
    q.skipAnimation ? this.finish() : gt.start(this);
  }
  _stop(t, i) {
    if (M(this)) {
      Ft(this, !1);
      const s = this.animation;
      S(s.values, o => {
        o.done = !0;
      }),
        s.toValues && (s.onChange = s.onPause = s.onResume = void 0),
        it(this, {
          type: "idle",
          parent: this,
        });
      const n = i ? z(this.get()) : V(this.get(), G(this, t ?? s.to));
      K(this._pendingCalls, n), s.changed && ((s.changed = !1), H(this, "onRest", n, this));
    }
  }
}
function G(e, t) {
  const i = W(t),
    s = W(e.get());
  return E(s, i);
}
function Jt(e, t = e.loop, i = e.to) {
  let s = N(t);
  if (s) {
    const n = s !== !0 && Bt(s),
      o = (n || e).reverse,
      h = !n || n.reset;
    return X(
      A(
        {},
        e,
        {
          loop: t,
          default: !1,
          pause: void 0,
          to: !o || ht(i) ? i : void 0,
          from: h ? e.from : void 0,
          reset: h,
        },
        n
      )
    );
  }
}
function X(e) {
  const { to: t, from: i } = (e = Bt(e)),
    s = /* @__PURE__ */ new Set();
  return a.obj(t) && Ot(t, s), a.obj(i) && Ot(i, s), (e.keys = s.size ? Array.from(s) : null), e;
}
function Ie(e) {
  const t = X(e);
  return a.und(t.default) && (t.default = yt(t)), t;
}
function Ot(e, t) {
  $(e, (i, s) => i != null && t.add(s));
}
const Re = ["onStart", "onRest", "onChange", "onPause", "onResume"];
function Et(e, t, i) {
  e.animation[i] = t[i] !== $t(t, i) ? zt(t[i], e.key) : void 0;
}
function H(e, t, ...i) {
  var s, n, o, h;
  (s = (n = e.animation)[t]) == null || s.call(n, ...i),
    (o = (h = e.defaultProps)[t]) == null || o.call(h, ...i);
}
const Ve = ["onStart", "onChange", "onRest"];
let Te = 1;
class Fe {
  constructor(t, i) {
    (this.id = Te++),
      (this.springs = {}),
      (this.queue = []),
      (this.ref = void 0),
      (this._flush = void 0),
      (this._initialProps = void 0),
      (this._lastAsyncId = 0),
      (this._active = /* @__PURE__ */ new Set()),
      (this._changed = /* @__PURE__ */ new Set()),
      (this._started = !1),
      (this._item = void 0),
      (this._state = {
        paused: !1,
        pauseQueue: /* @__PURE__ */ new Set(),
        resumeQueue: /* @__PURE__ */ new Set(),
        timeouts: /* @__PURE__ */ new Set(),
      }),
      (this._events = {
        onStart: /* @__PURE__ */ new Map(),
        onChange: /* @__PURE__ */ new Map(),
        onRest: /* @__PURE__ */ new Map(),
      }),
      (this._onFrame = this._onFrame.bind(this)),
      i && (this._flush = i),
      t &&
        this.start(
          A(
            {
              default: !0,
            },
            t
          )
        );
  }
  get idle() {
    return !this._state.asyncTo && Object.values(this.springs).every(t => t.idle);
  }
  get item() {
    return this._item;
  }
  set item(t) {
    this._item = t;
  }
  get() {
    const t = {};
    return this.each((i, s) => (t[s] = i.get())), t;
  }
  set(t) {
    for (const i in t) {
      const s = t[i];
      a.und(s) || this.springs[i].set(s);
    }
  }
  update(t) {
    return t && this.queue.push(X(t)), this;
  }
  start(t) {
    let { queue: i } = this;
    return (
      t ? (i = R(t).map(X)) : (this.queue = []),
      this._flush ? this._flush(this, i) : (te(this, i), pt(this, i))
    );
  }
  stop(t, i) {
    if ((t !== !!t && (i = t), i)) {
      const s = this.springs;
      S(R(i), n => s[n].stop(!!t));
    } else Y(this._state, this._lastAsyncId), this.each(s => s.stop(!!t));
    return this;
  }
  pause(t) {
    if (a.und(t))
      this.start({
        pause: !0,
      });
    else {
      const i = this.springs;
      S(R(t), s => i[s].pause());
    }
    return this;
  }
  resume(t) {
    if (a.und(t))
      this.start({
        pause: !1,
      });
    else {
      const i = this.springs;
      S(R(t), s => i[s].resume());
    }
    return this;
  }
  each(t) {
    $(this.springs, t);
  }
  _onFrame() {
    const { onStart: t, onChange: i, onRest: s } = this._events,
      n = this._active.size > 0,
      o = this._changed.size > 0;
    ((n && !this._started) || (o && !this._started)) &&
      ((this._started = !0),
      et(t, ([r, l]) => {
        (l.value = this.get()), r(l, this, this._item);
      }));
    const h = !n && this._started,
      g = o || (h && s.size) ? this.get() : null;
    o &&
      i.size &&
      et(i, ([r, l]) => {
        (l.value = g), r(l, this, this._item);
      }),
      h &&
        ((this._started = !1),
        et(s, ([r, l]) => {
          (l.value = g), r(l, this, this._item);
        }));
  }
  eventObserved(t) {
    if (t.type == "change") this._changed.add(t.parent), t.idle || this._active.add(t.parent);
    else if (t.type == "idle") this._active.delete(t.parent);
    else return;
    T.onFrame(this._onFrame);
  }
}
function pt(e, t) {
  return Promise.all(t.map(i => Wt(e, i))).then(i => vt(e, i));
}
async function Wt(e, t, i) {
  const { keys: s, to: n, from: o, loop: h, onRest: g, onResolve: r } = t,
    l = a.obj(t.default) && t.default;
  h && (t.loop = !1), n === !1 && (t.to = null), o === !1 && (t.from = null);
  const u = a.arr(n) || a.fun(n) ? n : void 0;
  u
    ? ((t.to = void 0), (t.onRest = void 0), l && (l.onRest = void 0))
    : S(Ve, m => {
        const c = t[m];
        if (a.fun(c)) {
          const p = e._events[m];
          (t[m] = ({ finished: _, cancelled: d }) => {
            const P = p.get(c);
            P
              ? (_ || (P.finished = !1), d && (P.cancelled = !0))
              : p.set(c, {
                  value: null,
                  finished: _ || !1,
                  cancelled: d || !1,
                });
          }),
            l && (l[m] = t[m]);
        }
      });
  const f = e._state;
  t.pause === !f.paused
    ? ((f.paused = t.pause), K(t.pause ? f.pauseQueue : f.resumeQueue))
    : f.paused && (t.pause = !0);
  const v = (s || Object.keys(e.springs)).map(m => e.springs[m].start(t)),
    b = t.cancel === !0 || $t(t, "cancel") === !0;
  (u || (b && f.asyncId)) &&
    v.push(
      Lt(++e._lastAsyncId, {
        props: t,
        state: f,
        actions: {
          pause: St,
          resume: St,
          start(m, c) {
            b ? (Y(f, e._lastAsyncId), c(z(e))) : ((m.onRest = g), c(Ht(u, m, f, e)));
          },
        },
      })
    ),
    f.paused &&
      (await new Promise(m => {
        f.resumeQueue.add(m);
      }));
  const y = vt(e, await Promise.all(v));
  if (h && y.finished && !(i && y.noop)) {
    const m = Jt(t, h, n);
    if (m) return te(e, [m]), Wt(e, m, !0);
  }
  return r && T.batchedUpdates(() => r(y, e, e.item)), y;
}
function jt(e, t) {
  const i = A({}, e.springs);
  return (
    t &&
      S(R(t), s => {
        a.und(s.keys) && (s = X(s)),
          a.obj(s.to) ||
            (s = A({}, s, {
              to: void 0,
            })),
          Zt(i, s, n => Xt(n));
      }),
    Yt(e, i),
    i
  );
}
function Yt(e, t) {
  $(t, (i, s) => {
    e.springs[s] || ((e.springs[s] = i), nt(i, e));
  });
}
function Xt(e, t) {
  const i = new Ce();
  return (i.key = e), t && nt(i, t), i;
}
function Zt(e, t, i) {
  t.keys &&
    S(t.keys, s => {
      (e[s] || (e[s] = i(s)))._prepareNode(t);
    });
}
function te(e, t) {
  S(t, i => {
    Zt(e.springs, i, s => Xt(s, e));
  });
}
function xe(e, t) {
  if (e == null) return {};
  var i = {},
    s = Object.keys(e),
    n,
    o;
  for (o = 0; o < s.length; o++) (n = s[o]), !(t.indexOf(n) >= 0) && (i[n] = e[n]);
  return i;
}
const Oe = ["children"],
  ot = e => {
    let { children: t } = e,
      i = xe(e, Oe);
    const s = Dt(st),
      n = i.pause || !!s.pause,
      o = i.immediate || !!s.immediate;
    i = se(
      () => ({
        pause: n,
        immediate: o,
      }),
      [n, o]
    );
    const { Provider: h } = st;
    return Qt.createElement(
      h,
      {
        value: i,
      },
      t
    );
  },
  st = Ee(ot, {});
ot.Provider = st.Provider;
ot.Consumer = st.Consumer;
function Ee(e, t) {
  return (
    Object.assign(e, Qt.createContext(t)), (e.Provider._context = e), (e.Consumer._context = e), e
  );
}
const je = () => {
  const e = [],
    t = function (n) {
      he();
      const o = [];
      return (
        S(e, (h, g) => {
          if (a.und(n)) o.push(h.start());
          else {
            const r = i(n, h, g);
            r && o.push(h.start(r));
          }
        }),
        o
      );
    };
  (t.current = e),
    (t.add = function (s) {
      e.includes(s) || e.push(s);
    }),
    (t.delete = function (s) {
      const n = e.indexOf(s);
      ~n && e.splice(n, 1);
    }),
    (t.pause = function () {
      return S(e, s => s.pause(...arguments)), this;
    }),
    (t.resume = function () {
      return S(e, s => s.resume(...arguments)), this;
    }),
    (t.set = function (s) {
      S(e, n => n.set(s));
    }),
    (t.start = function (s) {
      const n = [];
      return (
        S(e, (o, h) => {
          if (a.und(s)) n.push(o.start());
          else {
            const g = this._getProps(s, o, h);
            g && n.push(o.start(g));
          }
        }),
        n
      );
    }),
    (t.stop = function () {
      return S(e, s => s.stop(...arguments)), this;
    }),
    (t.update = function (s) {
      return S(e, (n, o) => n.update(this._getProps(s, n, o))), this;
    });
  const i = function (n, o, h) {
    return a.fun(n) ? n(h, o) : n;
  };
  return (t._getProps = i), t;
};
function qe(e, t, i) {
  const s = a.fun(t) && t;
  s && !i && (i = []);
  const n = tt(() => (s || arguments.length == 3 ? je() : void 0), []),
    o = wt(0),
    h = re(),
    g = tt(
      () => ({
        ctrls: [],
        queue: [],
        flush(p, _) {
          const d = jt(p, _);
          return o.current > 0 && !g.queue.length && !Object.keys(d).some(w => !p.springs[w])
            ? pt(p, _)
            : new Promise(w => {
                Yt(p, d),
                  g.queue.push(() => {
                    w(pt(p, _));
                  }),
                  h();
              });
        },
      }),
      []
    ),
    r = wt([...g.ctrls]),
    l = [],
    u = bt(e) || 0;
  tt(() => {
    S(r.current.slice(e, u), p => {
      _e(p, n), p.stop(!0);
    }),
      (r.current.length = e),
      f(u, e);
  }, [e]),
    tt(() => {
      f(0, Math.min(u, e));
    }, i);
  function f(p, _) {
    for (let d = p; d < _; d++) {
      const P = r.current[d] || (r.current[d] = new Fe(null, g.flush)),
        w = s ? s(d, P) : t[d];
      w && (l[d] = Ie(w));
    }
  }
  const v = r.current.map((p, _) => jt(p, l[_])),
    b = Dt(ot),
    y = bt(b),
    m = b !== y && ge(b);
  ue(() => {
    o.current++, (g.ctrls = r.current);
    const { queue: p } = g;
    p.length && ((g.queue = []), S(p, _ => _())),
      S(r.current, (_, d) => {
        n == null || n.add(_),
          m &&
            _.start({
              default: b,
            });
        const P = l[d];
        P && (ye(_, P.ref), _.ref ? _.queue.push(P) : _.start(P));
      });
  }),
    ce(() => () => {
      S(g.ctrls, p => p.stop(!0));
    });
  const c = v.map(p => A({}, p));
  return n ? [c, n] : c;
}
function ze(e, t) {
  const i = a.fun(e),
    [[s], n] = qe(1, i ? e : [e], i ? t || [] : t);
  return i || arguments.length == 2 ? [s, n] : s;
}
let qt;
(function (e) {
  (e.MOUNT = "mount"), (e.ENTER = "enter"), (e.UPDATE = "update"), (e.LEAVE = "leave");
})(qt || (qt = {}));
class Me extends Pt {
  constructor(t, i) {
    super(),
      (this.key = void 0),
      (this.idle = !0),
      (this.calc = void 0),
      (this._active = /* @__PURE__ */ new Set()),
      (this.source = t),
      (this.calc = ne(...i));
    const s = this._get(),
      n = ct(s);
    kt(this, n.create(s));
  }
  advance(t) {
    const i = this._get(),
      s = this.get();
    E(i, s) || (j(this).setValue(i), this._onChange(i, this.idle)),
      !this.idle && Mt(this._active) && ut(this);
  }
  _get() {
    const t = a.arr(this.source) ? this.source.map(x) : R(x(this.source));
    return this.calc(...t);
  }
  _start() {
    this.idle &&
      !Mt(this._active) &&
      ((this.idle = !1),
      S(_t(this), t => {
        t.done = !1;
      }),
      q.skipAnimation ? (T.batchedUpdates(() => this.advance()), ut(this)) : gt.start(this));
  }
  _attach() {
    let t = 1;
    S(R(this.source), i => {
      U(i) && nt(i, this),
        lt(i) && (i.idle || this._active.add(i), (t = Math.max(t, i.priority + 1)));
    }),
      (this.priority = t),
      this._start();
  }
  _detach() {
    S(R(this.source), t => {
      U(t) && Ut(t, this);
    }),
      this._active.clear(),
      ut(this);
  }
  eventObserved(t) {
    t.type == "change"
      ? t.idle
        ? this.advance()
        : (this._active.add(t.parent), this._start())
      : t.type == "idle"
      ? this._active.delete(t.parent)
      : t.type == "priority" &&
        (this.priority = R(this.source).reduce(
          (i, s) => Math.max(i, (lt(s) ? s.priority : 0) + 1),
          0
        ));
  }
}
function Ue(e) {
  return e.idle !== !1;
}
function Mt(e) {
  return !e.size || Array.from(e).every(Ue);
}
function ut(e) {
  e.idle ||
    ((e.idle = !0),
    S(_t(e), t => {
      t.done = !0;
    }),
    it(e, {
      type: "idle",
      parent: e,
    }));
}
q.assign({
  createStringInterpolator: ie,
  to: (e, t) => new Me(e, t),
});
export {
  Vt as BailSignal,
  Fe as Controller,
  Pt as FrameValue,
  q as Globals,
  Me as Interpolation,
  ot as SpringContext,
  je as SpringRef,
  Ce as SpringValue,
  ve as config,
  ne as createInterpolator,
  Bt as inferTo,
  ze as useSpring,
  qe as useSprings,
};
