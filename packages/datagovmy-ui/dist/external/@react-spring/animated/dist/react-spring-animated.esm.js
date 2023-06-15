import {
  eachProp as V,
  defineHidden as I,
  hasFluidValue as S,
  getFluidValue as $,
  each as c,
  is as l,
  isAnimatedString as F,
  createInterpolator as O,
  useForceUpdate as B,
  useLayoutEffect as D,
  addFluidObserver as K,
  removeFluidObserver as w,
  useOnce as L,
} from "../../shared/dist/react-spring-shared.esm.js";
import * as M from "react";
import { forwardRef as k, useRef as T, useCallback as q, useEffect as z } from "react";
import { raf as U } from "../../shared/node_modules/@react-spring/rafz/dist/react-spring-rafz.esm.js";
const h = Symbol.for("Animated:node"),
  G = e => !!e && e[h] === e,
  J = e => e && e[h],
  Q = (e, t) => I(e, h, t),
  W = e => e && e[h] && e[h].getPayload();
class j {
  constructor() {
    (this.payload = void 0), Q(this, this);
  }
  getPayload() {
    return this.payload || [];
  }
}
class f extends j {
  constructor(t) {
    super(),
      (this.done = !0),
      (this.elapsedTime = void 0),
      (this.lastPosition = void 0),
      (this.lastVelocity = void 0),
      (this.v0 = void 0),
      (this.durationProgress = 0),
      (this._value = t),
      l.num(this._value) && (this.lastPosition = this._value);
  }
  static create(t) {
    return new f(t);
  }
  getPayload() {
    return [this];
  }
  getValue() {
    return this._value;
  }
  setValue(t, s) {
    return (
      l.num(t) &&
        ((this.lastPosition = t),
        s && ((t = Math.round(t / s) * s), this.done && (this.lastPosition = t))),
      this._value === t ? !1 : ((this._value = t), !0)
    );
  }
  reset() {
    const { done: t } = this;
    (this.done = !1),
      l.num(this._value) &&
        ((this.elapsedTime = 0),
        (this.durationProgress = 0),
        (this.lastPosition = this._value),
        t && (this.lastVelocity = null),
        (this.v0 = null));
  }
}
class y extends f {
  constructor(t) {
    super(0),
      (this._string = null),
      (this._toString = void 0),
      (this._toString = O({
        output: [t, t],
      }));
  }
  static create(t) {
    return new y(t);
  }
  getValue() {
    let t = this._string;
    return t ?? (this._string = this._toString(this._value));
  }
  setValue(t) {
    if (l.str(t)) {
      if (t == this._string) return !1;
      (this._string = t), (this._value = 1);
    } else if (super.setValue(t)) this._string = null;
    else return !1;
    return !0;
  }
  reset(t) {
    t &&
      (this._toString = O({
        output: [this.getValue(), t],
      })),
      (this._value = 0),
      super.reset();
  }
}
const p = {
  dependencies: null,
};
class P extends j {
  constructor(t) {
    super(), (this.source = t), this.setValue(t);
  }
  getValue(t) {
    const s = {};
    return (
      V(this.source, (i, a) => {
        G(i) ? (s[a] = i.getValue(t)) : S(i) ? (s[a] = $(i)) : t || (s[a] = i);
      }),
      s
    );
  }
  setValue(t) {
    (this.source = t), (this.payload = this._makePayload(t));
  }
  reset() {
    this.payload && c(this.payload, t => t.reset());
  }
  _makePayload(t) {
    if (t) {
      const s = /* @__PURE__ */ new Set();
      return V(t, this._addToPayload, s), Array.from(s);
    }
  }
  _addToPayload(t) {
    p.dependencies && S(t) && p.dependencies.add(t);
    const s = W(t);
    s && c(s, i => this.add(i));
  }
}
class _ extends P {
  constructor(t) {
    super(t);
  }
  static create(t) {
    return new _(t);
  }
  getValue() {
    return this.source.map(t => t.getValue());
  }
  setValue(t) {
    const s = this.getPayload();
    return t.length == s.length
      ? s.map((i, a) => i.setValue(t[a])).some(Boolean)
      : (super.setValue(t.map(X)), !0);
  }
}
function X(e) {
  return (F(e) ? y : f).create(e);
}
function it(e) {
  const t = J(e);
  return t ? t.constructor : l.arr(e) ? _ : F(e) ? y : f;
}
function m() {
  return (
    (m =
      Object.assign ||
      function (e) {
        for (var t = 1; t < arguments.length; t++) {
          var s = arguments[t];
          for (var i in s) Object.prototype.hasOwnProperty.call(s, i) && (e[i] = s[i]);
        }
        return e;
      }),
    m.apply(this, arguments)
  );
}
const x = (e, t) => {
  const s = !l.fun(e) || (e.prototype && e.prototype.isReactComponent);
  return k((i, a) => {
    const o = T(null),
      n =
        s &&
        q(
          r => {
            o.current = C(a, r);
          },
          [a]
        ),
      [d, A] = Z(i, t),
      E = B(),
      v = () => {
        const r = o.current;
        if (s && !r) return;
        (r ? t.applyAnimatedValues(r, d.getValue(!0)) : !1) === !1 && E();
      },
      b = new Y(v, A),
      g = T();
    D(() => {
      const r = g.current;
      (g.current = b), c(A, u => K(u, b)), r && (c(r.deps, u => w(u, r)), U.cancel(r.update));
    }),
      z(v, []),
      L(() => () => {
        const r = g.current;
        c(r.deps, u => w(u, r));
      });
    const H = t.getComponentProps(d.getValue());
    return M.createElement(
      e,
      m({}, H, {
        ref: n,
      })
    );
  });
};
class Y {
  constructor(t, s) {
    (this.update = t), (this.deps = s);
  }
  eventObserved(t) {
    t.type == "change" && U.write(this.update);
  }
}
function Z(e, t) {
  const s = /* @__PURE__ */ new Set();
  return (
    (p.dependencies = s),
    e.style &&
      (e = m({}, e, {
        style: t.createAnimatedStyle(e.style),
      })),
    (e = new P(e)),
    (p.dependencies = null),
    [e, s]
  );
}
function C(e, t) {
  return e && (l.fun(e) ? e(t) : (e.current = t)), t;
}
const N = Symbol.for("AnimatedComponent"),
  nt = (
    e,
    {
      applyAnimatedValues: t = () => !1,
      createAnimatedStyle: s = a => new P(a),
      getComponentProps: i = a => a,
    } = {}
  ) => {
    const a = {
        applyAnimatedValues: t,
        createAnimatedStyle: s,
        getComponentProps: i,
      },
      o = n => {
        const d = R(n) || "Anonymous";
        return (
          l.str(n) ? (n = o[n] || (o[n] = x(n, a))) : (n = n[N] || (n[N] = x(n, a))),
          (n.displayName = `Animated(${d})`),
          n
        );
      };
    return (
      V(e, (n, d) => {
        l.arr(e) && (d = R(n)), (o[d] = o(n));
      }),
      {
        animated: o,
      }
    );
  },
  R = e =>
    l.str(e) ? e : e && l.str(e.displayName) ? e.displayName : (l.fun(e) && e.name) || null;
export {
  j as Animated,
  _ as AnimatedArray,
  P as AnimatedObject,
  y as AnimatedString,
  f as AnimatedValue,
  nt as createHost,
  J as getAnimated,
  it as getAnimatedType,
  W as getPayload,
  G as isAnimated,
  Q as setAnimated,
};
