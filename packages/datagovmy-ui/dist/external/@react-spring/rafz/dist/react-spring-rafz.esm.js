let m = r();
const n = e => u(e, m);
let p = r();
n.write = e => u(e, p);
let s = r();
n.onStart = e => u(e, s);
let w = r();
n.onFrame = e => u(e, w);
let y = r();
n.onFinish = e => u(e, y);
let d = [];
n.setTimeout = (e, t) => {
  let l = n.now() + t,
    a = () => {
      let f = d.findIndex(L => L.cancel == a);
      ~f && d.splice(f, 1), (i -= ~f ? 1 : 0);
    },
    c = {
      time: l,
      handler: e,
      cancel: a,
    };
  return d.splice(Q(l), 0, c), (i += 1), S(), c;
};
let Q = e => ~(~d.findIndex(t => t.time > e) || ~d.length);
n.cancel = e => {
  s.delete(e), w.delete(e), m.delete(e), p.delete(e), y.delete(e);
};
n.sync = e => {
  (h = !0), n.batchedUpdates(e), (h = !1);
};
n.throttle = e => {
  let t;
  function l() {
    try {
      e(...t);
    } finally {
      t = null;
    }
  }
  function a(...c) {
    (t = c), n.onStart(l);
  }
  return (
    (a.handler = e),
    (a.cancel = () => {
      s.delete(l), (t = null);
    }),
    a
  );
};
let F = typeof window < "u" ? window.requestAnimationFrame : () => {};
n.use = e => (F = e);
n.now = typeof performance < "u" ? () => performance.now() : Date.now;
n.batchedUpdates = e => e();
n.catch = console.error;
n.frameLoop = "always";
n.advance = () => {
  n.frameLoop !== "demand"
    ? console.warn(
        "Cannot call the manual advancement of rafz whilst frameLoop is not set as demand"
      )
    : x();
};
let o = -1,
  i = 0,
  h = !1;
function u(e, t) {
  h ? (t.delete(e), e(0)) : (t.add(e), S());
}
function S() {
  o < 0 && ((o = 0), n.frameLoop !== "demand" && F(v));
}
function b() {
  o = -1;
}
function v() {
  ~o && (F(v), n.batchedUpdates(x));
}
function x() {
  let e = o;
  o = n.now();
  let t = Q(o);
  t && (z(d.splice(0, t), l => l.handler()), (i -= t)),
    s.flush(),
    m.flush(e ? Math.min(64, o - e) : 16.667),
    w.flush(),
    p.flush(),
    y.flush(),
    i || b();
}
function r() {
  let e = /* @__PURE__ */ new Set(),
    t = e;
  return {
    add(l) {
      (i += t == e && !e.has(l) ? 1 : 0), e.add(l);
    },
    delete(l) {
      return (i -= t == e && e.has(l) ? 1 : 0), e.delete(l);
    },
    flush(l) {
      t.size &&
        ((e = /* @__PURE__ */ new Set()),
        (i -= t.size),
        z(t, a => a(l) && e.add(a)),
        (i += e.size),
        (t = e));
    },
  };
}
function z(e, t) {
  e.forEach(l => {
    try {
      t(l);
    } catch (a) {
      n.catch(a);
    }
  });
}
export { n as raf };
