import { j as t } from "../../../../../../external/react/jsx-runtime.js";
import { useMemo as B, useState as w, useEffect as H, useCallback as O } from "react";
import {
  useReactTable as $,
  flexRender as D,
} from "../../../../../../external/@tanstack/react-table/build/lib/index.js";
import { rankItem as W } from "../../../../../../external/@tanstack/match-sorter-utils/build/lib/index.js";
import { CountryAndStates as x } from "../../../lib/constants.js";
import q from "next/image";
import { useTranslation as J } from "../../../hooks/useTranslation.js";
import Q from "../../../../../../external/lodash/debounce.js";
import { clx as m } from "../../../../../../helpers.js";
import X from "../../../../../../external/@heroicons/react/20/solid/esm/ArrowUpIcon.js";
import Y from "../../../../../../external/@heroicons/react/20/solid/esm/ArrowDownIcon.js";
import Z from "../../../../../../external/@heroicons/react/24/solid/esm/ArrowsUpDownIcon.js";
import z from "../../../../../../external/@heroicons/react/24/solid/esm/ArrowLeftIcon.js";
import ee from "../../../../../../external/@heroicons/react/24/solid/esm/ArrowRightIcon.js";
import {
  getCoreRowModel as te,
  getSortedRowModel as oe,
  getFilteredRowModel as se,
  getPaginationRowModel as le,
} from "../../../../../../external/@tanstack/table-core/build/lib/index.js";
const re = (o, n = !1) => {
    const r = {
      DEFAULT: "bg-outline",
      GREEN: "bg-green-400 text-green-600",
      RED: "bg-red-400 text-red-600",
    };
    return n
      ? o > 1
        ? r.RED
        : o < 0
        ? r.GREEN
        : r.DEFAULT
      : o > 1
      ? r.GREEN
      : o < 0
      ? r.RED
      : r.DEFAULT;
  },
  ne = o => (o >= 75 ? "bg-[#FDC7B2]" : o >= 50 ? "bg-[#FFECE4]" : "bg-transparent"),
  ce = (o, n, r, h) => {
    const u = r.toLowerCase();
    let b = o.getValue(n);
    const s = W(b, u);
    return h({ itemRank: s }), s.passed;
  },
  Me = ({
    className: o = "",
    title: n,
    menu: r,
    data: h = de,
    config: u = ae,
    sorts: b = [],
    freeze: s,
    controls: f,
    search: j,
    responsive: k = !0,
    enablePagination: p = !1,
    cellClass: R = "text-right",
  }) => {
    const S = B(() => u, [u]),
      [F, E] = w(b),
      [A, y] = w(""),
      [I, N] = w([]),
      { t: g } = J(),
      T = l => {
        if (l === !1) return "Sort";
        if (l === "desc") return "Desc order";
        if (l === "asc") return "Asc order";
      },
      K = {
        data: h,
        columns: S,
        state: {
          sorting: F,
          columnFilters: I,
          globalFilter: A,
        },
        onSortingChange: E,
        onColumnFiltersChange: N,
        onGlobalFilterChange: y,
        globalFilterFn: ce,
        getCoreRowModel: te(),
        getSortedRowModel: oe(),
        getFilteredRowModel: se(),
        getPaginationRowModel: p ? le() : void 0,
        sortingFns: {
          localeNumber: (l, e, a) => {
            const [d, i] = [
              Number(l.getValue(a).replaceAll(",", "")),
              Number(e.getValue(a).replaceAll(",", "")),
            ];
            return d > i ? 1 : -1;
          },
        },
        debugTable: !1,
      },
      c = $(K);
    H(() => {
      p && c.setPageSize(p);
    }, []);
    const P = O(
        Q(l => {
          y(l ?? "");
        }, 500),
        []
      ),
      _ = l => {
        var a;
        const e = (a = document.getElementById(l)) == null ? void 0 : a.previousElementSibling;
        return e != null ? e.clientWidth : 0;
      };
    return /* @__PURE__ */ t.jsxs(t.Fragment, {
      children: [
        /* @__PURE__ */ t.jsxs("div", {
          className: "grid grid-cols-1 gap-2 md:grid-cols-2",
          children: [
            /* @__PURE__ */ t.jsx("span", { className: "text-base font-bold", children: n }),
            r &&
              /* @__PURE__ */ t.jsx("div", {
                className: "flex items-center justify-end gap-2",
                children: r,
              }),
          ],
        }),
        (j || f) &&
          /* @__PURE__ */ t.jsxs("div", {
            className: "flex w-full flex-wrap items-center justify-between gap-4",
            children: [
              /* @__PURE__ */ t.jsx("div", {
                className: "flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center",
                children: f && f(N),
              }),
              j && j(P),
            ],
          }),
        /* @__PURE__ */ t.jsx("div", {
          className: m(k && "table-responsive"),
          children: /* @__PURE__ */ t.jsxs("table", {
            className: m("table", o),
            children: [
              /* @__PURE__ */ t.jsx("thead", {
                children: c.getHeaderGroups().map(l =>
                  /* @__PURE__ */ t.jsx(
                    "tr",
                    {
                      children: l.headers.map(e => {
                        var a, d;
                        return /* @__PURE__ */ t.jsx(
                          "th",
                          {
                            id: e.id,
                            colSpan: e.colSpan,
                            className: m(s == null ? void 0 : s.includes(e.id)) && "sticky-col",
                            style: {
                              left: s != null && s.includes(e.id) ? _(e.id) : 0,
                            },
                            children: e.isPlaceholder
                              ? null
                              : /* @__PURE__ */ t.jsxs("div", {
                                  className: m(
                                    e.subHeaders.length < 1
                                      ? "flex select-none justify-between gap-1 px-2 text-left text-sm"
                                      : e.column.columnDef.header
                                      ? "pr-2 text-end"
                                      : "hidden",
                                    e.column.getCanSort() ? "cursor-pointer" : ""
                                  ),
                                  onClick: e.column.getCanSort()
                                    ? e.column.getToggleSortingHandler()
                                    : void 0,
                                  children: [
                                    /* @__PURE__ */ t.jsxs("div", {
                                      children: [
                                        /* @__PURE__ */ t.jsx("p", {
                                          className: "font-medium text-black dark:text-white",
                                          children: D(e.column.columnDef.header, e.getContext()),
                                        }),
                                        ((a = e.column.columnDef) == null ? void 0 : a.subheader) &&
                                          /* @__PURE__ */ t.jsx("p", {
                                            className: "text-dim text-left dark:text-white",
                                            children:
                                              (d = e.column.columnDef) == null
                                                ? void 0
                                                : d.subheader,
                                          }),
                                      ],
                                    }),
                                    e.subHeaders.length < 1 &&
                                      /* @__PURE__ */ t.jsxs("span", {
                                        className: "ml-2 inline-block",
                                        title: T(e.column.getIsSorted()),
                                        children: [
                                          {
                                            asc: /* @__PURE__ */ t.jsx(X, {
                                              className:
                                                "inline-block h-4 w-auto text-black dark:text-white",
                                            }),
                                            desc: /* @__PURE__ */ t.jsx(Y, {
                                              className:
                                                "inline-block h-4 w-auto text-black dark:text-white",
                                            }),
                                          }[e.column.getIsSorted()],
                                          e.column.getCanSort() &&
                                            !e.column.getIsSorted() &&
                                            /* @__PURE__ */ t.jsx(Z, {
                                              className: "text-dim inline-block h-4 w-auto",
                                            }),
                                        ],
                                      }),
                                  ],
                                }),
                          },
                          e.id
                        );
                      }),
                    },
                    l.id
                  )
                ),
              }),
              /* @__PURE__ */ t.jsx("tbody", {
                children: c.getRowModel().rows.length
                  ? c.getRowModel().rows.map(l =>
                      /* @__PURE__ */ t.jsx(
                        "tr",
                        {
                          children: l.getVisibleCells().map((e, a) => {
                            var M, v;
                            const d = e.column.parent
                                ? (v = e.column.parent) == null
                                  ? void 0
                                  : v.columns[
                                      ((M = e.column.parent) == null ? void 0 : M.columns.length) -
                                        1
                                    ]
                                : e.column,
                              i = e.getValue(),
                              L = e.column.columnDef.unit ?? void 0,
                              G = e.column.columnDef.inverse ?? void 0,
                              C = e.column.columnDef.relative ?? void 0,
                              V = e.column.columnDef.scale ?? void 0,
                              U = m(
                                d.id === e.column.id && "text-sm",
                                C ? re(i, G) : "bg-opacity-20",
                                V && ne(i),
                                (s == null ? void 0 : s.includes(e.column.id)) &&
                                  "sticky-col border-l",
                                e.column.columnDef.className ? e.column.columnDef.className : R
                              );
                            return /* @__PURE__ */ t.jsxs(
                              "td",
                              {
                                id: e.id,
                                className: U,
                                style: {
                                  left: s != null && s.includes(e.column.id) ? _(e.id) : 0,
                                },
                                children: [
                                  D(e.column.columnDef.cell, e.getContext()),
                                  i !== null && L,
                                  i === null && C && "-",
                                ],
                              },
                              e.id
                            );
                          }),
                        },
                        l.id
                      )
                    )
                  : /* @__PURE__ */ t.jsx("tr", {
                      children: /* @__PURE__ */ t.jsx("td", {
                        colSpan: c.getAllColumns().length,
                        className: "border-r border-black",
                        children: /* @__PURE__ */ t.jsxs("div", {
                          children: [g("common:common.no_entries"), ". "],
                        }),
                      }),
                    }),
              }),
            ],
          }),
        }),
        p &&
          /* @__PURE__ */ t.jsxs("div", {
            className: `mt-5 flex items-center justify-center gap-4 text-sm ${o}`,
            children: [
              /* @__PURE__ */ t.jsxs("button", {
                className:
                  "flex flex-row gap-2 rounded border px-2 py-1 disabled:bg-slate-100 disabled:opacity-50",
                onClick: () => c.previousPage(),
                disabled: !c.getCanPreviousPage(),
                children: [
                  /* @__PURE__ */ t.jsx(z, { className: "text-dim h-5 w-4" }),
                  g("common:common.previous"),
                ],
              }),
              /* @__PURE__ */ t.jsx("span", {
                className: "flex items-center gap-1 text-center text-sm",
                children: g("common:common.page_of", {
                  current: c.getState().pagination.pageIndex + 1,
                  total: c.getPageCount(),
                }),
              }),
              /* @__PURE__ */ t.jsxs("button", {
                className:
                  "flex flex-row gap-2 rounded border px-2 py-1 disabled:bg-slate-100 disabled:opacity-50",
                onClick: () => c.nextPage(),
                disabled: !c.getCanNextPage(),
                children: [
                  g("common:common.next"),
                  " ",
                  /* @__PURE__ */ t.jsx(ee, { className: "text-dim h-5 w-4" }),
                ],
              }),
            ],
          }),
      ],
    });
  },
  ae = [
    {
      header: "",
      id: "state",
      accessorKey: "state",
      enableSorting: !1,
      cell: o => {
        const n = o.getValue();
        return /* @__PURE__ */ t.jsxs("div", {
          className: "flex items-center gap-3",
          children: [
            /* @__PURE__ */ t.jsx(q, {
              src: `/static/images/states/${n}.jpeg`,
              width: 28,
              height: 16,
              alt: x[n],
            }),
            /* @__PURE__ */ t.jsx("span", { children: x[n] }),
          ],
        });
      },
    },
    {
      id: "total",
      header: "Total",
      columns: [
        {
          id: "total.perc_1dose",
          header: "% 1 Dose",
          accessorKey: "total.perc_1dose.child",
        },
        {
          id: "total.perc_2dose",
          header: "% 2 Doses",
          accessorKey: "total.perc_2dose",
        },
        {
          id: "perc_1booster",
          header: "% 1 Booster",
          accessorKey: "total.perc_1booster",
        },
      ],
    },
    {
      id: "adult",
      header: "Adults",
      columns: [
        {
          id: "adult.perc_1dose",
          header: "% 1 Dose",
          accessorKey: "adult.perc_1dose",
        },
        {
          id: "adult.perc_2dose",
          header: "% 2 Doses",
          accessorKey: "adult.perc_2dose",
        },
        {
          id: "adult.perc_1booster",
          header: "% 1 Booster",
          accessorKey: "adult.perc_1booster",
        },
      ],
    },
    {
      id: "adolescent",
      header: "Adolescent",
      columns: [
        {
          id: "adolescent.perc_1dose",
          header: "% 1 Dose",
          accessorKey: "adolescent.perc_1dose",
        },
        {
          id: "adolescent.perc_2dose",
          header: "% 2 Doses",
          accessorKey: "adolescent.perc_2dose",
        },
      ],
    },
    {
      id: "children",
      header: "Children",
      columns: [
        {
          id: "children.perc_1dose",
          header: "% 1 Dose",
          accessorKey: "children.perc_1dose",
        },
        {
          id: "children.perc_2dose",
          header: "% 2 Doses",
          accessorKey: "children.perc_1dose",
        },
      ],
    },
  ],
  de = Array(Object.keys(x).length)
    .fill(0)
    .map((o, n) => {
      const r = Object.keys(x)[n];
      return {
        id: n,
        //
        state: r,
        // state code: sgr, mlk etc
        total: {
          perc_1dose: Math.floor(Math.random() * 10) + 1,
          perc_2dose: Math.floor(Math.random() * 10) + 1,
          perc_1booster: Math.floor(Math.random() * 10) + 1,
        },
        adult: {
          perc_1dose: Math.floor(Math.random() * 10) + 1,
          perc_2dose: Math.floor(Math.random() * 10) + 1,
          perc_1booster: Math.floor(Math.random() * 10) + 1,
        },
        adolescent: {
          perc_1dose: Math.floor(Math.random() * 10) + 1,
          perc_2dose: Math.floor(Math.random() * 10) + 1,
        },
        children: {
          perc_1dose: Math.floor(Math.random() * 10) + 1,
          perc_2dose: Math.floor(Math.random() * 10) + 1,
        },
      };
    });
export { Me as default };
