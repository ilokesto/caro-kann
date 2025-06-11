import type { Store, SetStateAction } from "../types";

export const createStore = <T>(initState: T): Store<T> => {
  const callbacks = new Set<() => void>();
  let store = initState;
  let selected = {};

  const setStore = (nextState: SetStateAction<T>, actionName?: string, selector?: (state: T) => any) => {
    store = typeof nextState === "function" 
      ? (nextState as (prev: T) => T)(store) 
      : nextState;

    if (selector) selected = selector(store);

    callbacks.forEach((cb) => cb());
  };

  return {
    setStore,
    getStore: (init?: 'init') => init ? initState : store,
    getSelected: () => selected,
    subscribe: (callback: () => void) => {
      callbacks.add(callback);
      return () => callbacks.delete(callback);
    },
    isSelected: typeof selected === 'object' && Object.keys(selected).length > 0,
  };
};