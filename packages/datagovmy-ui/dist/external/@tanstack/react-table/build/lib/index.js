import * as o from "react";
import { createTable as s } from "../../../table-core/build/lib/index.js";
import {
  ColumnSizing as m,
  Expanding as y,
  Filters as C,
  Grouping as b,
  Headers as w,
  Ordering as F,
  Pagination as h,
  Pinning as x,
  RowSelection as v,
  Sorting as O,
  Visibility as E,
  aggregationFns as M,
  buildHeaderGroups as P,
  createCell as $,
  createColumn as A,
  createRow as j,
  defaultColumnSizing as k,
  expandRows as z,
  filterFns as G,
  flattenBy as H,
  functionalUpdate as N,
  getCoreRowModel as T,
  getFilteredRowModel as U,
  getPaginationRowModel as V,
  getSortedRowModel as B,
  isFunction as _,
  isNumberArray as q,
  isRowSelected as D,
  isSubRowSelected as I,
  makeStateUpdater as J,
  memo as K,
  orderColumns as L,
  passiveEventSupported as Q,
  reSplitAlphaNumeric as W,
  selectRowsFn as X,
  shouldAutoRemoveFilter as Y,
  sortingFns as Z,
} from "../../../table-core/build/lib/index.js";
/**
 * react-table
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function g(e, t) {
  return e ? (u(e) ? /* @__PURE__ */ o.createElement(e, t) : e) : null;
}
function u(e) {
  return c(e) || typeof e == "function" || d(e);
}
function c(e) {
  return (
    typeof e == "function" &&
    (() => {
      const t = Object.getPrototypeOf(e);
      return t.prototype && t.prototype.isReactComponent;
    })()
  );
}
function d(e) {
  return (
    typeof e == "object" &&
    typeof e.$$typeof == "symbol" &&
    ["react.memo", "react.forward_ref"].includes(e.$$typeof.description)
  );
}
function p(e) {
  const t = {
      state: {},
      // Dummy state
      onStateChange: () => {},
      // noop
      renderFallbackValue: null,
      ...e,
    },
    [n] = o.useState(() => ({
      current: s(t),
    })),
    [a, i] = o.useState(() => n.current.initialState);
  return (
    n.current.setOptions(l => ({
      ...l,
      ...e,
      state: {
        ...a,
        ...e.state,
      },
      // Similarly, we'll maintain both our internal state and any user-provided
      // state.
      onStateChange: r => {
        i(r), e.onStateChange == null || e.onStateChange(r);
      },
    })),
    n.current
  );
}
export {
  m as ColumnSizing,
  y as Expanding,
  C as Filters,
  b as Grouping,
  w as Headers,
  F as Ordering,
  h as Pagination,
  x as Pinning,
  v as RowSelection,
  O as Sorting,
  E as Visibility,
  M as aggregationFns,
  P as buildHeaderGroups,
  $ as createCell,
  A as createColumn,
  j as createRow,
  s as createTable,
  k as defaultColumnSizing,
  z as expandRows,
  G as filterFns,
  H as flattenBy,
  g as flexRender,
  N as functionalUpdate,
  T as getCoreRowModel,
  U as getFilteredRowModel,
  V as getPaginationRowModel,
  B as getSortedRowModel,
  _ as isFunction,
  q as isNumberArray,
  D as isRowSelected,
  I as isSubRowSelected,
  J as makeStateUpdater,
  K as memo,
  L as orderColumns,
  Q as passiveEventSupported,
  W as reSplitAlphaNumeric,
  X as selectRowsFn,
  Y as shouldAutoRemoveFilter,
  Z as sortingFns,
  p as useReactTable,
};
