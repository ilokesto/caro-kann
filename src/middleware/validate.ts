import type { Middleware, MiddlewareStore, StoreType } from "../types";
import { storeTypeTag } from "../types";
import { Resolver } from "common-resolver/types";
import { getStoreFromInitState } from "../utils/getStoreFromInitState";

export const validate: Middleware["validate"] = <T, K extends Array<StoreType>>(initState: MiddlewareStore<T, K> | T, resolver: Resolver<T>) => {
  const {store: Store, [storeTypeTag]: storeTypeTagArray } = getStoreFromInitState(initState);

  const setStore = (nextState: T | ((prev: T) => T), actionName: string = "validate", selector?: (state: T) => any) => {
    const newState = typeof nextState === "function" ? (nextState as (prev: T) => T)(Store.getStore()) : nextState;

    const { valid, error } = resolver.validate(newState);

    if (!valid) {
      console.error(`[Validation Error] Invalid state:`, error);
      return;
    }

    Store.setStore(newState, actionName, selector);
  };

  return {
    store: { ...Store, setStore },
    [storeTypeTag]: ["validate", ...storeTypeTagArray]
  }
};