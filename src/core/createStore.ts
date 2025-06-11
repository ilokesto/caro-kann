import type { Store, SetStateAction } from "../types";

export const createStore = <T>(initState: T): Store<T> => {
  const callbacks = new Set<() => void>();
  let store = initState;
  let selected = {};

  const setStore = (nextState: SetStateAction<T>, actionName?: string, selector?: (state: T) => any) => {
    store = typeof nextState === "function" 
      ? (nextState as (prev: T) => T)(store) 
      : nextState;

    callbacks.forEach((cb) => cb());
  };

  const setSelected = (selector: (state: T) => any) => {
    const s = selector(store);
    const isSelected = typeof s === 'object';

    if (isSelected) selected = s;

    return isSelected
  }

  return {
    setStore,
    getStore: (init?: 'init') => init ? initState : store,
    getSelected: () => selected,
    subscribe: (callback: () => void) => {
      callbacks.add(callback);
      return () => callbacks.delete(callback);
    },
    setSelected
  };
};