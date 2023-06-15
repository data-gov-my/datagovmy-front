import "../../chart.js/dist/chart.js";
import { v as w } from "../../chart.js/dist/chunks/helpers.segment.js";
var c = {
    line: {
      color: "#F66",
      width: 1,
      dashPattern: [],
    },
    sync: {
      enabled: !0,
      group: 1,
      suppressTooltips: !1,
    },
    zoom: {
      enabled: !0,
      zoomboxBackgroundColor: "rgba(66,133,244,0.2)",
      zoomboxBorderColor: "#48F",
      zoomButtonText: "Reset Zoom",
      zoomButtonClass: "reset-zoom",
    },
    snap: {
      enabled: !1,
    },
    callbacks: {
      beforeZoom: function (e, s) {
        return !0;
      },
      afterZoom: function (e, s) {},
    },
  },
  V = {
    id: "crosshair",
    afterInit: function (e) {
      if (e.config.options.scales.x) {
        var s = e.config.options.scales.x.type;
        if (!(s !== "linear" && s !== "time" && s !== "category" && s !== "logarithmic")) {
          e.options.plugins.crosshair === void 0 && (e.options.plugins.crosshair = c),
            (e.crosshair = {
              enabled: !1,
              suppressUpdate: !1,
              x: null,
              originalData: [],
              originalXRange: {},
              dragStarted: !1,
              dragStartX: null,
              dragEndX: null,
              suppressTooltips: !1,
              ignoreNextEvents: 0,
              reset: function () {
                this.resetZoom(e, !1, !1);
              }.bind(this),
            });
          var i = this.getOption(e, "sync", "enabled");
          i &&
            ((e.crosshair.syncEventHandler = function (o) {
              this.handleSyncEvent(e, o);
            }.bind(this)),
            (e.crosshair.resetZoomEventHandler = function (o) {
              var n = this.getOption(e, "sync", "group");
              o.chartId !== e.id && o.syncGroup === n && this.resetZoom(e, !0);
            }.bind(this)),
            window.addEventListener("sync-event", e.crosshair.syncEventHandler),
            window.addEventListener("reset-zoom-event", e.crosshair.resetZoomEventHandler)),
            (e.panZoom = this.panZoom.bind(this, e));
        }
      }
    },
    destroy: function (e) {
      var s = this.getOption(e, "sync", "enabled");
      s &&
        (window.removeEventListener("sync-event", e.crosshair.syncEventHandler),
        window.removeEventListener("reset-zoom-event", e.crosshair.resetZoomEventHandler));
    },
    panZoom: function (e, s) {
      if (e.crosshair.originalData.length !== 0) {
        var i = e.crosshair.end - e.crosshair.start,
          o = e.crosshair.min,
          n = e.crosshair.max;
        s < 0
          ? ((e.crosshair.start = Math.max(e.crosshair.start + s, o)),
            (e.crosshair.end = e.crosshair.start === o ? o + i : e.crosshair.end + s))
          : ((e.crosshair.end = Math.min(e.crosshair.end + s, e.crosshair.max)),
            (e.crosshair.start = e.crosshair.end === n ? n - i : e.crosshair.start + s)),
          this.doZoom(e, e.crosshair.start, e.crosshair.end);
      }
    },
    getOption: function (e, s, i) {
      return w(
        e.options.plugins.crosshair[s] ? e.options.plugins.crosshair[s][i] : void 0,
        c[s][i]
      );
    },
    getXScale: function (e) {
      return e.data.datasets.length ? e.scales[e.getDatasetMeta(0).xAxisID] : null;
    },
    getYScale: function (e) {
      return e.scales[e.getDatasetMeta(0).yAxisID];
    },
    handleSyncEvent: function (e, s) {
      var i = this.getOption(e, "sync", "group");
      if (s.chartId !== e.id && s.syncGroup === i) {
        var o = this.getXScale(e);
        if (o) {
          var n =
            s.original.native.buttons === void 0
              ? s.original.native.which
              : s.original.native.buttons;
          s.original.type === "mouseup" && (n = 0);
          var r = {
            type: s.original.type == "click" ? "mousemove" : s.original.type,
            // do not transmit click events to prevent unwanted changing of synced charts. We do need to transmit a event to stop zooming on synced charts however.
            chart: e,
            x: o.getPixelForValue(s.xValue),
            y: s.original.y,
            native: {
              buttons: n,
            },
            stop: !0,
          };
          e._eventHandler(r);
        }
      }
    },
    afterEvent: function (e, s) {
      if (e.config.options.scales.x.length == 0) return;
      let i = s.event;
      var o = e.config.options.scales.x.type;
      if (!(o !== "linear" && o !== "time" && o !== "category" && xscaleType !== "logarithmic")) {
        var n = this.getXScale(e);
        if (n) {
          if (e.crosshair.ignoreNextEvents > 0) {
            e.crosshair.ignoreNextEvents -= 1;
            return;
          }
          var r = i.native.buttons === void 0 ? i.native.which : i.native.buttons;
          i.native.type === "mouseup" && (r = 0);
          var a = this.getOption(e, "sync", "enabled"),
            l = this.getOption(e, "sync", "group");
          if (!i.stop && a) {
            var s = new CustomEvent("sync-event");
            (s.chartId = e.id),
              (s.syncGroup = l),
              (s.original = i),
              (s.xValue = n.getValueForPixel(i.x)),
              window.dispatchEvent(s);
          }
          var t = this.getOption(e, "sync", "suppressTooltips");
          if (
            ((e.crosshair.suppressTooltips = i.stop && t),
            (e.crosshair.enabled =
              i.type !== "mouseout" &&
              i.x > n.getPixelForValue(n.min) &&
              i.x < n.getPixelForValue(n.max)),
            !e.crosshair.enabled && !e.crosshair.suppressUpdate)
          )
            return (
              i.x > n.getPixelForValue(n.max) &&
                ((e.crosshair.suppressUpdate = !0), e.update("none")),
              (e.crosshair.dragStarted = !1),
              !1
            );
          e.crosshair.suppressUpdate = !1;
          var g = this.getOption(e, "zoom", "enabled");
          if (
            (r === 1 &&
              !e.crosshair.dragStarted &&
              g &&
              ((e.crosshair.dragStartX = i.x), (e.crosshair.dragStarted = !0)),
            e.crosshair.dragStarted && r === 0)
          ) {
            e.crosshair.dragStarted = !1;
            var d = n.getValueForPixel(e.crosshair.dragStartX),
              u = n.getValueForPixel(e.crosshair.x);
            Math.abs(e.crosshair.dragStartX - e.crosshair.x) > 1 && this.doZoom(e, d, u),
              e.update("none");
          }
          (e.crosshair.x = i.x), e.draw();
        }
      }
    },
    afterDraw: function (e) {
      if (e.crosshair.enabled)
        return (
          e.crosshair.dragStarted
            ? this.drawZoombox(e)
            : (this.drawTraceLine(e), this.interpolateValues(e), this.drawTracePoints(e)),
          !0
        );
    },
    beforeTooltipDraw: function (e) {
      return !e.crosshair.dragStarted && !e.crosshair.suppressTooltips;
    },
    resetZoom: function (e) {
      var s = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1,
        i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : !0;
      if (i) {
        if (e.crosshair.originalData.length > 0)
          for (var o = 0; o < e.data.datasets.length; o++) {
            var n = e.data.datasets[o];
            n.data = e.crosshair.originalData.shift(0);
          }
        e.crosshair.originalXRange.min
          ? ((e.options.scales.x.min = e.crosshair.originalXRange.min),
            (e.crosshair.originalXRange.min = null))
          : delete e.options.scales.x.min,
          e.crosshair.originalXRange.max
            ? ((e.options.scales.x.max = e.crosshair.originalXRange.max),
              (e.crosshair.originalXRange.max = null))
            : delete e.options.scales.x.max;
      }
      e.crosshair.button &&
        e.crosshair.button.parentNode &&
        (e.crosshair.button.parentNode.removeChild(e.crosshair.button), (e.crosshair.button = !1));
      var r = this.getOption(e, "sync", "enabled");
      if (!s && i && r) {
        var a = this.getOption(e, "sync", "group"),
          l = new CustomEvent("reset-zoom-event");
        (l.chartId = e.id), (l.syncGroup = a), window.dispatchEvent(l);
      }
      i && e.update("none");
    },
    doZoom: function (e, s, i) {
      if (s > i) {
        var o = s;
        (s = i), (i = o);
      }
      var n = w(
        e.options.plugins.crosshair.callbacks
          ? e.options.plugins.crosshair.callbacks.beforeZoom
          : void 0,
        c.callbacks.beforeZoom
      );
      if (!n(s, i)) return !1;
      if (
        ((e.crosshair.dragStarted = !1),
        e.options.scales.x.min &&
          e.crosshair.originalData.length === 0 &&
          (e.crosshair.originalXRange.min = e.options.scales.x.min),
        e.options.scales.x.max &&
          e.crosshair.originalData.length === 0 &&
          (e.crosshair.originalXRange.max = e.options.scales.x.max),
        !e.crosshair.button)
      ) {
        var r = document.createElement("button"),
          a = this.getOption(e, "zoom", "zoomButtonText"),
          l = this.getOption(e, "zoom", "zoomButtonClass"),
          t = document.createTextNode(a);
        r.appendChild(t),
          (r.className = l),
          r.addEventListener(
            "click",
            function () {
              this.resetZoom(e);
            }.bind(this)
          ),
          e.canvas.parentNode.appendChild(r),
          (e.crosshair.button = r);
      }
      (e.options.scales.x.min = s), (e.options.scales.x.max = i);
      var g = e.crosshair.originalData.length === 0,
        d = e.config.options.scales.x.type !== "category";
      if (d)
        for (var u = 0; u < e.data.datasets.length; u++) {
          var p = [],
            f = 0,
            y = !1,
            S = !1;
          g && (e.crosshair.originalData[u] = e.data.datasets[u].data);
          for (var v = e.crosshair.originalData[u], b = 0; b < v.length; b++) {
            var m = v[b],
              x = m.x !== void 0 ? m.x : NaN;
            x >= s && !y && f > 0 && (p.push(v[f - 1]), (y = !0)),
              x >= s && x <= i && p.push(m),
              x > i && !S && f < v.length && (p.push(m), (S = !0)),
              (f += 1);
          }
          e.data.datasets[u].data = p;
        }
      if (((e.crosshair.start = s), (e.crosshair.end = i), g)) {
        var E = this.getXScale(e);
        (e.crosshair.min = E.min), (e.crosshair.max = E.max);
      }
      (e.crosshair.ignoreNextEvents = 2), e.update("none");
      var P = this.getOption(e, "callbacks", "afterZoom");
      P(s, i);
    },
    drawZoombox: function (e) {
      var s = this.getYScale(e),
        i = this.getOption(e, "zoom", "zoomboxBorderColor"),
        o = this.getOption(e, "zoom", "zoomboxBackgroundColor");
      e.ctx.beginPath(),
        e.ctx.rect(
          e.crosshair.dragStartX,
          s.getPixelForValue(s.max),
          e.crosshair.x - e.crosshair.dragStartX,
          s.getPixelForValue(s.min) - s.getPixelForValue(s.max)
        ),
        (e.ctx.lineWidth = 1),
        (e.ctx.strokeStyle = i),
        (e.ctx.fillStyle = o),
        e.ctx.fill(),
        (e.ctx.fillStyle = ""),
        e.ctx.stroke(),
        e.ctx.closePath();
    },
    drawTraceLine: function (e) {
      var s = this.getYScale(e),
        i = this.getOption(e, "line", "width"),
        o = this.getOption(e, "line", "color"),
        n = this.getOption(e, "line", "dashPattern"),
        r = this.getOption(e, "snap", "enabled"),
        a = e.crosshair.x;
      r && e._active.length && (a = e._active[0].element.x),
        e.ctx.beginPath(),
        e.ctx.setLineDash(n),
        e.ctx.moveTo(a, s.getPixelForValue(s.max)),
        (e.ctx.lineWidth = i),
        (e.ctx.strokeStyle = o),
        e.ctx.lineTo(a, s.getPixelForValue(s.min)),
        e.ctx.stroke(),
        e.ctx.setLineDash([]);
    },
    drawTracePoints: function (e) {
      for (var s = 0; s < e.data.datasets.length; s++) {
        var i = e.data.datasets[s],
          o = e.getDatasetMeta(s),
          n = e.scales[o.yAxisID];
        o.hidden ||
          !i.interpolate ||
          (e.ctx.beginPath(),
          e.ctx.arc(e.crosshair.x, n.getPixelForValue(i.interpolatedValue), 3, 0, 2 * Math.PI, !1),
          (e.ctx.fillStyle = "white"),
          (e.ctx.lineWidth = 2),
          (e.ctx.strokeStyle = i.borderColor),
          e.ctx.fill(),
          e.ctx.stroke());
      }
    },
    interpolateValues: function (e) {
      for (var s = 0; s < e.data.datasets.length; s++) {
        var i = e.data.datasets[s],
          o = e.getDatasetMeta(s),
          n = e.scales[o.xAxisID],
          r = n.getValueForPixel(e.crosshair.x);
        if (!(o.hidden || !i.interpolate)) {
          var a = i.data,
            l = a.findIndex(function (u) {
              return u.x >= r;
            }),
            t = a[l - 1],
            g = a[l];
          if (e.data.datasets[s].steppedLine && t) i.interpolatedValue = t.y;
          else if (t && g) {
            var d = (g.y - t.y) / (g.x - t.x);
            i.interpolatedValue = t.y + (r - t.x) * d;
          } else i.interpolatedValue = NaN;
        }
      }
    },
  };
export { V as CrosshairPlugin, V as default };
