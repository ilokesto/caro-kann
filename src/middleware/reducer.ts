import { createStore } from "../core/createStore";
import { Middleware } from "../types";

export const reducer: Middleware["reducer"] = (reducer, initialState) => {
  const Store = createStore(initialState);

  const setStore = (action: { [x: string]: any, type: string }) => {
    Store.setStore(prev => reducer(prev, action));
  };

  return [{ ...Store, setStore }, "reducer" as const];
}