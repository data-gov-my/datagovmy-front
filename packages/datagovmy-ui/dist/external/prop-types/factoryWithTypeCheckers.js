import { __require as F } from "../react-is/index.js";
import { __require as N } from "../object-assign/index.js";
import { __require as ee } from "./lib/ReactPropTypesSecret.js";
import { __require as re } from "./lib/has.js";
import { __require as ne } from "./checkPropTypes.js";
var A, C;
function oe() {
  if (C) return A;
  C = 1;
  var k = F(),
    W = N(),
    h = ee(),
    j = re(),
    R = ne(),
    T = function () {};
  process.env.NODE_ENV !== "production" &&
    (T = function (x) {
      var S = "Warning: " + x;
      typeof console < "u" && console.error(S);
      try {
        throw new Error(S);
      } catch {}
    });
  function E() {
    return null;
  }
  return (
    (A = function (x, S) {
      var _ = typeof Symbol == "function" && Symbol.iterator,
        D = "@@iterator";
      function m(e) {
        var r = e && ((_ && e[_]) || e[D]);
        if (typeof r == "function") return r;
      }
      var P = "<<anonymous>>",
        w = {
          array: p("array"),
          bigint: p("bigint"),
          bool: p("boolean"),
          func: p("function"),
          number: p("number"),
          object: p("object"),
          string: p("string"),
          symbol: p("symbol"),
          any: M(),
          arrayOf: U,
          element: B(),
          elementType: J(),
          instanceOf: z,
          node: G(),
          objectOf: H,
          oneOf: L,
          oneOfType: X,
          shape: K,
          exact: Q,
        };
      function Y(e, r) {
        return e === r ? e !== 0 || 1 / e === 1 / r : e !== e && r !== r;
      }
      function d(e, r) {
        (this.message = e), (this.data = r && typeof r == "object" ? r : {}), (this.stack = "");
      }
      d.prototype = Error.prototype;
      function v(e) {
        if (process.env.NODE_ENV !== "production")
          var r = {},
            u = 0;
        function i(f, t, a, o, c, s, y) {
          if (((o = o || P), (s = s || a), y !== h)) {
            if (S) {
              var l = new Error(
                "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
              );
              throw ((l.name = "Invariant Violation"), l);
            } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
              var b = o + ":" + a;
              !r[b] && // Avoid spamming the console because they are often not actionable except for lib authors
                u < 3 &&
                (T(
                  "You are manually calling a React.PropTypes validation function for the `" +
                    s +
                    "` prop on `" +
                    o +
                    "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
                ),
                (r[b] = !0),
                u++);
            }
          }
          return t[a] == null
            ? f
              ? t[a] === null
                ? new d(
                    "The " +
                      c +
                      " `" +
                      s +
                      "` is marked as required " +
                      ("in `" + o + "`, but its value is `null`.")
                  )
                : new d(
                    "The " +
                      c +
                      " `" +
                      s +
                      "` is marked as required in " +
                      ("`" + o + "`, but its value is `undefined`.")
                  )
              : null
            : e(t, a, o, c, s);
        }
        var n = i.bind(null, !1);
        return (n.isRequired = i.bind(null, !0)), n;
      }
      function p(e) {
        function r(u, i, n, f, t, a) {
          var o = u[i],
            c = g(o);
          if (c !== e) {
            var s = O(o);
            return new d(
              "Invalid " +
                f +
                " `" +
                t +
                "` of type " +
                ("`" + s + "` supplied to `" + n + "`, expected ") +
                ("`" + e + "`."),
              { expectedType: e }
            );
          }
          return null;
        }
        return v(r);
      }
      function M() {
        return v(E);
      }
      function U(e) {
        function r(u, i, n, f, t) {
          if (typeof e != "function")
            return new d(
              "Property `" +
                t +
                "` of component `" +
                n +
                "` has invalid PropType notation inside arrayOf."
            );
          var a = u[i];
          if (!Array.isArray(a)) {
            var o = g(a);
            return new d(
              "Invalid " +
                f +
                " `" +
                t +
                "` of type " +
                ("`" + o + "` supplied to `" + n + "`, expected an array.")
            );
          }
          for (var c = 0; c < a.length; c++) {
            var s = e(a, c, n, f, t + "[" + c + "]", h);
            if (s instanceof Error) return s;
          }
          return null;
        }
        return v(r);
      }
      function B() {
        function e(r, u, i, n, f) {
          var t = r[u];
          if (!x(t)) {
            var a = g(t);
            return new d(
              "Invalid " +
                n +
                " `" +
                f +
                "` of type " +
                ("`" + a + "` supplied to `" + i + "`, expected a single ReactElement.")
            );
          }
          return null;
        }
        return v(e);
      }
      function J() {
        function e(r, u, i, n, f) {
          var t = r[u];
          if (!k.isValidElementType(t)) {
            var a = g(t);
            return new d(
              "Invalid " +
                n +
                " `" +
                f +
                "` of type " +
                ("`" + a + "` supplied to `" + i + "`, expected a single ReactElement type.")
            );
          }
          return null;
        }
        return v(e);
      }
      function z(e) {
        function r(u, i, n, f, t) {
          if (!(u[i] instanceof e)) {
            var a = e.name || P,
              o = V(u[i]);
            return new d(
              "Invalid " +
                f +
                " `" +
                t +
                "` of type " +
                ("`" + o + "` supplied to `" + n + "`, expected ") +
                ("instance of `" + a + "`.")
            );
          }
          return null;
        }
        return v(r);
      }
      function L(e) {
        if (!Array.isArray(e))
          return (
            process.env.NODE_ENV !== "production" &&
              (arguments.length > 1
                ? T(
                    "Invalid arguments supplied to oneOf, expected an array, got " +
                      arguments.length +
                      " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
                  )
                : T("Invalid argument supplied to oneOf, expected an array.")),
            E
          );
        function r(u, i, n, f, t) {
          for (var a = u[i], o = 0; o < e.length; o++) if (Y(a, e[o])) return null;
          var c = JSON.stringify(e, function (y, l) {
            var b = O(l);
            return b === "symbol" ? String(l) : l;
          });
          return new d(
            "Invalid " +
              f +
              " `" +
              t +
              "` of value `" +
              String(a) +
              "` " +
              ("supplied to `" + n + "`, expected one of " + c + ".")
          );
        }
        return v(r);
      }
      function H(e) {
        function r(u, i, n, f, t) {
          if (typeof e != "function")
            return new d(
              "Property `" +
                t +
                "` of component `" +
                n +
                "` has invalid PropType notation inside objectOf."
            );
          var a = u[i],
            o = g(a);
          if (o !== "object")
            return new d(
              "Invalid " +
                f +
                " `" +
                t +
                "` of type " +
                ("`" + o + "` supplied to `" + n + "`, expected an object.")
            );
          for (var c in a)
            if (j(a, c)) {
              var s = e(a, c, n, f, t + "." + c, h);
              if (s instanceof Error) return s;
            }
          return null;
        }
        return v(r);
      }
      function X(e) {
        if (!Array.isArray(e))
          return (
            process.env.NODE_ENV !== "production" &&
              T("Invalid argument supplied to oneOfType, expected an instance of array."),
            E
          );
        for (var r = 0; r < e.length; r++) {
          var u = e[r];
          if (typeof u != "function")
            return (
              T(
                "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " +
                  $(u) +
                  " at index " +
                  r +
                  "."
              ),
              E
            );
        }
        function i(n, f, t, a, o) {
          for (var c = [], s = 0; s < e.length; s++) {
            var y = e[s],
              l = y(n, f, t, a, o, h);
            if (l == null) return null;
            l.data && j(l.data, "expectedType") && c.push(l.data.expectedType);
          }
          var b = c.length > 0 ? ", expected one of type [" + c.join(", ") + "]" : "";
          return new d("Invalid " + a + " `" + o + "` supplied to " + ("`" + t + "`" + b + "."));
        }
        return v(i);
      }
      function G() {
        function e(r, u, i, n, f) {
          return I(r[u])
            ? null
            : new d(
                "Invalid " +
                  n +
                  " `" +
                  f +
                  "` supplied to " +
                  ("`" + i + "`, expected a ReactNode.")
              );
        }
        return v(e);
      }
      function q(e, r, u, i, n) {
        return new d(
          (e || "React class") +
            ": " +
            r +
            " type `" +
            u +
            "." +
            i +
            "` is invalid; it must be a function, usually from the `prop-types` package, but received `" +
            n +
            "`."
        );
      }
      function K(e) {
        function r(u, i, n, f, t) {
          var a = u[i],
            o = g(a);
          if (o !== "object")
            return new d(
              "Invalid " +
                f +
                " `" +
                t +
                "` of type `" +
                o +
                "` " +
                ("supplied to `" + n + "`, expected `object`.")
            );
          for (var c in e) {
            var s = e[c];
            if (typeof s != "function") return q(n, f, t, c, O(s));
            var y = s(a, c, n, f, t + "." + c, h);
            if (y) return y;
          }
          return null;
        }
        return v(r);
      }
      function Q(e) {
        function r(u, i, n, f, t) {
          var a = u[i],
            o = g(a);
          if (o !== "object")
            return new d(
              "Invalid " +
                f +
                " `" +
                t +
                "` of type `" +
                o +
                "` " +
                ("supplied to `" + n + "`, expected `object`.")
            );
          var c = W({}, u[i], e);
          for (var s in c) {
            var y = e[s];
            if (j(e, s) && typeof y != "function") return q(n, f, t, s, O(y));
            if (!y)
              return new d(
                "Invalid " +
                  f +
                  " `" +
                  t +
                  "` key `" +
                  s +
                  "` supplied to `" +
                  n +
                  "`.\nBad object: " +
                  JSON.stringify(u[i], null, "  ") +
                  `
Valid keys: ` +
                  JSON.stringify(Object.keys(e), null, "  ")
              );
            var l = y(a, s, n, f, t + "." + s, h);
            if (l) return l;
          }
          return null;
        }
        return v(r);
      }
      function I(e) {
        switch (typeof e) {
          case "number":
          case "string":
          case "undefined":
            return !0;
          case "boolean":
            return !e;
          case "object":
            if (Array.isArray(e)) return e.every(I);
            if (e === null || x(e)) return !0;
            var r = m(e);
            if (r) {
              var u = r.call(e),
                i;
              if (r !== e.entries) {
                for (; !(i = u.next()).done; ) if (!I(i.value)) return !1;
              } else
                for (; !(i = u.next()).done; ) {
                  var n = i.value;
                  if (n && !I(n[1])) return !1;
                }
            } else return !1;
            return !0;
          default:
            return !1;
        }
      }
      function Z(e, r) {
        return e === "symbol"
          ? !0
          : r
          ? r["@@toStringTag"] === "Symbol" || (typeof Symbol == "function" && r instanceof Symbol)
          : !1;
      }
      function g(e) {
        var r = typeof e;
        return Array.isArray(e) ? "array" : e instanceof RegExp ? "object" : Z(r, e) ? "symbol" : r;
      }
      function O(e) {
        if (typeof e > "u" || e === null) return "" + e;
        var r = g(e);
        if (r === "object") {
          if (e instanceof Date) return "date";
          if (e instanceof RegExp) return "regexp";
        }
        return r;
      }
      function $(e) {
        var r = O(e);
        switch (r) {
          case "array":
          case "object":
            return "an " + r;
          case "boolean":
          case "date":
          case "regexp":
            return "a " + r;
          default:
            return r;
        }
      }
      function V(e) {
        return !e.constructor || !e.constructor.name ? P : e.constructor.name;
      }
      return (
        (w.checkPropTypes = R), (w.resetWarningCache = R.resetWarningCache), (w.PropTypes = w), w
      );
    }),
    A
  );
}
export { oe as __require };
