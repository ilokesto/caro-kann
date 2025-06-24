import type { Store, SetStateAction } from "../types";

export function createStore<T>(initState: T): Store<T> {
  let store: T = initState;
  const callbacks: Set<() => void> = new Set();

  return {
    getStore: () => store,
    setStore: (nextState: SetStateAction<T>) => {
      store = typeof nextState === "function"
        ? (nextState as (prev: T) => T)(store)
        : nextState;

      callbacks.forEach((cb) => cb());
    },
    subscribe: (callback: () => void) => {
      callbacks.add(callback);
      return () => callbacks.delete(callback);
    }
  };
}