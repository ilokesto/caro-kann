import { createStore } from "../core/createStore";
import { Middleware, MiddlewareStore, Store, storeTypeTag } from "../types";
import { isMiddlewareStore } from "../utils/isMiddlewareStore";

export const reducer: Middleware["reducer"] = <T, A extends object>(reducer: (state: T, action: A) => T, initState: T | MiddlewareStore<T>) => {
  const Store = isMiddlewareStore(initState) ? initState.store : createStore(initState);

  const setStore = (action: A) => {
    // @ts-ignore
    Store.setStore(prev => reducer(prev, action), action.type);
  };

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: "reducer"
  }
}