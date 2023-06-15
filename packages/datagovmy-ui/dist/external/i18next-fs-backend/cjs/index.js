import { __module as b } from "../../../_virtual/index.js";
import { __require as T } from "./utils.js";
import { __require as D } from "./readFile.js";
import { __require as C } from "./writeFile.js";
var F;
function V() {
  return F
    ? b.exports
    : ((F = 1),
      (function (W, p) {
        Object.defineProperty(p, "__esModule", {
          value: !0,
        }),
          (p.default = void 0);
        var l = T(),
          k = D(),
          _ = C();
        function v(n) {
          "@babel/helpers - typeof";
          return (
            (v =
              typeof Symbol == "function" && typeof Symbol.iterator == "symbol"
                ? function (i) {
                    return typeof i;
                  }
                : function (i) {
                    return i &&
                      typeof Symbol == "function" &&
                      i.constructor === Symbol &&
                      i !== Symbol.prototype
                      ? "symbol"
                      : typeof i;
                  }),
            v(n)
          );
        }
        function g(n, i) {
          if (!(n instanceof i)) throw new TypeError("Cannot call a class as a function");
        }
        function q(n, i) {
          for (var e = 0; e < i.length; e++) {
            var t = i[e];
            (t.enumerable = t.enumerable || !1),
              (t.configurable = !0),
              "value" in t && (t.writable = !0),
              Object.defineProperty(n, S(t.key), t);
          }
        }
        function O(n, i, e) {
          return (
            i && q(n.prototype, i),
            e && q(n, e),
            Object.defineProperty(n, "prototype", { writable: !1 }),
            n
          );
        }
        function S(n) {
          var i = j(n, "string");
          return v(i) === "symbol" ? i : String(i);
        }
        function j(n, i) {
          if (v(n) !== "object" || n === null) return n;
          var e = n[Symbol.toPrimitive];
          if (e !== void 0) {
            var t = e.call(n, i || "default");
            if (v(t) !== "object") return t;
            throw new TypeError("@@toPrimitive must return a primitive value.");
          }
          return (i === "string" ? String : Number)(n);
        }
        var x = function () {
            return {
              loadPath: "/locales/{{lng}}/{{ns}}.json",
              addPath: "/locales/{{lng}}/{{ns}}.missing.json",
              ident: 2,
              parse: JSON.parse,
              stringify: JSON.stringify,
            };
          },
          w = (function () {
            function n(i) {
              var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
                t = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
              g(this, n),
                (this.services = i),
                (this.options = e),
                (this.allOptions = t),
                (this.type = "backend"),
                this.init(i, e, t);
            }
            return (
              O(n, [
                {
                  key: "init",
                  value: function (e) {
                    var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
                      r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                    (this.services = e),
                      (this.options = (0, l.defaults)(t, this.options || {}, x())),
                      (this.allOptions = r),
                      (this.queuedWrites = {}),
                      (this.debouncedWrite = (0, l.debounce)(this.write, 250));
                  },
                },
                {
                  key: "read",
                  value: function (e, t, r) {
                    var o = this,
                      a = this.options.loadPath;
                    typeof this.options.loadPath == "function" && (a = this.options.loadPath(e, t));
                    var u = this.services.interpolator.interpolate(a, {
                      lng: e,
                      ns: t,
                    });
                    if (this.allOptions.initImmediate === !1) {
                      try {
                        var f = (0, k.readFileSync)(u, this.options),
                          h = f.data,
                          s = f.stat;
                        if (
                          this.options.expirationTime &&
                          s &&
                          s.mtime &&
                          s.mtime.getTime() + this.options.expirationTime < Date.now()
                        )
                          return this.removeFile(e, t), r(new Error("File expired!"), !1);
                        r(null, h);
                      } catch (d) {
                        r(d, !1);
                      }
                      return;
                    }
                    (0, k.readFile)(u, this.options)
                      .then(function (d) {
                        var m = d.data,
                          c = d.stat;
                        if (
                          o.options.expirationTime &&
                          c &&
                          c.mtime &&
                          c.mtime.getTime() + o.options.expirationTime < Date.now()
                        )
                          return o.removeFile(e, t), r(new Error("File expired!"), !1);
                        r(null, m);
                      })
                      .catch(function (d) {
                        return r(d, !1);
                      });
                  },
                },
                {
                  key: "create",
                  value: function (e, t, r, o, a) {
                    var u = this;
                    typeof a != "function" && (a = function () {}),
                      typeof e == "string" && (e = [e]);
                    var f = e.length,
                      h = function () {
                        --f || a();
                      };
                    e.forEach(function (s) {
                      u.queue.call(u, s, t, r, o, h);
                    });
                  },
                },
                {
                  key: "save",
                  value: function (e, t, r, o) {
                    var a = this;
                    o || (o = function () {});
                    var u = Object.keys(r),
                      f = u.length,
                      h = function () {
                        --f || o();
                      };
                    u.forEach(function (s) {
                      a.queue.call(a, e, t, s, r[s], h);
                    });
                  },
                },
                {
                  key: "removeFile",
                  value: function (e, t) {
                    var r = this.options.addPath;
                    typeof this.options.addPath == "function" && (r = this.options.addPath(e, t));
                    var o = this.services.interpolator.interpolate(r, {
                      lng: e,
                      ns: t,
                    });
                    (0, _.removeFile)(o, this.options)
                      .then(function () {})
                      .catch(function () {});
                  },
                },
                {
                  key: "write",
                  value: function () {
                    for (var e in this.queuedWrites) {
                      var t = this.queuedWrites[e];
                      if (e !== "locks") for (var r in t) this.writeFile(e, r);
                    }
                  },
                },
                {
                  key: "writeFile",
                  value: function (e, t) {
                    var r = this,
                      o = (0, l.getPath)(this.queuedWrites, ["locks", e, t]);
                    if (!o) {
                      var a = this.options.addPath;
                      typeof this.options.addPath == "function" && (a = this.options.addPath(e, t));
                      var u = this.services.interpolator.interpolate(a, {
                          lng: e,
                          ns: t,
                        }),
                        f = (0, l.getPath)(this.queuedWrites, [e, t]);
                      if (((0, l.setPath)(this.queuedWrites, [e, t], []), f.length)) {
                        (0, l.setPath)(this.queuedWrites, ["locks", e, t], !0);
                        var h = function (d) {
                          var m = d.data;
                          f.forEach(function (y) {
                            var P =
                              r.allOptions.keySeparator === !1
                                ? [y.key]
                                : y.key.split(r.allOptions.keySeparator || ".");
                            (0, l.setPath)(m, P, y.fallbackValue);
                          });
                          var c = function () {
                            (0, l.setPath)(r.queuedWrites, ["locks", e, t], !1),
                              f.forEach(function (P) {
                                P.callback && P.callback();
                              }),
                              r.debouncedWrite();
                          };
                          (0, _.writeFile)(u, m, r.options).then(c).catch(c);
                        };
                        (0, k.readFile)(u, this.options)
                          .then(h)
                          .catch(function () {
                            return h({
                              data: {},
                            });
                          });
                      }
                    }
                  },
                },
                {
                  key: "queue",
                  value: function (e, t, r, o, a) {
                    (0, l.pushPath)(this.queuedWrites, [e, t], {
                      key: r,
                      fallbackValue: o || "",
                      callback: a,
                    }),
                      this.debouncedWrite();
                  },
                },
              ]),
              n
            );
          })();
        w.type = "backend";
        var E = w;
        (p.default = E), (W.exports = p.default);
      })(b, b.exports),
      b.exports);
}
export { V as __require };
