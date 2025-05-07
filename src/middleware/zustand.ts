import { createStore } from "../core/createStore";
import { Middleware, storeTypeTag } from "../types";

export const zustand: Middleware["zustand"] = (initFn) => {
  type T = ReturnType<typeof initFn>;
  const Store = createStore({} as T);

  const setStore = (nextState: Partial<T> | ((prev: T) => T)) =>
    Store.setStore(prev => typeof nextState === "function" ? (nextState as (prev: T) => T)(prev) : {...prev, ...nextState});

  // 스토어 초기화
  Store.setStore(initFn(setStore, Store.getStore, { ...Store, setStore }));

  return {
    store: {...Store, setStore},
    [storeTypeTag]: "zustand"
  }
}