import type { CreateStore } from "../types";

export const createStore: CreateStore = (initState) => {
  const callbacks = new Set<() => void>();
  let store = initState;

  type T = typeof initState;
  const setStore = (nextState: T | ((prev: T) => T)) => {
    store = typeof nextState === "function" ? (nextState as (prev: T) => T)(store) : nextState;

    callbacks.forEach((cb) => cb());
  };

  const getStore = () => store;

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  return { getStore, setStore, subscribe, getInitState: () => initState };
};
