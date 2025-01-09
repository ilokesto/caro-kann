import { createStore } from "../core/createStore";
import { Middleware } from "../types";

export const zustand: Middleware["Zustand"] = (initFn) => {
  type T = ReturnType<typeof initFn>;
  const Store = createStore({} as T);

  const setStore = (nextState: Partial<T> | ((prev: T) => T)) =>
    Store.setStore(prev => typeof nextState === "function" ? (nextState as (prev: T) => T)(prev) : {...prev, ...nextState});

  Store.setStore(initFn(setStore, Store.getStore, { ...Store, setStore }));

  return [{ ...Store, setStore }, "zustand" as const];
}