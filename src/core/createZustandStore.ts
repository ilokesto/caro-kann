import { Store } from "../types";

export function createZustandStore<T>(initFn: (set: (nextState: Partial<T> | ((prev: T) => T)) => void, get: () => T) => T): Store<T> {
  let store: T;
  const callbacks = new Set<() => void>();
  const getStore = () => store;

  const setStore = (nextState: Partial<T> | ((prev: T) => T)) => {
    store = typeof nextState === "function" ? (nextState as (prev: T) => T)(store) : {...store, ...nextState};
    callbacks.forEach((callback) => callback());
  };

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);

    return () => {
      callbacks.delete(callback);
    };
  };

  store = initFn(setStore, getStore);

  return { getStore, setStore, subscribe, getInitState: () => store, storeTag: 'zustand' as const };
};
