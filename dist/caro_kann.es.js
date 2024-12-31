import { jsx as S } from "react/jsx-runtime";
import { useContext as k, useSyncExternalStore as w, createContext as B } from "react";
function g(e) {
  const t = document.cookie.split("; ").find((a) => a.startsWith(`${e}=`));
  return t ? t.split("=")[1] : null;
}
const v = ({ storageKey: e, storageType: r, migrate: t }) => {
  const { version: a, strategy: c } = t;
  if (console.log("a!"), r === "local") {
    const { state: o, version: s } = JSON.parse(localStorage.getItem(e));
    a > s && localStorage.setItem(e, JSON.stringify({
      state: c(o, s),
      version: a
    }));
  } else if (r === "cookie") {
    const { state: o, version: s } = JSON.parse(g(e));
    a > s && (document.cookie = `${e}=${JSON.stringify({
      state: c(o, s),
      version: a
    })}`);
  }
}, h = ({ storageKey: e, storageType: r, migrate: t, initState: a }) => {
  try {
    let c = null;
    if (t && r && v({ storageKey: e, storageType: r, migrate: t }), r === "local" ? c = localStorage.getItem(e) : r === "session" ? c = sessionStorage.getItem(e) : r === "cookie" && (c = g(e)), c !== null)
      return JSON.parse(c);
  } catch {
    typeof window < "u" && console.error("Caro-Kann : Failed to read from storage");
  }
  return { state: a, version: 0 };
}, I = (e) => {
  var o;
  const r = (e == null ? void 0 : e.local) ?? (e == null ? void 0 : e.cookie) ?? (e == null ? void 0 : e.session) ?? "", t = e != null && e.local ? "local" : e != null && e.cookie ? "cookie" : e != null && e.session ? "session" : null, a = ((o = e == null ? void 0 : e.migrate) == null ? void 0 : o.version) ?? 0, c = e == null ? void 0 : e.migrate;
  return { storageKey: r, storageType: t, storageVersion: a, migrate: c };
}, b = ({ storageKey: e, storageType: r, storageVersion: t, value: a }) => {
  const c = JSON.stringify({ state: a, version: t });
  try {
    r === "local" ? localStorage.setItem(e, c) : r === "session" ? sessionStorage.setItem(e, c) : r === "cookie" && (document.cookie = `${e}=${c}`);
  } catch (o) {
    typeof window < "u" && console.error("Caro-Kann : Failed to write to storage", o);
  }
}, u = (e, r) => {
  const t = I(r), a = t.storageType ? h({ ...t, initState: e }).state : e, c = /* @__PURE__ */ new Set();
  let o = a;
  return { getBoard: () => o, setBoard: (i) => {
    o = typeof i == "function" ? i(o) : i, t.storageType && b({ ...t, value: o }), c.forEach((m) => m());
  }, subscribe: (i) => (c.add(i), () => c.delete(i)), getInitState: () => e };
}, O = (e) => {
  if (!/=>/.test(e))
    throw new Error('Invalid caro-kann selector format: missing " => "');
  if (/{|}/.test(e))
    throw new Error("Invalid caro-kann selector format: contains curly braces({ })");
  if (/&|:|\?/.test(e))
    throw new Error("Invalid caro-kann selector format: contains disallowed special characters(? : &)");
  const r = e.split("=>")[1].trim(), t = r.match(/\[(?!["'])([^\]]+)(?!["'])\]/);
  if (t)
    throw new Error(`Invalid path detected: ${t[0]}`);
  return Array.from(r.matchAll(/(?:\.|^)(\w+)|\["(.+?)"\]/g)).map((c) => c[1] || c[2]).slice(1);
}, f = (e, r, t) => {
  r.length === 1 ? e[r[0]] = t : (e[r[0]] || (e[r[0]] = {}), f(e[r[0]], r.slice(1), t));
}, C = (e, r) => (t) => {
  e((a) => {
    const c = O(r.toString()), o = { ...a };
    return typeof t == "function" ? f(o, c, t(r(a))) : f(o, c, t), o;
  });
}, d = (e, r) => {
  const { getBoard: t, setBoard: a, subscribe: c, getInitState: o } = k(e), s = (n) => () => r ? r(n()) : n();
  return [w(c, s(t), s(o)), a];
};
function E(e, r) {
  const t = B(u(e, r));
  return { useBoard: (s) => {
    const [l, n] = s ? d(t, s) : d(t);
    return s ? [l, C(n, s), n] : [l, n];
  }, useDerivedBoard: (s) => d(t, s)[0], BoardContext: ({ value: s, children: l }) => /* @__PURE__ */ S(t.Provider, { value: u(s), children: l }) };
}
export {
  E as playTartakower
};
