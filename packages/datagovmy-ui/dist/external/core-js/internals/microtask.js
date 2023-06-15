import { g as w } from "./global.js";
import { f as x } from "./function-bind-context.js";
import "./object-get-own-property-descriptor.js";
import { __require as P } from "./task.js";
import { __require as B } from "./queue.js";
import { __require as D } from "./engine-is-ios.js";
import { __require as W } from "./engine-is-ios-pebble.js";
import { __require as y } from "./engine-is-webos-webkit.js";
import { __require as T } from "./engine-is-node.js";
import { __exports as N } from "../../../_virtual/object-get-own-property-descriptor.js";
var v, k;
function F() {
  if (k) return v;
  k = 1;
  var r = w,
    _ = x,
    l = N.f,
    s = P().set,
    E = B(),
    O = D(),
    M = W(),
    S = y(),
    u = T(),
    p = r.MutationObserver || r.WebKitMutationObserver,
    d = r.document,
    q = r.process,
    o = r.Promise,
    b = l(r, "queueMicrotask"),
    c = b && b.value,
    e,
    f,
    m,
    t,
    I;
  if (!c) {
    var a = new E(),
      n = function () {
        var i, g;
        for (u && (i = q.domain) && i.exit(); (g = a.get()); )
          try {
            g();
          } catch (h) {
            throw (a.head && e(), h);
          }
        i && i.enter();
      };
    !O && !u && !S && p && d
      ? ((f = !0),
        (m = d.createTextNode("")),
        new p(n).observe(m, { characterData: !0 }),
        (e = function () {
          m.data = f = !f;
        }))
      : !M && o && o.resolve
      ? ((t = o.resolve(void 0)),
        (t.constructor = o),
        (I = _(t.then, t)),
        (e = function () {
          I(n);
        }))
      : u
      ? (e = function () {
          q.nextTick(n);
        })
      : ((s = _(s, r)),
        (e = function () {
          s(n);
        })),
      (c = function (i) {
        a.head || e(), a.add(i);
      });
  }
  return (v = c), v;
}
export { F as __require };
