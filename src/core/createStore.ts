import type { Store, SetStateAction } from "../types";

export const createStore = <T>(initState: T): Store<T> => {
  const callbacks = new Set<() => void>();
  let store = initState;

  const setStore = (nextState: SetStateAction<T>) => {
    store = typeof nextState === "function" 
      ? (nextState as (prev: T) => T)(store) 
      : nextState;

    callbacks.forEach((cb) => cb());
  };

  return {
    setStore,
    getStore: () => store,
    subscribe: (callback: () => void) => {
      callbacks.add(callback);
      return () => callbacks.delete(callback);
    },
  };
};