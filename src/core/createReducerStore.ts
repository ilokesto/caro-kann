import type { CreateReducerStore } from "../types";

export const createReducerStore: CreateReducerStore = (reducer, initState) => {
  const callbacks = new Set<() => void>();
  let store = initState;

  const setStore = (action: { [x: string]: any, type: string }) => {
    store = reducer(store, action)

    callbacks.forEach((cb) => cb());
  };

  const getStore = () => store;

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);
    return () => callbacks.delete(callback);
  };

  return { getStore, setStore, subscribe, getInitState: () => initState };
};
