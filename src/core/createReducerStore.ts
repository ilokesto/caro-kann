import type { CreateReducerStore } from "../types";

export const createReducerStore: CreateReducerStore = (reducer, Store) => {
  const setStore = (action: { [x: string]: any, type: string }) => {
    Store.setStore(prev => reducer(prev, action));
  };

  return { ...Store, setStore };
};
