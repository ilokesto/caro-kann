import { createStore } from "../core/createStore";
import { Store } from "../types";

export function zustand<T>(initFn: (set: (nextState: Partial<T> | ((prev: T) => T)) => void, get: () => T, api: Omit<Store<T>, "getInitState">) => T): [Store<T>, "zustand"] {
  const Store = createStore({} as T);

  const setStore = (nextState: Partial<T> | ((prev: T) => T)) => {
    Store.setStore(prev => typeof nextState === "function" ? (nextState as (prev: T) => T)(prev) : {...prev, ...nextState});
  }

  Store.setStore(initFn(setStore, Store.getStore, { getStore: Store.getStore, setStore, subscribe: Store.subscribe }))

  return [{ ...Store, setStore }, "zustand" as const];
}