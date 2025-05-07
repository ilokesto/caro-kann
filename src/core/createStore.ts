import type { Store } from "../types";

export const createStore = <T>(initState: T): Store<T> => {
  const callbacks = new Set<() => void>();
  let store = initState;

  const setStore = (nextState: T | ((prev: T) => T)) => {
    store = typeof nextState === "function" ? (nextState as (prev: T) => T)(store) : nextState;

    callbacks.forEach((cb) => cb());
  };

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  return {
    setStore,
    subscribe,
    getStore: () => store,
    getInitState: () => initState
  };
};