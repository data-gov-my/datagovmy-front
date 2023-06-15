/**
 * table-core
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function E(e, n) {
  return typeof e == "function" ? e(n) : e;
}
function R(e, n) {
  return t => {
    n.setState(o => ({
      ...o,
      [e]: E(t, o[e]),
    }));
  };
}
function D(e) {
  return e instanceof Function;
}
function ae(e) {
  return Array.isArray(e) && e.every(n => typeof n == "number");
}
function ge(e, n) {
  const t = [],
    o = r => {
      r.forEach(l => {
        t.push(l);
        const i = n(l);
        i != null && i.length && o(i);
      });
    };
  return o(e), t;
}
function v(e, n, t) {
  let o = [],
    r;
  return () => {
    let l;
    t.key && t.debug && (l = Date.now());
    const i = e();
    if (!(i.length !== o.length || i.some((d, u) => o[u] !== d))) return r;
    o = i;
    let a;
    if (
      (t.key && t.debug && (a = Date.now()),
      (r = n(...i)),
      t == null || t.onChange == null || t.onChange(r),
      t.key && t.debug && t != null && t.debug())
    ) {
      const d = Math.round((Date.now() - l) * 100) / 100,
        u = Math.round((Date.now() - a) * 100) / 100,
        c = u / 16,
        f = (s, m) => {
          for (s = String(s); s.length < m; ) s = " " + s;
          return s;
        };
      console.info(
        `%c⏱ ${f(u, 5)} /${f(d, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * c, 120))}deg 100% 31%);`,
        t == null ? void 0 : t.key
      );
    }
    return r;
  };
}
function de(e, n, t, o) {
  var r, l;
  const g = {
      ...e._getDefaultColumnDef(),
      ...n,
    },
    a = g.accessorKey;
  let d =
      (r = (l = g.id) != null ? l : a ? a.replace(".", "_") : void 0) != null
        ? r
        : typeof g.header == "string"
        ? g.header
        : void 0,
    u;
  if (
    (g.accessorFn
      ? (u = g.accessorFn)
      : a &&
        (a.includes(".")
          ? (u = f => {
              let s = f;
              for (const p of a.split(".")) {
                var m;
                (s = (m = s) == null ? void 0 : m[p]),
                  process.env.NODE_ENV !== "production" &&
                    s === void 0 &&
                    console.warn(`"${p}" in deeply nested key "${a}" returned undefined.`);
              }
              return s;
            })
          : (u = f => f[g.accessorKey])),
    !d)
  )
    throw process.env.NODE_ENV !== "production"
      ? new Error(
          g.accessorFn
            ? "Columns require an id when using an accessorFn"
            : "Columns require an id when using a non-string header"
        )
      : new Error();
  let c = {
    id: `${String(d)}`,
    accessorFn: u,
    parent: o,
    depth: t,
    columnDef: g,
    columns: [],
    getFlatColumns: v(
      () => [!0],
      () => {
        var f;
        return [c, ...((f = c.columns) == null ? void 0 : f.flatMap(s => s.getFlatColumns()))];
      },
      {
        key: process.env.NODE_ENV === "production" && "column.getFlatColumns",
        debug: () => {
          var f;
          return (f = e.options.debugAll) != null ? f : e.options.debugColumns;
        },
      }
    ),
    getLeafColumns: v(
      () => [e._getOrderColumnsFn()],
      f => {
        var s;
        if ((s = c.columns) != null && s.length) {
          let m = c.columns.flatMap(p => p.getLeafColumns());
          return f(m);
        }
        return [c];
      },
      {
        key: process.env.NODE_ENV === "production" && "column.getLeafColumns",
        debug: () => {
          var f;
          return (f = e.options.debugAll) != null ? f : e.options.debugColumns;
        },
      }
    ),
  };
  return (
    (c = e._features.reduce(
      (f, s) => Object.assign(f, s.createColumn == null ? void 0 : s.createColumn(c, e)),
      c
    )),
    c
  );
}
function J(e, n, t) {
  var o;
  let l = {
    id: (o = t.id) != null ? o : n.id,
    column: n,
    index: t.index,
    isPlaceholder: !!t.isPlaceholder,
    placeholderId: t.placeholderId,
    depth: t.depth,
    subHeaders: [],
    colSpan: 0,
    rowSpan: 0,
    headerGroup: null,
    getLeafHeaders: () => {
      const i = [],
        g = a => {
          a.subHeaders && a.subHeaders.length && a.subHeaders.map(g), i.push(a);
        };
      return g(l), i;
    },
    getContext: () => ({
      table: e,
      header: l,
      column: n,
    }),
  };
  return (
    e._features.forEach(i => {
      Object.assign(l, i.createHeader == null ? void 0 : i.createHeader(l, e));
    }),
    l
  );
}
const ce = {
  createTable: e => ({
    // Header Groups
    getHeaderGroups: v(
      () => [
        e.getAllColumns(),
        e.getVisibleLeafColumns(),
        e.getState().columnPinning.left,
        e.getState().columnPinning.right,
      ],
      (n, t, o, r) => {
        var l, i;
        const g =
            (l = o == null ? void 0 : o.map(c => t.find(f => f.id === c)).filter(Boolean)) != null
              ? l
              : [],
          a =
            (i = r == null ? void 0 : r.map(c => t.find(f => f.id === c)).filter(Boolean)) != null
              ? i
              : [],
          d = t.filter(c => !(o != null && o.includes(c.id)) && !(r != null && r.includes(c.id)));
        return A(n, [...g, ...d, ...a], e);
      },
      {
        key: process.env.NODE_ENV === "development" && "getHeaderGroups",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getCenterHeaderGroups: v(
      () => [
        e.getAllColumns(),
        e.getVisibleLeafColumns(),
        e.getState().columnPinning.left,
        e.getState().columnPinning.right,
      ],
      (n, t, o, r) => (
        (t = t.filter(l => !(o != null && o.includes(l.id)) && !(r != null && r.includes(l.id)))),
        A(n, t, e, "center")
      ),
      {
        key: process.env.NODE_ENV === "development" && "getCenterHeaderGroups",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getLeftHeaderGroups: v(
      () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.left],
      (n, t, o) => {
        var r;
        const l =
          (r = o == null ? void 0 : o.map(i => t.find(g => g.id === i)).filter(Boolean)) != null
            ? r
            : [];
        return A(n, l, e, "left");
      },
      {
        key: process.env.NODE_ENV === "development" && "getLeftHeaderGroups",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getRightHeaderGroups: v(
      () => [e.getAllColumns(), e.getVisibleLeafColumns(), e.getState().columnPinning.right],
      (n, t, o) => {
        var r;
        const l =
          (r = o == null ? void 0 : o.map(i => t.find(g => g.id === i)).filter(Boolean)) != null
            ? r
            : [];
        return A(n, l, e, "right");
      },
      {
        key: process.env.NODE_ENV === "development" && "getRightHeaderGroups",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    // Footer Groups
    getFooterGroups: v(
      () => [e.getHeaderGroups()],
      n => [...n].reverse(),
      {
        key: process.env.NODE_ENV === "development" && "getFooterGroups",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getLeftFooterGroups: v(
      () => [e.getLeftHeaderGroups()],
      n => [...n].reverse(),
      {
        key: process.env.NODE_ENV === "development" && "getLeftFooterGroups",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getCenterFooterGroups: v(
      () => [e.getCenterHeaderGroups()],
      n => [...n].reverse(),
      {
        key: process.env.NODE_ENV === "development" && "getCenterFooterGroups",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getRightFooterGroups: v(
      () => [e.getRightHeaderGroups()],
      n => [...n].reverse(),
      {
        key: process.env.NODE_ENV === "development" && "getRightFooterGroups",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    // Flat Headers
    getFlatHeaders: v(
      () => [e.getHeaderGroups()],
      n => n.map(t => t.headers).flat(),
      {
        key: process.env.NODE_ENV === "development" && "getFlatHeaders",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getLeftFlatHeaders: v(
      () => [e.getLeftHeaderGroups()],
      n => n.map(t => t.headers).flat(),
      {
        key: process.env.NODE_ENV === "development" && "getLeftFlatHeaders",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getCenterFlatHeaders: v(
      () => [e.getCenterHeaderGroups()],
      n => n.map(t => t.headers).flat(),
      {
        key: process.env.NODE_ENV === "development" && "getCenterFlatHeaders",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getRightFlatHeaders: v(
      () => [e.getRightHeaderGroups()],
      n => n.map(t => t.headers).flat(),
      {
        key: process.env.NODE_ENV === "development" && "getRightFlatHeaders",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    // Leaf Headers
    getCenterLeafHeaders: v(
      () => [e.getCenterFlatHeaders()],
      n =>
        n.filter(t => {
          var o;
          return !((o = t.subHeaders) != null && o.length);
        }),
      {
        key: process.env.NODE_ENV === "development" && "getCenterLeafHeaders",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getLeftLeafHeaders: v(
      () => [e.getLeftFlatHeaders()],
      n =>
        n.filter(t => {
          var o;
          return !((o = t.subHeaders) != null && o.length);
        }),
      {
        key: process.env.NODE_ENV === "development" && "getLeftLeafHeaders",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getRightLeafHeaders: v(
      () => [e.getRightFlatHeaders()],
      n =>
        n.filter(t => {
          var o;
          return !((o = t.subHeaders) != null && o.length);
        }),
      {
        key: process.env.NODE_ENV === "development" && "getRightLeafHeaders",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
    getLeafHeaders: v(
      () => [e.getLeftHeaderGroups(), e.getCenterHeaderGroups(), e.getRightHeaderGroups()],
      (n, t, o) => {
        var r, l, i, g, a, d;
        return [
          ...((r = (l = n[0]) == null ? void 0 : l.headers) != null ? r : []),
          ...((i = (g = t[0]) == null ? void 0 : g.headers) != null ? i : []),
          ...((a = (d = o[0]) == null ? void 0 : d.headers) != null ? a : []),
        ]
          .map(u => u.getLeafHeaders())
          .flat();
      },
      {
        key: process.env.NODE_ENV === "development" && "getLeafHeaders",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugHeaders;
        },
      }
    ),
  }),
};
function A(e, n, t, o) {
  var r, l;
  let i = 0;
  const g = function (f, s) {
    s === void 0 && (s = 1),
      (i = Math.max(i, s)),
      f
        .filter(m => m.getIsVisible())
        .forEach(m => {
          var p;
          (p = m.columns) != null && p.length && g(m.columns, s + 1);
        }, 0);
  };
  g(e);
  let a = [];
  const d = (f, s) => {
      const m = {
          depth: s,
          id: [o, `${s}`].filter(Boolean).join("_"),
          headers: [],
        },
        p = [];
      f.forEach(S => {
        const C = [...p].reverse()[0],
          V = S.column.depth === m.depth;
        let w,
          _ = !1;
        if (
          (V && S.column.parent ? (w = S.column.parent) : ((w = S.column), (_ = !0)),
          C && (C == null ? void 0 : C.column) === w)
        )
          C.subHeaders.push(S);
        else {
          const $ = J(t, w, {
            id: [o, s, w.id, S == null ? void 0 : S.id].filter(Boolean).join("_"),
            isPlaceholder: _,
            placeholderId: _ ? `${p.filter(I => I.column === w).length}` : void 0,
            depth: s,
            index: p.length,
          });
          $.subHeaders.push(S), p.push($);
        }
        m.headers.push(S), (S.headerGroup = m);
      }),
        a.push(m),
        s > 0 && d(p, s - 1);
    },
    u = n.map((f, s) =>
      J(t, f, {
        depth: i,
        index: s,
      })
    );
  d(u, i - 1), a.reverse();
  const c = f =>
    f
      .filter(m => m.column.getIsVisible())
      .map(m => {
        let p = 0,
          S = 0,
          C = [0];
        m.subHeaders && m.subHeaders.length
          ? ((C = []),
            c(m.subHeaders).forEach(w => {
              let { colSpan: _, rowSpan: $ } = w;
              (p += _), C.push($);
            }))
          : (p = 1);
        const V = Math.min(...C);
        return (
          (S = S + V),
          (m.colSpan = p),
          (m.rowSpan = S),
          {
            colSpan: p,
            rowSpan: S,
          }
        );
      });
  return c((r = (l = a[0]) == null ? void 0 : l.headers) != null ? r : []), a;
}
const x = {
    size: 150,
    minSize: 20,
    maxSize: Number.MAX_SAFE_INTEGER,
  },
  P = () => ({
    startOffset: null,
    startSize: null,
    deltaOffset: null,
    deltaPercentage: null,
    isResizingColumn: !1,
    columnSizingStart: [],
  }),
  fe = {
    getDefaultColumnDef: () => x,
    getInitialState: e => ({
      columnSizing: {},
      columnSizingInfo: P(),
      ...e,
    }),
    getDefaultOptions: e => ({
      columnResizeMode: "onEnd",
      onColumnSizingChange: R("columnSizing", e),
      onColumnSizingInfoChange: R("columnSizingInfo", e),
    }),
    createColumn: (e, n) => ({
      getSize: () => {
        var t, o, r;
        const l = n.getState().columnSizing[e.id];
        return Math.min(
          Math.max(
            (t = e.columnDef.minSize) != null ? t : x.minSize,
            (o = l ?? e.columnDef.size) != null ? o : x.size
          ),
          (r = e.columnDef.maxSize) != null ? r : x.maxSize
        );
      },
      getStart: t => {
        const o = t
            ? t === "left"
              ? n.getLeftVisibleLeafColumns()
              : n.getRightVisibleLeafColumns()
            : n.getVisibleLeafColumns(),
          r = o.findIndex(l => l.id === e.id);
        if (r > 0) {
          const l = o[r - 1];
          return l.getStart(t) + l.getSize();
        }
        return 0;
      },
      resetSize: () => {
        n.setColumnSizing(t => {
          let { [e.id]: o, ...r } = t;
          return r;
        });
      },
      getCanResize: () => {
        var t, o;
        return (
          ((t = e.columnDef.enableResizing) != null ? t : !0) &&
          ((o = n.options.enableColumnResizing) != null ? o : !0)
        );
      },
      getIsResizing: () => n.getState().columnSizingInfo.isResizingColumn === e.id,
    }),
    createHeader: (e, n) => ({
      getSize: () => {
        let t = 0;
        const o = r => {
          if (r.subHeaders.length) r.subHeaders.forEach(o);
          else {
            var l;
            t += (l = r.column.getSize()) != null ? l : 0;
          }
        };
        return o(e), t;
      },
      getStart: () => {
        if (e.index > 0) {
          const t = e.headerGroup.headers[e.index - 1];
          return t.getStart() + t.getSize();
        }
        return 0;
      },
      getResizeHandler: () => {
        const t = n.getColumn(e.column.id),
          o = t == null ? void 0 : t.getCanResize();
        return r => {
          if (
            !t ||
            !o ||
            (r.persist == null || r.persist(), H(r) && r.touches && r.touches.length > 1)
          )
            return;
          const l = e.getSize(),
            i = e
              ? e.getLeafHeaders().map(p => [p.column.id, p.column.getSize()])
              : [[t.id, t.getSize()]],
            g = H(r) ? Math.round(r.touches[0].clientX) : r.clientX,
            a = {},
            d = (p, S) => {
              typeof S == "number" &&
                (n.setColumnSizingInfo(C => {
                  var V, w;
                  const _ = S - ((V = C == null ? void 0 : C.startOffset) != null ? V : 0),
                    $ = Math.max(
                      _ / ((w = C == null ? void 0 : C.startSize) != null ? w : 0),
                      -0.999999
                    );
                  return (
                    C.columnSizingStart.forEach(I => {
                      let [se, K] = I;
                      a[se] = Math.round(Math.max(K + K * $, 0) * 100) / 100;
                    }),
                    {
                      ...C,
                      deltaOffset: _,
                      deltaPercentage: $,
                    }
                  );
                }),
                (n.options.columnResizeMode === "onChange" || p === "end") &&
                  n.setColumnSizing(C => ({
                    ...C,
                    ...a,
                  })));
            },
            u = p => d("move", p),
            c = p => {
              d("end", p),
                n.setColumnSizingInfo(S => ({
                  ...S,
                  isResizingColumn: !1,
                  startOffset: null,
                  startSize: null,
                  deltaOffset: null,
                  deltaPercentage: null,
                  columnSizingStart: [],
                }));
            },
            f = {
              moveHandler: p => u(p.clientX),
              upHandler: p => {
                document.removeEventListener("mousemove", f.moveHandler),
                  document.removeEventListener("mouseup", f.upHandler),
                  c(p.clientX);
              },
            },
            s = {
              moveHandler: p => (
                p.cancelable && (p.preventDefault(), p.stopPropagation()),
                u(p.touches[0].clientX),
                !1
              ),
              upHandler: p => {
                var S;
                document.removeEventListener("touchmove", s.moveHandler),
                  document.removeEventListener("touchend", s.upHandler),
                  p.cancelable && (p.preventDefault(), p.stopPropagation()),
                  c((S = p.touches[0]) == null ? void 0 : S.clientX);
              },
            },
            m = pe()
              ? {
                  passive: !1,
                }
              : !1;
          H(r)
            ? (document.addEventListener("touchmove", s.moveHandler, m),
              document.addEventListener("touchend", s.upHandler, m))
            : (document.addEventListener("mousemove", f.moveHandler, m),
              document.addEventListener("mouseup", f.upHandler, m)),
            n.setColumnSizingInfo(p => ({
              ...p,
              startOffset: g,
              startSize: l,
              deltaOffset: 0,
              deltaPercentage: 0,
              columnSizingStart: i,
              isResizingColumn: t.id,
            }));
        };
      },
    }),
    createTable: e => ({
      setColumnSizing: n =>
        e.options.onColumnSizingChange == null ? void 0 : e.options.onColumnSizingChange(n),
      setColumnSizingInfo: n =>
        e.options.onColumnSizingInfoChange == null ? void 0 : e.options.onColumnSizingInfoChange(n),
      resetColumnSizing: n => {
        var t;
        e.setColumnSizing(n ? {} : (t = e.initialState.columnSizing) != null ? t : {});
      },
      resetHeaderSizeInfo: n => {
        var t;
        e.setColumnSizingInfo(n ? P() : (t = e.initialState.columnSizingInfo) != null ? t : P());
      },
      getTotalSize: () => {
        var n, t;
        return (n =
          (t = e.getHeaderGroups()[0]) == null
            ? void 0
            : t.headers.reduce((o, r) => o + r.getSize(), 0)) != null
          ? n
          : 0;
      },
      getLeftTotalSize: () => {
        var n, t;
        return (n =
          (t = e.getLeftHeaderGroups()[0]) == null
            ? void 0
            : t.headers.reduce((o, r) => o + r.getSize(), 0)) != null
          ? n
          : 0;
      },
      getCenterTotalSize: () => {
        var n, t;
        return (n =
          (t = e.getCenterHeaderGroups()[0]) == null
            ? void 0
            : t.headers.reduce((o, r) => o + r.getSize(), 0)) != null
          ? n
          : 0;
      },
      getRightTotalSize: () => {
        var n, t;
        return (n =
          (t = e.getRightHeaderGroups()[0]) == null
            ? void 0
            : t.headers.reduce((o, r) => o + r.getSize(), 0)) != null
          ? n
          : 0;
      },
    }),
  };
let y = null;
function pe() {
  if (typeof y == "boolean") return y;
  let e = !1;
  try {
    const n = {
        get passive() {
          return (e = !0), !1;
        },
      },
      t = () => {};
    window.addEventListener("test", t, n), window.removeEventListener("test", t);
  } catch {
    e = !1;
  }
  return (y = e), y;
}
function H(e) {
  return e.type === "touchstart";
}
const me = {
    getInitialState: e => ({
      expanded: {},
      ...e,
    }),
    getDefaultOptions: e => ({
      onExpandedChange: R("expanded", e),
      paginateExpandedRows: !0,
    }),
    createTable: e => {
      let n = !1,
        t = !1;
      return {
        _autoResetExpanded: () => {
          var o, r;
          if (!n) {
            e._queue(() => {
              n = !0;
            });
            return;
          }
          if (
            (o = (r = e.options.autoResetAll) != null ? r : e.options.autoResetExpanded) != null
              ? o
              : !e.options.manualExpanding
          ) {
            if (t) return;
            (t = !0),
              e._queue(() => {
                e.resetExpanded(), (t = !1);
              });
          }
        },
        setExpanded: o =>
          e.options.onExpandedChange == null ? void 0 : e.options.onExpandedChange(o),
        toggleAllRowsExpanded: o => {
          o ?? !e.getIsAllRowsExpanded() ? e.setExpanded(!0) : e.setExpanded({});
        },
        resetExpanded: o => {
          var r, l;
          e.setExpanded(
            o ? {} : (r = (l = e.initialState) == null ? void 0 : l.expanded) != null ? r : {}
          );
        },
        getCanSomeRowsExpand: () =>
          e.getPrePaginationRowModel().flatRows.some(o => o.getCanExpand()),
        getToggleAllRowsExpandedHandler: () => o => {
          o.persist == null || o.persist(), e.toggleAllRowsExpanded();
        },
        getIsSomeRowsExpanded: () => {
          const o = e.getState().expanded;
          return o === !0 || Object.values(o).some(Boolean);
        },
        getIsAllRowsExpanded: () => {
          const o = e.getState().expanded;
          return typeof o == "boolean"
            ? o === !0
            : !(!Object.keys(o).length || e.getRowModel().flatRows.some(r => !r.getIsExpanded()));
        },
        getExpandedDepth: () => {
          let o = 0;
          return (
            (e.getState().expanded === !0
              ? Object.keys(e.getRowModel().rowsById)
              : Object.keys(e.getState().expanded)
            ).forEach(l => {
              const i = l.split(".");
              o = Math.max(o, i.length);
            }),
            o
          );
        },
        getPreExpandedRowModel: () => e.getSortedRowModel(),
        getExpandedRowModel: () => (
          !e._getExpandedRowModel &&
            e.options.getExpandedRowModel &&
            (e._getExpandedRowModel = e.options.getExpandedRowModel(e)),
          e.options.manualExpanding || !e._getExpandedRowModel
            ? e.getPreExpandedRowModel()
            : e._getExpandedRowModel()
        ),
      };
    },
    createRow: (e, n) => ({
      toggleExpanded: t => {
        n.setExpanded(o => {
          var r;
          const l = o === !0 ? !0 : !!(o != null && o[e.id]);
          let i = {};
          if (
            (o === !0
              ? Object.keys(n.getRowModel().rowsById).forEach(g => {
                  i[g] = !0;
                })
              : (i = o),
            (t = (r = t) != null ? r : !l),
            !l && t)
          )
            return {
              ...i,
              [e.id]: !0,
            };
          if (l && !t) {
            const { [e.id]: g, ...a } = i;
            return a;
          }
          return o;
        });
      },
      getIsExpanded: () => {
        var t;
        const o = n.getState().expanded;
        return !!((t =
          n.options.getIsRowExpanded == null ? void 0 : n.options.getIsRowExpanded(e)) != null
          ? t
          : o === !0 || (o != null && o[e.id]));
      },
      getCanExpand: () => {
        var t, o, r;
        return (t = n.options.getRowCanExpand == null ? void 0 : n.options.getRowCanExpand(e)) !=
          null
          ? t
          : ((o = n.options.enableExpanding) != null ? o : !0) &&
              !!((r = e.subRows) != null && r.length);
      },
      getToggleExpandedHandler: () => {
        const t = e.getCanExpand();
        return () => {
          t && e.toggleExpanded();
        };
      },
    }),
  },
  Z = (e, n, t) => {
    var o, r, l;
    const i = t.toLowerCase();
    return !!(
      !(
        (o = e.getValue(n)) == null ||
        (r = o.toString()) == null ||
        (l = r.toLowerCase()) == null
      ) && l.includes(i)
    );
  };
Z.autoRemove = e => h(e);
const ee = (e, n, t) => {
  var o, r;
  return !!(!((o = e.getValue(n)) == null || (r = o.toString()) == null) && r.includes(t));
};
ee.autoRemove = e => h(e);
const te = (e, n, t) => {
  var o, r;
  return (
    ((o = e.getValue(n)) == null || (r = o.toString()) == null ? void 0 : r.toLowerCase()) ===
    (t == null ? void 0 : t.toLowerCase())
  );
};
te.autoRemove = e => h(e);
const ne = (e, n, t) => {
  var o;
  return (o = e.getValue(n)) == null ? void 0 : o.includes(t);
};
ne.autoRemove = e => h(e) || !(e != null && e.length);
const oe = (e, n, t) =>
  !t.some(o => {
    var r;
    return !((r = e.getValue(n)) != null && r.includes(o));
  });
oe.autoRemove = e => h(e) || !(e != null && e.length);
const re = (e, n, t) =>
  t.some(o => {
    var r;
    return (r = e.getValue(n)) == null ? void 0 : r.includes(o);
  });
re.autoRemove = e => h(e) || !(e != null && e.length);
const le = (e, n, t) => e.getValue(n) === t;
le.autoRemove = e => h(e);
const ie = (e, n, t) => e.getValue(n) == t;
ie.autoRemove = e => h(e);
const T = (e, n, t) => {
  let [o, r] = t;
  const l = e.getValue(n);
  return l >= o && l <= r;
};
T.resolveFilterValue = e => {
  let [n, t] = e,
    o = typeof n != "number" ? parseFloat(n) : n,
    r = typeof t != "number" ? parseFloat(t) : t,
    l = n === null || Number.isNaN(o) ? -1 / 0 : o,
    i = t === null || Number.isNaN(r) ? 1 / 0 : r;
  if (l > i) {
    const g = l;
    (l = i), (i = g);
  }
  return [l, i];
};
T.autoRemove = e => h(e) || (h(e[0]) && h(e[1]));
const F = {
  includesString: Z,
  includesStringSensitive: ee,
  equalsString: te,
  arrIncludes: ne,
  arrIncludesAll: oe,
  arrIncludesSome: re,
  equals: le,
  weakEquals: ie,
  inNumberRange: T,
};
function h(e) {
  return e == null || e === "";
}
const ve = {
  getDefaultColumnDef: () => ({
    filterFn: "auto",
  }),
  getInitialState: e => ({
    columnFilters: [],
    globalFilter: void 0,
    // filtersProgress: 1,
    // facetProgress: {},
    ...e,
  }),
  getDefaultOptions: e => ({
    onColumnFiltersChange: R("columnFilters", e),
    onGlobalFilterChange: R("globalFilter", e),
    filterFromLeafRows: !1,
    maxLeafRowFilterDepth: 100,
    globalFilterFn: "auto",
    getColumnCanGlobalFilter: n => {
      var t, o;
      const r =
        (t = e.getCoreRowModel().flatRows[0]) == null ||
        (o = t._getAllCellsByColumnId()[n.id]) == null
          ? void 0
          : o.getValue();
      return typeof r == "string" || typeof r == "number";
    },
  }),
  createColumn: (e, n) => ({
    getAutoFilterFn: () => {
      const t = n.getCoreRowModel().flatRows[0],
        o = t == null ? void 0 : t.getValue(e.id);
      return typeof o == "string"
        ? F.includesString
        : typeof o == "number"
        ? F.inNumberRange
        : typeof o == "boolean" || (o !== null && typeof o == "object")
        ? F.equals
        : Array.isArray(o)
        ? F.arrIncludes
        : F.weakEquals;
    },
    getFilterFn: () => {
      var t, o;
      return D(e.columnDef.filterFn)
        ? e.columnDef.filterFn
        : e.columnDef.filterFn === "auto"
        ? e.getAutoFilterFn()
        : (t = (o = n.options.filterFns) == null ? void 0 : o[e.columnDef.filterFn]) != null
        ? t
        : F[e.columnDef.filterFn];
    },
    getCanFilter: () => {
      var t, o, r;
      return (
        ((t = e.columnDef.enableColumnFilter) != null ? t : !0) &&
        ((o = n.options.enableColumnFilters) != null ? o : !0) &&
        ((r = n.options.enableFilters) != null ? r : !0) &&
        !!e.accessorFn
      );
    },
    getCanGlobalFilter: () => {
      var t, o, r, l;
      return (
        ((t = e.columnDef.enableGlobalFilter) != null ? t : !0) &&
        ((o = n.options.enableGlobalFilter) != null ? o : !0) &&
        ((r = n.options.enableFilters) != null ? r : !0) &&
        ((l =
          n.options.getColumnCanGlobalFilter == null
            ? void 0
            : n.options.getColumnCanGlobalFilter(e)) != null
          ? l
          : !0) &&
        !!e.accessorFn
      );
    },
    getIsFiltered: () => e.getFilterIndex() > -1,
    getFilterValue: () => {
      var t, o;
      return (t = n.getState().columnFilters) == null || (o = t.find(r => r.id === e.id)) == null
        ? void 0
        : o.value;
    },
    getFilterIndex: () => {
      var t, o;
      return (t =
        (o = n.getState().columnFilters) == null ? void 0 : o.findIndex(r => r.id === e.id)) != null
        ? t
        : -1;
    },
    setFilterValue: t => {
      n.setColumnFilters(o => {
        const r = e.getFilterFn(),
          l = o == null ? void 0 : o.find(u => u.id === e.id),
          i = E(t, l ? l.value : void 0);
        if (Q(r, i, e)) {
          var g;
          return (g = o == null ? void 0 : o.filter(u => u.id !== e.id)) != null ? g : [];
        }
        const a = {
          id: e.id,
          value: i,
        };
        if (l) {
          var d;
          return (d = o == null ? void 0 : o.map(u => (u.id === e.id ? a : u))) != null ? d : [];
        }
        return o != null && o.length ? [...o, a] : [a];
      });
    },
    _getFacetedRowModel: n.options.getFacetedRowModel && n.options.getFacetedRowModel(n, e.id),
    getFacetedRowModel: () =>
      e._getFacetedRowModel ? e._getFacetedRowModel() : n.getPreFilteredRowModel(),
    _getFacetedUniqueValues:
      n.options.getFacetedUniqueValues && n.options.getFacetedUniqueValues(n, e.id),
    getFacetedUniqueValues: () =>
      e._getFacetedUniqueValues ? e._getFacetedUniqueValues() : /* @__PURE__ */ new Map(),
    _getFacetedMinMaxValues:
      n.options.getFacetedMinMaxValues && n.options.getFacetedMinMaxValues(n, e.id),
    getFacetedMinMaxValues: () => {
      if (e._getFacetedMinMaxValues) return e._getFacetedMinMaxValues();
    },
    // () => [column.getFacetedRowModel()],
    // facetedRowModel => getRowModelMinMaxValues(facetedRowModel, column.id),
  }),
  createRow: (e, n) => ({
    columnFilters: {},
    columnFiltersMeta: {},
  }),
  createTable: e => ({
    getGlobalAutoFilterFn: () => F.includesString,
    getGlobalFilterFn: () => {
      var n, t;
      const { globalFilterFn: o } = e.options;
      return D(o)
        ? o
        : o === "auto"
        ? e.getGlobalAutoFilterFn()
        : (n = (t = e.options.filterFns) == null ? void 0 : t[o]) != null
        ? n
        : F[o];
    },
    setColumnFilters: n => {
      const t = e.getAllLeafColumns(),
        o = r => {
          var l;
          return (l = E(n, r)) == null
            ? void 0
            : l.filter(i => {
                const g = t.find(a => a.id === i.id);
                if (g) {
                  const a = g.getFilterFn();
                  if (Q(a, i.value, g)) return !1;
                }
                return !0;
              });
        };
      e.options.onColumnFiltersChange == null || e.options.onColumnFiltersChange(o);
    },
    setGlobalFilter: n => {
      e.options.onGlobalFilterChange == null || e.options.onGlobalFilterChange(n);
    },
    resetGlobalFilter: n => {
      e.setGlobalFilter(n ? void 0 : e.initialState.globalFilter);
    },
    resetColumnFilters: n => {
      var t, o;
      e.setColumnFilters(
        n ? [] : (t = (o = e.initialState) == null ? void 0 : o.columnFilters) != null ? t : []
      );
    },
    getPreFilteredRowModel: () => e.getCoreRowModel(),
    getFilteredRowModel: () => (
      !e._getFilteredRowModel &&
        e.options.getFilteredRowModel &&
        (e._getFilteredRowModel = e.options.getFilteredRowModel(e)),
      e.options.manualFiltering || !e._getFilteredRowModel
        ? e.getPreFilteredRowModel()
        : e._getFilteredRowModel()
    ),
    _getGlobalFacetedRowModel:
      e.options.getFacetedRowModel && e.options.getFacetedRowModel(e, "__global__"),
    getGlobalFacetedRowModel: () =>
      e.options.manualFiltering || !e._getGlobalFacetedRowModel
        ? e.getPreFilteredRowModel()
        : e._getGlobalFacetedRowModel(),
    _getGlobalFacetedUniqueValues:
      e.options.getFacetedUniqueValues && e.options.getFacetedUniqueValues(e, "__global__"),
    getGlobalFacetedUniqueValues: () =>
      e._getGlobalFacetedUniqueValues
        ? e._getGlobalFacetedUniqueValues()
        : /* @__PURE__ */ new Map(),
    _getGlobalFacetedMinMaxValues:
      e.options.getFacetedMinMaxValues && e.options.getFacetedMinMaxValues(e, "__global__"),
    getGlobalFacetedMinMaxValues: () => {
      if (e._getGlobalFacetedMinMaxValues) return e._getGlobalFacetedMinMaxValues();
    },
  }),
};
function Q(e, n, t) {
  return (
    (e && e.autoRemove ? e.autoRemove(n, t) : !1) || typeof n > "u" || (typeof n == "string" && !n)
  );
}
const Se = (e, n, t) =>
    t.reduce((o, r) => {
      const l = r.getValue(e);
      return o + (typeof l == "number" ? l : 0);
    }, 0),
  Ce = (e, n, t) => {
    let o;
    return (
      t.forEach(r => {
        const l = r.getValue(e);
        l != null && (o > l || (o === void 0 && l >= l)) && (o = l);
      }),
      o
    );
  },
  we = (e, n, t) => {
    let o;
    return (
      t.forEach(r => {
        const l = r.getValue(e);
        l != null && (o < l || (o === void 0 && l >= l)) && (o = l);
      }),
      o
    );
  },
  _e = (e, n, t) => {
    let o, r;
    return (
      t.forEach(l => {
        const i = l.getValue(e);
        i != null && (o === void 0 ? i >= i && (o = r = i) : (o > i && (o = i), r < i && (r = i)));
      }),
      [o, r]
    );
  },
  Re = (e, n) => {
    let t = 0,
      o = 0;
    if (
      (n.forEach(r => {
        let l = r.getValue(e);
        l != null && (l = +l) >= l && (++t, (o += l));
      }),
      t)
    )
      return o / t;
  },
  he = (e, n) => {
    if (!n.length) return;
    const t = n.map(l => l.getValue(e));
    if (!ae(t)) return;
    if (t.length === 1) return t[0];
    const o = Math.floor(t.length / 2),
      r = t.sort((l, i) => l - i);
    return t.length % 2 !== 0 ? r[o] : (r[o - 1] + r[o]) / 2;
  },
  $e = (e, n) => Array.from(new Set(n.map(t => t.getValue(e))).values()),
  Fe = (e, n) => new Set(n.map(t => t.getValue(e))).size,
  Ve = (e, n) => n.length,
  N = {
    sum: Se,
    min: Ce,
    max: we,
    extent: _e,
    mean: Re,
    median: he,
    unique: $e,
    uniqueCount: Fe,
    count: Ve,
  },
  Ee = {
    getDefaultColumnDef: () => ({
      aggregatedCell: e => {
        var n, t;
        return (n = (t = e.getValue()) == null || t.toString == null ? void 0 : t.toString()) !=
          null
          ? n
          : null;
      },
      aggregationFn: "auto",
    }),
    getInitialState: e => ({
      grouping: [],
      ...e,
    }),
    getDefaultOptions: e => ({
      onGroupingChange: R("grouping", e),
      groupedColumnMode: "reorder",
    }),
    createColumn: (e, n) => ({
      toggleGrouping: () => {
        n.setGrouping(t =>
          t != null && t.includes(e.id) ? t.filter(o => o !== e.id) : [...(t ?? []), e.id]
        );
      },
      getCanGroup: () => {
        var t, o, r, l;
        return (t =
          (o =
            (r = (l = e.columnDef.enableGrouping) != null ? l : !0) != null
              ? r
              : n.options.enableGrouping) != null
            ? o
            : !0) != null
          ? t
          : !!e.accessorFn;
      },
      getIsGrouped: () => {
        var t;
        return (t = n.getState().grouping) == null ? void 0 : t.includes(e.id);
      },
      getGroupedIndex: () => {
        var t;
        return (t = n.getState().grouping) == null ? void 0 : t.indexOf(e.id);
      },
      getToggleGroupingHandler: () => {
        const t = e.getCanGroup();
        return () => {
          t && e.toggleGrouping();
        };
      },
      getAutoAggregationFn: () => {
        const t = n.getCoreRowModel().flatRows[0],
          o = t == null ? void 0 : t.getValue(e.id);
        if (typeof o == "number") return N.sum;
        if (Object.prototype.toString.call(o) === "[object Date]") return N.extent;
      },
      getAggregationFn: () => {
        var t, o;
        if (!e) throw new Error();
        return D(e.columnDef.aggregationFn)
          ? e.columnDef.aggregationFn
          : e.columnDef.aggregationFn === "auto"
          ? e.getAutoAggregationFn()
          : (t = (o = n.options.aggregationFns) == null ? void 0 : o[e.columnDef.aggregationFn]) !=
            null
          ? t
          : N[e.columnDef.aggregationFn];
      },
    }),
    createTable: e => ({
      setGrouping: n =>
        e.options.onGroupingChange == null ? void 0 : e.options.onGroupingChange(n),
      resetGrouping: n => {
        var t, o;
        e.setGrouping(
          n ? [] : (t = (o = e.initialState) == null ? void 0 : o.grouping) != null ? t : []
        );
      },
      getPreGroupedRowModel: () => e.getFilteredRowModel(),
      getGroupedRowModel: () => (
        !e._getGroupedRowModel &&
          e.options.getGroupedRowModel &&
          (e._getGroupedRowModel = e.options.getGroupedRowModel(e)),
        e.options.manualGrouping || !e._getGroupedRowModel
          ? e.getPreGroupedRowModel()
          : e._getGroupedRowModel()
      ),
    }),
    createRow: (e, n) => ({
      getIsGrouped: () => !!e.groupingColumnId,
      getGroupingValue: t => {
        if (e._groupingValuesCache.hasOwnProperty(t)) return e._groupingValuesCache[t];
        const o = n.getColumn(t);
        return o != null && o.columnDef.getGroupingValue
          ? ((e._groupingValuesCache[t] = o.columnDef.getGroupingValue(e.original)),
            e._groupingValuesCache[t])
          : e.getValue(t);
      },
      _groupingValuesCache: {},
    }),
    createCell: (e, n, t, o) => ({
      getIsGrouped: () => n.getIsGrouped() && n.id === t.groupingColumnId,
      getIsPlaceholder: () => !e.getIsGrouped() && n.getIsGrouped(),
      getIsAggregated: () => {
        var r;
        return (
          !e.getIsGrouped() && !e.getIsPlaceholder() && !!((r = t.subRows) != null && r.length)
        );
      },
    }),
  };
function be(e, n, t) {
  if (!(n != null && n.length) || !t) return e;
  const o = e.filter(l => !n.includes(l.id));
  return t === "remove" ? o : [...n.map(l => e.find(i => i.id === l)).filter(Boolean), ...o];
}
const Me = {
    getInitialState: e => ({
      columnOrder: [],
      ...e,
    }),
    getDefaultOptions: e => ({
      onColumnOrderChange: R("columnOrder", e),
    }),
    createTable: e => ({
      setColumnOrder: n =>
        e.options.onColumnOrderChange == null ? void 0 : e.options.onColumnOrderChange(n),
      resetColumnOrder: n => {
        var t;
        e.setColumnOrder(n ? [] : (t = e.initialState.columnOrder) != null ? t : []);
      },
      _getOrderColumnsFn: v(
        () => [e.getState().columnOrder, e.getState().grouping, e.options.groupedColumnMode],
        (n, t, o) => r => {
          let l = [];
          if (!(n != null && n.length)) l = r;
          else {
            const i = [...n],
              g = [...r];
            for (; g.length && i.length; ) {
              const a = i.shift(),
                d = g.findIndex(u => u.id === a);
              d > -1 && l.push(g.splice(d, 1)[0]);
            }
            l = [...l, ...g];
          }
          return be(l, t, o);
        },
        {
          key: process.env.NODE_ENV === "development" && "getOrderColumnsFn",
          // debug: () => table.options.debugAll ?? table.options.debugTable,
        }
      ),
    }),
  },
  z = 0,
  k = 10,
  O = () => ({
    pageIndex: z,
    pageSize: k,
  }),
  Ae = {
    getInitialState: e => ({
      ...e,
      pagination: {
        ...O(),
        ...(e == null ? void 0 : e.pagination),
      },
    }),
    getDefaultOptions: e => ({
      onPaginationChange: R("pagination", e),
    }),
    createTable: e => {
      let n = !1,
        t = !1;
      return {
        _autoResetPageIndex: () => {
          var o, r;
          if (!n) {
            e._queue(() => {
              n = !0;
            });
            return;
          }
          if (
            (o = (r = e.options.autoResetAll) != null ? r : e.options.autoResetPageIndex) != null
              ? o
              : !e.options.manualPagination
          ) {
            if (t) return;
            (t = !0),
              e._queue(() => {
                e.resetPageIndex(), (t = !1);
              });
          }
        },
        setPagination: o => {
          const r = l => E(o, l);
          return e.options.onPaginationChange == null ? void 0 : e.options.onPaginationChange(r);
        },
        resetPagination: o => {
          var r;
          e.setPagination(o ? O() : (r = e.initialState.pagination) != null ? r : O());
        },
        setPageIndex: o => {
          e.setPagination(r => {
            let l = E(o, r.pageIndex);
            const i =
              typeof e.options.pageCount > "u" || e.options.pageCount === -1
                ? Number.MAX_SAFE_INTEGER
                : e.options.pageCount - 1;
            return (
              (l = Math.max(0, Math.min(l, i))),
              {
                ...r,
                pageIndex: l,
              }
            );
          });
        },
        resetPageIndex: o => {
          var r, l, i;
          e.setPageIndex(
            o
              ? z
              : (r =
                  (l = e.initialState) == null || (i = l.pagination) == null
                    ? void 0
                    : i.pageIndex) != null
              ? r
              : z
          );
        },
        resetPageSize: o => {
          var r, l, i;
          e.setPageSize(
            o
              ? k
              : (r =
                  (l = e.initialState) == null || (i = l.pagination) == null
                    ? void 0
                    : i.pageSize) != null
              ? r
              : k
          );
        },
        setPageSize: o => {
          e.setPagination(r => {
            const l = Math.max(1, E(o, r.pageSize)),
              i = r.pageSize * r.pageIndex,
              g = Math.floor(i / l);
            return {
              ...r,
              pageIndex: g,
              pageSize: l,
            };
          });
        },
        setPageCount: o =>
          e.setPagination(r => {
            var l;
            let i = E(o, (l = e.options.pageCount) != null ? l : -1);
            return (
              typeof i == "number" && (i = Math.max(-1, i)),
              {
                ...r,
                pageCount: i,
              }
            );
          }),
        getPageOptions: v(
          () => [e.getPageCount()],
          o => {
            let r = [];
            return o && o > 0 && (r = [...new Array(o)].fill(null).map((l, i) => i)), r;
          },
          {
            key: process.env.NODE_ENV === "development" && "getPageOptions",
            debug: () => {
              var o;
              return (o = e.options.debugAll) != null ? o : e.options.debugTable;
            },
          }
        ),
        getCanPreviousPage: () => e.getState().pagination.pageIndex > 0,
        getCanNextPage: () => {
          const { pageIndex: o } = e.getState().pagination,
            r = e.getPageCount();
          return r === -1 ? !0 : r === 0 ? !1 : o < r - 1;
        },
        previousPage: () => e.setPageIndex(o => o - 1),
        nextPage: () => e.setPageIndex(o => o + 1),
        getPrePaginationRowModel: () => e.getExpandedRowModel(),
        getPaginationRowModel: () => (
          !e._getPaginationRowModel &&
            e.options.getPaginationRowModel &&
            (e._getPaginationRowModel = e.options.getPaginationRowModel(e)),
          e.options.manualPagination || !e._getPaginationRowModel
            ? e.getPrePaginationRowModel()
            : e._getPaginationRowModel()
        ),
        getPageCount: () => {
          var o;
          return (o = e.options.pageCount) != null
            ? o
            : Math.ceil(
                e.getPrePaginationRowModel().rows.length / e.getState().pagination.pageSize
              );
        },
      };
    },
  },
  G = () => ({
    left: [],
    right: [],
  }),
  xe = {
    getInitialState: e => ({
      columnPinning: G(),
      ...e,
    }),
    getDefaultOptions: e => ({
      onColumnPinningChange: R("columnPinning", e),
    }),
    createColumn: (e, n) => ({
      pin: t => {
        const o = e
          .getLeafColumns()
          .map(r => r.id)
          .filter(Boolean);
        n.setColumnPinning(r => {
          var l, i;
          if (t === "right") {
            var g, a;
            return {
              left: ((g = r == null ? void 0 : r.left) != null ? g : []).filter(
                c => !(o != null && o.includes(c))
              ),
              right: [
                ...((a = r == null ? void 0 : r.right) != null ? a : []).filter(
                  c => !(o != null && o.includes(c))
                ),
                ...o,
              ],
            };
          }
          if (t === "left") {
            var d, u;
            return {
              left: [
                ...((d = r == null ? void 0 : r.left) != null ? d : []).filter(
                  c => !(o != null && o.includes(c))
                ),
                ...o,
              ],
              right: ((u = r == null ? void 0 : r.right) != null ? u : []).filter(
                c => !(o != null && o.includes(c))
              ),
            };
          }
          return {
            left: ((l = r == null ? void 0 : r.left) != null ? l : []).filter(
              c => !(o != null && o.includes(c))
            ),
            right: ((i = r == null ? void 0 : r.right) != null ? i : []).filter(
              c => !(o != null && o.includes(c))
            ),
          };
        });
      },
      getCanPin: () =>
        e.getLeafColumns().some(o => {
          var r, l;
          return (
            ((r = o.columnDef.enablePinning) != null ? r : !0) &&
            ((l = n.options.enablePinning) != null ? l : !0)
          );
        }),
      getIsPinned: () => {
        const t = e.getLeafColumns().map(g => g.id),
          { left: o, right: r } = n.getState().columnPinning,
          l = t.some(g => (o == null ? void 0 : o.includes(g))),
          i = t.some(g => (r == null ? void 0 : r.includes(g)));
        return l ? "left" : i ? "right" : !1;
      },
      getPinnedIndex: () => {
        var t, o, r;
        const l = e.getIsPinned();
        return l
          ? (t =
              (o = n.getState().columnPinning) == null || (r = o[l]) == null
                ? void 0
                : r.indexOf(e.id)) != null
            ? t
            : -1
          : 0;
      },
    }),
    createRow: (e, n) => ({
      getCenterVisibleCells: v(
        () => [
          e._getAllVisibleCells(),
          n.getState().columnPinning.left,
          n.getState().columnPinning.right,
        ],
        (t, o, r) => {
          const l = [...(o ?? []), ...(r ?? [])];
          return t.filter(i => !l.includes(i.column.id));
        },
        {
          key: process.env.NODE_ENV === "production" && "row.getCenterVisibleCells",
          debug: () => {
            var t;
            return (t = n.options.debugAll) != null ? t : n.options.debugRows;
          },
        }
      ),
      getLeftVisibleCells: v(
        () => [e._getAllVisibleCells(), n.getState().columnPinning.left, ,],
        (t, o) =>
          (o ?? [])
            .map(l => t.find(i => i.column.id === l))
            .filter(Boolean)
            .map(l => ({
              ...l,
              position: "left",
            })),
        {
          key: process.env.NODE_ENV === "production" && "row.getLeftVisibleCells",
          debug: () => {
            var t;
            return (t = n.options.debugAll) != null ? t : n.options.debugRows;
          },
        }
      ),
      getRightVisibleCells: v(
        () => [e._getAllVisibleCells(), n.getState().columnPinning.right],
        (t, o) =>
          (o ?? [])
            .map(l => t.find(i => i.column.id === l))
            .filter(Boolean)
            .map(l => ({
              ...l,
              position: "right",
            })),
        {
          key: process.env.NODE_ENV === "production" && "row.getRightVisibleCells",
          debug: () => {
            var t;
            return (t = n.options.debugAll) != null ? t : n.options.debugRows;
          },
        }
      ),
    }),
    createTable: e => ({
      setColumnPinning: n =>
        e.options.onColumnPinningChange == null ? void 0 : e.options.onColumnPinningChange(n),
      resetColumnPinning: n => {
        var t, o;
        return e.setColumnPinning(
          n ? G() : (t = (o = e.initialState) == null ? void 0 : o.columnPinning) != null ? t : G()
        );
      },
      getIsSomeColumnsPinned: n => {
        var t;
        const o = e.getState().columnPinning;
        if (!n) {
          var r, l;
          return !!(((r = o.left) != null && r.length) || ((l = o.right) != null && l.length));
        }
        return !!((t = o[n]) != null && t.length);
      },
      getLeftLeafColumns: v(
        () => [e.getAllLeafColumns(), e.getState().columnPinning.left],
        (n, t) => (t ?? []).map(o => n.find(r => r.id === o)).filter(Boolean),
        {
          key: process.env.NODE_ENV === "development" && "getLeftLeafColumns",
          debug: () => {
            var n;
            return (n = e.options.debugAll) != null ? n : e.options.debugColumns;
          },
        }
      ),
      getRightLeafColumns: v(
        () => [e.getAllLeafColumns(), e.getState().columnPinning.right],
        (n, t) => (t ?? []).map(o => n.find(r => r.id === o)).filter(Boolean),
        {
          key: process.env.NODE_ENV === "development" && "getRightLeafColumns",
          debug: () => {
            var n;
            return (n = e.options.debugAll) != null ? n : e.options.debugColumns;
          },
        }
      ),
      getCenterLeafColumns: v(
        () => [
          e.getAllLeafColumns(),
          e.getState().columnPinning.left,
          e.getState().columnPinning.right,
        ],
        (n, t, o) => {
          const r = [...(t ?? []), ...(o ?? [])];
          return n.filter(l => !r.includes(l.id));
        },
        {
          key: process.env.NODE_ENV === "development" && "getCenterLeafColumns",
          debug: () => {
            var n;
            return (n = e.options.debugAll) != null ? n : e.options.debugColumns;
          },
        }
      ),
    }),
  },
  ye = {
    getInitialState: e => ({
      rowSelection: {},
      ...e,
    }),
    getDefaultOptions: e => ({
      onRowSelectionChange: R("rowSelection", e),
      enableRowSelection: !0,
      enableMultiRowSelection: !0,
      enableSubRowSelection: !0,
      // enableGroupingRowSelection: false,
      // isAdditiveSelectEvent: (e: unknown) => !!e.metaKey,
      // isInclusiveSelectEvent: (e: unknown) => !!e.shiftKey,
    }),
    createTable: e => ({
      setRowSelection: n =>
        e.options.onRowSelectionChange == null ? void 0 : e.options.onRowSelectionChange(n),
      resetRowSelection: n => {
        var t;
        return e.setRowSelection(n ? {} : (t = e.initialState.rowSelection) != null ? t : {});
      },
      toggleAllRowsSelected: n => {
        e.setRowSelection(t => {
          n = typeof n < "u" ? n : !e.getIsAllRowsSelected();
          const o = {
              ...t,
            },
            r = e.getPreGroupedRowModel().flatRows;
          return (
            n
              ? r.forEach(l => {
                  l.getCanSelect() && (o[l.id] = !0);
                })
              : r.forEach(l => {
                  delete o[l.id];
                }),
            o
          );
        });
      },
      toggleAllPageRowsSelected: n =>
        e.setRowSelection(t => {
          const o = typeof n < "u" ? n : !e.getIsAllPageRowsSelected(),
            r = {
              ...t,
            };
          return (
            e.getRowModel().rows.forEach(l => {
              B(r, l.id, o, e);
            }),
            r
          );
        }),
      // addRowSelectionRange: rowId => {
      //   const {
      //     rows,
      //     rowsById,
      //     options: { selectGroupingRows, selectSubRows },
      //   } = table
      //   const findSelectedRow = (rows: Row[]) => {
      //     let found
      //     rows.find(d => {
      //       if (d.getIsSelected()) {
      //         found = d
      //         return true
      //       }
      //       const subFound = findSelectedRow(d.subRows || [])
      //       if (subFound) {
      //         found = subFound
      //         return true
      //       }
      //       return false
      //     })
      //     return found
      //   }
      //   const firstRow = findSelectedRow(rows) || rows[0]
      //   const lastRow = rowsById[rowId]
      //   let include = false
      //   const selectedRowIds = {}
      //   const addRow = (row: Row) => {
      //     mutateRowIsSelected(selectedRowIds, row.id, true, {
      //       rowsById,
      //       selectGroupingRows: selectGroupingRows!,
      //       selectSubRows: selectSubRows!,
      //     })
      //   }
      //   table.rows.forEach(row => {
      //     const isFirstRow = row.id === firstRow.id
      //     const isLastRow = row.id === lastRow.id
      //     if (isFirstRow || isLastRow) {
      //       if (!include) {
      //         include = true
      //       } else if (include) {
      //         addRow(row)
      //         include = false
      //       }
      //     }
      //     if (include) {
      //       addRow(row)
      //     }
      //   })
      //   table.setRowSelection(selectedRowIds)
      // },
      getPreSelectedRowModel: () => e.getCoreRowModel(),
      getSelectedRowModel: v(
        () => [e.getState().rowSelection, e.getCoreRowModel()],
        (n, t) =>
          Object.keys(n).length
            ? L(e, t)
            : {
                rows: [],
                flatRows: [],
                rowsById: {},
              },
        {
          key: process.env.NODE_ENV === "development" && "getSelectedRowModel",
          debug: () => {
            var n;
            return (n = e.options.debugAll) != null ? n : e.options.debugTable;
          },
        }
      ),
      getFilteredSelectedRowModel: v(
        () => [e.getState().rowSelection, e.getFilteredRowModel()],
        (n, t) =>
          Object.keys(n).length
            ? L(e, t)
            : {
                rows: [],
                flatRows: [],
                rowsById: {},
              },
        {
          key: process.env.NODE_ENV === "production" && "getFilteredSelectedRowModel",
          debug: () => {
            var n;
            return (n = e.options.debugAll) != null ? n : e.options.debugTable;
          },
        }
      ),
      getGroupedSelectedRowModel: v(
        () => [e.getState().rowSelection, e.getSortedRowModel()],
        (n, t) =>
          Object.keys(n).length
            ? L(e, t)
            : {
                rows: [],
                flatRows: [],
                rowsById: {},
              },
        {
          key: process.env.NODE_ENV === "production" && "getGroupedSelectedRowModel",
          debug: () => {
            var n;
            return (n = e.options.debugAll) != null ? n : e.options.debugTable;
          },
        }
      ),
      ///
      // getGroupingRowCanSelect: rowId => {
      //   const row = table.getRow(rowId)
      //   if (!row) {
      //     throw new Error()
      //   }
      //   if (typeof table.options.enableGroupingRowSelection === 'function') {
      //     return table.options.enableGroupingRowSelection(row)
      //   }
      //   return table.options.enableGroupingRowSelection ?? false
      // },
      getIsAllRowsSelected: () => {
        const n = e.getFilteredRowModel().flatRows,
          { rowSelection: t } = e.getState();
        let o = !!(n.length && Object.keys(t).length);
        return o && n.some(r => r.getCanSelect() && !t[r.id]) && (o = !1), o;
      },
      getIsAllPageRowsSelected: () => {
        const n = e.getPaginationRowModel().flatRows.filter(r => r.getCanSelect()),
          { rowSelection: t } = e.getState();
        let o = !!n.length;
        return o && n.some(r => !t[r.id]) && (o = !1), o;
      },
      getIsSomeRowsSelected: () => {
        var n;
        const t = Object.keys((n = e.getState().rowSelection) != null ? n : {}).length;
        return t > 0 && t < e.getFilteredRowModel().flatRows.length;
      },
      getIsSomePageRowsSelected: () => {
        const n = e.getPaginationRowModel().flatRows;
        return e.getIsAllPageRowsSelected()
          ? !1
          : n.filter(t => t.getCanSelect()).some(t => t.getIsSelected() || t.getIsSomeSelected());
      },
      getToggleAllRowsSelectedHandler: () => n => {
        e.toggleAllRowsSelected(n.target.checked);
      },
      getToggleAllPageRowsSelectedHandler: () => n => {
        e.toggleAllPageRowsSelected(n.target.checked);
      },
    }),
    createRow: (e, n) => ({
      toggleSelected: t => {
        const o = e.getIsSelected();
        n.setRowSelection(r => {
          if (((t = typeof t < "u" ? t : !o), o === t)) return r;
          const l = {
            ...r,
          };
          return B(l, e.id, t, n), l;
        });
      },
      getIsSelected: () => {
        const { rowSelection: t } = n.getState();
        return j(e, t);
      },
      getIsSomeSelected: () => {
        const { rowSelection: t } = n.getState();
        return W(e, t) === "some";
      },
      getIsAllSubRowsSelected: () => {
        const { rowSelection: t } = n.getState();
        return W(e, t) === "all";
      },
      getCanSelect: () => {
        var t;
        return typeof n.options.enableRowSelection == "function"
          ? n.options.enableRowSelection(e)
          : (t = n.options.enableRowSelection) != null
          ? t
          : !0;
      },
      getCanSelectSubRows: () => {
        var t;
        return typeof n.options.enableSubRowSelection == "function"
          ? n.options.enableSubRowSelection(e)
          : (t = n.options.enableSubRowSelection) != null
          ? t
          : !0;
      },
      getCanMultiSelect: () => {
        var t;
        return typeof n.options.enableMultiRowSelection == "function"
          ? n.options.enableMultiRowSelection(e)
          : (t = n.options.enableMultiRowSelection) != null
          ? t
          : !0;
      },
      getToggleSelectedHandler: () => {
        const t = e.getCanSelect();
        return o => {
          var r;
          t && e.toggleSelected((r = o.target) == null ? void 0 : r.checked);
        };
      },
    }),
  },
  B = (e, n, t, o) => {
    var r;
    const l = o.getRow(n);
    t
      ? (l.getCanMultiSelect() || Object.keys(e).forEach(i => delete e[i]),
        l.getCanSelect() && (e[n] = !0))
      : delete e[n],
      (r = l.subRows) != null &&
        r.length &&
        l.getCanSelectSubRows() &&
        l.subRows.forEach(i => B(e, i.id, t, o));
  };
function L(e, n) {
  const t = e.getState().rowSelection,
    o = [],
    r = {},
    l = function (i, g) {
      return i
        .map(a => {
          var d;
          const u = j(a, t);
          if (
            (u && (o.push(a), (r[a.id] = a)),
            (d = a.subRows) != null &&
              d.length &&
              (a = {
                ...a,
                subRows: l(a.subRows),
              }),
            u)
          )
            return a;
        })
        .filter(Boolean);
    };
  return {
    rows: l(n.rows),
    flatRows: o,
    rowsById: r,
  };
}
function j(e, n) {
  var t;
  return (t = n[e.id]) != null ? t : !1;
}
function W(e, n, t) {
  if (e.subRows && e.subRows.length) {
    let o = !0,
      r = !1;
    return (
      e.subRows.forEach(l => {
        (r && !o) || (j(l, n) ? (r = !0) : (o = !1));
      }),
      o ? "all" : r ? "some" : !1
    );
  }
  return !1;
}
const q = /([0-9]+)/gm,
  De = (e, n, t) => ue(b(e.getValue(t)).toLowerCase(), b(n.getValue(t)).toLowerCase()),
  Ie = (e, n, t) => ue(b(e.getValue(t)), b(n.getValue(t))),
  Pe = (e, n, t) => U(b(e.getValue(t)).toLowerCase(), b(n.getValue(t)).toLowerCase()),
  He = (e, n, t) => U(b(e.getValue(t)), b(n.getValue(t))),
  Ne = (e, n, t) => {
    const o = e.getValue(t),
      r = n.getValue(t);
    return o > r ? 1 : o < r ? -1 : 0;
  },
  Oe = (e, n, t) => U(e.getValue(t), n.getValue(t));
function U(e, n) {
  return e === n ? 0 : e > n ? 1 : -1;
}
function b(e) {
  return typeof e == "number"
    ? isNaN(e) || e === 1 / 0 || e === -1 / 0
      ? ""
      : String(e)
    : typeof e == "string"
    ? e
    : "";
}
function ue(e, n) {
  const t = e.split(q).filter(Boolean),
    o = n.split(q).filter(Boolean);
  for (; t.length && o.length; ) {
    const r = t.shift(),
      l = o.shift(),
      i = parseInt(r, 10),
      g = parseInt(l, 10),
      a = [i, g].sort();
    if (isNaN(a[0])) {
      if (r > l) return 1;
      if (l > r) return -1;
      continue;
    }
    if (isNaN(a[1])) return isNaN(i) ? -1 : 1;
    if (i > g) return 1;
    if (g > i) return -1;
  }
  return t.length - o.length;
}
const M = {
    alphanumeric: De,
    alphanumericCaseSensitive: Ie,
    text: Pe,
    textCaseSensitive: He,
    datetime: Ne,
    basic: Oe,
  },
  Ge = {
    getInitialState: e => ({
      sorting: [],
      ...e,
    }),
    getDefaultColumnDef: () => ({
      sortingFn: "auto",
    }),
    getDefaultOptions: e => ({
      onSortingChange: R("sorting", e),
      isMultiSortEvent: n => n.shiftKey,
    }),
    createColumn: (e, n) => ({
      getAutoSortingFn: () => {
        const t = n.getFilteredRowModel().flatRows.slice(10);
        let o = !1;
        for (const r of t) {
          const l = r == null ? void 0 : r.getValue(e.id);
          if (Object.prototype.toString.call(l) === "[object Date]") return M.datetime;
          if (typeof l == "string" && ((o = !0), l.split(q).length > 1)) return M.alphanumeric;
        }
        return o ? M.text : M.basic;
      },
      getAutoSortDir: () => {
        const t = n.getFilteredRowModel().flatRows[0];
        return typeof (t == null ? void 0 : t.getValue(e.id)) == "string" ? "asc" : "desc";
      },
      getSortingFn: () => {
        var t, o;
        if (!e) throw new Error();
        return D(e.columnDef.sortingFn)
          ? e.columnDef.sortingFn
          : e.columnDef.sortingFn === "auto"
          ? e.getAutoSortingFn()
          : (t = (o = n.options.sortingFns) == null ? void 0 : o[e.columnDef.sortingFn]) != null
          ? t
          : M[e.columnDef.sortingFn];
      },
      toggleSorting: (t, o) => {
        const r = e.getNextSortingOrder(),
          l = typeof t < "u" && t !== null;
        n.setSorting(i => {
          const g = i == null ? void 0 : i.find(s => s.id === e.id),
            a = i == null ? void 0 : i.findIndex(s => s.id === e.id);
          let d = [],
            u,
            c = l ? t : r === "desc";
          if (
            (i != null && i.length && e.getCanMultiSort() && o
              ? g
                ? (u = "toggle")
                : (u = "add")
              : i != null && i.length && a !== i.length - 1
              ? (u = "replace")
              : g
              ? (u = "toggle")
              : (u = "replace"),
            u === "toggle" && (l || r || (u = "remove")),
            u === "add")
          ) {
            var f;
            (d = [
              ...i,
              {
                id: e.id,
                desc: c,
              },
            ]),
              d.splice(
                0,
                d.length -
                  ((f = n.options.maxMultiSortColCount) != null ? f : Number.MAX_SAFE_INTEGER)
              );
          } else
            u === "toggle"
              ? (d = i.map(s =>
                  s.id === e.id
                    ? {
                        ...s,
                        desc: c,
                      }
                    : s
                ))
              : u === "remove"
              ? (d = i.filter(s => s.id !== e.id))
              : (d = [
                  {
                    id: e.id,
                    desc: c,
                  },
                ]);
          return d;
        });
      },
      getFirstSortDir: () => {
        var t, o;
        return (
          (t = (o = e.columnDef.sortDescFirst) != null ? o : n.options.sortDescFirst) != null
            ? t
            : e.getAutoSortDir() === "desc"
        )
          ? "desc"
          : "asc";
      },
      getNextSortingOrder: t => {
        var o, r;
        const l = e.getFirstSortDir(),
          i = e.getIsSorted();
        return i
          ? i !== l &&
            ((o = n.options.enableSortingRemoval) == null || o) && // If enableSortRemove, enable in general
            (!(t && (r = n.options.enableMultiRemove) != null) || r)
            ? !1
            : i === "desc"
            ? "asc"
            : "desc"
          : l;
      },
      getCanSort: () => {
        var t, o;
        return (
          ((t = e.columnDef.enableSorting) != null ? t : !0) &&
          ((o = n.options.enableSorting) != null ? o : !0) &&
          !!e.accessorFn
        );
      },
      getCanMultiSort: () => {
        var t, o;
        return (t = (o = e.columnDef.enableMultiSort) != null ? o : n.options.enableMultiSort) !=
          null
          ? t
          : !!e.accessorFn;
      },
      getIsSorted: () => {
        var t;
        const o = (t = n.getState().sorting) == null ? void 0 : t.find(r => r.id === e.id);
        return o ? (o.desc ? "desc" : "asc") : !1;
      },
      getSortIndex: () => {
        var t, o;
        return (t =
          (o = n.getState().sorting) == null ? void 0 : o.findIndex(r => r.id === e.id)) != null
          ? t
          : -1;
      },
      clearSorting: () => {
        n.setSorting(t => (t != null && t.length ? t.filter(o => o.id !== e.id) : []));
      },
      getToggleSortingHandler: () => {
        const t = e.getCanSort();
        return o => {
          t &&
            (o.persist == null || o.persist(),
            e.toggleSorting == null ||
              e.toggleSorting(
                void 0,
                e.getCanMultiSort()
                  ? n.options.isMultiSortEvent == null
                    ? void 0
                    : n.options.isMultiSortEvent(o)
                  : !1
              ));
        };
      },
    }),
    createTable: e => ({
      setSorting: n => (e.options.onSortingChange == null ? void 0 : e.options.onSortingChange(n)),
      resetSorting: n => {
        var t, o;
        e.setSorting(
          n ? [] : (t = (o = e.initialState) == null ? void 0 : o.sorting) != null ? t : []
        );
      },
      getPreSortedRowModel: () => e.getGroupedRowModel(),
      getSortedRowModel: () => (
        !e._getSortedRowModel &&
          e.options.getSortedRowModel &&
          (e._getSortedRowModel = e.options.getSortedRowModel(e)),
        e.options.manualSorting || !e._getSortedRowModel
          ? e.getPreSortedRowModel()
          : e._getSortedRowModel()
      ),
    }),
  },
  Le = {
    getInitialState: e => ({
      columnVisibility: {},
      ...e,
    }),
    getDefaultOptions: e => ({
      onColumnVisibilityChange: R("columnVisibility", e),
    }),
    createColumn: (e, n) => ({
      toggleVisibility: t => {
        e.getCanHide() &&
          n.setColumnVisibility(o => ({
            ...o,
            [e.id]: t ?? !e.getIsVisible(),
          }));
      },
      getIsVisible: () => {
        var t, o;
        return (t = (o = n.getState().columnVisibility) == null ? void 0 : o[e.id]) != null
          ? t
          : !0;
      },
      getCanHide: () => {
        var t, o;
        return (
          ((t = e.columnDef.enableHiding) != null ? t : !0) &&
          ((o = n.options.enableHiding) != null ? o : !0)
        );
      },
      getToggleVisibilityHandler: () => t => {
        e.toggleVisibility == null || e.toggleVisibility(t.target.checked);
      },
    }),
    createRow: (e, n) => ({
      _getAllVisibleCells: v(
        () => [e.getAllCells(), n.getState().columnVisibility],
        t => t.filter(o => o.column.getIsVisible()),
        {
          key: process.env.NODE_ENV === "production" && "row._getAllVisibleCells",
          debug: () => {
            var t;
            return (t = n.options.debugAll) != null ? t : n.options.debugRows;
          },
        }
      ),
      getVisibleCells: v(
        () => [e.getLeftVisibleCells(), e.getCenterVisibleCells(), e.getRightVisibleCells()],
        (t, o, r) => [...t, ...o, ...r],
        {
          key: process.env.NODE_ENV === "development" && "row.getVisibleCells",
          debug: () => {
            var t;
            return (t = n.options.debugAll) != null ? t : n.options.debugRows;
          },
        }
      ),
    }),
    createTable: e => {
      const n = (t, o) =>
        v(
          () => [
            o(),
            o()
              .filter(r => r.getIsVisible())
              .map(r => r.id)
              .join("_"),
          ],
          r => r.filter(l => (l.getIsVisible == null ? void 0 : l.getIsVisible())),
          {
            key: t,
            debug: () => {
              var r;
              return (r = e.options.debugAll) != null ? r : e.options.debugColumns;
            },
          }
        );
      return {
        getVisibleFlatColumns: n("getVisibleFlatColumns", () => e.getAllFlatColumns()),
        getVisibleLeafColumns: n("getVisibleLeafColumns", () => e.getAllLeafColumns()),
        getLeftVisibleLeafColumns: n("getLeftVisibleLeafColumns", () => e.getLeftLeafColumns()),
        getRightVisibleLeafColumns: n("getRightVisibleLeafColumns", () => e.getRightLeafColumns()),
        getCenterVisibleLeafColumns: n("getCenterVisibleLeafColumns", () =>
          e.getCenterLeafColumns()
        ),
        setColumnVisibility: t =>
          e.options.onColumnVisibilityChange == null
            ? void 0
            : e.options.onColumnVisibilityChange(t),
        resetColumnVisibility: t => {
          var o;
          e.setColumnVisibility(t ? {} : (o = e.initialState.columnVisibility) != null ? o : {});
        },
        toggleAllColumnsVisible: t => {
          var o;
          (t = (o = t) != null ? o : !e.getIsAllColumnsVisible()),
            e.setColumnVisibility(
              e.getAllLeafColumns().reduce(
                (r, l) => ({
                  ...r,
                  [l.id]: t || !(l.getCanHide != null && l.getCanHide()),
                }),
                {}
              )
            );
        },
        getIsAllColumnsVisible: () =>
          !e.getAllLeafColumns().some(t => !(t.getIsVisible != null && t.getIsVisible())),
        getIsSomeColumnsVisible: () =>
          e.getAllLeafColumns().some(t => (t.getIsVisible == null ? void 0 : t.getIsVisible())),
        getToggleAllColumnsVisibilityHandler: () => t => {
          var o;
          e.toggleAllColumnsVisible((o = t.target) == null ? void 0 : o.checked);
        },
      };
    },
  },
  Y = [ce, Le, Me, xe, ve, Ge, Ee, me, Ae, ye, fe];
function je(e) {
  var n;
  (e.debugAll || e.debugTable) && console.info("Creating Table Instance...");
  let t = {
    _features: Y,
  };
  const o = t._features.reduce(
      (u, c) => Object.assign(u, c.getDefaultOptions == null ? void 0 : c.getDefaultOptions(t)),
      {}
    ),
    r = u =>
      t.options.mergeOptions
        ? t.options.mergeOptions(o, u)
        : {
            ...o,
            ...u,
          };
  let i = {
    ...{},
    ...((n = e.initialState) != null ? n : {}),
  };
  t._features.forEach(u => {
    var c;
    i = (c = u.getInitialState == null ? void 0 : u.getInitialState(i)) != null ? c : i;
  });
  const g = [];
  let a = !1;
  const d = {
    _features: Y,
    options: {
      ...o,
      ...e,
    },
    initialState: i,
    _queue: u => {
      g.push(u),
        a ||
          ((a = !0),
          Promise.resolve()
            .then(() => {
              for (; g.length; ) g.shift()();
              a = !1;
            })
            .catch(c =>
              setTimeout(() => {
                throw c;
              })
            ));
    },
    reset: () => {
      t.setState(t.initialState);
    },
    setOptions: u => {
      const c = E(u, t.options);
      t.options = r(c);
    },
    getState: () => t.options.state,
    setState: u => {
      t.options.onStateChange == null || t.options.onStateChange(u);
    },
    _getRowId: (u, c, f) => {
      var s;
      return (s = t.options.getRowId == null ? void 0 : t.options.getRowId(u, c, f)) != null
        ? s
        : `${f ? [f.id, c].join(".") : c}`;
    },
    getCoreRowModel: () => (
      t._getCoreRowModel || (t._getCoreRowModel = t.options.getCoreRowModel(t)),
      t._getCoreRowModel()
    ),
    // The final calls start at the bottom of the model,
    // expanded rows, which then work their way up
    getRowModel: () => t.getPaginationRowModel(),
    getRow: u => {
      const c = t.getRowModel().rowsById[u];
      if (!c)
        throw process.env.NODE_ENV !== "production"
          ? new Error(`getRow expected an ID, but got ${u}`)
          : new Error();
      return c;
    },
    _getDefaultColumnDef: v(
      () => [t.options.defaultColumn],
      u => {
        var c;
        return (
          (u = (c = u) != null ? c : {}),
          {
            header: f => {
              const s = f.header.column.columnDef;
              return s.accessorKey ? s.accessorKey : s.accessorFn ? s.id : null;
            },
            // footer: props => props.header.column.id,
            cell: f => {
              var s, m;
              return (s =
                (m = f.renderValue()) == null || m.toString == null ? void 0 : m.toString()) != null
                ? s
                : null;
            },
            ...t._features.reduce(
              (f, s) =>
                Object.assign(f, s.getDefaultColumnDef == null ? void 0 : s.getDefaultColumnDef()),
              {}
            ),
            ...u,
          }
        );
      },
      {
        debug: () => {
          var u;
          return (u = t.options.debugAll) != null ? u : t.options.debugColumns;
        },
        key: process.env.NODE_ENV === "development" && "getDefaultColumnDef",
      }
    ),
    _getColumnDefs: () => t.options.columns,
    getAllColumns: v(
      () => [t._getColumnDefs()],
      u => {
        const c = function (f, s, m) {
          return (
            m === void 0 && (m = 0),
            f.map(p => {
              const S = de(t, p, m, s),
                C = p;
              return (S.columns = C.columns ? c(C.columns, S, m + 1) : []), S;
            })
          );
        };
        return c(u);
      },
      {
        key: process.env.NODE_ENV === "development" && "getAllColumns",
        debug: () => {
          var u;
          return (u = t.options.debugAll) != null ? u : t.options.debugColumns;
        },
      }
    ),
    getAllFlatColumns: v(
      () => [t.getAllColumns()],
      u => u.flatMap(c => c.getFlatColumns()),
      {
        key: process.env.NODE_ENV === "development" && "getAllFlatColumns",
        debug: () => {
          var u;
          return (u = t.options.debugAll) != null ? u : t.options.debugColumns;
        },
      }
    ),
    _getAllFlatColumnsById: v(
      () => [t.getAllFlatColumns()],
      u => u.reduce((c, f) => ((c[f.id] = f), c), {}),
      {
        key: process.env.NODE_ENV === "development" && "getAllFlatColumnsById",
        debug: () => {
          var u;
          return (u = t.options.debugAll) != null ? u : t.options.debugColumns;
        },
      }
    ),
    getAllLeafColumns: v(
      () => [t.getAllColumns(), t._getOrderColumnsFn()],
      (u, c) => {
        let f = u.flatMap(s => s.getLeafColumns());
        return c(f);
      },
      {
        key: process.env.NODE_ENV === "development" && "getAllLeafColumns",
        debug: () => {
          var u;
          return (u = t.options.debugAll) != null ? u : t.options.debugColumns;
        },
      }
    ),
    getColumn: u => {
      const c = t._getAllFlatColumnsById()[u];
      return (
        process.env.NODE_ENV !== "production" &&
          !c &&
          console.error(`[Table] Column with id '${u}' does not exist.`),
        c
      );
    },
  };
  return (
    Object.assign(t, d),
    t._features.forEach(u => Object.assign(t, u.createTable == null ? void 0 : u.createTable(t))),
    t
  );
}
function ze(e, n, t, o) {
  const r = () => {
      var i;
      return (i = l.getValue()) != null ? i : e.options.renderFallbackValue;
    },
    l = {
      id: `${n.id}_${t.id}`,
      row: n,
      column: t,
      getValue: () => n.getValue(o),
      renderValue: r,
      getContext: v(
        () => [e, t, n, l],
        (i, g, a, d) => ({
          table: i,
          column: g,
          row: a,
          cell: d,
          getValue: d.getValue,
          renderValue: d.renderValue,
        }),
        {
          key: process.env.NODE_ENV === "development" && "cell.getContext",
          debug: () => e.options.debugAll,
        }
      ),
    };
  return (
    e._features.forEach(i => {
      Object.assign(l, i.createCell == null ? void 0 : i.createCell(l, t, n, e));
    }, {}),
    l
  );
}
const X = (e, n, t, o, r, l, i) => {
  let g = {
    id: n,
    index: o,
    original: t,
    depth: r,
    parentId: i,
    _valuesCache: {},
    _uniqueValuesCache: {},
    getValue: a => {
      if (g._valuesCache.hasOwnProperty(a)) return g._valuesCache[a];
      const d = e.getColumn(a);
      if (d != null && d.accessorFn)
        return (g._valuesCache[a] = d.accessorFn(g.original, o)), g._valuesCache[a];
    },
    getUniqueValues: a => {
      if (g._uniqueValuesCache.hasOwnProperty(a)) return g._uniqueValuesCache[a];
      const d = e.getColumn(a);
      if (d != null && d.accessorFn)
        return d.columnDef.getUniqueValues
          ? ((g._uniqueValuesCache[a] = d.columnDef.getUniqueValues(g.original, o)),
            g._uniqueValuesCache[a])
          : ((g._uniqueValuesCache[a] = [g.getValue(a)]), g._uniqueValuesCache[a]);
    },
    renderValue: a => {
      var d;
      return (d = g.getValue(a)) != null ? d : e.options.renderFallbackValue;
    },
    subRows: l ?? [],
    getLeafRows: () => ge(g.subRows, a => a.subRows),
    getParentRow: () => (g.parentId ? e.getRow(g.parentId) : void 0),
    getParentRows: () => {
      let a = [],
        d = g;
      for (;;) {
        const u = d.getParentRow();
        if (!u) break;
        a.push(u), (d = u);
      }
      return a.reverse();
    },
    getAllCells: v(
      () => [e.getAllLeafColumns()],
      a => a.map(d => ze(e, g, d, d.id)),
      {
        key: process.env.NODE_ENV === "development" && "row.getAllCells",
        debug: () => {
          var a;
          return (a = e.options.debugAll) != null ? a : e.options.debugRows;
        },
      }
    ),
    _getAllCellsByColumnId: v(
      () => [g.getAllCells()],
      a => a.reduce((d, u) => ((d[u.column.id] = u), d), {}),
      {
        key: process.env.NODE_ENV === "production" && "row.getAllCellsByColumnId",
        debug: () => {
          var a;
          return (a = e.options.debugAll) != null ? a : e.options.debugRows;
        },
      }
    ),
  };
  for (let a = 0; a < e._features.length; a++) {
    const d = e._features[a];
    Object.assign(g, d == null || d.createRow == null ? void 0 : d.createRow(g, e));
  }
  return g;
};
function Ue() {
  return e =>
    v(
      () => [e.options.data],
      n => {
        const t = {
            rows: [],
            flatRows: [],
            rowsById: {},
          },
          o = function (r, l, i) {
            l === void 0 && (l = 0);
            const g = [];
            for (let d = 0; d < r.length; d++) {
              const u = X(
                e,
                e._getRowId(r[d], d, i),
                r[d],
                d,
                l,
                void 0,
                i == null ? void 0 : i.id
              );
              if ((t.flatRows.push(u), (t.rowsById[u.id] = u), g.push(u), e.options.getSubRows)) {
                var a;
                (u.originalSubRows = e.options.getSubRows(r[d], d)),
                  (a = u.originalSubRows) != null &&
                    a.length &&
                    (u.subRows = o(u.originalSubRows, l + 1, u));
              }
            }
            return g;
          };
        return (t.rows = o(n)), t;
      },
      {
        key: process.env.NODE_ENV === "development" && "getRowModel",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugTable;
        },
        onChange: () => {
          e._autoResetPageIndex();
        },
      }
    );
}
function ke(e, n, t) {
  return t.options.filterFromLeafRows ? Be(e, n, t) : qe(e, n, t);
}
function Be(e, n, t) {
  var o;
  const r = [],
    l = {},
    i = (o = t.options.maxLeafRowFilterDepth) != null ? o : 100,
    g = function (a, d) {
      d === void 0 && (d = 0);
      const u = [];
      for (let f = 0; f < a.length; f++) {
        var c;
        let s = a[f];
        const m = X(t, s.id, s.original, s.index, s.depth, void 0, s.parentId);
        if (((m.columnFilters = s.columnFilters), (c = s.subRows) != null && c.length && d < i)) {
          if (((m.subRows = g(s.subRows, d + 1)), (s = m), n(s) && !m.subRows.length)) {
            u.push(s), (l[s.id] = s), (l[f] = s);
            continue;
          }
          if (n(s) || m.subRows.length) {
            u.push(s), (l[s.id] = s), (l[f] = s);
            continue;
          }
        } else (s = m), n(s) && (u.push(s), (l[s.id] = s), (l[f] = s));
      }
      return u;
    };
  return {
    rows: g(e),
    flatRows: r,
    rowsById: l,
  };
}
function qe(e, n, t) {
  var o;
  const r = [],
    l = {},
    i = (o = t.options.maxLeafRowFilterDepth) != null ? o : 100,
    g = function (a, d) {
      d === void 0 && (d = 0);
      const u = [];
      for (let f = 0; f < a.length; f++) {
        let s = a[f];
        if (n(s)) {
          var c;
          if ((c = s.subRows) != null && c.length && d < i) {
            const p = X(t, s.id, s.original, s.index, s.depth, void 0, s.parentId);
            (p.subRows = g(s.subRows, d + 1)), (s = p);
          }
          u.push(s), r.push(s), (l[s.id] = s);
        }
      }
      return u;
    };
  return {
    rows: g(e),
    flatRows: r,
    rowsById: l,
  };
}
function Xe() {
  return e =>
    v(
      () => [e.getPreFilteredRowModel(), e.getState().columnFilters, e.getState().globalFilter],
      (n, t, o) => {
        if (!n.rows.length || (!(t != null && t.length) && !o)) {
          for (let f = 0; f < n.flatRows.length; f++)
            (n.flatRows[f].columnFilters = {}), (n.flatRows[f].columnFiltersMeta = {});
          return n;
        }
        const r = [],
          l = [];
        (t ?? []).forEach(f => {
          var s;
          const m = e.getColumn(f.id);
          if (!m) return;
          const p = m.getFilterFn();
          if (!p) {
            process.env.NODE_ENV !== "production" &&
              console.warn(
                `Could not find a valid 'column.filterFn' for column with the ID: ${m.id}.`
              );
            return;
          }
          r.push({
            id: f.id,
            filterFn: p,
            resolvedValue:
              (s = p.resolveFilterValue == null ? void 0 : p.resolveFilterValue(f.value)) != null
                ? s
                : f.value,
          });
        });
        const i = t.map(f => f.id),
          g = e.getGlobalFilterFn(),
          a = e.getAllLeafColumns().filter(f => f.getCanGlobalFilter());
        o &&
          g &&
          a.length &&
          (i.push("__global__"),
          a.forEach(f => {
            var s;
            l.push({
              id: f.id,
              filterFn: g,
              resolvedValue:
                (s = g.resolveFilterValue == null ? void 0 : g.resolveFilterValue(o)) != null
                  ? s
                  : o,
            });
          }));
        let d, u;
        for (let f = 0; f < n.flatRows.length; f++) {
          const s = n.flatRows[f];
          if (((s.columnFilters = {}), r.length))
            for (let m = 0; m < r.length; m++) {
              d = r[m];
              const p = d.id;
              s.columnFilters[p] = d.filterFn(s, p, d.resolvedValue, S => {
                s.columnFiltersMeta[p] = S;
              });
            }
          if (l.length) {
            for (let m = 0; m < l.length; m++) {
              u = l[m];
              const p = u.id;
              if (
                u.filterFn(s, p, u.resolvedValue, S => {
                  s.columnFiltersMeta[p] = S;
                })
              ) {
                s.columnFilters.__global__ = !0;
                break;
              }
            }
            s.columnFilters.__global__ !== !0 && (s.columnFilters.__global__ = !1);
          }
        }
        const c = f => {
          for (let s = 0; s < i.length; s++) if (f.columnFilters[i[s]] === !1) return !1;
          return !0;
        };
        return ke(n.rows, c, e);
      },
      {
        key: process.env.NODE_ENV === "development" && "getFilteredRowModel",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugTable;
        },
        onChange: () => {
          e._autoResetPageIndex();
        },
      }
    );
}
function Ke() {
  return e =>
    v(
      () => [e.getState().sorting, e.getPreSortedRowModel()],
      (n, t) => {
        if (!t.rows.length || !(n != null && n.length)) return t;
        const o = e.getState().sorting,
          r = [],
          l = o.filter(a => {
            var d;
            return (d = e.getColumn(a.id)) == null ? void 0 : d.getCanSort();
          }),
          i = {};
        l.forEach(a => {
          const d = e.getColumn(a.id);
          d &&
            (i[a.id] = {
              sortUndefined: d.columnDef.sortUndefined,
              invertSorting: d.columnDef.invertSorting,
              sortingFn: d.getSortingFn(),
            });
        });
        const g = a => {
          const d = [...a];
          return (
            d.sort((u, c) => {
              for (let s = 0; s < l.length; s += 1) {
                var f;
                const m = l[s],
                  p = i[m.id],
                  S = (f = m == null ? void 0 : m.desc) != null ? f : !1;
                if (p.sortUndefined) {
                  const V = u.getValue(m.id),
                    w = c.getValue(m.id),
                    _ = typeof V > "u",
                    $ = typeof w > "u";
                  if (_ || $) return _ && $ ? 0 : _ ? p.sortUndefined : -p.sortUndefined;
                }
                let C = p.sortingFn(u, c, m.id);
                if (C !== 0) return S && (C *= -1), p.invertSorting && (C *= -1), C;
              }
              return u.index - c.index;
            }),
            d.forEach(u => {
              var c;
              r.push(u), (c = u.subRows) != null && c.length && (u.subRows = g(u.subRows));
            }),
            d
          );
        };
        return {
          rows: g(t.rows),
          flatRows: r,
          rowsById: t.rowsById,
        };
      },
      {
        key: process.env.NODE_ENV === "development" && "getSortedRowModel",
        debug: () => {
          var n;
          return (n = e.options.debugAll) != null ? n : e.options.debugTable;
        },
        onChange: () => {
          e._autoResetPageIndex();
        },
      }
    );
}
function Te(e) {
  const n = [],
    t = o => {
      var r;
      n.push(o), (r = o.subRows) != null && r.length && o.getIsExpanded() && o.subRows.forEach(t);
    };
  return (
    e.rows.forEach(t),
    {
      rows: n,
      flatRows: e.flatRows,
      rowsById: e.rowsById,
    }
  );
}
function Je(e) {
  return n =>
    v(
      () => [
        n.getState().pagination,
        n.getPrePaginationRowModel(),
        n.options.paginateExpandedRows ? void 0 : n.getState().expanded,
      ],
      (t, o) => {
        if (!o.rows.length) return o;
        const { pageSize: r, pageIndex: l } = t;
        let { rows: i, flatRows: g, rowsById: a } = o;
        const d = r * l,
          u = d + r;
        i = i.slice(d, u);
        let c;
        n.options.paginateExpandedRows
          ? (c = {
              rows: i,
              flatRows: g,
              rowsById: a,
            })
          : (c = Te({
              rows: i,
              flatRows: g,
              rowsById: a,
            })),
          (c.flatRows = []);
        const f = s => {
          c.flatRows.push(s), s.subRows.length && s.subRows.forEach(f);
        };
        return c.rows.forEach(f), c;
      },
      {
        key: process.env.NODE_ENV === "development" && "getPaginationRowModel",
        debug: () => {
          var t;
          return (t = n.options.debugAll) != null ? t : n.options.debugTable;
        },
      }
    );
}
export {
  fe as ColumnSizing,
  me as Expanding,
  ve as Filters,
  Ee as Grouping,
  ce as Headers,
  Me as Ordering,
  Ae as Pagination,
  xe as Pinning,
  ye as RowSelection,
  Ge as Sorting,
  Le as Visibility,
  N as aggregationFns,
  A as buildHeaderGroups,
  ze as createCell,
  de as createColumn,
  X as createRow,
  je as createTable,
  x as defaultColumnSizing,
  Te as expandRows,
  F as filterFns,
  ge as flattenBy,
  E as functionalUpdate,
  Ue as getCoreRowModel,
  Xe as getFilteredRowModel,
  Je as getPaginationRowModel,
  Ke as getSortedRowModel,
  D as isFunction,
  ae as isNumberArray,
  j as isRowSelected,
  W as isSubRowSelected,
  R as makeStateUpdater,
  v as memo,
  be as orderColumns,
  pe as passiveEventSupported,
  q as reSplitAlphaNumeric,
  L as selectRowsFn,
  Q as shouldAutoRemoveFilter,
  M as sortingFns,
};
