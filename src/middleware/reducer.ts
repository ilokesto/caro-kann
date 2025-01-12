import { createStore } from "../core/createStore";
import { Dispatcher, Middleware, Roll, Store } from "../types";

export const reducer: Middleware["reducer"] = <T,>(reducer: (state: T, action: Roll<Parameters<Dispatcher>[0]>) => T, initState: T | [Store<T>, string]) => {
  const Store = initState instanceof Array ? initState[0] : createStore(initState);

  const setStore = (action: { [x: string]: any, type: string }) => {
    Store.setStore(prev => reducer(prev, action));
  };

  return [{ ...Store, setStore }, "reducer" as const];
}