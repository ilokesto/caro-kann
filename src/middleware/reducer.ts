import { createStore } from "../core/createStore";
import { Store } from "../types";

export function reducer<T>(reducer: (state: T, action: { [x: string]: any, type: string }) => T, initialState: T): [Omit<Store<T>, "setStore"> & { setStore: (action: { [x: string]: any, type: string }) => void }, "reducer"] {
  const Store = createStore(initialState);

  const setStore = (action: { [x: string]: any, type: string }) => {
    Store.setStore(prev => reducer(prev, action));
  };

  return [{ ...Store, setStore }, "reducer" as const];
}