import Z from "../../@babel/runtime/helpers/esm/extends.js";
import U from "../../@babel/runtime/helpers/esm/assertThisInitialized.js";
import ee from "../../@babel/runtime/helpers/esm/inheritsLoose.js";
import M from "../../memoize-one/dist/memoize-one.esm.js";
import { createElement as W, PureComponent as te } from "react";
var ie = typeof performance == "object" && typeof performance.now == "function",
  V = ie
    ? function () {
        return performance.now();
      }
    : function () {
        return Date.now();
      };
function $(l) {
  cancelAnimationFrame(l.id);
}
function re(l, t) {
  var n = V();
  function c() {
    V() - n >= t ? l.call(null) : (u.id = requestAnimationFrame(c));
  }
  var u = {
    id: requestAnimationFrame(c),
  };
  return u;
}
var k = -1;
function q(l) {
  if ((l === void 0 && (l = !1), k === -1 || l)) {
    var t = document.createElement("div"),
      n = t.style;
    (n.width = "50px"),
      (n.height = "50px"),
      (n.overflow = "scroll"),
      document.body.appendChild(t),
      (k = t.offsetWidth - t.clientWidth),
      document.body.removeChild(t);
  }
  return k;
}
var _ = null;
function H(l) {
  if ((l === void 0 && (l = !1), _ === null || l)) {
    var t = document.createElement("div"),
      n = t.style;
    (n.width = "50px"), (n.height = "50px"), (n.overflow = "scroll"), (n.direction = "rtl");
    var c = document.createElement("div"),
      u = c.style;
    return (
      (u.width = "100px"),
      (u.height = "100px"),
      t.appendChild(c),
      document.body.appendChild(t),
      t.scrollLeft > 0
        ? (_ = "positive-descending")
        : ((t.scrollLeft = 1), t.scrollLeft === 0 ? (_ = "negative") : (_ = "positive-ascending")),
      document.body.removeChild(t),
      _
    );
  }
  return _;
}
process.env.NODE_ENV;
var oe = 150,
  ne = function (t, n) {
    return t;
  },
  P = null,
  R = null;
process.env.NODE_ENV !== "production" &&
  typeof window < "u" &&
  typeof window.WeakSet < "u" &&
  ((P = /* @__PURE__ */ new WeakSet()), (R = /* @__PURE__ */ new WeakSet()));
function le(l) {
  var t,
    n = l.getItemOffset,
    c = l.getEstimatedTotalSize,
    u = l.getItemSize,
    z = l.getOffsetForIndexAndAlignment,
    S = l.getStartIndexForOffset,
    b = l.getStopIndexForStartIndex,
    O = l.initInstanceProps,
    g = l.shouldResetStyleCacheOnItemSizeChange,
    m = l.validateProps;
  return (
    (t = /* @__PURE__ */ (function (I) {
      ee(T, I);
      function T(f) {
        var e;
        return (
          (e = I.call(this, f) || this),
          (e._instanceProps = O(e.props, U(e))),
          (e._outerRef = void 0),
          (e._resetIsScrollingTimeoutId = null),
          (e.state = {
            instance: U(e),
            isScrolling: !1,
            scrollDirection: "forward",
            scrollOffset:
              typeof e.props.initialScrollOffset == "number" ? e.props.initialScrollOffset : 0,
            scrollUpdateWasRequested: !1,
          }),
          (e._callOnItemsRendered = void 0),
          (e._callOnItemsRendered = M(function (i, r, o, s) {
            return e.props.onItemsRendered({
              overscanStartIndex: i,
              overscanStopIndex: r,
              visibleStartIndex: o,
              visibleStopIndex: s,
            });
          })),
          (e._callOnScroll = void 0),
          (e._callOnScroll = M(function (i, r, o) {
            return e.props.onScroll({
              scrollDirection: i,
              scrollOffset: r,
              scrollUpdateWasRequested: o,
            });
          })),
          (e._getItemStyle = void 0),
          (e._getItemStyle = function (i) {
            var r = e.props,
              o = r.direction,
              s = r.itemSize,
              h = r.layout,
              a = e._getItemStyleCache(g && s, g && h, g && o),
              d;
            if (a.hasOwnProperty(i)) d = a[i];
            else {
              var p = n(e.props, i, e._instanceProps),
                y = u(e.props, i, e._instanceProps),
                w = o === "horizontal" || h === "horizontal",
                x = o === "rtl",
                E = w ? p : 0;
              a[i] = d = {
                position: "absolute",
                left: x ? void 0 : E,
                right: x ? E : void 0,
                top: w ? 0 : p,
                height: w ? "100%" : y,
                width: w ? y : "100%",
              };
            }
            return d;
          }),
          (e._getItemStyleCache = void 0),
          (e._getItemStyleCache = M(function (i, r, o) {
            return {};
          })),
          (e._onScrollHorizontal = function (i) {
            var r = i.currentTarget,
              o = r.clientWidth,
              s = r.scrollLeft,
              h = r.scrollWidth;
            e.setState(function (a) {
              if (a.scrollOffset === s) return null;
              var d = e.props.direction,
                p = s;
              if (d === "rtl")
                switch (H()) {
                  case "negative":
                    p = -s;
                    break;
                  case "positive-descending":
                    p = h - o - s;
                    break;
                }
              return (
                (p = Math.max(0, Math.min(p, h - o))),
                {
                  isScrolling: !0,
                  scrollDirection: a.scrollOffset < s ? "forward" : "backward",
                  scrollOffset: p,
                  scrollUpdateWasRequested: !1,
                }
              );
            }, e._resetIsScrollingDebounced);
          }),
          (e._onScrollVertical = function (i) {
            var r = i.currentTarget,
              o = r.clientHeight,
              s = r.scrollHeight,
              h = r.scrollTop;
            e.setState(function (a) {
              if (a.scrollOffset === h) return null;
              var d = Math.max(0, Math.min(h, s - o));
              return {
                isScrolling: !0,
                scrollDirection: a.scrollOffset < d ? "forward" : "backward",
                scrollOffset: d,
                scrollUpdateWasRequested: !1,
              };
            }, e._resetIsScrollingDebounced);
          }),
          (e._outerRefSetter = function (i) {
            var r = e.props.outerRef;
            (e._outerRef = i),
              typeof r == "function"
                ? r(i)
                : r != null &&
                  typeof r == "object" &&
                  r.hasOwnProperty("current") &&
                  (r.current = i);
          }),
          (e._resetIsScrollingDebounced = function () {
            e._resetIsScrollingTimeoutId !== null && $(e._resetIsScrollingTimeoutId),
              (e._resetIsScrollingTimeoutId = re(e._resetIsScrolling, oe));
          }),
          (e._resetIsScrolling = function () {
            (e._resetIsScrollingTimeoutId = null),
              e.setState(
                {
                  isScrolling: !1,
                },
                function () {
                  e._getItemStyleCache(-1, null);
                }
              );
          }),
          e
        );
      }
      T.getDerivedStateFromProps = function (e, i) {
        return ae(e, i), m(e), null;
      };
      var v = T.prototype;
      return (
        (v.scrollTo = function (e) {
          (e = Math.max(0, e)),
            this.setState(function (i) {
              return i.scrollOffset === e
                ? null
                : {
                    scrollDirection: i.scrollOffset < e ? "forward" : "backward",
                    scrollOffset: e,
                    scrollUpdateWasRequested: !0,
                  };
            }, this._resetIsScrollingDebounced);
        }),
        (v.scrollToItem = function (e, i) {
          i === void 0 && (i = "auto");
          var r = this.props,
            o = r.itemCount,
            s = r.layout,
            h = this.state.scrollOffset;
          e = Math.max(0, Math.min(e, o - 1));
          var a = 0;
          if (this._outerRef) {
            var d = this._outerRef;
            s === "vertical"
              ? (a = d.scrollWidth > d.clientWidth ? q() : 0)
              : (a = d.scrollHeight > d.clientHeight ? q() : 0);
          }
          this.scrollTo(z(this.props, e, i, h, this._instanceProps, a));
        }),
        (v.componentDidMount = function () {
          var e = this.props,
            i = e.direction,
            r = e.initialScrollOffset,
            o = e.layout;
          if (typeof r == "number" && this._outerRef != null) {
            var s = this._outerRef;
            i === "horizontal" || o === "horizontal" ? (s.scrollLeft = r) : (s.scrollTop = r);
          }
          this._callPropsCallbacks();
        }),
        (v.componentDidUpdate = function () {
          var e = this.props,
            i = e.direction,
            r = e.layout,
            o = this.state,
            s = o.scrollOffset,
            h = o.scrollUpdateWasRequested;
          if (h && this._outerRef != null) {
            var a = this._outerRef;
            if (i === "horizontal" || r === "horizontal")
              if (i === "rtl")
                switch (H()) {
                  case "negative":
                    a.scrollLeft = -s;
                    break;
                  case "positive-ascending":
                    a.scrollLeft = s;
                    break;
                  default:
                    var d = a.clientWidth,
                      p = a.scrollWidth;
                    a.scrollLeft = p - d - s;
                    break;
                }
              else a.scrollLeft = s;
            else a.scrollTop = s;
          }
          this._callPropsCallbacks();
        }),
        (v.componentWillUnmount = function () {
          this._resetIsScrollingTimeoutId !== null && $(this._resetIsScrollingTimeoutId);
        }),
        (v.render = function () {
          var e = this.props,
            i = e.children,
            r = e.className,
            o = e.direction,
            s = e.height,
            h = e.innerRef,
            a = e.innerElementType,
            d = e.innerTagName,
            p = e.itemCount,
            y = e.itemData,
            w = e.itemKey,
            x = w === void 0 ? ne : w,
            E = e.layout,
            K = e.outerElementType,
            j = e.outerTagName,
            B = e.style,
            G = e.useIsScrolling,
            J = e.width,
            D = this.state.isScrolling,
            N = o === "horizontal" || E === "horizontal",
            Q = N ? this._onScrollHorizontal : this._onScrollVertical,
            F = this._getRangeToRender(),
            X = F[0],
            Y = F[1],
            L = [];
          if (p > 0)
            for (var C = X; C <= Y; C++)
              L.push(
                W(i, {
                  data: y,
                  key: x(C, y),
                  index: C,
                  isScrolling: G ? D : void 0,
                  style: this._getItemStyle(C),
                })
              );
          var A = c(this.props, this._instanceProps);
          return W(
            K || j || "div",
            {
              className: r,
              onScroll: Q,
              ref: this._outerRefSetter,
              style: Z(
                {
                  position: "relative",
                  height: s,
                  width: J,
                  overflow: "auto",
                  WebkitOverflowScrolling: "touch",
                  willChange: "transform",
                  direction: o,
                },
                B
              ),
            },
            W(a || d || "div", {
              children: L,
              ref: h,
              style: {
                height: N ? "100%" : A,
                pointerEvents: D ? "none" : void 0,
                width: N ? A : "100%",
              },
            })
          );
        }),
        (v._callPropsCallbacks = function () {
          if (typeof this.props.onItemsRendered == "function") {
            var e = this.props.itemCount;
            if (e > 0) {
              var i = this._getRangeToRender(),
                r = i[0],
                o = i[1],
                s = i[2],
                h = i[3];
              this._callOnItemsRendered(r, o, s, h);
            }
          }
          if (typeof this.props.onScroll == "function") {
            var a = this.state,
              d = a.scrollDirection,
              p = a.scrollOffset,
              y = a.scrollUpdateWasRequested;
            this._callOnScroll(d, p, y);
          }
        }),
        (v._getRangeToRender = function () {
          var e = this.props,
            i = e.itemCount,
            r = e.overscanCount,
            o = this.state,
            s = o.isScrolling,
            h = o.scrollDirection,
            a = o.scrollOffset;
          if (i === 0) return [0, 0, 0, 0];
          var d = S(this.props, a, this._instanceProps),
            p = b(this.props, d, a, this._instanceProps),
            y = !s || h === "backward" ? Math.max(1, r) : 1,
            w = !s || h === "forward" ? Math.max(1, r) : 1;
          return [Math.max(0, d - y), Math.max(0, Math.min(i - 1, p + w)), d, p];
        }),
        T
      );
    })(te)),
    (t.defaultProps = {
      direction: "ltr",
      itemData: void 0,
      layout: "vertical",
      overscanCount: 2,
      useIsScrolling: !1,
    }),
    t
  );
}
var ae = function (t, n) {
    var c = t.children,
      u = t.direction,
      z = t.height,
      S = t.layout,
      b = t.innerTagName,
      O = t.outerTagName,
      g = t.width,
      m = n.instance;
    if (process.env.NODE_ENV !== "production") {
      (b != null || O != null) &&
        R &&
        !R.has(m) &&
        (R.add(m),
        console.warn(
          "The innerTagName and outerTagName props have been deprecated. Please use the innerElementType and outerElementType props instead."
        ));
      var I = u === "horizontal" || S === "horizontal";
      switch (u) {
        case "horizontal":
        case "vertical":
          P &&
            !P.has(m) &&
            (P.add(m),
            console.warn(
              'The direction prop should be either "ltr" (default) or "rtl". Please use the layout prop to specify "vertical" (default) or "horizontal" orientation.'
            ));
          break;
        case "ltr":
        case "rtl":
          break;
        default:
          throw Error(
            'An invalid "direction" prop has been specified. Value should be either "ltr" or "rtl". ' +
              ('"' + u + '" was specified.')
          );
      }
      switch (S) {
        case "horizontal":
        case "vertical":
          break;
        default:
          throw Error(
            'An invalid "layout" prop has been specified. Value should be either "horizontal" or "vertical". ' +
              ('"' + S + '" was specified.')
          );
      }
      if (c == null)
        throw Error(
          'An invalid "children" prop has been specified. Value should be a React component. ' +
            ('"' + (c === null ? "null" : typeof c) + '" was specified.')
        );
      if (I && typeof g != "number")
        throw Error(
          'An invalid "width" prop has been specified. Horizontal lists must specify a number for width. ' +
            ('"' + (g === null ? "null" : typeof g) + '" was specified.')
        );
      if (!I && typeof z != "number")
        throw Error(
          'An invalid "height" prop has been specified. Vertical lists must specify a number for height. ' +
            ('"' + (z === null ? "null" : typeof z) + '" was specified.')
        );
    }
  },
  fe = /* @__PURE__ */ le({
    getItemOffset: function (t, n) {
      var c = t.itemSize;
      return n * c;
    },
    getItemSize: function (t, n) {
      var c = t.itemSize;
      return c;
    },
    getEstimatedTotalSize: function (t) {
      var n = t.itemCount,
        c = t.itemSize;
      return c * n;
    },
    getOffsetForIndexAndAlignment: function (t, n, c, u, z, S) {
      var b = t.direction,
        O = t.height,
        g = t.itemCount,
        m = t.itemSize,
        I = t.layout,
        T = t.width,
        v = b === "horizontal" || I === "horizontal",
        f = v ? T : O,
        e = Math.max(0, g * m - f),
        i = Math.min(e, n * m),
        r = Math.max(0, n * m - f + m + S);
      switch ((c === "smart" && (u >= r - f && u <= i + f ? (c = "auto") : (c = "center")), c)) {
        case "start":
          return i;
        case "end":
          return r;
        case "center": {
          var o = Math.round(r + (i - r) / 2);
          return o < Math.ceil(f / 2) ? 0 : o > e + Math.floor(f / 2) ? e : o;
        }
        case "auto":
        default:
          return u >= r && u <= i ? u : u < r ? r : i;
      }
    },
    getStartIndexForOffset: function (t, n) {
      var c = t.itemCount,
        u = t.itemSize;
      return Math.max(0, Math.min(c - 1, Math.floor(n / u)));
    },
    getStopIndexForStartIndex: function (t, n, c) {
      var u = t.direction,
        z = t.height,
        S = t.itemCount,
        b = t.itemSize,
        O = t.layout,
        g = t.width,
        m = u === "horizontal" || O === "horizontal",
        I = n * b,
        T = m ? g : z,
        v = Math.ceil((T + c - I) / b);
      return Math.max(
        0,
        Math.min(
          S - 1,
          n + v - 1
          // -1 is because stop index is inclusive
        )
      );
    },
    initInstanceProps: function (t) {},
    shouldResetStyleCacheOnItemSizeChange: !0,
    validateProps: function (t) {
      var n = t.itemSize;
      if (process.env.NODE_ENV !== "production" && typeof n != "number")
        throw Error(
          'An invalid "itemSize" prop has been specified. Value should be a number. ' +
            ('"' + (n === null ? "null" : typeof n) + '" was specified.')
        );
    },
  });
export { fe as FixedSizeList };
