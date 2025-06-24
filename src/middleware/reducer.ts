import type { Middleware, MiddlewareStore, StoreType } from "../types";
import { storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const reducer: Middleware["reducer"] = <T, K extends Array<StoreType>, A extends { type: string, [x: PropertyKey]: any }>(reducer: (state: T, action: A) => T, initState: T | MiddlewareStore<T, K>) => {
  const {store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);

  const setStore = (action: A, actionName?: string) => {
    Store.setStore(prev => reducer(prev, action), action.type);
  };

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: ["reducer", ...storeTypeTagArray]
  }
}