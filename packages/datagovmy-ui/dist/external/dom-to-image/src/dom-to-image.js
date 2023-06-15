import { getDefaultExportFromCjs as Y } from "../../../_virtual/_commonjsHelpers.js";
import { __module as N } from "../../../_virtual/dom-to-image.js";
(function (O) {
  (function (ee) {
    var s = J(),
      B = z(),
      L = K(),
      k = Q(),
      F = {
        // Default is to fail on error, no placeholder
        imagePlaceholder: void 0,
        // Default cache bust is false, it will use the cache
        cacheBust: !1,
      },
      T = {
        toSvg: j,
        toPng: H,
        toJpeg: X,
        toBlob: G,
        toPixelData: V,
        impl: {
          fontFaces: L,
          images: k,
          util: s,
          inliner: B,
          options: {},
        },
      };
    O.exports = T;
    function j(n, t) {
      return (
        (t = t || {}),
        _(t),
        Promise.resolve(n)
          .then(function (o) {
            return M(o, t.filter, !0);
          })
          .then($)
          .then(W)
          .then(r)
          .then(function (o) {
            return q(o, t.width || s.width(n), t.height || s.height(n));
          })
      );
      function r(o) {
        return (
          t.bgcolor && (o.style.backgroundColor = t.bgcolor),
          t.width && (o.style.width = t.width + "px"),
          t.height && (o.style.height = t.height + "px"),
          t.style &&
            Object.keys(t.style).forEach(function (l) {
              o.style[l] = t.style[l];
            }),
          o
        );
      }
    }
    function V(n, t) {
      return I(n, t || {}).then(function (r) {
        return r.getContext("2d").getImageData(0, 0, s.width(n), s.height(n)).data;
      });
    }
    function H(n, t) {
      return I(n, t || {}).then(function (r) {
        return r.toDataURL();
      });
    }
    function X(n, t) {
      return (
        (t = t || {}),
        I(n, t).then(function (r) {
          return r.toDataURL("image/jpeg", t.quality || 1);
        })
      );
    }
    function G(n, t) {
      return I(n, t || {}).then(s.canvasToBlob);
    }
    function _(n) {
      typeof n.imagePlaceholder > "u"
        ? (T.impl.options.imagePlaceholder = F.imagePlaceholder)
        : (T.impl.options.imagePlaceholder = n.imagePlaceholder),
        typeof n.cacheBust > "u"
          ? (T.impl.options.cacheBust = F.cacheBust)
          : (T.impl.options.cacheBust = n.cacheBust);
    }
    function I(n, t) {
      return j(n, t)
        .then(s.makeImage)
        .then(s.delay(100))
        .then(function (o) {
          var l = r(n);
          return l.getContext("2d").drawImage(o, 0, 0), l;
        });
      function r(o) {
        var l = document.createElement("canvas");
        if (((l.width = t.width || s.width(o)), (l.height = t.height || s.height(o)), t.bgcolor)) {
          var c = l.getContext("2d");
          (c.fillStyle = t.bgcolor), c.fillRect(0, 0, l.width, l.height);
        }
        return l;
      }
    }
    function M(n, t, r) {
      if (!r && t && !t(n)) return Promise.resolve();
      return Promise.resolve(n)
        .then(o)
        .then(function (i) {
          return l(n, i, t);
        })
        .then(function (i) {
          return c(n, i);
        });
      function o(i) {
        return i instanceof HTMLCanvasElement ? s.makeImage(i.toDataURL()) : i.cloneNode(!1);
      }
      function l(i, a, p) {
        var P = i.childNodes;
        if (P.length === 0) return Promise.resolve(a);
        return m(a, s.asArray(P), p).then(function () {
          return a;
        });
        function m(S, v, g) {
          var y = Promise.resolve();
          return (
            v.forEach(function (C) {
              y = y
                .then(function () {
                  return M(C, g);
                })
                .then(function (w) {
                  w && S.appendChild(w);
                });
            }),
            y
          );
        }
      }
      function c(i, a) {
        if (!(a instanceof Element)) return a;
        return Promise.resolve()
          .then(p)
          .then(P)
          .then(m)
          .then(S)
          .then(function () {
            return a;
          });
        function p() {
          v(window.getComputedStyle(i), a.style);
          function v(g, y) {
            g.cssText ? (y.cssText = g.cssText) : C(g, y);
            function C(w, E) {
              s.asArray(w).forEach(function (e) {
                E.setProperty(e, w.getPropertyValue(e), w.getPropertyPriority(e));
              });
            }
          }
        }
        function P() {
          [":before", ":after"].forEach(function (g) {
            v(g);
          });
          function v(g) {
            var y = window.getComputedStyle(i, g),
              C = y.getPropertyValue("content");
            if (C === "" || C === "none") return;
            var w = s.uid();
            a.className = a.className + " " + w;
            var E = document.createElement("style");
            E.appendChild(e(w, g, y)), a.appendChild(E);
            function e(u, h, f) {
              var d = "." + u + ":" + h,
                b = f.cssText ? R(f) : D(f);
              return document.createTextNode(d + "{" + b + "}");
              function R(x) {
                var A = x.getPropertyValue("content");
                return x.cssText + " content: " + A + ";";
              }
              function D(x) {
                return s.asArray(x).map(A).join("; ") + ";";
                function A(U) {
                  return (
                    U +
                    ": " +
                    x.getPropertyValue(U) +
                    (x.getPropertyPriority(U) ? " !important" : "")
                  );
                }
              }
            }
          }
        }
        function m() {
          i instanceof HTMLTextAreaElement && (a.innerHTML = i.value),
            i instanceof HTMLInputElement && a.setAttribute("value", i.value);
        }
        function S() {
          a instanceof SVGElement &&
            (a.setAttribute("xmlns", "http://www.w3.org/2000/svg"),
            a instanceof SVGRectElement &&
              ["width", "height"].forEach(function (v) {
                var g = a.getAttribute(v);
                g && a.style.setProperty(v, g);
              }));
        }
      }
    }
    function $(n) {
      return L.resolveAll().then(function (t) {
        var r = document.createElement("style");
        return n.appendChild(r), r.appendChild(document.createTextNode(t)), n;
      });
    }
    function W(n) {
      return k.inlineAll(n).then(function () {
        return n;
      });
    }
    function q(n, t, r) {
      return Promise.resolve(n)
        .then(function (o) {
          return (
            o.setAttribute("xmlns", "http://www.w3.org/1999/xhtml"),
            new XMLSerializer().serializeToString(o)
          );
        })
        .then(s.escapeXhtml)
        .then(function (o) {
          return '<foreignObject x="0" y="0" width="100%" height="100%">' + o + "</foreignObject>";
        })
        .then(function (o) {
          return (
            '<svg xmlns="http://www.w3.org/2000/svg" width="' +
            t +
            '" height="' +
            r +
            '">' +
            o +
            "</svg>"
          );
        })
        .then(function (o) {
          return "data:image/svg+xml;charset=utf-8," + o;
        });
    }
    function J() {
      return {
        escape: S,
        parseExtension: t,
        mimeType: r,
        dataAsUrl: m,
        isDataUrl: o,
        canvasToBlob: c,
        resolveUrl: i,
        getAndEncode: P,
        uid: a(),
        delay: v,
        asArray: g,
        escapeXhtml: y,
        makeImage: p,
        width: C,
        height: w,
      };
      function n() {
        var e = "application/font-woff",
          u = "image/jpeg";
        return {
          woff: e,
          woff2: e,
          ttf: "application/font-truetype",
          eot: "application/vnd.ms-fontobject",
          png: "image/png",
          jpg: u,
          jpeg: u,
          gif: "image/gif",
          tiff: "image/tiff",
          svg: "image/svg+xml",
        };
      }
      function t(e) {
        var u = /\.([^\.\/]*?)$/g.exec(e);
        return u ? u[1] : "";
      }
      function r(e) {
        var u = t(e).toLowerCase();
        return n()[u] || "";
      }
      function o(e) {
        return e.search(/^(data:)/) !== -1;
      }
      function l(e) {
        return new Promise(function (u) {
          for (
            var h = window.atob(e.toDataURL().split(",")[1]),
              f = h.length,
              d = new Uint8Array(f),
              b = 0;
            b < f;
            b++
          )
            d[b] = h.charCodeAt(b);
          u(
            new Blob([d], {
              type: "image/png",
            })
          );
        });
      }
      function c(e) {
        return e.toBlob
          ? new Promise(function (u) {
              e.toBlob(u);
            })
          : l(e);
      }
      function i(e, u) {
        var h = document.implementation.createHTMLDocument(),
          f = h.createElement("base");
        h.head.appendChild(f);
        var d = h.createElement("a");
        return h.body.appendChild(d), (f.href = u), (d.href = e), d.href;
      }
      function a() {
        var e = 0;
        return function () {
          return "u" + u() + e++;
          function u() {
            return ("0000" + ((Math.random() * Math.pow(36, 4)) << 0).toString(36)).slice(-4);
          }
        };
      }
      function p(e) {
        return new Promise(function (u, h) {
          var f = new Image();
          (f.onload = function () {
            u(f);
          }),
            (f.onerror = h),
            (f.src = e);
        });
      }
      function P(e) {
        var u = 3e4;
        return (
          T.impl.options.cacheBust &&
            (e += (/\?/.test(e) ? "&" : "?") + /* @__PURE__ */ new Date().getTime()),
          new Promise(function (h) {
            var f = new XMLHttpRequest();
            (f.onreadystatechange = R),
              (f.ontimeout = D),
              (f.responseType = "blob"),
              (f.timeout = u),
              f.open("GET", e, !0),
              f.send();
            var d;
            if (T.impl.options.imagePlaceholder) {
              var b = T.impl.options.imagePlaceholder.split(/,/);
              b && b[1] && (d = b[1]);
            }
            function R() {
              if (f.readyState === 4) {
                if (f.status !== 200) {
                  d ? h(d) : x("cannot fetch resource: " + e + ", status: " + f.status);
                  return;
                }
                var A = new FileReader();
                (A.onloadend = function () {
                  var U = A.result.split(/,/)[1];
                  h(U);
                }),
                  A.readAsDataURL(f.response);
              }
            }
            function D() {
              d ? h(d) : x("timeout of " + u + "ms occured while fetching resource: " + e);
            }
            function x(A) {
              console.error(A), h("");
            }
          })
        );
      }
      function m(e, u) {
        return "data:" + u + ";base64," + e;
      }
      function S(e) {
        return e.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
      }
      function v(e) {
        return function (u) {
          return new Promise(function (h) {
            setTimeout(function () {
              h(u);
            }, e);
          });
        };
      }
      function g(e) {
        for (var u = [], h = e.length, f = 0; f < h; f++) u.push(e[f]);
        return u;
      }
      function y(e) {
        return e.replace(/#/g, "%23").replace(/\n/g, "%0A");
      }
      function C(e) {
        var u = E(e, "border-left-width"),
          h = E(e, "border-right-width");
        return e.scrollWidth + u + h;
      }
      function w(e) {
        var u = E(e, "border-top-width"),
          h = E(e, "border-bottom-width");
        return e.scrollHeight + u + h;
      }
      function E(e, u) {
        var h = window.getComputedStyle(e).getPropertyValue(u);
        return parseFloat(h.replace("px", ""));
      }
    }
    function z() {
      var n = /url\(['"]?([^'"]+?)['"]?\)/g;
      return {
        inlineAll: l,
        shouldProcess: t,
        impl: {
          readUrls: r,
          inline: o,
        },
      };
      function t(c) {
        return c.search(n) !== -1;
      }
      function r(c) {
        for (var i = [], a; (a = n.exec(c)) !== null; ) i.push(a[1]);
        return i.filter(function (p) {
          return !s.isDataUrl(p);
        });
      }
      function o(c, i, a, p) {
        return Promise.resolve(i)
          .then(function (m) {
            return a ? s.resolveUrl(m, a) : m;
          })
          .then(p || s.getAndEncode)
          .then(function (m) {
            return s.dataAsUrl(m, s.mimeType(i));
          })
          .then(function (m) {
            return c.replace(P(i), "$1" + m + "$3");
          });
        function P(m) {
          return new RegExp(`(url\\(['"]?)(` + s.escape(m) + `)(['"]?\\))`, "g");
        }
      }
      function l(c, i, a) {
        if (p()) return Promise.resolve(c);
        return Promise.resolve(c)
          .then(r)
          .then(function (P) {
            var m = Promise.resolve(c);
            return (
              P.forEach(function (S) {
                m = m.then(function (v) {
                  return o(v, S, i, a);
                });
              }),
              m
            );
          });
        function p() {
          return !t(c);
        }
      }
    }
    function K() {
      return {
        resolveAll: n,
        impl: {
          readAll: t,
        },
      };
      function n() {
        return t()
          .then(function (r) {
            return Promise.all(
              r.map(function (o) {
                return o.resolve();
              })
            );
          })
          .then(function (r) {
            return r.join(`
`);
          });
      }
      function t() {
        return Promise.resolve(s.asArray(document.styleSheets))
          .then(o)
          .then(r)
          .then(function (c) {
            return c.map(l);
          });
        function r(c) {
          return c
            .filter(function (i) {
              return i.type === CSSRule.FONT_FACE_RULE;
            })
            .filter(function (i) {
              return B.shouldProcess(i.style.getPropertyValue("src"));
            });
        }
        function o(c) {
          var i = [];
          return (
            c.forEach(function (a) {
              try {
                s.asArray(a.cssRules || []).forEach(i.push.bind(i));
              } catch (p) {
                console.log("Error while reading CSS rules from " + a.href, p.toString());
              }
            }),
            i
          );
        }
        function l(c) {
          return {
            resolve: function () {
              var a = (c.parentStyleSheet || {}).href;
              return B.inlineAll(c.cssText, a);
            },
            src: function () {
              return c.style.getPropertyValue("src");
            },
          };
        }
      }
    }
    function Q() {
      return {
        inlineAll: t,
        impl: {
          newImage: n,
        },
      };
      function n(r) {
        return {
          inline: o,
        };
        function o(l) {
          return s.isDataUrl(r.src)
            ? Promise.resolve()
            : Promise.resolve(r.src)
                .then(l || s.getAndEncode)
                .then(function (c) {
                  return s.dataAsUrl(c, s.mimeType(r.src));
                })
                .then(function (c) {
                  return new Promise(function (i, a) {
                    (r.onload = i), (r.onerror = a), (r.src = c);
                  });
                });
        }
      }
      function t(r) {
        if (!(r instanceof Element)) return Promise.resolve(r);
        return o(r).then(function () {
          return r instanceof HTMLImageElement
            ? n(r).inline()
            : Promise.all(
                s.asArray(r.childNodes).map(function (l) {
                  return t(l);
                })
              );
        });
        function o(l) {
          var c = l.style.getPropertyValue("background");
          return c
            ? B.inlineAll(c)
                .then(function (i) {
                  l.style.setProperty("background", i, l.style.getPropertyPriority("background"));
                })
                .then(function () {
                  return l;
                })
            : Promise.resolve(l);
        }
      }
    }
  })();
})(N);
var Z = N.exports;
const re = /* @__PURE__ */ Y(Z);
export { re as default };
