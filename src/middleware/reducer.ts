import { Middleware, MiddlewareStore, StoreType, storeTypeTag } from "../types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const reducer: Middleware["reducer"] = <T, K extends Array<StoreType>, A extends object>(reducer: (state: T, action: A) => T, initState: T | MiddlewareStore<T, K>) => {
  const {store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);

  const setStore = (action: A, actionName?: string, selector?: (state: T) => any) => {
    // @ts-ignore
    Store.setStore(prev => reducer(prev, action), action.type, selector);
  };

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: ["reducer", ...storeTypeTagArray]
  }
}