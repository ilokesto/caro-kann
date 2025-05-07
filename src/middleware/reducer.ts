import { Middleware, MiddlewareStore, storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const reducer: Middleware["reducer"] = <T, A extends object>(reducer: (state: T, action: A) => T, initState: T | MiddlewareStore<T>) => {
  const Store = getStoreFromInitState(initState);

  const setStore = (action: A) => {
    // @ts-ignore
    Store.setStore(prev => reducer(prev, action), action.type);
  };

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: "reducer"
  }
}