/**
 * match-sorter-utils
 *
 * Copyright (c) TanStack
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
const d = {
    À: "A",
    Á: "A",
    Â: "A",
    Ã: "A",
    Ä: "A",
    Å: "A",
    Ấ: "A",
    Ắ: "A",
    Ẳ: "A",
    Ẵ: "A",
    Ặ: "A",
    Æ: "AE",
    Ầ: "A",
    Ằ: "A",
    Ȃ: "A",
    Ç: "C",
    Ḉ: "C",
    È: "E",
    É: "E",
    Ê: "E",
    Ë: "E",
    Ế: "E",
    Ḗ: "E",
    Ề: "E",
    Ḕ: "E",
    Ḝ: "E",
    Ȇ: "E",
    Ì: "I",
    Í: "I",
    Î: "I",
    Ï: "I",
    Ḯ: "I",
    Ȋ: "I",
    Ð: "D",
    Ñ: "N",
    Ò: "O",
    Ó: "O",
    Ô: "O",
    Õ: "O",
    Ö: "O",
    Ø: "O",
    Ố: "O",
    Ṍ: "O",
    Ṓ: "O",
    Ȏ: "O",
    Ù: "U",
    Ú: "U",
    Û: "U",
    Ü: "U",
    Ý: "Y",
    à: "a",
    á: "a",
    â: "a",
    ã: "a",
    ä: "a",
    å: "a",
    ấ: "a",
    ắ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    æ: "ae",
    ầ: "a",
    ằ: "a",
    ȃ: "a",
    ç: "c",
    ḉ: "c",
    è: "e",
    é: "e",
    ê: "e",
    ë: "e",
    ế: "e",
    ḗ: "e",
    ề: "e",
    ḕ: "e",
    ḝ: "e",
    ȇ: "e",
    ì: "i",
    í: "i",
    î: "i",
    ï: "i",
    ḯ: "i",
    ȋ: "i",
    ð: "d",
    ñ: "n",
    ò: "o",
    ó: "o",
    ô: "o",
    õ: "o",
    ö: "o",
    ø: "o",
    ố: "o",
    ṍ: "o",
    ṓ: "o",
    ȏ: "o",
    ù: "u",
    ú: "u",
    û: "u",
    ü: "u",
    ý: "y",
    ÿ: "y",
    Ā: "A",
    ā: "a",
    Ă: "A",
    ă: "a",
    Ą: "A",
    ą: "a",
    Ć: "C",
    ć: "c",
    Ĉ: "C",
    ĉ: "c",
    Ċ: "C",
    ċ: "c",
    Č: "C",
    č: "c",
    C̆: "C",
    c̆: "c",
    Ď: "D",
    ď: "d",
    Đ: "D",
    đ: "d",
    Ē: "E",
    ē: "e",
    Ĕ: "E",
    ĕ: "e",
    Ė: "E",
    ė: "e",
    Ę: "E",
    ę: "e",
    Ě: "E",
    ě: "e",
    Ĝ: "G",
    Ǵ: "G",
    ĝ: "g",
    ǵ: "g",
    Ğ: "G",
    ğ: "g",
    Ġ: "G",
    ġ: "g",
    Ģ: "G",
    ģ: "g",
    Ĥ: "H",
    ĥ: "h",
    Ħ: "H",
    ħ: "h",
    Ḫ: "H",
    ḫ: "h",
    Ĩ: "I",
    ĩ: "i",
    Ī: "I",
    ī: "i",
    Ĭ: "I",
    ĭ: "i",
    Į: "I",
    į: "i",
    İ: "I",
    ı: "i",
    Ĳ: "IJ",
    ĳ: "ij",
    Ĵ: "J",
    ĵ: "j",
    Ķ: "K",
    ķ: "k",
    Ḱ: "K",
    ḱ: "k",
    K̆: "K",
    k̆: "k",
    Ĺ: "L",
    ĺ: "l",
    Ļ: "L",
    ļ: "l",
    Ľ: "L",
    ľ: "l",
    Ŀ: "L",
    ŀ: "l",
    Ł: "l",
    ł: "l",
    Ḿ: "M",
    ḿ: "m",
    M̆: "M",
    m̆: "m",
    Ń: "N",
    ń: "n",
    Ņ: "N",
    ņ: "n",
    Ň: "N",
    ň: "n",
    ŉ: "n",
    N̆: "N",
    n̆: "n",
    Ō: "O",
    ō: "o",
    Ŏ: "O",
    ŏ: "o",
    Ő: "O",
    ő: "o",
    Œ: "OE",
    œ: "oe",
    P̆: "P",
    p̆: "p",
    Ŕ: "R",
    ŕ: "r",
    Ŗ: "R",
    ŗ: "r",
    Ř: "R",
    ř: "r",
    R̆: "R",
    r̆: "r",
    Ȓ: "R",
    ȓ: "r",
    Ś: "S",
    ś: "s",
    Ŝ: "S",
    ŝ: "s",
    Ş: "S",
    Ș: "S",
    ș: "s",
    ş: "s",
    Š: "S",
    š: "s",
    Ţ: "T",
    ţ: "t",
    ț: "t",
    Ț: "T",
    Ť: "T",
    ť: "t",
    Ŧ: "T",
    ŧ: "t",
    T̆: "T",
    t̆: "t",
    Ũ: "U",
    ũ: "u",
    Ū: "U",
    ū: "u",
    Ŭ: "U",
    ŭ: "u",
    Ů: "U",
    ů: "u",
    Ű: "U",
    ű: "u",
    Ų: "U",
    ų: "u",
    Ȗ: "U",
    ȗ: "u",
    V̆: "V",
    v̆: "v",
    Ŵ: "W",
    ŵ: "w",
    Ẃ: "W",
    ẃ: "w",
    X̆: "X",
    x̆: "x",
    Ŷ: "Y",
    ŷ: "y",
    Ÿ: "Y",
    Y̆: "Y",
    y̆: "y",
    Ź: "Z",
    ź: "z",
    Ż: "Z",
    ż: "z",
    Ž: "Z",
    ž: "z",
    ſ: "s",
    ƒ: "f",
    Ơ: "O",
    ơ: "o",
    Ư: "U",
    ư: "u",
    Ǎ: "A",
    ǎ: "a",
    Ǐ: "I",
    ǐ: "i",
    Ǒ: "O",
    ǒ: "o",
    Ǔ: "U",
    ǔ: "u",
    Ǖ: "U",
    ǖ: "u",
    Ǘ: "U",
    ǘ: "u",
    Ǚ: "U",
    ǚ: "u",
    Ǜ: "U",
    ǜ: "u",
    Ứ: "U",
    ứ: "u",
    Ṹ: "U",
    ṹ: "u",
    Ǻ: "A",
    ǻ: "a",
    Ǽ: "AE",
    ǽ: "ae",
    Ǿ: "O",
    ǿ: "o",
    Þ: "TH",
    þ: "th",
    Ṕ: "P",
    ṕ: "p",
    Ṥ: "S",
    ṥ: "s",
    X́: "X",
    x́: "x",
    Ѓ: "Г",
    ѓ: "г",
    Ќ: "К",
    ќ: "к",
    A̋: "A",
    a̋: "a",
    E̋: "E",
    e̋: "e",
    I̋: "I",
    i̋: "i",
    Ǹ: "N",
    ǹ: "n",
    Ồ: "O",
    ồ: "o",
    Ṑ: "O",
    ṑ: "o",
    Ừ: "U",
    ừ: "u",
    Ẁ: "W",
    ẁ: "w",
    Ỳ: "Y",
    ỳ: "y",
    Ȁ: "A",
    ȁ: "a",
    Ȅ: "E",
    ȅ: "e",
    Ȉ: "I",
    ȉ: "i",
    Ȍ: "O",
    ȍ: "o",
    Ȑ: "R",
    ȑ: "r",
    Ȕ: "U",
    ȕ: "u",
    B̌: "B",
    b̌: "b",
    Č̣: "C",
    č̣: "c",
    Ê̌: "E",
    ê̌: "e",
    F̌: "F",
    f̌: "f",
    Ǧ: "G",
    ǧ: "g",
    Ȟ: "H",
    ȟ: "h",
    J̌: "J",
    ǰ: "j",
    Ǩ: "K",
    ǩ: "k",
    M̌: "M",
    m̌: "m",
    P̌: "P",
    p̌: "p",
    Q̌: "Q",
    q̌: "q",
    Ř̩: "R",
    ř̩: "r",
    Ṧ: "S",
    ṧ: "s",
    V̌: "V",
    v̌: "v",
    W̌: "W",
    w̌: "w",
    X̌: "X",
    x̌: "x",
    Y̌: "Y",
    y̌: "y",
    A̧: "A",
    a̧: "a",
    B̧: "B",
    b̧: "b",
    Ḑ: "D",
    ḑ: "d",
    Ȩ: "E",
    ȩ: "e",
    Ɛ̧: "E",
    ɛ̧: "e",
    Ḩ: "H",
    ḩ: "h",
    I̧: "I",
    i̧: "i",
    Ɨ̧: "I",
    ɨ̧: "i",
    M̧: "M",
    m̧: "m",
    O̧: "O",
    o̧: "o",
    Q̧: "Q",
    q̧: "q",
    U̧: "U",
    u̧: "u",
    X̧: "X",
    x̧: "x",
    Z̧: "Z",
    z̧: "z",
  },
  C = Object.keys(d).join("|"),
  U = new RegExp(C, "g");
function M(e) {
  return e.replace(U, r => d[r]);
}
/**
 * @name match-sorter
 * @license MIT license.
 * @copyright (c) 2099 Kent C. Dodds
 * @author Kent C. Dodds <me@kentcdodds.com> (https://kentcdodds.com)
 */
const u = {
  CASE_SENSITIVE_EQUAL: 7,
  EQUAL: 6,
  STARTS_WITH: 5,
  WORD_STARTS_WITH: 4,
  CONTAINS: 3,
  ACRONYM: 2,
  MATCHES: 1,
  NO_MATCH: 0,
};
function V(e, r, n) {
  var a;
  if (((n = n || {}), (n.threshold = (a = n.threshold) != null ? a : u.MATCHES), !n.accessors)) {
    const o = f(e, r, n);
    return {
      // ends up being duplicate of 'item' in matches but consistent
      rankedValue: e,
      rank: o,
      accessorIndex: -1,
      accessorThreshold: n.threshold,
      passed: o >= n.threshold,
    };
  }
  const A = H(e, n.accessors),
    c = {
      rankedValue: e,
      rank: u.NO_MATCH,
      accessorIndex: -1,
      accessorThreshold: n.threshold,
      passed: !1,
    };
  for (let o = 0; o < A.length; o++) {
    const h = A[o];
    let t = f(h.itemValue, r, n);
    const { minRanking: s, maxRanking: l, threshold: i = n.threshold } = h.attributes;
    t < s && t >= u.MATCHES ? (t = s) : t > l && (t = l),
      (t = Math.min(t, l)),
      t >= i &&
        t > c.rank &&
        ((c.rank = t),
        (c.passed = !0),
        (c.accessorIndex = o),
        (c.accessorThreshold = i),
        (c.rankedValue = h.itemValue));
  }
  return c;
}
function f(e, r, n) {
  return (
    (e = I(e, n)),
    (r = I(r, n)),
    r.length > e.length
      ? u.NO_MATCH
      : e === r
      ? u.CASE_SENSITIVE_EQUAL
      : ((e = e.toLowerCase()),
        (r = r.toLowerCase()),
        e === r
          ? u.EQUAL
          : e.startsWith(r)
          ? u.STARTS_WITH
          : e.includes(` ${r}`)
          ? u.WORD_STARTS_WITH
          : e.includes(r)
          ? u.CONTAINS
          : r.length === 1
          ? u.NO_MATCH
          : T(e).includes(r)
          ? u.ACRONYM
          : m(e, r))
  );
}
function T(e) {
  let r = "";
  return (
    e.split(" ").forEach(a => {
      a.split("-").forEach(c => {
        r += c.substr(0, 1);
      });
    }),
    r
  );
}
function m(e, r) {
  let n = 0,
    a = 0;
  function A(t, s, l) {
    for (let i = l, O = s.length; i < O; i++) if (s[i] === t) return (n += 1), i + 1;
    return -1;
  }
  function c(t) {
    const s = 1 / t,
      l = n / r.length;
    return u.MATCHES + l * s;
  }
  const o = A(r[0], e, 0);
  if (o < 0) return u.NO_MATCH;
  a = o;
  for (let t = 1, s = r.length; t < s; t++) {
    const l = r[t];
    if (((a = A(l, e, a)), !(a > -1))) return u.NO_MATCH;
  }
  const h = a - o;
  return c(h);
}
function I(e, r) {
  let { keepDiacritics: n } = r;
  return (e = `${e}`), n || (e = M(e)), e;
}
function y(e, r) {
  let n = r;
  typeof r == "object" && (n = r.accessor);
  const a = n(e);
  return a == null ? [] : Array.isArray(a) ? a : [String(a)];
}
function H(e, r) {
  const n = [];
  for (let a = 0, A = r.length; a < A; a++) {
    const c = r[a],
      o = N(c),
      h = y(e, c);
    for (let t = 0, s = h.length; t < s; t++)
      n.push({
        itemValue: h[t],
        attributes: o,
      });
  }
  return n;
}
const E = {
  maxRanking: 1 / 0,
  minRanking: -1 / 0,
};
function N(e) {
  return typeof e == "function"
    ? E
    : {
        ...E,
        ...e,
      };
}
export { V as rankItem, u as rankings };
